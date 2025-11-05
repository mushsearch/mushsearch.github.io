    const btn = document.getElementById("btn");
    const resultDiv = document.getElementById("result");

    function formatPlayerData(playerData) {
      const account = playerData.account || {};
      const stats = playerData.stats || {};
      
      return `
        <div class="player-profile-cards">
          <!-- Header Card -->
          <div class="player-header-card">
            <div class="header-content">
              <div class="player-main-info">
                <h2 class="player-name">${account.username || 'N/A'}</h2>
                <div class="player-badges">
                  <span class="account-type ${account.type || 'unknown'}">${account.type === 'premium' ? 'Premium' : 'Cracked'}</span>
                  ${playerData.connected ? '<span class="status online">Online</span>' : '<span class="status offline">Offline</span>'}
                </div>
              </div>
              ${playerData.avatar_url ? `
                <img src="${playerData.avatar_url}" alt="Avatar" class="player-avatar-large">
              ` : ''}
            </div>
            
            <!-- Tags Principais -->
            <div class="header-tags">
              ${playerData.best_tag ? `
                <span class="main-tag" style="color: ${playerData.best_tag.color}">${playerData.best_tag.name}</span>
              ` : ''}
              ${playerData.rank_tag ? `
                <span class="rank-tag" style="color: ${playerData.rank_tag.color}">${playerData.rank_tag.name}</span>
              ` : ''}
              ${playerData.medal ? `
                <span class="medal-tag">${formatMedalName(playerData.medal)}</span>
              ` : ''}
            </div>
          </div>

          <!-- Grid de Cards de Informações -->
          <div class="info-cards-grid">
            <!-- Informações da Conta -->
            <div class="info-card">
              <h3 class="card-title">Informações da Conta</h3>
              <div class="card-content">
                <div class="info-row">
                  <span class="info-label">ID do Perfil:</span>
                  <span class="info-value">${account.profile_id || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">ID Único:</span>
                  <span class="info-value">${account.unique_id || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Primeiro Login:</span>
                  <span class="info-value">${formatDate(playerData.first_login)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Último Login:</span>
                  <span class="info-value">${formatDate(playerData.last_login)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Amigos:</span>
                  <span class="info-value">${playerData.friends ? `${playerData.friends.count}/${playerData.friends.limit}` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <!-- Clan e Social -->
            <div class="info-card">
              <h3 class="card-title">👥 Social</h3>
              <div class="card-content">
                ${playerData.clan ? `
                  <div class="info-row">
                    <span class="info-label">Clan:</span>
                    <span class="info-value" style="color: ${playerData.clan.tag_color}">[${playerData.clan.tag}] ${playerData.clan.name}</span>
                  </div>
                ` : ''}
                ${playerData.discord ? `
                  <div class="info-row">
                    <span class="info-label">Discord:</span>
                    <span class="info-value">${playerData.discord.global_name || playerData.discord.name}</span>
                  </div>
                ` : ''}
                ${playerData.profile_tag ? `
                  <div class="info-row">
                    <span class="info-label">Tag Perfil:</span>
                    <span class="info-value" style="color: ${playerData.profile_tag.color}">${playerData.profile_tag.name}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Medalhas -->
            ${playerData.medals && playerData.medals.length > 0 ? `
              <div class="info-card">
                <h3 class="card-title">Medalhas (${playerData.medals.length})</h3>
                <div class="card-content">
                  <div class="medals-grid-compact">
                    ${playerData.medals.slice(0, 6).map(medal => `
                      <span class="medal-compact ${medal === playerData.medal ? 'active' : ''}">
                        ${formatMedalName(medal)}
                      </span>
                    `).join('')}
                    ${playerData.medals.length > 6 ? `
                      <span class="more-items">+${playerData.medals.length - 6} mais</span>
                    ` : ''}
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Tags -->
            ${playerData.tags && playerData.tags.length > 0 ? `
              <div class="info-card">
                <h3 class="card-title">Tags (${playerData.tags.length})</h3>
                <div class="card-content">
                  <div class="tags-grid-compact">
                    ${playerData.tags.slice(0, 8).map(tag => `
                      <span class="tag-compact">${formatTagName(tag)}</span>
                    `).join('')}
                    ${playerData.tags.length > 8 ? `
                      <span class="more-items">+${playerData.tags.length - 8} mais</span>
                    ` : ''}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Resumo das Estatísticas Principais -->
          <div class="stats-overview-section">
            <h3>Estatísticas Principais</h3>
            <div class="stats-overview-grid">
              ${formatStatsOverview(stats)}
            </div>
          </div>

          <!-- Modos de Jogo em Cards -->
          <div class="game-modes-cards-section">
            <h3>Modos de Jogo</h3>
            <div class="game-modes-cards-grid">
              ${formatGameModesCards(stats)}
            </div>
          </div>

          <!-- Missões e Tempo de Jogo -->
          <div class="additional-cards-grid">
            ${playerData.missions ? `
              <div class="info-card">
                <h3 class="card-title">Missões</h3>
                <div class="card-content">
                  ${formatMissionsCompact(playerData.missions)}
                </div>
              </div>
            ` : ''}

            ${playerData.play_time ? `
              <div class="info-card">
                <h3 class="card-title">Tempo de Jogo</h3>
                <div class="card-content">
                  ${formatPlayTimeCompact(playerData.play_time)}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    function formatStatsOverview(stats) {
      const mainModes = ['bedwars', 'skywars_r1', 'duels', 'murder', 'buildbattle', 'hungergames', 'pvp'];
      let overviewHTML = '';
      
      mainModes.forEach(mode => {
        if (stats[mode]) {
          const modeStats = stats[mode];
          const mainStat = getMainStatForMode(mode, modeStats);
          if (mainStat && mainStat.value > 0) {
            overviewHTML += `
              <div class="stat-overview-card">
                <div class="stat-mode">${formatGameModeName(mode)}</div>
                <div class="stat-main">${formatStatValue(mainStat.value)}</div>
                <div class="stat-label">${mainStat.label}</div>
              </div>
            `;
          }
        }
      });
      
      return overviewHTML || '<div class="no-stats">Nenhuma estatística disponível</div>';
    }

    function getMainStatForMode(mode, stats) {
      const mainStats = {
        'bedwars': { key: 'level', label: 'Level' },
        'skywars_r1': { key: 'level', label: 'Level' },
        'duels': { key: 'wins', label: 'Vitórias' },
        'murder': { key: 'wins', label: 'Vitórias' },
        'buildbattle': { key: 'level', label: 'Level' },
        'hungergames': { key: 'wins', label: 'Vitórias' },
        'pvp': { key: 'arena_kills', label: 'Kills' }
      };
      
      const config = mainStats[mode];
      if (config && stats[config.key] !== undefined) {
        return {
          label: config.label,
          value: stats[config.key]
        };
      }
      
      // Fallback para estatísticas comuns
      const commonStats = ['wins', 'kills', 'level', 'points', 'coins'];
      for (const stat of commonStats) {
        if (stats[stat] !== undefined && stats[stat] > 0) {
          return { label: formatStatName(stat), value: stats[stat] };
        }
      }
      
      return null;
    }

    function formatGameModesCards(stats) {
      let modesHTML = '';
      const gameModes = Object.keys(stats);
      
      gameModes.forEach(mode => {
        const modeStats = stats[mode];
        if (modeStats && typeof modeStats === 'object') {
          const statsCount = Object.keys(modeStats).length;
          const topStats = getTopStatsForMode(modeStats, 4); // Mostrar 4 stats principais
          
          modesHTML += `
            <div class="game-mode-card">
              <div class="mode-card-header">
                <h4 class="mode-title">${formatGameModeName(mode)}</h4>
                <span class="stats-count">${statsCount} stats</span>
              </div>
              <div class="mode-stats-grid">
                ${topStats.map(stat => `
                  <div class="mode-stat-item">
                    <span class="mode-stat-label">${stat.label}:</span>
                    <span class="mode-stat-value">${formatStatValue(stat.value)}</span>
                  </div>
                `).join('')}
              </div>
              <button class="show-all-mode-stats" onclick="showAllModeStats('${mode}', this)" 
                      data-stats='${JSON.stringify(modeStats).replace(/'/g, "&#39;")}'>
                Ver Todas as Estatísticas
              </button>
            </div>
          `;
        }
      });
      
      return modesHTML || '<div class="no-stats">Nenhum modo de jogo disponível</div>';
    }

    function getTopStatsForMode(stats, limit) {
      const statsArray = [];
      
      for (const [key, value] of Object.entries(stats)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          continue;
        }
        statsArray.push({ key, value });
      }
      
      // Ordenar por importância e valor
      statsArray.sort((a, b) => {
        const priorityA = getStatPriority(a.key);
        const priorityB = getStatPriority(b.key);
        if (priorityA !== priorityB) return priorityA - priorityB;
        return (b.value || 0) - (a.value || 0);
      });
      
      return statsArray.slice(0, limit).map(stat => ({
        label: formatStatName(stat.key),
        value: stat.value
      }));
    }

    function formatMissionsCompact(missions) {
      let missionsHTML = '';
      let totalCompleted = 0;
      let totalGiven = 0;
      
      for (const [key, value] of Object.entries(missions)) {
        if (key.includes('completed')) totalCompleted += value;
        if (key.includes('given')) totalGiven += value;
      }
      
      missionsHTML += `
        <div class="info-row">
          <span class="info-label">Completadas:</span>
          <span class="info-value">${totalCompleted}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Recebidas:</span>
          <span class="info-value">${totalGiven}</span>
        </div>
      `;
      
      // Adicionar missões por modo
      const modeMissions = {};
      for (const [key, value] of Object.entries(missions)) {
        if (key.includes('completed') && value > 0) {
          const mode = key.split('_')[0];
          if (!modeMissions[mode]) modeMissions[mode] = 0;
          modeMissions[mode] += value;
        }
      }
      
      for (const [mode, count] of Object.entries(modeMissions)) {
        if (count > 0) {
          missionsHTML += `
            <div class="info-row">
              <span class="info-label">${formatGameModeName(mode)}:</span>
              <span class="info-value">${count}</span>
            </div>
          `;
        }
      }
      
      return missionsHTML;
    }

    function formatPlayTimeCompact(playTime) {
      let totalHours = 0;
      const topModes = [];
      
      for (const [key, seconds] of Object.entries(playTime)) {
        const hours = Math.round(seconds / 3600);
        totalHours += hours;
        if (hours > 0 && !key.includes('lobby')) {
          topModes.push({ key, hours });
        }
      }
      
      // Ordenar e pegar os top 5
      topModes.sort((a, b) => b.hours - a.hours);
      const top5 = topModes.slice(0, 5);
      
      let playTimeHTML = `
        <div class="info-row">
          <span class="info-label">Total:</span>
          <span class="info-value">${totalHours}h</span>
        </div>
      `;
      
      top5.forEach(mode => {
        playTimeHTML += `
          <div class="info-row">
            <span class="info-label">${formatGameModeName(mode.key)}:</span>
            <span class="info-value">${mode.hours}h</span>
          </div>
        `;
      });
      
      return playTimeHTML;
    }

    function getStatPriority(statKey) {
      const priority = {
        'level': 1, 'wins': 2, 'kills': 3, 'deaths': 4, 'games_played': 5,
        'coins': 6, 'xp': 7, 'winstreak': 8, 'max_winstreak': 9, 'losses': 10,
        'fkdr': 11, 'kd_ratio': 12, 'beds_broken': 13, 'beds_lost': 14,
        'final_kills': 15, 'final_deaths': 16, 'assists': 17, 'points': 18
      };
      
      if (statKey.includes('monthly') || statKey.includes('weekly')) return 100;
      if (statKey.match(/\d+v\d+/)) return 50;
      return priority[statKey] || 99;
    }

    function formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      return new Date(timestamp).toLocaleDateString('pt-BR');
    }

    function formatGameModeName(mode) {
      const modeNames = {
        'bedwars': 'BedWars', 'skywars_r1': 'SkyWars', 'duels': 'Duelos',
        'murder': 'Murder Mystery', 'buildbattle': 'Build Battle', 
        'hungergames': 'Hunger Games', 'party': 'Party Games', 'pvp': 'PvP',
        'nascomandou': 'Nascomandou', 'seek': 'Hide and Seek',
        'quickbuilders': 'Quick Builders', 'ctf': 'Capture the Flag',
        'blockparty': 'Block Party', 'bridgepractice': 'Bridge Practice'
      };
      return modeNames[mode] || (typeof mode === 'string' ? mode.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') : 'Desconhecido');
    }

    function formatStatName(stat) {
      const statNames = {
        'level': 'Level', 'wins': 'Vitórias', 'kills': 'Kills', 'deaths': 'Mortes',
        'final_kills': 'Final Kills', 'games_played': 'Partidas', 'fkdr': 'FKDR',
        'coins': 'Moedas', 'xp': 'XP', 'winstreak': 'Winstreak',
        'beds_broken': 'Camas', 'assists': 'Assistências', 'points': 'Pontos',
        'kd_ratio': 'K/D', 'kd': 'K/D', 'souls': 'Almas', 'perfect_builds': 'Perfect Builds'
      };
      
      if (!stat || typeof stat !== 'string') return 'Estatística';
      return statNames[stat] || stat.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    function formatMedalName(medal) {
      const medalNames = {
        'empty': 'Vazia', 'toxic': 'Tóxica', 'yin_yang': 'Yin Yang',
        'musician': 'Músico', 'flash': 'Flash', 'love_and_peace': 'Amor e Paz',
        'love': 'Amor', 'coffee': 'Café', 'face': 'Rosto',
        'biscoito_de_gengibre': 'Biscoito de Gengibre'
      };
      return medalNames[medal] || medal;
    }

    function formatTagName(tag) {
      const tagNames = {
        'member': 'Membro', 'vip': 'VIP', 'mvp': 'MVP', 'pro': 'Pro',
        'ultra': 'Ultra', 'carnaval': 'Carnaval', 'ultra_plus': 'Ultra+',
        'ultra_plus_tier_0': 'Ultra+ Tier 0'
      };
      return tagNames[tag] || tag;
    }

    function formatStatValue(value) {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'object') return '[Objeto]';
      if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
      
      if (typeof value === 'number') {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return value.toLocaleString('pt-BR');
        if (value % 1 !== 0) return value.toFixed(2);
        return value.toString();
      }
      
      return value;
    }

    // Função global para mostrar todas as estatísticas de um modo
    window.showAllModeStats = function(mode, button) {
      const stats = JSON.parse(button.getAttribute('data-stats'));
      const statsHTML = Object.entries(stats)
        .filter(([key, value]) => typeof value !== 'object' || Array.isArray(value))
        .map(([key, value]) => `
          <div class="stat-row">
            <span class="stat-label">${formatStatName(key)}:</span>
            <span class="stat-value">${formatStatValue(value)}</span>
          </div>
        `).join('');
      
      const modal = document.createElement('div');
      modal.className = 'stats-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Todas as Estatísticas - ${formatGameModeName(mode)}</h3>
            <button class="close-modal" onclick="this.closest('.stats-modal').remove()">×</button>
          </div>
          <div class="modal-stats">
            ${statsHTML}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    };

    btn.addEventListener("click", () => {
      const player = document.getElementById("player").value.trim();
      if (!player) return alert("Insira um nick válido!");

      resultDiv.innerHTML = '<div class="loading">Carregando...</div>';

      fetch(`https://mush.com.br/api/player/${player}`)
        .then(res => {
          if (!res.ok) throw new Error("Erro ao buscar o jogador!");
          return res.json();
        })
        .then(data => {
          if (!data.success) {
            resultDiv.innerHTML = '<div class="error-message">Jogador não encontrado!</div>';
            return;
          }
          
          resultDiv.innerHTML = formatPlayerData(data.response);
        })
        .catch(err => {
          console.error(err);
          resultDiv.innerHTML = '<div class="error-message">Erro ao buscar jogador!</div>';
        });
    });