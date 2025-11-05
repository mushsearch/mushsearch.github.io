    const btn = document.getElementById('btn');
    const resultDiv = document.getElementById('result');
    const modoInput = document.getElementById('modo');
    const modoStatus = document.getElementById('modo-status');

    function playerToHTML(player, index, modo) {
      // Extrair TODAS as estatísticas específicas do modo
      const stats = extractStatsForMode(player, modo);
      
      // Estatísticas principais para mostrar no card
      const mainStats = getMainStats(stats, modo, player);
      
      return `
        <div class="player-card">
          <div class="player-header">
            <div class="rank-avatar-container">
              <div class="player-rank">#${player.pos || index + 1}</div>
              ${player.avatar_url ? `<img src="${player.avatar_url}" alt="Avatar de ${player.account.username}" class="player-avatar">` : ''}
            </div>
            <div class="player-name-container">
              <h3 class="player-name" style="color: ${player.color || '#ffffff'}">${player.account.username}</h3>
              <div class="player-meta">
                <span class="player-type ${player.account.type}">${player.account.type === 'premium' ? 'Premium' : 'Padrão'}</span>
              </div>
            </div>
          </div>
          
          <!-- Estatísticas Principais em Grid Compacto -->
          <div class="main-stats-grid">
            ${mainStats.map(stat => `
              <div class="main-stat-item">
                <span class="main-stat-label">${stat.label}:</span>
                <span class="main-stat-value">${formatStatValue(stat.value)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Botão para expandir todas as estatísticas -->
          <div class="card-actions">
            <button class="show-all-stats-btn" onclick="toggleAllStats(this, '${modo}')" 
                    data-player='${JSON.stringify(player).replace(/'/g, "&#39;")}'>
              Mostrar Todas as Estatísticas
            </button>
          </div>

          <!-- Container para todas as estatísticas (inicialmente oculto) -->
          <div class="all-stats-container" style="display: none;">
            <div class="all-stats-content">
              ${Object.entries(stats).map(([stat, value]) => `
                <div class="stat-row">
                  <span class="stat-label">${formatStatName(stat)}:</span>
                  <span class="stat-value">${formatStatValue(value)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    function extractStatsForMode(player, modo) {
      const stats = {};
      
      // Mapeamento de modos para padrões de estatísticas
      const modePatterns = {
        'bedwars': /^bedwars:/,
        'skywars': /^skywars_r1:/,
        'skywars_r1': /^skywars_r1:/,
        'bridge': /^(duels:bridge_|bridge_)/,
        'hg': /^hungergames:/,
        'minimush': /^hungergames:mode_minimush_/,
        'pvp': /^pvp:/,
        'gladiator': /^duels:gladiator_/,
        'party': /^party:/,
        'ctf': /^ctf:/,
        'quickbuilders': /^quickbuilders:/,
        'murder': /^murder:/,
        'duels': /^duels:/,
        'buildbattle': /^buildbattle:/,
        'hungergames': /^hungergames:/,
        'nascomandou': /^nascomandou:/
      };

      const pattern = modePatterns[modo];
      
      for (const [key, value] of Object.entries(player)) {
        // Pular propriedades que não são estatísticas
        if (['pos', 'color', 'account', 'avatar_url'].includes(key)) continue;
        
        // Para BedWars (formato bedwars:stat)
        if (modo === 'bedwars' && key.startsWith('bedwars:')) {
          const statName = key.replace('bedwars:', '');
          stats[statName] = value;
        }
        // Para SkyWars (formato skywars_r1:stat)
        else if ((modo === 'skywars' || modo === 'skywars_r1') && key.startsWith('skywars_r1:')) {
          const statName = key.replace('skywars_r1:', '');
          stats[statName] = value;
        }
        // Para Bridge (pode estar em duels:bridge_ ou bridge_)
        else if (modo === 'bridge' && (key.startsWith('duels:bridge_') || key.startsWith('bridge_'))) {
          const statName = key.replace('duels:bridge_', '').replace('bridge_', '');
          stats[statName] = value;
        }
        // Para HG/HungerGames
        else if ((modo === 'hg' || modo === 'hungergames') && key.startsWith('hungergames:')) {
          const statName = key.replace('hungergames:', '');
          stats[statName] = value;
        }
        // Para Minimush (submodo de hungergames)
        else if (modo === 'minimush' && key.startsWith('hungergames:mode_minimush_')) {
          const statName = key.replace('hungergames:mode_minimush_', '');
          stats[statName] = value;
        }
        // Para Gladiator (submodo de duels)
        else if (modo === 'gladiator' && key.startsWith('duels:gladiator_')) {
          const statName = key.replace('duels:gladiator_', '');
          stats[statName] = value;
        }
        // Para outros modos com formato padrão
        else if (pattern && pattern.test(key)) {
          const statName = key.replace(pattern, '');
          stats[statName] = value;
        }
        // Fallback: estatísticas que contêm o nome do modo
        else if (key.includes(modo)) {
          stats[key] = value;
        }
      }
      
      return stats;
    }

    function getMainStats(stats, modo, player) {
      // Configuração baseada nas estatísticas reais que a API retorna
      const mainStatsConfig = {
        'bedwars': [
          { key: 'level', label: 'Level' },
          { key: 'wins', label: 'Vitórias' },
          { key: 'kills', label: 'Kills' },
          { key: 'final_kills', label: 'Final Kills' }
        ],
        'skywars': [
          { key: 'level', label: 'Level' },
          { key: 'wins', label: 'Vitórias' },
          { key: 'kills', label: 'Kills' },
          { key: 'losses', label: 'Derrotas' },
          { key: 'coins', label: 'Moedas' }
        ],
        'skywars_r1': [
          { key: 'level', label: 'Level' },
          { key: 'wins', label: 'Vitórias' },
          { key: 'kills', label: 'Kills' },
          { key: 'losses', label: 'Derrotas' },
          { key: 'coins', label: 'Moedas' }
        ],
        'bridge': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'losses', label: 'Derrotas' },
          { key: 'points', label: 'Pontos' }
        ],
        'hg': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'kills', label: 'Kills' },
          { key: 'deaths', label: 'Mortes' },
          { key: 'kd', label: 'K/D' }
        ],
        'minimush': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'kills', label: 'Kills' },
          { key: 'deaths', label: 'Mortes' }
        ],
        'pvp': [
          { key: 'arena_kills', label: 'Kills' },
          { key: 'arena_deaths', label: 'Mortes' },
          { key: 'arena_kdr', label: 'K/D Ratio' }
        ],
        'gladiator': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'deaths', label: 'Mortes' },
          { key: 'winstreak', label: 'Winstreak' }
        ],
        'party': [
          { key: 'points', label: 'Pontos' },
          { key: 'first_place', label: '1º Lugar' },
          { key: 'second_place', label: '2º Lugar' },
          { key: 'third_place', label: '3º Lugar' }
        ],
        'ctf': [
          { key: 'captures', label: 'Capturas' },
          { key: 'kills', label: 'Kills' },
          { key: 'coins', label: 'Moedas' }
        ],
        'quickbuilders': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'losses', label: 'Derrotas' },
          { key: 'perfect_builds', label: 'Perfect Builds' },
          { key: 'builds', label: 'Builds' }
        ],
        'murder': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'losses', label: 'Derrotas' }
        ],
        'duels': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'games_played', label: 'Partidas' },
          { key: 'kills', label: 'Kills' }
        ],
        'buildbattle': [
          { key: 'level', label: 'Level' },
          { key: 'wins', label: 'Vitórias' },
          { key: 'points', label: 'Pontos' }
        ],
        'hungergames': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'kills', label: 'Kills' },
          { key: 'deaths', label: 'Mortes' },
          { key: 'kd', label: 'K/D' }
        ],
        'nascomandou': [
          { key: 'wins', label: 'Vitórias' },
          { key: 'points', label: 'Pontos' },
          { key: 'games_played', label: 'Partidas' }
        ]
      };

      const config = mainStatsConfig[modo] || [
        { key: 'wins', label: 'Vitórias' },
        { key: 'kills', label: 'Kills' },
        { key: 'level', label: 'Level' },
        { key: 'coins', label: 'Moedas' }
      ];

      // Buscar estatísticas disponíveis
      const availableStats = [];
      
      for (const statConfig of config) {
        let value = stats[statConfig.key];
        
        // Se não encontrou, tenta buscar diretamente no player
        if (value === undefined) {
          value = findStatInPlayer(player, modo, statConfig.key);
        }
        
        // Só adiciona se encontrou um valor
        if (value !== undefined && value !== null) {
          availableStats.push({
            key: statConfig.key,
            label: statConfig.label,
            value: value
          });
        }
        
        // Limita a 6 estatísticas
        if (availableStats.length >= 6) break;
      }

      // Se não encontrou estatísticas específicas, usar as primeiras disponíveis
      if (availableStats.length === 0) {
        const statsEntries = Object.entries(stats);
        for (let i = 0; i < Math.min(6, statsEntries.length); i++) {
          const [key, value] = statsEntries[i];
          availableStats.push({
            key: key,
            label: formatStatName(key),
            value: value
          });
        }
      }

      // Se ainda não tem estatísticas, mostrar estatísticas gerais do player
      if (availableStats.length === 0) {
        // Tenta encontrar qualquer estatística numérica no player
        for (const [key, value] of Object.entries(player)) {
          if (['pos', 'color', 'account', 'avatar_url'].includes(key)) continue;
          if (typeof value === 'number' && value > 0) {
            availableStats.push({
              key: key,
              label: formatStatName(key),
              value: value
            });
            if (availableStats.length >= 3) break;
          }
        }
      }

      // Se ainda não tem estatísticas, mostrar mensagem
      if (availableStats.length === 0) {
        availableStats.push({
          key: 'no_stats',
          label: 'Estatísticas',
          value: 'Nenhuma disponível'
        });
      }

      return availableStats;
    }

    function findStatInPlayer(player, modo, statKey) {
      // Tenta encontrar a estatística em diferentes formatos
      const possibleKeys = [
        `${modo}:${statKey}`,
        `duels:${modo}_${statKey}`,
        `hungergames:mode_${modo}_${statKey}`,
        `hungergames:${statKey}`,
        statKey
      ];
      
      for (const key of possibleKeys) {
        if (player[key] !== undefined) {
          return player[key];
        }
      }
      
      return undefined;
    }

    function formatStatName(stat) {
      const statNames = {
        'level': 'Level',
        'wins': 'Vitórias',
        'kills': 'Kills',
        'deaths': 'Mortes',
        'final_kills': 'Final Kills',
        'games_played': 'Partidas',
        'fkdr': 'FKDR',
        'coins': 'Moedas',
        'xp': 'XP',
        'winstreak': 'Winstreak',
        'beds_broken': 'Camas',
        'beds_lost': 'Camas Perdidas',
        'assists': 'Assistências',
        'final_deaths': 'Mortes Finais',
        'losses': 'Derrotas',
        'max_winstreak': 'Maior Winstreak',
        'played': 'Partidas',
        'points': 'Pontos',
        'kd_ratio': 'K/D',
        'kd': 'K/D',
        'souls': 'Almas',
        'perfect_builds': 'Perfect Builds',
        'builds': 'Builds',
        'killed_murderer': 'Assassinos',
        'captures': 'Capturas',
        'first_place': '1º Lugar',
        'second_place': '2º Lugar',
        'third_place': '3º Lugar',
        'arena_kills': 'Kills',
        'arena_deaths': 'Mortes',
        'arena_kdr': 'K/D Ratio',
        'bridge_wins': 'Vitórias',
        'bridge_losses': 'Derrotas',
        'bridge_points': 'Pontos',
        'gladiator_wins': 'Vitórias',
        'gladiator_deaths': 'Mortes',
        'gladiator_winstreak': 'Winstreak',
        'mode_minimush_wins': 'Vitórias',
        'mode_minimush_kills': 'Kills',
        'mode_minimush_deaths': 'Mortes',
        'mode_2025_09_doublekit_rank_exp': 'XP Rank',
        'mode_2025_09_minimush_rank_exp': 'XP Rank'
      };
      
      return statNames[stat] || stat.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    function formatStatValue(value) {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'object') return '[Objeto]';
      
      // Formatar números grandes
      if (typeof value === 'number') {
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
          return value.toLocaleString('pt-BR');
        }
        // Formatar números decimais
        if (value % 1 !== 0) {
          return value.toFixed(2);
        }
        return value.toString();
      }
      
      return value;
    }

    // Função global para mostrar/ocultar todas as estatísticas
    window.toggleAllStats = function(button, modo) {
      const card = button.closest('.player-card');
      const statsContainer = card.querySelector('.all-stats-container');
      const isVisible = statsContainer.style.display !== 'none';
      
      if (isVisible) {
        statsContainer.style.display = 'none';
        button.textContent = 'Mostrar Todas as Estatísticas';
      } else {
        statsContainer.style.display = 'block';
        button.textContent = 'Ocultar Estatísticas';
        
        // Scroll suave para o card expandido
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    let modo = '';
    const modosValidos = [
      "bedwars", "skywars", "bridge", "hg", "minimush", 
      "pvp", "sopa", "gladiator", "party", "ctf", 
      "quickbuilders", "murder", "skywars_r1", "duels",
      "buildbattle", "hungergames", "nascomandou"
    ];

    function verificarModo() {
      const modoDigitado = modoInput.value.trim().toLowerCase();
      
      if (modoDigitado === '') {
        modoStatus.textContent = 'Digite um modo de jogo para verificar';
        modoStatus.className = 'modo-status modo-vazio';
        return false;
      }
      
      if (modosValidos.includes(modoDigitado)) {
        modoStatus.textContent = ``;
        modoStatus.className = 'modo-status modo-valido';
        return true;
      } else {
        modoStatus.textContent = `Modo "${modoDigitado}" não existe.`;
        modoStatus.className = 'modo-status modo-invalido';
        return false;
      }
    }

    modoInput.addEventListener('input', verificarModo);
    modoInput.addEventListener('keyup', verificarModo);

    btn.addEventListener('click', () => {
      modo = document.getElementById('modo').value.trim().toLowerCase();
      if (!modo) return alert("Insira um modo de jogo!");

      if (!modosValidos.includes(modo)) {
        resultDiv.innerHTML = `
          <div class="error">
            <h2>Modo Inválido</h2>
            <p>O modo "${modo}" não existe. Modos válidos:</p>
            <ul class="valid-modes-list">
              ${modosValidos.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>
        `;
        return;
      }

      resultDiv.innerHTML = '<div class="loading">Carregando Top 100...</div>';

      fetch(`https://mush.com.br/api/leaderboard/${modo}`)
        .then(response => {
          if (!response.ok) throw new Error("Modo não existe ou erro na API");
          return response.json();
        })
        .then(data => {
          resultDiv.innerHTML = "";
          const topPlayers = data.records.slice(0, 100);
          
          if (topPlayers.length === 0) {
            resultDiv.innerHTML = '<div class="no-results">Nenhum jogador encontrado para este modo.</div>';
            return;
          }
          
          // Cabeçalho do Leaderboard
          const header = document.createElement('div');
          header.className = 'leaderboard-header';
          header.innerHTML = `
            <h2 class="leaderboard-title">Top 100 - ${modo.toUpperCase()}</h2>
            <div class="leaderboard-info">
              <span class="total-players">Total de jogadores: ${topPlayers.length}</span>
              <span class="last-updated">Atualizado em: ${new Date().toLocaleString('pt-BR')}</span>
            </div>
          `;
          resultDiv.appendChild(header);

          // Container para os cards dos jogadores em grid
          const playersContainer = document.createElement('div');
          playersContainer.className = 'players-grid-compact';
          
          topPlayers.forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.innerHTML = playerToHTML(player, index, modo);
            playersContainer.appendChild(playerCard);
          });
          
          resultDiv.appendChild(playersContainer);

          // Estatísticas gerais do leaderboard
          const statsSummary = document.createElement('div');
          statsSummary.className = 'leaderboard-stats';
          
          let summaryHTML = '';
          
          // Tenta encontrar estatísticas para o resumo
          const sampleStats = extractStatsForMode(topPlayers[0], modo);
          const statKeys = Object.keys(sampleStats);
          
          if (statKeys.length > 0) {
            // Usar as primeiras 3 estatísticas disponíveis para o resumo
            for (let i = 0; i < Math.min(3, statKeys.length); i++) {
              const statKey = statKeys[i];
              const values = topPlayers.map(p => {
                const playerStats = extractStatsForMode(p, modo);
                return playerStats[statKey] || 0;
              });
              const maxValue = Math.max(...values);
              
              summaryHTML += `
                <div class="summary-item">
                  <span class="summary-label">Maior ${formatStatName(statKey)}:</span>
                  <span class="summary-value">${formatStatValue(maxValue)}</span>
                </div>
              `;
            }
          } else {
            summaryHTML = '<div class="no-stats">Nenhuma estatística disponível para análise</div>';
          }
          
          statsSummary.innerHTML = `
            <h3>Estatísticas do Leaderboard</h3>
            <div class="stats-summary">
              ${summaryHTML}
            </div>
          `;
          resultDiv.appendChild(statsSummary);

        })
        .catch(err => {
          resultDiv.innerHTML = `
            <div class="error">
              <h2>Erro ao carregar o leaderboard</h2>
              <p>${err.message}</p>
              <p>Verifique se o modo está correto e tente novamente.</p>
            </div>
          `;
          console.error(err);
        });
    });

    // Carregar modo da URL se existir
    window.addEventListener('load', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const modoFromUrl = urlParams.get('modo');
      if (modoFromUrl && modosValidos.includes(modoFromUrl.toLowerCase())) {
        modoInput.value = modoFromUrl;
        verificarModo();
        // Auto-buscar se o modo é válido
        setTimeout(() => btn.click(), 500);
      }
    });