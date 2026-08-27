<template>
  <div v-if="bannerList.length > 0">
    <div data-v-ab7e7df3="" data-v-1ed58d81="" class="app-download-bar-v2" v-if="appshow">
      <div data-v-ab7e7df3="" class="flex-center">
        <span data-v-ab7e7df3="" class="close-btn" @click="appshow = false">×</span>
        <div data-v-ab7e7df3="" class="icon">
          <img data-v-ab7e7df3="" src="https://9pgh5.liwifi.top/assets/9pg-DYmuSJSM.png" alt="icon" class="fit-image">
        </div>
        <div data-v-ab7e7df3="" class="medium-text text">官方域名<span data-v-ab7e7df3="" class="text-domain-name">9PG.app</span>，请安装APP</div>
      </div>
      <div data-v-ab7e7df3="" class="download-btn" @click="$parent.goNav('/app')">立即下载&gt;</div>
      <!---->
    </div>
    <div style="position: relative">

    </div>


    <div class="domainModal_domainView__FWCzg" v-if="goInfo">
      <div class="domainModal_mask__24Y2m domainModal_fadeIn__1I3AS false" @click="goInfo = null"></div>
      <div class="domainModal_content__1nBgc" style="width: 80%">
        <img src="/static/image/hongbaocolse.png" @click="goInfo = null" style="position: absolute; top: 5px; right: 13px; width: 0.7rem" alt="" />

        <div class="domainModal_middle__3gQPm" style="padding: 35px 10px 15px">
          {{ goInfo }}

          <van-button type="info" style="margin: 0 auto; margin-top: 20px; width: 120px; border-radius: 10px; height: 35px" @click="$parent.goNav('/message')">更多公告</van-button>
        </div>
      </div>
    </div>
    <!-- 用户信息栏 -->
    <div class="xiding" :style="{ top: appshow ? '1rem' : '0' }">
      <div class="logo-wrapper">
            <img :src="$store.state.appInfo.site_logo || 'https://emage.hnylqx.xyz/18/h5/banner/images/20251003174120316.gif'" alt="" class="logo-icon lu-logo">
          </div>
      <div class="caosuo">
        <div class="lefsg" v-if="$store.state.token">
          <div class="meys">
            <div class="lefs">
              <span>￥</span>{{ $store.getters.safeBalance }}
              <div class="imsg" @click="refreshBalance">
                <img :class="{ 'rotate': isRefreshing }" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAsCAMAAADGmMENAAAAP1BMVEVHcEwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiqnIXhzAAAAFHRSTlMA2J27Cx/syfSufhOOSDJc41NtOpw838sAAAGHSURBVDjLjZVZloQgDEUZlFmc2P9aW4KNIKEwX1XHa3hJnoGQV9jVaSmUkNqtM/kZ08FVKEKa/guTEaEJ1uEPhAXet6zV+bGikkv6vKsb2G9ZqrdJ13y/z6c3vGCn8k7m8857ltJoB7YJdlWDtg5MJDxYSZuZIa1r4Xl7wcadpY5KBtEvmF3/fP4VJKLN1YXJJ/XcdrQ4bQL3xOQGLX02S1NahCiSuo2YXE1kRlQj4VLb4IxjSC+pbBdyc34F9IIn6wxlExLHRaFINY3pOAEBxW7kG60+0xzoqER8VgJV2jFNQQP71kFwCk82WYf0mRzsU9tHYe6Rw1cyfRlOHCKM3nyxSfQemFAVs7e1tXNHwp6XzFPnqdqjQLVIn0nMbetFVA/Al0th4dq/VlxVtYUFSjvV3Apfi2juwdWwvGgTQOwIbJAdWcCi7N9KQ2cfrvdazkby7maRzMf/xXFdfoyx6xrMN8uOtIPjl1Tg+Dd+aoSVe9/FbKtQwfaB24yWm1Jqo9fV/TbyHynqLXJDNCBaAAAAAElFTkSuQmCC" alt="reload" class="fit-image" />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="balance-wrapper">
          
          <div class="login-wrapper">
            <div class="regist-button button black-text small2-text medium" @click="showRegister = true" style="font-size: 0.36rem !important;"></div>
            <div id="login-button" class="button white-text small2-text medium" @click="showLogin = true"></div>
          </div>
        </div>
        <div class="riggs">
          <div class="lisImg" @click="$parent.goNav('/recharge')">
            <div class="img-wrapper">
              <img src="/static/style/feature_moneydraw.cbeb513bc9fd00ecc5372fc0e54a84c0.png" alt="" />
              <div class="right-top-label">送3%</div>
            </div>
            存款
          </div>
          <div class="lisImg" @click="$parent.goNav('/withdrawal')">
            <img src="/static/style/feature_moneysave.4b60fbaf4ee368d1e7060133f62690c9.png" alt="" />
            取款
          </div>
          <div class="lisImg" @click="$parent.openKefu">
            <img src="/static/style/kffff.png" alt="" />
            客服
          </div>
          <div class="lisImg" @click="$parent.goNav('/hongbao')">
            <div class="link-icon rebate-icon pg-rebate-icon">
              <img src="/static/style/icon-profit-rain-dq3TXISv.png" alt="rebate" class="fit-image">
            </div>
            <div class="caption" style="color: rgb(250, 29, 29);"> 红包雨 </div>
          </div>
        </div>
      </div>
      <!-- 游戏分类标签栏 -->
      <div class="top-tab-bar" v-if="gameType === 2 || gameType === 3 || gameType === 4 || gameType === 5">
        <div class="game-type-tabs">
          <!-- 捕鱼分类 -->
          <template v-if="gameType === 2">
            <div class="game-type-tab" :class="{ 'active': !selectedFishingPlatform }">全部</div>
            <div class="game-type-tab" :class="{ 'active': selectedFishingPlatform === 'BGBY' }" @click="selectFishingPlatform('BGBY')">BG</div>
            <div class="game-type-tab" :class="{ 'active': selectedFishingPlatform === 'AG' }" @click="selectFishingPlatform('AG')">PA</div>
          </template>
          <!-- 棋牌分类 -->
          <template v-if="gameType === 3">
            <div class="game-type-tab" :class="{ 'active': !selectedJokerPlatform }">全部</div>
            <div class="game-type-tab" :class="{ 'active': selectedJokerPlatform === 'BBQP' }" @click="selectJokerPlatform('BBQP')">BBIN</div>
            <div class="game-type-tab" :class="{ 'active': selectedJokerPlatform === 'BGQP' }" @click="selectJokerPlatform('BGQP')">BG</div>
            <div class="game-type-tab" :class="{ 'active': selectedJokerPlatform === 'AG' }" @click="selectJokerPlatform('AG')">AG</div>
          </template>
          <!-- 电子分类 -->
          <template v-if="gameType === 4">
            
           <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'PG' }" @click="selectPlatform('PG')">PG</div>
            <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'PP' }" @click="selectPlatform('PP')">PP</div>
            <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'CQ9' }" @click="selectPlatform('CQ9')">CQ9</div>
            <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'JDB' }" @click="selectPlatform('JDB')">JDB</div>
            <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'JILI' }" @click="selectPlatform('JILI')">JILI</div>
            <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'FC' }" @click="selectPlatform('FC')">FC</div>
            <div class="game-type-tab" :class="{ 'active': selectedPlatform === 'WG' }" @click="selectPlatform('WG')">WG</div>
          </template>
          <!-- 彩票分类 -->
          <template v-if="gameType === 5">
            <div class="game-type-tab" :class="{ 'active': !selectedLotteryPlatform }">全部</div>
            <div class="game-type-tab" :class="{ 'active': selectedLotteryPlatform === 'LHC' }" @click="selectLotteryPlatform('LHC')">六合彩</div>
            <div class="game-type-tab" :class="{ 'active': selectedLotteryPlatform === 'JSC' }" @click="selectLotteryPlatform('JSC')">极速彩</div>
            <div class="game-type-tab" :class="{ 'active': selectedLotteryPlatform === 'JWC' }" @click="selectLotteryPlatform('JWC')">境外彩</div>
            <div class="game-type-tab" :class="{ 'active': selectedLotteryPlatform === 'QKC' }" @click="selectLotteryPlatform('QKC')">区块彩</div>
          </template>
        </div>
        <!-- 搜索图标 -->
        <div class="search-icon" @click="toggleSearchBox" v-if="gameType === 4">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUdwTCUlJSgoKCkpKSgoKCkpKSkpKSkpKSoqKigoKCkpKScnJygoKCMjIygoKCoqKseuDdQAAAAPdFJOUwAQf+A/vplf7yDPL28fT1x7ifYAAADwSURBVCjPnVG7DgFRFLzeESKbKAiNKLQahUZWr6BCI0voUWvEDygkCo1S6R/4AJ/isesRIuO+F1GZYueeyZycOWcJ+Y10xXgv/V3A7rl1xAJDSws74FakSkbWXqBhkISFkxTyKDCKmdISwV1MWMDh7ENJOMPmmfMeZdlbFa/+WU0LoM1oelVCCGP69eCphDCOLDYOOiEe34KjfRyye+ropYXZuighiBrf9aZus8SAUVLoLKLNKarW9kJGtNDhM/rKGoc9pPUWYhWaZA3Uc016w5N7Q4aJqa86N1ltzLSF+DfZEe/NfP6/lEjmwrMi/+AFJYxumJPpNugAAAAASUVORK5CYII=" alt="search" class="search-img">
        </div>
        <!-- 搜索框 -->
        <div class="search-box" v-if="showSearchBox && gameType === 4">
          <div class="search-input-wrapper">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUdwTCUlJSgoKCkpKSgoKCkpKSkpKSkpKSoqKigoKCkpKScnJygoKCMjIygoKCoqKseuDdQAAAAPdFJOUwAQf+A/vplf7yDPL28fT1x7ifYAAADwSURBVCjPnVG7DgFRFLzeESKbKAiNKLQahUZWr6BCI0voUWvEDygkCo1S6R/4AJ/isesRIuO+F1GZYueeyZycOWcJ+Y10xXgv/V3A7rl1xAJDSws74FakSkbWXqBhkISFkxTyKDCKmdISwV1MWMDh7ENJOMPmmfMeZdlbFa/+WU0LoM1oelVCCGP69eCphDCOLDYOOiEe34KjfRyye+ropYXZuighiBrf9aZus8SAUVLoLKLNKarW9kJGtNDhM/rKGoc9pPUWYhWaZA3Uc016w5N7Q4aJqa86N1ltzLSF+DfZEe/NfP6/lEjmwrMi/+AFJYxumJPpNugAAAAASUVORK5CYII=" alt="search" class="search-img-inside">
            <input type="text" v-model="searchKeyword" @input="searchGames" placeholder="搜索游戏" class="search-input-with-icon">
          </div>
          <div class="search-close" @click="closeSearchBox">×</div>
        </div>
      </div>
    </div>
    <!-- 游戏栏 -->
    <div class="gameBoxs" :style="{ marginTop: appshow ? '3.2rem' : '2.2rem' }">
      <div class="lfst" :style="{ top: appshow ? '3.2rem' : '2.2rem' }">
        <div :class="gameType == 6 ? 'ls active' : 'ls'" @click="changGameType(6)">
          <img :src="`/static/style/${gameType == 6 ? 'sidebar_casino_icon_select' : 'sidebar_casino_icon_nor'}.png`" alt="" />
          <span>热门</span>
        </div>
        <div :class="gameType == 4 ? 'ls active' : 'ls'" @click="changGameType(4)">
          <img :src="`/static/style/${gameType == 4 ? 'sidebar_slot_icon_select' : 'sidebar_slot_icon_nor'}.png`" alt="" />

          <span>电子</span>
        </div>
        <div :class="gameType == 0 ? 'ls active' : 'ls'" @click="changGameType(0)">
          <img :src="`/static/style/${gameType == 0 ? 'sidebar_casino_icon_select' : 'sidebar_casino_icon_nor'}.png`" alt="" />
          <span>真人</span>
        </div>
        <div :class="gameType == 1 ? 'ls active' : 'ls'" @click="changGameType(1)">
          <img :src="`/static/style/${gameType == 1 ? 'sidebar_sports_icon_select' : 'sidebar_sports_icon_nor'}.png`" alt="" />

          <span>体育</span>
        </div>
        <div :class="gameType == 2 ? 'ls active' : 'ls'" @click="changGameType(2)">
          <img :src="`/static/style/${gameType == 2 ? 'sidebar_esports_icon_select' : 'sidebar_esports_icon_nor'}.png`" alt="" />

          <span>捕鱼</span>
        </div>
        <div :class="gameType == 3 ? 'ls active' : 'ls'" @click="changGameType(3)">
          <img :src="`/static/style/${gameType == 3 ? 'sidebar_board_icon_select' : 'sidebar_board_icon_nor'}.png`" alt="" />

          <span>棋牌</span>
        </div>
        <div :class="gameType == 5 ? 'ls active' : 'ls'" @click="changGameType(5)">
          <img :src="`/static/style/${gameType == 5 ? 'sidebar_lottery_icon_select' : 'sidebar_lottery_icon_nor'}.png`" alt="" />

          <span>彩票</span>
        </div>
      </div>
      <div class="content-area">

        <div class="rigts hot-grid" v-if="gameType == 6">
          <div class="game-item" v-for="(item, index) in $store.state.fishingList" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)">
            <div class="game-icon-container">
              <img :src="getGameImg(item, 'fishing')" alt="" />
              <div class="api-icon" v-if="item.api_logo_img">
                <img :src="item.api_logo_img" alt="接口图标" />
              </div>
            </div>
            <div class="game-name">{{ item.name || item.game_name || item.title || '游戏' }}</div>
          </div>
        </div>
        <div class="rigts single-column realbet-content" v-if="gameType == 0">
          <div class="realbet-game-item" v-for="(item, index) in $store.state.realbetList" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)">
            <div class="realbet-icon-container">
              <img :src="getGameImg(item, 'realbet')" alt="" />
            </div>
          </div>
        </div>
        <div class="rigts single-column sport-content" v-if="gameType == 1">
          <div class="sport-game-item" v-for="(item, index) in $store.state.sportList" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)">
            <div class="sport-icon-container">
              <img :src="getGameImg(item, 'sport')" alt="" />
            </div>
          </div>
        </div>
        <div class="rigts three-column" v-if="gameType == 2">
          <div class="game-item" v-for="(item, index) in filteredFishingGames.length > 0 ? filteredFishingGames : $store.state.gamingList" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)">
            <div class="game-icon-container">
              <img :src="getGameImg(item, 'gaming')" alt="" />
              <div class="api-icon" v-if="item.api_logo_img">
                <img :src="item.api_logo_img" alt="接口图标" />
              </div>
            </div>
            <div class="game-name">{{ item.name || item.game_name || item.title || '游戏' }}</div>
          </div>
        </div>
        <div class="rigts three-column" v-if="gameType == 3">
          <div class="game-item" v-for="(item, index) in filteredJokerGames.length > 0 ? filteredJokerGames : $store.state.jokerList" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)">
            <div class="game-icon-container">
              <img :src="getGameImg(item, 'joker')" alt="" />
              <div class="api-icon" v-if="item.api_logo_img">
                <img :src="item.api_logo_img" alt="接口图标" />
              </div>
            </div>
            <div class="game-name">{{ item.name || item.game_name || item.title || '游戏' }}</div>
          </div>
        </div>
        <div class="rigts three-column" v-if="gameType == 4">
          <div class="game-item" v-for="(item, index) in filteredGames.length > 0 ? filteredGames : $store.state.conciseList" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)">
            <div class="game-icon-container">
              <img :src="getGameImg(item, 'concise')" alt="" />
              <div class="api-icon" v-if="item.api_logo_img">
                <img :src="item.api_logo_img" alt="接口图标" />
              </div>
            </div>
            <div class="game-name">{{ item.name || item.game_name || item.title || '游戏' }}</div>
          </div>
        </div>
        <div class="rigts three-column" v-if="gameType == 5">
          <div class="game-item" v-for="(item, index) in filteredLotteryGames" :key="index" @click="$parent.openGamePage(item.platform_name, item.game_code, '', item.name || item.game_name || item.title)" :class="{ 'full-width': item.platform_name == 'vrbet' }">
            <div class="game-icon-container">
              <img :style="item.platform_name == 'vrbet' ? 'width:100%' : ''" :src="getGameImg(item, 'lottery')" alt="" />
              <div class="api-icon" v-if="item.api_logo_img">
                <img :src="item.api_logo_img" alt="接口图标" />
              </div>
            </div>
            <div class="game-name">{{ item.name || item.game_name || item.title || '游戏' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹出层 -->
    <van-popup v-model="leftshow" position="left" :style="{ height: '100%' }">
      <div class="leftbox">
        <div class="side__main__1NhyG">
          <h3>Hi，欢迎进入{{ $store.state.appInfo.title }}</h3>
          <dl class="side__vip__1dW8w">
            <div class="topxs">专属VIP体验</div>
            <p>立享会员特权</p>
            <p>享受只属于你的与众不同</p>
            <dd @click="$parent.goNav('/vip')">会员中心</dd>
          </dl>
          <ul>
            <li v-if="$store.state.token" @click="$parent.goNav('/message')"><img src="/static/image/meunIcon.39f38dc98ad956615952d485d0e6af04.svg" />消息中心<span class="side__subtitle__3QtYC"></span></li>
            <li @click="$parent.openKefu"><img src="/static/image/meunIcon2.5d0d78496889fb8b027f603254286fdf.svg" />意见反馈<span class="side__subtitle__3QtYC"></span></li>
            <li @click="doCopy($store.state.appInfo.h5_url)">
              <img src="/static/image/menuIcon5.5687ef4d1512d53aa3535e3b1088fe70.png" />永久域名<span class="side__subtitle__3QtYC">{{ $store.state.appInfo.h5_url }}</span>
            </li>
            <li @click="$parent.goNav('/abouts')"><img src="/static/image/meunIcon3.c51bbb9ebece978f1976397ab12acba7.svg" />关于我们<span class="side__subtitle__3QtYC"></span></li>
          </ul>
          <div class="nisd" v-if="!$store.state.token" @click="$parent.goNav('/login')">立即登录</div>
          <div class="nisd" v-else @click="$parent.outLogin"><img src="/static/image/tuichu.93c1b9e3d4b4a7772481916ca32c074f.svg" />安全退出</div>
        </div>
      </div>
    </van-popup>

    <!-- 官网弹窗 -->
    <div class="domainModal_domainView__FWCzg" v-if="$store.state.appInfo.index_modal == 1 && tanshow">
      <div class="domainModal_mask__24Y2m domainModal_fadeIn__1I3AS false" @click="changtanshow"></div>
      <div class="domainModal_content__1nBgc" style="width: 80%">
        <div id="domain" class="domainModal_contentTop__2C4jc">
          <img src="/static/image/hongbaocolse.png" @click="changtanshow" style="position: absolute; top: 5px; right: 13px; width: 0.6rem" alt="" />


          <div class="domainModal_middle__3gQPm" v-html="$store.state.appInfo.webcontent"></div>
        </div>
      </div>
    </div>
    <!-- 登录弹窗 -->
    <div class="login-modal-wrapper" v-if="showLogin">
      <div class="login-modal-overlay" @click="showLogin = false"></div>
      <div class="login-modal-content">
        <login @close="showLogin = false"></login>
      </div>
    </div>
    <!-- 注册弹窗 -->
    <div class="login-modal-wrapper" v-if="showRegister">
      <div class="login-modal-overlay" @click="showRegister = false"></div>
      <div class="login-modal-content">
        <login @close="showRegister = false" :initial-type="1"></login>
      </div>
    </div>
  </div>
</template>
<script>
import login from '../login.vue';
import languageselector from '../ui/languageselector.vue';

export default {
  name: 'index',
  components: {
    login,
    languageselector,
  },
  data() {
    return {
      hongbashow: true,
      appShow: true,
      current: 0,
      bannerList: [],
      homenoticelis: [],
      // 弹出层
      leftshow: false,
      activeKey: 0,
      gameType: 6,
      tanshow: true,
      appshow: true,
      goInfo: null,
      showLogin: false,
      showRegister: false,
      isRefreshing: false,
      // 拖动相关
      isDragging: false,
      startX: 0,
      startY: 0,
      initialLeft: 0,
      initialTop: 0,
      // 搜索相关
      showSearchBox: false,
      searchKeyword: '',
      filteredGames: [],
      // 平台过滤相关
      selectedPlatform: '',
      // 捕鱼平台过滤相关
      selectedFishingPlatform: '',
      filteredFishingGames: [],
      // 棋牌平台过滤相关
      selectedJokerPlatform: '',
      filteredJokerGames: [],
      // 彩票平台过滤相关
      selectedLotteryPlatform: '',
      filteredLotteryGames: [],
    };
  },
  created() {
    let that = this;
    that.getBanList();
    that.homenotice(); //获取公告
  },
  methods: {
    openGogao(val) {
      this.goInfo = val;
    },
    changtanshow() {
      this.tanshow = !this.tanshow;
    },
    changGameType(type) {
      this.gameType = type;
      // 切换到电子分类时，默认选中PG平台
      if (type === 4 && !this.selectedPlatform) {
        this.selectedPlatform = 'PG';
        this.filterGamesByPlatform();
      }
      // 切换到彩票分类时，默认显示全部
      if (type === 5) {
        this.selectedLotteryPlatform = '';
        this.filterLotteryGamesByPlatform();
      }
    },
    getGameImg(item, type) {
      console.log('getGameImg item:', item);
      let baseURL = sessionStorage.getItem('baseURL') || 'http://127.0.0.13';
      let imgSrc = '';
      
      const imgFields = [
        'mobile_img', 'api_logo_img', 'check_yes_img', 'check_no_img', 'header_logo',
        'app_img', 'img', 'image', 'icon', 'cover', 'photo',
        'appimg', 'appimage', 'game_img', 'game_icon', 'game_image',
        'img_url', 'image_url', 'icon_url', 'icon_img',
        'appIcon', 'appImage', 'gameIcon', 'gameImage', 'gameImg',
        'iconUrl', 'imgUrl', 'imageUrl',
        'logo', 'thumb', 'thumbnail', 'pic', 'picture'
      ];
      
      for (const field of imgFields) {
        if (item[field] && item[field].trim() !== '') {
          imgSrc = item[field].trim();
          console.log('找到图片字段:', field, '值:', imgSrc);
          break;
        }
      }
      
      if (imgSrc) {
        let result = '';
        
        // 处理特殊情况: 后端存储的混合路径，如 http://127.0.0.13/uploads/https://xxx
        const uploadsHttpPattern = /\/uploads\/(https?:\/\/.*)/;
        const uploadsHttpMatch = imgSrc.match(uploadsHttpPattern);
        if (uploadsHttpMatch) {
          // 提取真实的图片URL
          result = uploadsHttpMatch[1];
          console.log('提取外部链接:', result);
          return result;
        }
        
        // 方式1: 外部图片链接 - 以 http:// 或 https:// 开头
        if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
          result = imgSrc;
        }
        // 方式2: 本地上传图片 - 以 /uploads/ 开头，需要拼接 baseURL
        else if (imgSrc.startsWith('/uploads/')) {
          result = baseURL + imgSrc;
        }
        // 其他相对路径
        else if (imgSrc.startsWith('/')) {
          result = baseURL + imgSrc;
        } else {
          result = baseURL + '/' + imgSrc;
        }
        console.log('最终图片地址:', result);
        return result;
      }
      
      console.log('未找到有效图片字段，可用字段:', Object.keys(item));
      return '';
    },
    doCopy(msg) {
      let cInput = document.createElement('input');
      cInput.style.opacity = '0';
      cInput.value = msg;
      document.body.appendChild(cInput);
      // 选取文本框内容
      cInput.select();

      // 执行浏览器复制命令
      // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
      // Input要在正常的编辑状态下原生复制方法才会生效
      document.execCommand('copy');

      // 复制成功后再将构造的标签 移除
      this.$parent.showTost(1, '复制成功！');
    },
    changleftshow() {
      this.leftshow = !this.leftshow;
    },
    refreshBalance() {
      let that = this;
      if (that.isRefreshing) return;
      that.isRefreshing = true;
      console.log('刷新余额...');
      that.$apiFun.post('/api/balance', {}).then(res => {
        console.log('余额刷新接口返回:', res);
        if (res.code == 200 && res.data && res.data.balance !== undefined) {
          let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
          userInfo.balance = res.data.balance;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.$store.commit('changUserInfo');
          console.log('余额已刷新:', userInfo.balance);
        }
      }).catch(err => {
        console.error('刷新余额失败:', err);
      }).finally(() => {
        that.isRefreshing = false;
      });
    },
    getBanList() {
      let that = this;
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/bannerList', { type: 2 })
        .then(res => {
          if (res.code != 200) {
            that.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.bannerList = res.data;
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    homenotice() {
      let that = this;
      that.$apiFun.post('/api/homenotice', {}).then(res => {
        if (res.code != 200) {
          that.showTost(0, res.message);
        }
        if (res.code == 200) {
          that.homenoticelis = res.data;
          that.ok = true;
        }
      });
    },
    onChange(index) {
      this.current = index;
    },
    changhongbashow() {
      this.hongbashow = false;
    },
    changappShow() {
      this.appShow = false;
    },
    // 拖动相关方法
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      const tabBar = event.target.closest('.tab-bar');
      if (tabBar) {
        const rect = tabBar.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;
      }
    },
    drag(event) {
      if (!this.isDragging) return;
      
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      
      const tabBar = event.target.closest('.tab-bar');
      if (tabBar) {
        // 计算新位置，确保在内容区域内
        const parentRect = tabBar.parentElement.getBoundingClientRect();
        const tabRect = tabBar.getBoundingClientRect();
        
        let newLeft = this.initialLeft + deltaX;
        let newTop = this.initialTop + deltaY;
        
        // 边界检查
        newLeft = Math.max(0, Math.min(newLeft, parentRect.width - tabRect.width));
        newTop = Math.max(0, Math.min(newTop, parentRect.height - tabRect.height));
        
        // 设置新位置
        tabBar.style.position = 'absolute';
        tabBar.style.left = newLeft - parentRect.left + 'px';
        tabBar.style.top = newTop - parentRect.top + 'px';
        tabBar.style.zIndex = '100';
      }
      
      // 阻止默认行为和事件冒泡，防止页面滚动
      event.preventDefault();
      event.stopPropagation();
    },
    stopDrag() {
      this.isDragging = false;
    },
    // 搜索相关方法
    toggleSearchBox() {
      this.showSearchBox = !this.showSearchBox;
      if (this.showSearchBox) {
        // 重置搜索状态
        this.searchKeyword = '';
        this.filteredGames = [];
      }
    },
    closeSearchBox() {
      this.showSearchBox = false;
      this.searchKeyword = '';
      this.filteredGames = [];
    },
    searchGames() {
      if (!this.searchKeyword.trim()) {
        this.filteredGames = [];
        return;
      }
      
      const keyword = this.searchKeyword.toLowerCase().trim();
      const games = this.$store.state.conciseList || [];
      
      this.filteredGames = games.filter(game => {
        // 搜索游戏名称、平台名称等字段
        const gameName = (game.name || '').toLowerCase();
        const platformName = (game.platform_name || '').toLowerCase();
        const gameCode = (game.game_code || '').toLowerCase();
        
        return gameName.includes(keyword) || 
               platformName.includes(keyword) || 
               gameCode.includes(keyword);
      });
    },
    // 选择平台
    selectPlatform(platform) {
      if (this.selectedPlatform === platform) {
        // 取消选择
        this.selectedPlatform = '';
        this.filteredGames = [];
      } else {
        // 选择平台
        this.selectedPlatform = platform;
        this.filterGamesByPlatform();
      }
    },
    // 根据平台过滤游戏
    filterGamesByPlatform() {
      if (!this.selectedPlatform) {
        this.filteredGames = [];
        return;
      }

      const platform = this.selectedPlatform.toLowerCase();
      const games = this.$store.state.conciseList || [];

      this.filteredGames = games.filter(game => {
        const platformName = (game.platform_name || '').toLowerCase();
        return platformName === platform;
      });
    },
    // 选择捕鱼平台
    selectFishingPlatform(platform) {
      this.selectedFishingPlatform = platform;
      if (!platform) {
        // 选择全部，清空过滤结果
        this.filteredFishingGames = [];
      } else {
        // 选择特定平台
        this.filterFishingGamesByPlatform();
      }
    },
    // 根据平台过滤捕鱼游戏
    filterFishingGamesByPlatform() {
      if (!this.selectedFishingPlatform) {
        this.filteredFishingGames = [];
        return;
      }

      const platform = this.selectedFishingPlatform.toLowerCase();
      const games = this.$store.state.gamingList || [];

      this.filteredFishingGames = games.filter(game => {
        const platformName = (game.platform_name || '').toLowerCase();
        return platformName === platform;
      });
    },
    // 选择棋牌平台
    selectJokerPlatform(platform) {
      this.selectedJokerPlatform = platform;
      if (!platform) {
        this.filteredJokerGames = [];
      } else {
        this.filterJokerGamesByPlatform();
      }
    },
    // 根据平台过滤棋牌游戏
    filterJokerGamesByPlatform() {
      if (!this.selectedJokerPlatform) {
        this.filteredJokerGames = [];
        return;
      }

      const platform = this.selectedJokerPlatform.toLowerCase();
      const games = this.$store.state.jokerList || [];

      this.filteredJokerGames = games.filter(game => {
        const platformName = (game.platform_name || '').toLowerCase();
        return platformName === platform;
      });
    },
    // 选择彩票平台
    selectLotteryPlatform(platform) {
      this.selectedLotteryPlatform = platform;
      // 无论选择什么，都调用过滤方法
      this.filterLotteryGamesByPlatform();
    },
    // 根据平台过滤彩票游戏
    filterLotteryGamesByPlatform() {
      const category = this.selectedLotteryPlatform;
      let games = [];
      
      if (!category) {
        games = [
          ...(this.$store.state.lhcList || []),
          ...(this.$store.state.jscList || []),
          ...(this.$store.state.jwcList || []),
          ...(this.$store.state.qkcList || [])
        ];
      } else if (category === 'LHC') {
        games = this.$store.state.lhcList || [];
      } else if (category === 'JSC') {
        games = this.$store.state.jscList || [];
      } else if (category === 'JWC') {
        games = this.$store.state.jwcList || [];
      } else if (category === 'QKC') {
        games = this.$store.state.qkcList || [];
      } else {
        games = (this.$store.state.lotteryList || []).filter(game => {
          const platformName = (game.platform_name || '').toLowerCase();
          return platformName === category;
        });
      }

      this.filteredLotteryGames = games;
    },
  },
  mounted() {
    let that = this;
  },
  updated() {
    let that = this;
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import '../../../static/css/2d87bbdbffeb4734e5c7.css';
.domainModal_content__1nBgc {
  overflow: auto;
}
// 轮播样式
.swiper-dots {
  display: flex;
  position: absolute;
  left: 40px;
  bottom: 10px;
  width: 48px;
  height: 24px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJ7wAAAAASUVORK5CYII=);
  background-size: 100% 100%;
}
.swiper-dots .num {
  width: 24px;
  height: 24px;
  border-radius: 50px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 24px;
}
.swiper-dots .sign {
  position: absolute;
  top: 0;
  left: 50%;
  line-height: 24px;
  font-size: 8px;
  color: #fff;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.leftbox {
  width: 7.5rem;
  height: 100%;
  background-color: #ede9e7;
  color: #cf866b;
  .side__main__1NhyG {
    box-sizing: border-box;
    padding: 0 20px;
    h3 {
      font-size: 20px;
      font-weight: 400;
      margin: 0;
      padding-top: 72px;
    }
    .side__vip__1dW8w {
      background: url(/static/style/sidebr_vip_card.1ce7485811699286f87aae1827de7acf.png) no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      padding: 20px;
      color: #fff;
      position: relative;
      p {
        color: hsla(0, 0%, 100%, 0.6);
        font-size: 12px;
        margin: 5px 0 0 0;
      }
      .topxs {
        font-size: 16px;
      }
      dd {
        float: right;
        border: 0.02rem solid #fff;
        border-radius: 0.24rem;
        height: 0.48rem;
        line-height: 0.48rem;
        width: 1.88rem;
        text-align: center;
        font-size: 10px;
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
  }
  ul {
    list-style: none;
    margin-top: 0.36rem;
    li {
      display: block;
      line-height: 0.96rem;
      height: 0.96rem;
      border-bottom: 0.02rem solid #e6ebf6;
      color: #4e6693;
      font-size: 0.28rem;
      padding: 0 0.14rem;
      img {
        width: 0.36rem;
        vertical-align: middle;
        margin: -0.04rem 0.24rem 0 0;
      }
      span {
        float: right;
      }
    }
  }
  .nisd {
    position: absolute;
    width: 4.72rem;
    height: 0.8rem;
    line-height: 0.8rem;
    left: 0.9rem;
    bottom: 1rem;
    background: #dfe5ff;
    border-radius: 0.4rem;
    border: 0;
    color: #4e6693;
    font-size: 0.28rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      vertical-align: middle;
      margin: -0.04rem 0.08rem 0 -0.08rem;
      width: 0.32rem;
    }
  }
}
.gonggao {

  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.caosuo {
  color: #cf866b;
  width: 97%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .lefsg {
    flex: 1;
    .name {
      font-size: 12px;
    }
    .meys {
      display: flex;
      align-items: center;
      margin-top: 45px;
      .lefs {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #000;
        span {
          font-size: 18px;
          font-weight: 700;
        }
        .imsg {
          margin-left: 8px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
            &.rotate {
              animation: rotate 1s linear infinite;
            }
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
  .riggs {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
    padding: 0 5px;
    gap: 5px;
    .lisImg {
      width: 20%;
    
      max-width: 80px;
      text-align: center;
      font-size: 15px;
      color: #000;
      .img-wrapper {
        position: relative;
        display: inline-block;
        width: 75%;
        margin: 0 auto;
        img {
          width: 100%;
          display: block;
        }
        .right-top-label {
          position: absolute;
          top: 5px;
          right: -10px;
          background: linear-gradient(90deg, #ff6b6b, #ee5a6f);
          color: #fff;
          font-size: 10px;
      
          border-radius: 4px;
          white-space: nowrap;
          z-index: 10;
        }
      }
      img {
        width: 80%;
        display: block;
        margin: 0 auto;
      }
      .link-icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .fit-image {

        height: auto;
      }
      .caption {
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
}
.xiding {
  background-color: #ffffff;
  /* padding: 15px 0; */
  position: fixed;
  left: 0;
  right: 0;
  z-index: 99;
  
  transition: top 0.3s ease;
}

.balance-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 45px;
}

.logo-wrapper {
  display: flex;
  /* align-items: center; */
}

.logo-icon {
  width: 130px;
  height: 50px;
  min-width: 130px;
  min-height: 50px;
  max-width: 130px;
  max-height: 50px;
  position: fixed;
  /* top: 55px; */
  /* left: 20px; */
  /* -webkit-transform-origin: center center; */
  /* transform-origin: center center; */
  /* -webkit-transform: scale(1); */
  /* transform: scale(1); */
  /* z-index: 9999; */
  /* bottom: 888px; */
}

.login-wrapper {
  display: flex;
  gap: 0px;
  flex-shrink: 0;
}

.button {
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 0.32rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  white-space: nowrap;
  flex-shrink: 0;
}

.login-wrapper .regist-button,
.login-wrapper .regist-button.black-text,
.login-wrapper .regist-button.button,
.login-wrapper .regist-button.small2-text,
.login-wrapper .regist-button.medium {
  font-size: 0.36rem !important;
}

.black-text {
  color: #000;
  background-image: url(/static/style/zc.png);
  background-size: 100% 100%;
  border: none;
  font-size: 0.34rem;
}

.white-text {
  color: #fff;
  background-image: url(/static/style/dl.png);
  background-size: 100% 100%;
  border: none;
}

.small2-text {
  /*font-size: .37rem;*/
}

.medium {
  height: .65rem;
  line-height: .65rem;
}

// 游戏
.gameBoxs {
  /* background: #ede9e7; */
  /* -webkit-box-shadow: inset 0 .08rem .16rem hsla(16, 58%, 74%, .5); */
  /* box-shadow: inset 0 .08rem .16rem hsla(16, 58%, 74%, .5); */
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #414655ad;
  height: 100%;
  min-height: 608px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  .lfst {
    width: 1.25rem;
    /* height: 400px; */
    /* background: #eff3ff; */
    border-radius: 20px;
   
    border-top: none;
    position: fixed;
    left: 0.1rem;
    z-index: 99;
    transition: top 0.3s ease;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: top;
    -webkit-will-change: top;
    .ls.active {
      color: #1989fa;
      background-image: url(/static/style/gameicon_1773179136_g100pWLyRS.png);
    }
    .ls {
      text-align: center;
      border-radius: 10px;
      padding: 8px 0;
      background-image: url(/static/style/bbbb.png);
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: 50% !important;
      -webkit-transition: none !important;
      transition: none !important;
      -webkit-animation: none !important;
      animation: none !important;
      width: 100% !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      img {
        width: 35px;
        display: block;
        margin: 0 auto;
      }
      span {
        font-size: 13px;
        display: block;
        position: relative;
        top: -4px; 
        /* color: rgba(34, 37, 54, .5098039216); */
      }
    }
  }
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 1.3rem;
  }
  .rigts {
    
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .1rem;
    align-content: start;
  position: relative;
    grid-template-columns: repeat(3, 1fr);
    
    padding: 0px 5px 70px;
    
    .game-item {
      position: relative;
      margin-top: 10px;
      text-align: center;
      cursor: pointer;
      
      .game-icon-container {
        position: relative;
        display: inline-block;
        
        img {
          width: 48%;
          border-radius: 20px;
          display: block;
          margin: 0 auto;
        }
        
        .api-icon {
          position: absolute;
          top: 0;
          right: 2%;
          width: 36px;
         
          
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          z-index: 10;
        }
        
        .api-icon img {
          width: 30px;
        
          object-fit: contain;
          border-radius: 4px;
          border-radius: 0 15px 0 0;
        }
      }
      
      .game-name {
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        
        padding: 2px 0;
        border-radius: 0 0 20px 20px;
        width: 48%;
        margin: 0 auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    &.hot-grid {
      .game-item {
        margin-top: 1px;
        
        .game-icon-container {
          img {
            width: 98% !important;
            object-fit: cover !important;
            flex-shrink: 0 !important;
            -webkit-flex-shrink: 0 !important;
            -ms-flex-negative: 0 !important;
            box-sizing: border-box !important;
          }
        }
        
        .game-name {
          width: 98% !important;
        }
      }
    }
    &.single-column {
      grid-template-columns: 1fr;
      
      .game-item {
        .game-icon-container {
          img {
            width: 98% !important;
            margin-top: 10px;
          }
        }
        
        .game-name {
          width: 98% !important;
        }
      }
    }
    &.three-column {
      position: relative;
      grid-template-columns: repeat(3, 1fr);
      
      padding: 40px 5px 70px;
      
      .game-item {
        margin-top: 0;
        
        .game-icon-container {
          img {
           width: 98%!important;
    -o-object-fit: cover!important;
    object-fit: cover!important;
    flex-shrink: 0!important;
    -webkit-flex-shrink: 0!important;
    -ms-flex-negative: 0!important;
    -webkit-box-sizing: border-box!important;
    box-sizing: border-box!important;
          }
        }
        
        .game-name {
          width: 100% !important;
          bottom: 0;
          border-radius: 0 0 8px 8px;
        }
      }
    }
    
    .game-item.full-width {
      .game-icon-container {
        img {
          width: 98% !important;
        }
      }
      
      .game-name {
        width: 98% !important;
      }
    }
// 顶部标签栏样式
.top-tab-bar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 5px;
  margin: 0;
  border-top: none;
  border-bottom: none;
  
  z-index: 999;
  
  .game-type-tabs {
    display: flex;
    gap: 5px;
    overflow-x: auto;
    flex: 1;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    
    .game-type-tab {
      padding: 3px 15px;
      border-radius: 4px;
      font-size: .28rem;
      cursor: pointer;
      white-space: nowrap;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAA5BAMAAADuCSU8AAAALVBMVEUAAADV5/7Y6f3S6f3V6v7U6fvV6/3V6v7S4frO2vfO2/jy9fvs8Pj6+/7c5PlXKb34AAAAC3RSTlMAIQcSMkdabJjpvYzm6iwAAAPfSURBVEjHrZY7jxJRGIYN/gICFnZk8NIKo4ktho3RViBqYWIBXgoLo6AWW2jhpTCx8L6xMd4Ss/1mBvp1JvwBnO10L4z8Bt/3+75ZEF1lFt85fNdznj3nsCy7579rb3ZmHdkBcfDRm9HM2vx48U+Ms2+CKIUGo/eFaUTmfBylVO9ZYYpxfBilVu/Jr5QDb6JdqH99kuIsdncDGWw4E4c5PIx2pbW3hYmNgBpxMzADWr4YMJtUdyrbchJK5tAP5MR0uwjgJYpoCYOkRCwNK6zh+XrXSTZyCi0pgqSMCFKOJWySIW2VUNYTSHGJDVsNGL2HjAXAbYd0QrCtIEB15UTBrvWHh6KsgxN5xkMoiymUpIUKEpv61a7W2e9pG5iuBWR6GFhrZTibgRZT630r62kWMdmj0Eak4ixikpRtwUCIZOeMvpQLPE3xNRKUaOzHw46VTMfQiUqyn9Y7I5BjQ28O+fccXsnxwJtHT8q8kv07dOWC/q3vvJTihR26Pse/tQ5Ixl30fS/ACAIPB4PRnFFAIxkegQaQxb7O/JIDpPQYiWHokqasNCM5AUwsttxbFchnT+raNW+JGqaGTYKJfMUgoe7Wfjg8HfOQXtucT2dYc1CvcmTP3tLnEJO5AvKDkEtlQ6HvB4zgKXRRgAMVVpdgUh8QBxBUOALpwbCL9thBJISKxLAiUYQUjy4TYDXxvnpaC7BUl+jQPesrXCEk/zicSUafVrDK4+QXw7m0JTu5Nh9kQ96dc/NB1gHJlE7HYT+0QZkz9ZM8FmtRrCnNU9nJyTiWlWLjmDR6edncPoOkGBsQMVvvZCcLS2F6xdv7vpErEPI4nEOrNULcfVfmgWwIpJg/P8QHKtSPKhT4NPwUMkYLkhIejZjYX5feM0Lwi9JYQiYIGkpilb+zOKl/s1IGxCkt3AYXZKJpYBlxwEjCx9cKp4611ayU9wjkcsovjTGm976WIyTj5hvL3i61eVOuhJdSvzrkl7cNhvyeg2fIV6T/m8CrWGa89rzJK9HztJbR52QOMQM8ktuDihYoYUQwm+1aFqchBOe5vMQme9gIvS4fKM2qLIoMFPU+NKs5hwz+pixcujNkXWXeNqWy7Vmo9bUX7XrFxWn0PNXGpYfp/6N+1W7qe5NspdF5NOqmQQxGrzqtWsV1EohTytdbnVufRin08mOnVa/m5L2xrZSqoHRuPZhZ9zudVrOWBaOwvRU3C8qldmd2tVt1HsYYdiBQGq0UwlkqubJjADsQKAv1FKpWs3YhY0im6Gbz+WoKZbmPKTmO62ZnV8l1nSmG3ku57M6uojF+x2wL4d+VmbyOnwiTT/CN9GcBAAAAAElFTkSuQmCC);
          background-size: cover;
          background-repeat: no-repeat;
          color: #2a2a2a;
          
          &.active {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAA5CAMAAAAr+cg9AAAAYFBMVEUAAABjt/1ks/xltvpmtv9muf1mt/4LZ+ZhtPw7kfBmt/xitPsDX+FHnPQPaeQNaOQQaeQdd+jR5P/Z6f/G3f/p8v/w9v/g7P/L4P/k7/8CXeFbl+z1+f9xpfAzfeeRuvXavtWnAAAAEnRSTlMAMxBGHltqJBaXJk/lfavGfWGnzvn6AAAEK0lEQVRYw82Yi3qiMBCFF1DLCoKLyGUo+P5vuTMc4gGqlN0udU/CTGYysf+XxNb647/X2xb6Q4RzEss2SpPzSpjwnIqq65p/r64TVfzrbQVFrAy3/L1430b5zViST0iMoq2LonhXkAJ9cEigPcswixHbYPogazvdk6XNSJWiLFbpvfiCsnZpS95i6bLie5Tplrw9xWjvdVc65uj1sTbXx1la6tqbRmLvGcYVKvBoZ4K5wRcFvA1Y1of9DKxDmkRY1XJH5hhfEFFW6xGInxLj29RI6s/fsNJdr7U2qJ42yzDdi2mXqh8vdY7LuKqT8wTE11PJa+g6OPN9NdwgBpyGn9c4ixdgOUDgqtnJ+Im09QOVHC7OjYMVS1jdSuKPMDyRsqy1meXIOlQjYqYPucAMJzkBw1ekQb+IeP54O27lc9ULc18tb0c3xA9jycrygq7NLHSBYcwhZXk6PIwuzs9KYTK9Ib7j+CXN5aF09TqVf13SyC/HEeqxWOHHZtmV7fOCx9mbJCFA/F0sVc+WXb5flcQ7cIQ76TRBigwdCXo0N+8S7FNZigVcx7WDRI4hOCLp7qVcy0VMPIBknmtZMEVgHXrfOglCvz8WvabZi6QgelF3jqNFDkb79OHkPFjIcWHf6c2Na1s5DxzngaMaDB84Ts6DpVxFzxdGZvDkCO16HHuOCs3VM5wNGKxvS2uM4wgOux+cAa05Ng77KXXjKib6IHsKW83T1vV+DByRNNXr1N05ApGqyvNKDTsfncldGgGMy7PDYciEG1o0BOOwE2/g8GLJXyeJ7xyJ3PJX6SYpOPydd5Imf5UaOXtHHxyRvO5gRAJvB45jkEibv0atpI5DL8hJpOrFNwuHuOSco2EpY2eZYOH4zYiWiRyCIz6AKEeUSvvhV18Fixh5s24OI0RulXvQxm682tww0O2I+muKCxIcRPLFPyPV00mKvE9mPii37cCx4GCiRLqMnxz45xKheuY4AT+esCq3hAV9hiEXdpLYdiiHKdQN2cfSLn3IzS6rxLI1aiXeBzgWHIxuyAkg5XOU6Xi5qFyJcYqCox0LNyQ6ibTlsi4cfr2ybkVO3A53Q4K9geD/x2mbDNXOMoycMY0XjqpHiTvG+B9c25C9Hk2Xj79A4JcN484MEsi4HMeIaLWzpOr0UPYR3ixU6EDkdv0G6dVwGJPtsJMxkEMi0t2yQjV8q4WhizHgnD00Vw5Zy+Td2ZFIcjAMnAp1BzmlWtMoylbKbo2IpKcnGA7ESGJRdc0W6sSUKMUDDO4ISA4/FWUrxenPAyhwN0jCHdnZlhiJ6vRzC50Opn1km2EYjwQQL8CebCTsReAtYYxIFGUjRUsUZDESQ1mpiH6lPIUwimUMkCjK0dtGR4UgxacoyvKvdYQLCfEZiT1QaB0NAfpCo6NBc8JPWIvy3foNJmnskhJAWk4AAAAASUVORK5CYII=);
            color: #005ce0;
            font-weight: 500;
          }
        }
      }
      
      .search-icon {
        display: flex;
        align-items: center;
        margin-left: 10px;
        
        .search-img {
          width: 20px;
          height: 20px;
          margin-left: -4px;
          cursor: pointer;
          background: -webkit-gradient(linear,left top,left bottom,from(rgba(254,254,255,0)),color-stop(#e9eef6),to(hsla(0,0%,100%,0)));
          background: linear-gradient(180deg,rgba(254,254,255,0),#e9eef6,hsla(0,0%,100%,0));
          border: 0.04415rem solid #cdd8f6;
          border-right: none;
          --text-color: #2a2a2a;
          -webkit-transition-property: -webkit-transform;
          transition-property: -webkit-transform;
          transition-property: transform;
          transition-property: transform,-webkit-transform;
          -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
          transition-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transition-duration: .15s;
          transition-duration: .15s;
          padding-left: 0.14493rem;
          padding-right: 0.28986rem;
          border-radius: 15px 0 0 15px;
          transform: translateY(-2px);
        }
      }
      
      .search-box {
        position: absolute;
        
        left: 0;
        right: 0;
       
        padding: 3px;
        
        display: flex;
        
        background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), color-stop(45%, #fdfdfd), to(#f7f7f7));
       border-radius: 15px 0 0 15px;
        
        .search-input-wrapper {
          
          flex: 1;
          display: flex;
          align-items: center;
          
          .search-img-inside {
            position: absolute;
            left: 10px;
            width: 16px;
            height: 16px;
            z-index: 1;
          }
          
          .search-input-with-icon {font-size: 14px;
            flex: 1;
            padding: 4px 4px 4px 32px;
            border: 1px solid #41465566;
            border-radius: 20px;
            font-size: 14px;
            background: linear-gradient(to bottom, #fefeff, #e9eef6, #fff);
            border: 0.02415rem solid #cdd8f6;
            border-right: none;
            --text-color: #2a2a2a;
          }
        }
        
        .search-close {
          margin-left: -30px;
          cursor: pointer;
          font-size: 24px;
          color: #999;
        }
      }
    }
    
    // 真人视讯和体育页面样式
    .realbet-content {
      padding: 10px 5px 20px;

      .realbet-game-item {
        margin-bottom: 10px;
        cursor: pointer;
      }
    }

    .sport-content {
      padding: 10px 5px 20px;

      .sport-game-item {
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
}

// 独立定义 realbet-content 和 sport-content 样式，确保正确应用
.realbet-content {
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  display: grid !important;
  gap: 0.1rem !important;
  -ms-flex-line-pack: start !important;
  align-content: start !important;
  position: relative !important;
  grid-template-columns: repeat(3,1fr) !important;
  padding: 0 5px 70px !important;
  grid-template-columns: 1fr !important;
}

// 顶部标签栏样式
.top-tab-bar {
  width: calc(100% - 1.3rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 5px;
  margin: 5px 0 0 1.3rem;
  
  
  .game-type-tabs {
    display: flex;
    gap: 5px;
    overflow-x: auto;
    flex: 1;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    
    .game-type-tab {
    padding: 5px 20px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    background-image: url(/static/style/ddh.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    color: #2a2a2a;
    border: none;
    outline: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;

      
      &.active {
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAA5CAMAAAAr+cg9AAAAYFBMVEUAAABjt/1ks/xltvpmtv9muf1mt/4LZ+ZhtPw7kfBmt/xitPsDX+FHnPQPaeQNaOQQaeQdd+jR5P/Z6f/G3f/p8v/w9v/g7P/L4P/k7/8CXeFbl+z1+f9xpfAzfeeRuvXavtWnAAAAEnRSTlMAMxBGHltqJBaXJk/lfavGfWGnzvn6AAAEK0lEQVRYw82Yi3qiMBCFF1DLCoKLyGUo+P5vuTMc4gGqlN0udU/CTGYysf+XxNb647/X2xb6Q4RzEss2SpPzSpjwnIqq65p/r64TVfzrbQVFrAy3/L1430b5zViST0iMoq2LonhXkAJ9cEigPcswixHbYPogazvdk6XNSJWiLFbpvfiCsnZpS95i6bLie5Tplrw9xWjvdVc65uj1sTbXx1la6tqbRmLvGcYVKvBoZ4K5wRcFvA1Y1of9DKxDmkRY1XJH5hhfEFFW6xGInxLj29RI6s/fsNJdr7U2qJ42yzDdi2mXqh8vdY7LuKqT8wTE11PJa+g6OPN9NdwgBpyGn9c4ixdgOUDgqtnJ+Im09QOVHC7OjYMVS1jdSuKPMDyRsqy1meXIOlQjYqYPucAMJzkBw1ekQb+IeP54O27lc9ULc18tb0c3xA9jycrygq7NLHSBYcwhZXk6PIwuzs9KYTK9Ib7j+CXN5aF09TqVf13SyC/HEeqxWOHHZtmV7fOCx9mbJCFA/F0sVc+WXb5flcQ7cIQ76TRBigwdCXo0N+8S7FNZigVcx7WDRI4hOCLp7qVcy0VMPIBknmtZMEVgHXrfOglCvz8WvabZi6QgelF3jqNFDkb79OHkPFjIcWHf6c2Na1s5DxzngaMaDB84Ts6DpVxFzxdGZvDkCO16HHuOCs3VM5wNGKxvS2uM4wgOux+cAa05Ng77KXXjKib6IHsKW83T1vV+DByRNNXr1N05ApGqyvNKDTsfncldGgGMy7PDYciEG1o0BOOwE2/g8GLJXyeJ7xyJ3PJX6SYpOPydd5Imf5UaOXtHHxyRvO5gRAJvB45jkEibv0atpI5DL8hJpOrFNwuHuOSco2EpY2eZYOH4zYiWiRyCIz6AKEeUSvvhV18Fixh5s24OI0RulXvQxm682tww0O2I+muKCxIcRPLFPyPV00mKvE9mPii37cCx4GCiRLqMnxz45xKheuY4AT+esCq3hAV9hiEXdpLYdiiHKdQN2cfSLn3IzS6rxLI1aiXeBzgWHIxuyAkg5XOU6Xi5qFyJcYqCox0LNyQ6ibTlsi4cfr2ybkVO3A53Q4K9geD/x2mbDNXOMoycMY0XjqpHiTvG+B9c25C9Hk2Xj79A4JcN484MEsi4HMeIaLWzpOr0UPYR3ixU6EDkdv0G6dVwGJPtsJMxkEMi0t2yQjV8q4WhizHgnD00Vw5Zy+Td2ZFIcjAMnAp1BzmlWtMoylbKbo2IpKcnGA7ESGJRdc0W6sSUKMUDDO4ISA4/FWUrxenPAyhwN0jCHdnZlhiJ6vRzC50Opn1km2EYjwQQL8CebCTsReAtYYxIFGUjRUsUZDESQ1mpiH6lPIUwimUMkCjK0dtGR4UgxacoyvKvdYQLCfEZiT1QaB0NAfpCo6NBc8JPWIvy3foNJmnskhJAWk4AAAAASUVORK5CYII=);
    color: #005ce0;
    font-weight: 500;
      }
    }
  }
  
  .search-icon {
    display: flex;
    align-items: center;
 
    
    .search-img {
    width: 20px;
    height: 20px;
    /* margin-left: -42px; */
    cursor: pointer;
    background: -webkit-gradient(linear,left top,left bottom,from(rgba(254,254,255,0)),color-stop(#e9eef6),to(hsla(0,0%,100%,0)));
    background: linear-gradient(180deg,rgb(254 254 255),#e9eef6,hsl(0deg 0% 100%));
    border: 0.04415rem solid #cdd8f6;
    border-right: none;
    --text-color: #2a2a2a;
    -webkit-transition-property: -webkit-transform;
    transition-property: -webkit-transform;
    transition-property: transform;
    transition-property: transform,-webkit-transform;
    -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    -webkit-transition-duration: .15s;
    transition-duration: .15s;
    padding-left: 0.14493rem;
    padding-right: 0.28986rem;
    border-radius: 15px 0 0 15px;
    -webkit-transform: translateY(2px);
    transform: translateY(-1px);
    }
  }
  
  .search-box {
    position: absolute;
    left: 1.3rem;
    right: 0;
    padding: 3px;
    display: flex;
    background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), color-stop(45%, #fdfdfd), to(#f7f7f7));
    border-radius: 15px 0 0 15px;
    
    .search-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      
      .search-img-inside {
        position: absolute;
        left: 10px;
        width: 16px;
        height: 16px;
        z-index: 1;
      }
      
      .search-input-with-icon {
        flex: 1;
        padding: 4px 4px 4px 32px;
        border: 1px solid #41465566;
        border-radius: 20px;
        font-size: 14px;
        background: linear-gradient(to bottom, #fefeff, #e9eef6, #fff);
        border: 0.02415rem solid #cdd8f6;
        border-right: none;
        --text-color: #2a2a2a;
      }
    }
    
    .search-close {
      margin-left: -30px;
      cursor: pointer;
      font-size: 24px;
      color: #999;
    }
  }
}

.sport-content {
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  display: grid !important;
  gap: 0.1rem !important;
  -ms-flex-line-pack: start !important;
  align-content: start !important;
  position: relative !important;
  grid-template-columns: repeat(3,1fr) !important;
  padding: 0 5px 70px !important;
  grid-template-columns: 1fr !important;
}

// 独立定义 realbet-icon-container 样式，确保正确应用
.realbet-icon-container {
  width: 100% !important;
  height: 120px !important;
  min-width: 100% !important;
  max-width: 100% !important;
  min-height: 120px !important;
  max-height: 120px !important;
  overflow: hidden !important;
  border-radius: 8px !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;

  img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 22px !important;
    display: block !important;
    padding: 8px !important;
    box-sizing: border-box !important;
  }
}

// 独立定义 sport-icon-container 样式，与 realbet-icon-container 保持一致
.sport-icon-container {
  width: 100% !important;
  height: 120px !important;
  min-width: 100% !important;
  max-width: 100% !important;
  min-height: 120px !important;
  max-height: 120px !important;
  overflow: hidden !important;
  border-radius: 8px !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;

  img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 22px !important;
    display: block !important;
    padding: 8px !important;
    box-sizing: border-box !important;
  }
}

.login-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .login-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .login-modal-content {
    position: relative;
    z-index: 1001;
    width: 90%;
    max-width: 400px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
  }
}

// APP下载栏样式
.app-download-bar-v2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d4e6ff;
  
  .flex-center {
    display: flex;
    align-items: center;
    flex: 1;
    width: 80%;
    height: 1rem;
  }
  
  .close-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.0rem;
    height: 0.5rem;
    font-size: 0.76rem;
    color: #666;
    cursor: pointer;
    margin-right: 0.1rem;
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .fit-image {
      width: 0.8rem;
      height: 0.7rem;
      object-fit: contain;
    }
  }
  
  .medium-text {
    font-size: 0.38rem;
  }
  
  .text {
    margin-left: 0.2rem;
    color: #333;
  }
  
  .download-btn {
    padding: 0.1rem 0.6rem;
    color: #3d72fa;
    font-size: 0.35rem;
    border-radius: 0.1rem;
    cursor: pointer;
  }
}
</style>