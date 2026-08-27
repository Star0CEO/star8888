<template>
  <div>
    <!-- 导航栏，非全屏模式显示 -->
    <van-nav-bar v-if="!isFullscreen" style="position: fixed; top: 0; left: 0; width: 100%; background: url(/img/counter/top-bg.webp) no-repeat rgb(8, 76, 203);" :title="gameName" left-arrow @click-left="$router.back()">
      <template #right>
        <div @click="toggleFullscreen" style="color: white; margin-right: 15px; font-size: 16px; cursor: pointer;">
          全屏
        </div>
      </template>
    </van-nav-bar>
    <div v-if="!isFullscreen" style="height: 46px"></div>
    
    <!-- 全屏模式下的退出按钮 -->
    <div v-if="isFullscreen" class="fullscreen-exit-btn" @click="toggleFullscreen">
      <span class="exit-arrow">↑</span>
    </div>
    
    <!-- 游戏内容 -->
    <div v-if="url" :style="isFullscreen ? 'height: 100vh; overflow: hidden;' : 'height: calc(100vh - 46px); overflow-y: scroll; -webkit-overflow-scrolling: touch'">
      <iframe style="height: 100%; width: 100%"  ref="iframe" scrolling="auto" frameborder="0"  id="iframe"></iframe>
    </div>
  </div>
</template>
<script>
export default {
  name: 'gamePage',
  data() {
    return {
      url: null,
      gameName: '',
      isFullscreen: false,
    };
  },
  created() {
    let that = this;
    var query = that.$route.query;
    // 打开代理
    console.log('GamePage query parameters:', query);
    if (query.dailiD == 1) {
      that.getAgentLoginUrl();
      return;
    }
    // 打开客服
    if (query.dailiD == 2) {
      that.getservicerurl();
      return;
    }
    if (query.app == 1) {
     that.url = that.$store.state.appInfo.ios_download_url;
      return;
    }
    if (query.name) {
      // 尝试从多个可能的字段中获取游戏名称
      // 优先使用 game_name，这应该是从游戏列表页面传递过来的游戏名称
      console.log('Available query parameters:', Object.keys(query));
      console.log('game_name parameter:', query.game_name);
      console.log('title parameter:', query.title);
      console.log('gameTitle parameter:', query.gameTitle);
      console.log('name parameter:', query.name);
      console.log('code parameter:', query.code);
      console.log('type parameter:', query.type);
      
      // 优先从后端获取游戏列表，确保获取最新的游戏名称
      // 传递 type 参数作为 game_code
      that.fetchGamesFromBackend(query.name, query.code || query.type);
      
      // 同时从本地存储中获取游戏名称作为备用
      let gameName = query.game_name || query.title || query.gameTitle;
      if (!gameName) {
        // 从本地存储中查找游戏名称
        const gameLists = [
          { name: 'fishingList', list: JSON.parse(localStorage.getItem('fishingList') || '[]') },
          { name: 'realbetList', list: JSON.parse(localStorage.getItem('realbetList') || '[]') },
          { name: 'sportList', list: JSON.parse(localStorage.getItem('sportList') || '[]') },
          { name: 'gamingList', list: JSON.parse(localStorage.getItem('gamingList') || '[]') },
          { name: 'jokerList', list: JSON.parse(localStorage.getItem('jokerList') || '[]') },
          { name: 'conciseList', list: JSON.parse(localStorage.getItem('conciseList') || '[]') },
          { name: 'lotteryList', list: JSON.parse(localStorage.getItem('lotteryList') || '[]') },
          { name: 'lhcList', list: JSON.parse(localStorage.getItem('lhcList') || '[]') },
          { name: 'jscList', list: JSON.parse(localStorage.getItem('jscList') || '[]') },
          { name: 'jwcList', list: JSON.parse(localStorage.getItem('jwcList') || '[]') },
          { name: 'qkcList', list: JSON.parse(localStorage.getItem('qkcList') || '[]') }
        ];
        
        // 存储所有找到的游戏，以便后续分析
        const foundGames = [];
        
        for (const { name: listName, list } of gameLists) {
          console.log(`Searching in ${listName}: ${list.length} games`);
          
          // 尝试通过 platform_name 和 game_code 查找，优先使用 type 参数作为 game_code
          const gameByCode = list.find(item => {
            const matchesPlatform = item.platform_name === query.name;
            const matchesCode = !query.type && !query.code || 
                              item.game_code === query.type || 
                              item.game_code === query.code;
            return matchesPlatform && matchesCode;
          });
          
          if (gameByCode) {
            foundGames.push({ source: 'code_match', list: listName, game: gameByCode });
            console.log('Found game by platform_name and game_code:', gameByCode);
          }
          
          // 尝试只通过 platform_name 查找
          const gameByPlatform = list.find(item => item.platform_name === query.name);
          if (gameByPlatform) {
            foundGames.push({ source: 'platform_match', list: listName, game: gameByPlatform });
            console.log('Found game by platform_name only:', gameByPlatform);
          }
        }
        
        // 优先选择通过 code 匹配的游戏
        if (foundGames.length > 0) {
          // 按匹配质量排序：code_match > platform_match
          foundGames.sort((a, b) => {
            if (a.source === 'code_match' && b.source !== 'code_match') return -1;
            if (a.source !== 'code_match' && b.source === 'code_match') return 1;
            return 0;
          });
          
          const bestMatch = foundGames[0].game;
          gameName = bestMatch.name || bestMatch.game_name || bestMatch.title;
          console.log('Best match found:', bestMatch);
          console.log('Selected game name:', gameName);
        }
      }
      
      that.gameName = gameName || query.name;
      console.log('Final game name set to:', that.gameName);
      that.goGamePage(query.name, query.type, query.code);
    }
  },
  methods: {
    // 打开客服
    getservicerurl() {
      let that = this;
      that.$apiFun.post('/api/getservicerurl', {}).then(res => {
        if (res.code != 200) {
          that.showTost(0, res.message);
        }
        if (res.code == 200) {
          that.url = res.data.url;
        }
      });
    },
    // 打开代理
    getAgentLoginUrl() {
      let that = this;
      that.$apiFun.get('/api/getAgentLoginUrl', {}).then(res => {
        if (res.code != 200) {
          that.showTost(0, res.message);
        }
        if (res.code == 200) {
          that.url = res.data.url;
        }
      });
    },
    // 打开游戏
    goGamePage(name, type, code) {
      let that = this;

      that.$apiFun
        .post('/api/getGameUrl', { plat_name: name, game_type: type || 0, game_code: code, is_mobile_url: 1 })
        .then(res => {
          console.log(res);
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.url = res.data.url;
            // 尝试从响应中获取游戏名称，如果没有则使用传入的名称
            if (res.data.game_name) {
              that.gameName = res.data.game_name;
            }
          }
        })
        .catch(res => {});
    },
    // 切换全屏
    toggleFullscreen() {
      let that = this;
      if (!that.isFullscreen) {
        // 进入全屏
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        that.isFullscreen = true;
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        that.isFullscreen = false;
      }
    },
    // 从后端获取游戏列表并查找对应的游戏名称
    fetchGamesFromBackend(platformName, gameCode) {
      let that = this;
      
      // 尝试不同的后端接口路径，包括游戏管理页面的接口
      const apiPaths = [
        '/api/game/list', 
        '/api/game/games', 
        '/api/games/list',
        '/api/game/game-lists', // 游戏管理页面的接口
        '/api/game-lists', // 另一种可能的游戏管理接口路径
        '/api/game_lists' // 直接使用数据库表名的接口路径
      ];
      let currentPathIndex = 0;
      
      const tryNextPath = () => {
        if (currentPathIndex >= apiPaths.length) {
          console.log('No more API paths to try');
          return;
        }
        
        const apiPath = apiPaths[currentPathIndex];
        currentPathIndex++;
        
        console.log(`Trying API path: ${apiPath}`);
        
        that.$apiFun.get(apiPath, { category: '' }).then(res => {
          if (res.code == 200 || res.status == 200) {
            // 处理不同的数据结构
            let games = [];
            if (Array.isArray(res.data)) {
              games = res.data;
            } else if (res.data && Array.isArray(res.data.list)) {
              games = res.data.list;
            } else if (res.data && Array.isArray(res.data.games)) {
              games = res.data.games;
            } else if (res.data && Array.isArray(res.data.game_lists)) {
              games = res.data.game_lists;
            }
            
            console.log('Fetched games from backend:', games.length);
            
            // 尝试通过 platform_name 和 game_code 查找
            const gameByCode = games.find(item => {
              const matchesPlatform = item.platform_name === platformName || item.platform === platformName;
              const matchesCode = !gameCode || 
                                item.game_code === gameCode || 
                                item.code === gameCode || 
                                item.gameId === gameCode ||
                                item.type === gameCode;
              return matchesPlatform && matchesCode;
            });
            
            if (gameByCode) {
              const gameName = gameByCode.name || gameByCode.game_name || gameByCode.title || gameByCode.gameName;
              that.gameName = gameName;
              console.log('Found game from backend by platform_name and game_code:', gameByCode);
              console.log('Updated game name:', gameName);
            } else {
              // 尝试只通过 platform_name 查找
              const gameByPlatform = games.find(item => item.platform_name === platformName || item.platform === platformName);
              if (gameByPlatform) {
                const gameName = gameByPlatform.name || gameByPlatform.game_name || gameByPlatform.title || gameByPlatform.gameName;
                that.gameName = gameName;
                console.log('Found game from backend by platform_name only:', gameByPlatform);
                console.log('Updated game name:', gameName);
              } else {
                // 尝试通过游戏代码直接查找
                const gameByCodeOnly = games.find(item => 
                  item.game_code === gameCode || 
                  item.code === gameCode || 
                  item.gameId === gameCode ||
                  item.type === gameCode
                );
                if (gameByCodeOnly) {
                  const gameName = gameByCodeOnly.name || gameByCodeOnly.game_name || gameByCodeOnly.title || gameByCodeOnly.gameName;
                  that.gameName = gameName;
                  console.log('Found game from backend by code only:', gameByCodeOnly);
                  console.log('Updated game name:', gameName);
                } else {
                  console.log('No game found in backend for platform:', platformName, 'code:', gameCode);
                  // 尝试下一个API路径
                  tryNextPath();
                }
              }
            }
          } else {
            console.log('Failed to fetch games from backend:', res.message || res.msg);
            // 尝试下一个API路径
            tryNextPath();
          }
        }).catch(err => {
          console.log('Error fetching games from backend:', err);
          // 尝试下一个API路径
          tryNextPath();
        });
      };
      
      // 开始尝试第一个API路径
      tryNextPath();
    },
  },
  mounted() {
    let that = this;
  },
  updated() {
    let that = this;
    that.$refs.iframe.contentWindow.location.replace(that.url);
  },
};
</script>

<style lang="scss" scoped>
// @import '../../../static/css/chunk-099d4415.690b75b1.css';

.van-nav-bar__arrow {
  color: white !important;
}

.van-icon-arrow-left {
  color: white !important;
}

.van-nav-bar__title {
  color: white !important;
}
</style>

<style>
/* 全局样式，确保导航栏返回箭头和标题为白色 */
.van-nav-bar__arrow {
  color: white !important;
}

.van-icon-arrow-left {
  color: white !important;
}

.van-nav-bar__title {
  color: white !important;
  font-weight: bold !important;
}

/* 全屏退出按钮样式 */
.fullscreen-exit-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
}

.fullscreen-exit-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.exit-arrow {
  color: white;
  font-size: 20px;
  font-weight: bold;
}
</style>
