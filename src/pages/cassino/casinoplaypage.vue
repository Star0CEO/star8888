<template>
  <div>
    <GameLayout>
      <!-- Tela de carregamento -->
      <div class="w-full h-full flex justify-center items-center bg-black max-w-[490px]" :isLoading="isLoading">
        <div class="text-center">
          <img src="/public/assets/images/loading.png" class="w-[50px] h-auto" alt="Carregando informações dos jogos" />
        </div>
      </div>

      <!-- Tela do jogo -->
      <div v-if="!isLoading && (game || url)" :class="{ 'w-full': modeMovie, 'lg:w-3/3': !modeMovie }" class="mx-auto relative">
        <div class="game-screen" id="game-screen">
          <fullscreen v-model="fullscreen" :page-only="pageOnly">
            <!-- Botão "Quitar" -->
            <div class="absolute top-4 left-4 z-10 flex flex-col items-center">
              <router-link to="/" class="mr-2">
                <img src="/public/storage/quitar.png" alt="Voltar para Home" class="w-12 h-12 cursor-pointer" />
              </router-link>

             <!-- Botão de ativar/desativar tela cheia -->
<button @click="toggleFullscreen" class="w-auto h-auto mr-2 mt-1">
  <i v-if="fullscreen" class="fa-light fa-arrows-minimize fa-xl" style="color: #ffffff;"></i>
  <i v-else class="fa-light fa-arrows-maximize fa-xl" style="color: #ffffff;"></i>
</button>

            </div>

            <!-- Exibir o conteúdo do iframe ou botão iniciar -->
            <div v-if="showButton && game && game.game_type === 'live' && game.distribution === 'evergame'"
              class="game-full fullscreen-wrapper flex items-center justify-center">
              <button @click.prevent="openModal(gameUrl)" type="button" class="text-sm font-medium text-color focus:outline-none bg-white">
                Clique para começar
              </button>
            </div>
            <iframe v-else :src="gameUrl || url" class="game-full fullscreen-wrapper"></iframe>
          </fullscreen>
        </div>
      </div>

      <!-- Mensagem de manutenção -->
      <div v-if="undermaintenance" class="flex flex-col max-h-[100vh] items-center justify-center text-center py-24">
        <h1 class="text-2xl text-color mb-4">Jogo Em Manutenção, volte mais tarde!</h1>
        <img :src="`/assets/images/manutencao.png`" alt="" width="400">
        <div class="fixed bottom-16 flex items-center justify-center w-full p-4 h-20 max-w-[400px]">
          <router-link to="/" class="absolute rounded-lg w-auto py-4 pr-4 pl-4 items-center background-bottom-navigation">
            Voltar para Tela inicial
          </router-link>
        </div>
      </div>
    </GameLayout>
  </div>
</template>

<script>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/Stores/Auth.js";
import { component } from 'vue-fullscreen';
import LoadingComponent from "@/Components/UI/LoadingComponent.vue";
import GameLayout from "@/Layouts/GameLayout.vue";
import HttpApi from "@/Services/HttpApi.js";
import {
  defineComponent,
  toRefs,
  reactive,
} from 'vue';

export default {
  components: {
    GameLayout,
    LoadingComponent,
    RouterLink,
    component
  },
  data() {
    return {
      isLoading: true,
      game: null,
      modeMovie: false,
      gameUrl: null,
      url: null,
      gameName: '',
      token: null,
      gameId: null,
      tabs: null,
      undermaintenance: false,
      showButton: false,
      showFullscreenButton: false, // Mostrar botão de fullscreen se for bloqueado
    };
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      fullscreen: false,
      pageOnly: false,
    });

  // Função para ativar ou desativar a tela cheia
function toggleFullscreen() {
  const elem = document.getElementById("game-screen");

  if (!state.fullscreen) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        state.fullscreen = true;
      }).catch(err => {
        console.log(`Erro ao tentar ativar o modo de tela cheia: ${err.message}`);
      });
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else {
      console.log("Fullscreen não suportado pelo navegador.");
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        state.fullscreen = false;
      }).catch(err => {
        console.log(`Erro ao sair do modo de tela cheia: ${err.message}`);
      });
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

   return {
  ...toRefs(state),
  toggleFullscreen, // Substitua pelo método atualizado
  router
};

  },
  mounted() {
    // Tentar ativar a tela cheia automaticamente
    setTimeout(() => {
      this.activateFullscreen();
    }, 500); // Espera 0,5 segundos após o carregamento

    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
    const isSamsungInternet = userAgent.includes('samsung') && userAgent.includes('safari') && !userAgent.includes('chrome');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');

    if (isSafari || isSamsungInternet || isIOS) {
      this.showButton = true;
    }
  },
  computed: {
    userData() {
      const authStore = useAuthStore();
      return authStore.user;
    },
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuth;
    },
  },
  methods: {
    openModal(gameUrl) {
      window.open(gameUrl);
    },
    getGame: async function () {
      const _this = this;

      return await HttpApi.get('games/single/' + _this.gameId)
        .then(async response => {
          if (response.data?.action === 'deposit') {
            _this.$nextTick(() => {
              _this.router.push({ name: 'profileDeposit' });
            });
          }

          const game = response.data.game;
          _this.game = game;

          _this.gameUrl = response.data.gameUrl;
          _this.token = response.data.token;
          _this.isLoading = false;

          _this.$nextTick(() => {
            _this.loadingTab();
          });
        })
        .catch(error => {
          _this.isLoading = false;
          _this.undermaintenance = true;
        });
    },
    toggleFavorite: function () {
      const _this = this;
      return HttpApi.post('games/favorite/' + _this.game.id, {})
        .then(response => {
          _this.getGame();
          _this.isLoading = false;
        })
        .catch(error => {
          _this.isLoading = false;
        });
    },
    toggleLike: async function () {
      const _this = this;
      return await HttpApi.post('games/like/' + _this.game.id, {})
        .then(async response => {
          await _this.getGame();
          _this.isLoading = false;
        })
        .catch(error => {
          _this.isLoading = false;
        });
    },
    // 打开客服
    getservicerurl() {
      let that = this;
      HttpApi.post('/api/getservicerurl', {})
        .then(res => {
          if (res.data?.code != 200) {
            console.error(res.data?.message || 'Erro ao obter URL do客服');
          }
          if (res.data?.code == 200) {
            that.url = res.data.data.url;
            that.isLoading = false;
          }
        })
        .catch(error => {
          console.error('Erro ao obter URL do客服:', error);
          that.isLoading = false;
          that.undermaintenance = true;
        });
    },
    // 打开代理
    getAgentLoginUrl() {
      let that = this;
      HttpApi.get('/api/getAgentLoginUrl', {})
        .then(res => {
          if (res.data?.code != 200) {
            console.error(res.data?.message || 'Erro ao obter URL do代理');
          }
          if (res.data?.code == 200) {
            that.url = res.data.data.url;
            that.isLoading = false;
          }
        })
        .catch(error => {
          console.error('Erro ao obter URL do代理:', error);
          that.isLoading = false;
          that.undermaintenance = true;
        });
    },
    // 打开游戏
    goGamePage(name, type, code) {
      let that = this;

      HttpApi
        .post('/api/getGameUrl', { plat_name: name, game_type: type || 0, game_code: code, is_mobile_url: 1 })
        .then(res => {
          console.log(res);
          if (res.data?.code != 200) {
            console.error(res.data?.message || 'Erro ao obter URL do jogo');
          }
          if (res.data?.code == 200) {
            that.url = res.data.data.url;
            // 尝试从响应中获取游戏名称，如果没有则使用传入的名称
            if (res.data.data.game_name) {
              that.gameName = res.data.data.game_name;
            }
            that.isLoading = false;
          }
        })
        .catch(res => {
          console.error('Erro ao obter URL do jogo:', res);
          that.isLoading = false;
          that.undermaintenance = true;
        });
    },
    // 从后端获取游戏列表并查找对应的游戏名称
    fetchGamesFromBackend(platformName, gameCode) {
      let that = this;
      
      // 尝试不同的后端接口路径
      const apiPaths = [
        '/api/game/list', 
        '/api/game/games', 
        '/api/games/list',
        '/api/game/game-lists',
        '/api/game-lists',
        '/api/game_lists'
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
        
        HttpApi.get(apiPath, { category: '' }).then(res => {
          if (res.data?.code == 200 || res.data?.status == 200) {
            // 处理不同的数据结构
            let games = [];
            if (Array.isArray(res.data?.data)) {
              games = res.data.data;
            } else if (res.data?.data && Array.isArray(res.data.data.list)) {
              games = res.data.data.list;
            } else if (res.data?.data && Array.isArray(res.data.data.games)) {
              games = res.data.data.games;
            } else if (res.data?.data && Array.isArray(res.data.data.game_lists)) {
              games = res.data.data.game_lists;
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
            console.log('Failed to fetch games from backend:', res.data?.message || res.data?.msg);
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
    loadingTab() {
      // 加载标签页的逻辑
    },
    activateFullscreen() {
      // 激活全屏的逻辑
    }
  },
  async created() {
    if (this.isAuthenticated) {
      const route = useRoute();
      const query = route.query;
      
      // 打开代理
      if (query.dailiD == 1) {
        this.getAgentLoginUrl();
        return;
      }
      // 打开客服
      if (query.dailiD == 2) {
        this.getservicerurl();
        return;
      }
      if (query.app == 1) {
        this.url = 'https://example.com/app-download'; // 替换为实际的APP下载URL
        this.isLoading = false;
        return;
      }
      
      // 检查是否有name参数（从pg/wap游戏页面传来的参数）
      if (query.name) {
        // 优先从后端获取游戏列表，确保获取最新的游戏名称
        // 传递 type 参数作为 game_code
        this.fetchGamesFromBackend(query.name, query.code || query.type);
        
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
        
        this.gameName = gameName || query.name;
        console.log('Final game name set to:', this.gameName);
        this.goGamePage(query.name, query.type, query.code);
      } else {
        // 原有的游戏ID方式
        this.gameId = route.params.id;
        await this.getGame();
      }
    } else {
      this.router.push({ name: 'login', params: { action: 'openlogin' } });
    }
  },
};
</script>

<style>
.game-screen {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  width: 100%;
  min-height: 100vh;
}

.fullscreen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.game-full {
  width: 100%;
  min-height: 100vh;
}
</style>
