<template>
  <div style="width: 100%; min-height: 100vh; background: #ffffff">
    <div class="pageTop" style="position: fixed; top: 0; left: 0; right: 0; height: 46px; line-height: 46px; text-align: center; color: white; font-size: 18px; background: url(/img/counter/top-bg.webp) no-repeat #084ccb; z-index: 1000;">
      <img src="/static/image/nav_chevron_back.bb0f0ac706614ab578365b31d203927a.png" alt="" style="width: 16px; height: 16px; position: absolute; left: 15px; top: 50%; transform: translateY(-50%); cursor: pointer;" @click="$router.back()" />
      投注记录
      <div v-if="api_type" class="platform-select-btn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 14px; padding: 4px 12px;  border-radius: 16px;" @click="showPlatformSelect = !showPlatformSelect">
        选择平台
      </div>
    </div>
    <div style="height: 46px"></div>
    <!-- 平台选择下拉菜单 -->
    <div v-if="showPlatformSelect && api_type" class="platform-select-dropdown" style="position: fixed; top: 46px; right: 5px; z-index: 1001; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding: 10px; min-width: 0px; max-height: 770px; overflow-y: auto;">
      <div class="platform-option" style="padding: 8px 12px; cursor: pointer; border-radius: 4px;" @click="selectPlatform('')">
        全平台
      </div>
      <!-- 去除重复的平台 -->
      <div v-for="platform in uniquePlatforms" :key="platform.name" class="platform-option" style="padding: 8px 12px; cursor: pointer; border-radius: 4px;" @click="selectPlatform(platform.name)">
        {{ platform.name }}
      </div>
    </div>
    <div class="fixed-header" style="width: 100%; min-width: 250px; margin: 0 auto; position: fixed; top: 46px; left: 50%; transform: translateX(-50%); z-index: 999; background: #fff; box-sizing: border-box; padding: 10px;">
      <!-- 日期筛选 -->
      <div class="date-filter">
        <div class="date-item" :class="{ 'active': date == 1 }" @click="selectDate(1)">今日</div>
        <div class="date-item" :class="{ 'active': date == 5 }" @click="selectDate(5)">昨日</div>
        <div class="date-item" :class="{ 'active': date == 6 }" @click="selectDate(6)">本周</div>
        <div class="date-item" :class="{ 'active': date == 7 }" @click="selectDate(7)">上周</div>
      </div>
      
      <!-- 总计信息 -->
      <div class="total-info">
        <div class="total-item">
          <span class="total-label">总计(单)</span>
          <span class="total-value">{{ totalBets }}</span>
        </div>
        <div class="total-item">
          <span class="total-label">有效投注</span>
          <span class="total-value">{{ validBet }}</span>
        </div>
        <div class="total-item">
          <span class="total-label">输赢</span>
          <span class="total-value" :class="{ 'negative': winLoss < 0 }">{{ winLoss }}</span>
        </div>
      </div>
    </div>
    <div style="width: 100%; min-width: 250px; background: #fff; border-radius: 10px; box-sizing: border-box; padding: 10px; min-height: 90vh;">
      <!-- 游戏平台列表 -->
      <div class="game-list" v-if="gameList.length > 0">
        <div class="game-item" v-for="(game, index) in gameList" :key="index" @click="showGameDetail(game)">
          <div class="game-icon" :class="game.icon"></div>
          <div class="game-info">
            <div class="game-name">{{ game.name }}</div>
            <div class="game-bet">有效投注 {{ game.validBet }}</div>
          </div>
          <div class="game-win-loss" :class="{ 'negative': game.winLoss < 0 }">
            {{ game.winLoss }}
          </div>
          <div class="game-bets">
            {{ game.bets }}单
          </div>
        </div>
      </div>
      <div v-else style="margin-top: 60px; text-align: center">
        <img src="/static/image/mescroll-empty.png" style="width: 35%" alt="" />
        <van-divider dashed :style="{ color: '#ccc', borderColor: '#ccc', padding: '20px ' }">空空如也</van-divider>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'betRecord',
  data() {
    return {
      date: 1, // 默认选择今日
      list: [],
      pageData: {},
      page: 1,
      statuType: ['无效注单', '已结算', '未结算'],
      dogameLis: [],
      api_type: '',
      loading: false,
      name: '全平台',
      show: false,
      dateName: ['', '今日', '近7日', '近15日', '近30日', '昨日', '本周', '上周'],
      totalBets: 0,
      validBet: 0,
      winLoss: 0,
      // 所有游戏平台列表
      allGames: [
        { name: 'PG电子', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDg0Y2NiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: 'MG电子', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBhZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: '乐游棋牌', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: 'BBIN真人', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjc8OGNmQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1IDUiPjxwYXRoIGQ9Ik02IDEyYy0xLjIgMC0yLS44LTItMnMyLTIgMi0yIDItMiAyem0xMiAwYy0xLjIgMC0yLS44LTItMnMyLTIgMi0yIDItMiAyem0tNi02YzAtMS4yLjgtMiAyLTJzMi44IDIgMiAyLTIgMi0yLTJ6Ii8+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjwvc3ZnPg==' },
        { name: 'BBIN电子', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjc8OGNmQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1IDUiPjxwYXRoIGQ9Ik02IDEyYy0xLjIgMC0yLS44LTItMnMyLTIgMi0yIDItMiAyem0xMiAwYy0xLjIgMC0yLS44LTItMnMyLTIgMi0yIDItMiAyem0tNi02YzAtMS4yLjgtMiAyLTJzMi44IDIgMiAyLTIgMi0yLTJ6Ii8+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjwvc3ZnPg==' },
        { name: 'CQ9电子', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2MzZjQxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: '瓦力棋牌', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjY2ZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: 'FG捕鱼', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDVkZjM1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: 'DG捕鱼', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYjhkZWEzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
        { name: 'MT捕鱼', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIj999999IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' }
      ],
      // 显示的游戏列表
      gameList: [],
      // 平台选择下拉菜单显示状态
      showPlatformSelect: false
    };
  },
  created() {
    let that = this;
    that.getGamePlatforms();
  },
  methods: {
    selectDate(val) {
      let that = this;
      that.date = val;
      that.page = 1;
      that.getData();
    },
    showGameDetail(game) {
      let that = this;
      // 设置 api_type 为当前游戏平台名称
      that.api_type = game.name === '全平台' ? '' : game.name;
      // 重置页码
      that.page = 1;
      // 重新获取投注记录
      that.getData();
    },
    selectPlatform(platform) {
      let that = this;
      // 设置 api_type 为选择的平台名称
      that.api_type = platform;
      // 关闭平台选择下拉菜单
      that.showPlatformSelect = false;
      // 重置页码
      that.page = 1;
      // 重新获取投注记录
      that.getData();
    },
    // 获取投注记录
    getData() {
      let that = this;
      let page = that.page;
      if (page > that.pageData.last_page) {
        that.loading = false;
        return;
      }
      that.$parent.showLoading();
      let info = {
        date: that.date,
        page: that.page,
        api_type: that.api_type,
      };
      that.$apiFun
        .post('/api/betrecord', info)
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.pageData = res.data;
            if (that.page == 1) {
              that.list = res.data.data;
              // 从后端数据计算总计信息和游戏平台列表
              that.calculateGameStats(res.data.data);
            } else {
              let list = JSON.parse(JSON.stringify(that.list));
              res.data.data.forEach(el => {
                list.push(el);
              });
              that.list = list;
            }
            that.page = page + 1;
          }
          that.loading = false;
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
          that.loading = false;
        });
    },
    // 计算游戏统计信息
    calculateGameStats(data) {
      let that = this;
      // 初始化统计数据
      that.totalBets = 0;
      that.validBet = 0;
      that.winLoss = 0;
      
      // 按游戏平台分组
      let gameGroups = {};
      
      // 先初始化所有游戏平台
      that.allGames.forEach(game => {
        gameGroups[game.name] = {
          name: game.name,
          icon: game.icon,
          validBet: 0,
          winLoss: 0,
          bets: 0
        };
      });
      
      // 处理后端数据
      data.forEach(item => {
        // 计算总计信息
        that.totalBets++;
        that.validBet += parseFloat(item.bet_amount) || 0;
        that.winLoss += parseFloat(item.win_loss) || 0;
        
        // 按游戏平台分组
        let gameName = item.Code || '其他';
        if (gameGroups[gameName]) {
          gameGroups[gameName].validBet += parseFloat(item.bet_amount) || 0;
          gameGroups[gameName].winLoss += parseFloat(item.win_loss) || 0;
          gameGroups[gameName].bets++;
        } else {
          // 如果是其他游戏平台，添加到列表中
          gameGroups[gameName] = {
            name: gameName,
            icon: that.getGameIcon(gameName),
            validBet: parseFloat(item.bet_amount) || 0,
            winLoss: parseFloat(item.win_loss) || 0,
            bets: 1
          };
        }
      });
      
      // 转换为数组
      let gameList = Object.values(gameGroups);
      
      // 如果设置了 api_type，只显示对应游戏平台的记录
      if (that.api_type) {
        that.gameList = gameList.filter(game => game.name === that.api_type);
      } else {
        that.gameList = gameList;
      }
    },
    // 获取游戏平台列表
    getGamePlatforms() {
      let that = this;
      that.$apiFun.post('/api/balancelist', {}).then(res => {
        console.log('Game platforms:', res);
        if (res.code == 200) {
          // 从后端获取游戏平台列表
          const platforms = res.data.map(item => ({
            name: item.name,
            icon: that.getGameIcon(item.name)
          }));
          // 添加全平台选项
          platforms.unshift({ name: '全平台', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIj999999IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' });
          that.allGames = platforms;
          // 游戏平台列表获取成功后，再获取投注记录
          that.getData();
        } else {
          // 如果获取游戏平台列表失败，使用默认的游戏平台列表
          that.allGames = [
            { name: '全平台', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIj999999IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
            { name: 'PG电子', icon: that.getGameIcon('PG电子') },
            { name: 'MG电子', icon: that.getGameIcon('MG电子') },
            { name: '乐游棋牌', icon: that.getGameIcon('乐游棋牌') },
            { name: 'BBIN真人', icon: that.getGameIcon('BBIN真人') },
            { name: 'BBIN电子', icon: that.getGameIcon('BBIN电子') },
            { name: 'CQ9电子', icon: that.getGameIcon('CQ9电子') },
            { name: '瓦力棋牌', icon: that.getGameIcon('瓦力棋牌') },
            { name: 'FG捕鱼', icon: that.getGameIcon('FG捕鱼') },
            { name: 'DG捕鱼', icon: that.getGameIcon('DG捕鱼') }
          ];
          // 使用默认游戏平台列表后，再获取投注记录
          that.getData();
        }
      }).catch(err => {
        console.error('Failed to get game platforms:', err);
        // 如果获取游戏平台列表失败，使用默认的游戏平台列表
        that.allGames = [
          { name: '全平台', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIj999999IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIvPjwvc3ZnPg==' },
          { name: 'PG电子', icon: that.getGameIcon('PG电子') },
          { name: 'MG电子', icon: that.getGameIcon('MG电子') },
          { name: '乐游棋牌', icon: that.getGameIcon('乐游棋牌') },
          { name: 'BBIN真人', icon: that.getGameIcon('BBIN真人') },
          { name: 'BBIN电子', icon: that.getGameIcon('BBIN电子') },
          { name: 'CQ9电子', icon: that.getGameIcon('CQ9电子') },
          { name: '瓦力棋牌', icon: that.getGameIcon('瓦力棋牌') },
          { name: 'FG捕鱼', icon: that.getGameIcon('FG捕鱼') },
          { name: 'DG捕鱼', icon: that.getGameIcon('DG捕鱼') }
        ];
        // 使用默认游戏平台列表后，再获取投注记录
        that.getData();
      });
    },
    // 获取游戏图标
    getGameIcon(gameName) {
      // 根据游戏名称返回对应的系统生成图标
      const icons = {
        'PG电子': 'system-icon-pg',
        'MG电子': 'system-icon-mg',
        '乐游棋牌': 'system-icon-leyou',
        'BBIN真人': 'system-icon-bbin-live',
        'BBIN电子': 'system-icon-bbin-slot',
        'CQ9电子': 'system-icon-cq9',
        '瓦力棋牌': 'system-icon-wali',
        'FG捕鱼': 'system-icon-fg',
        'DG捕鱼': 'system-icon-dg',
        'MT捕鱼': 'system-icon-mt',
        'FB体育': 'system-icon-fb'
      };
      return icons[gameName] || 'system-icon-default';
    },
  },
  computed: {
    // 去除重复的平台
    uniquePlatforms() {
      let that = this;
      let seen = new Set();
      return that.allGames.filter(platform => {
        if (seen.has(platform.name)) {
          return false;
        }
        seen.add(platform.name);
        return true;
      });
    }
  },
  mounted() {
    let that = this;
    // 添加点击外部关闭平台选择下拉菜单的事件监听器
    document.addEventListener('click', function(e) {
      const platformSelectBtn = document.querySelector('.platform-select-btn');
      const platformSelectDropdown = document.querySelector('.platform-select-dropdown');
      if (platformSelectBtn && platformSelectDropdown && !platformSelectBtn.contains(e.target) && !platformSelectDropdown.contains(e.target)) {
        that.showPlatformSelect = false;
      }
    });
  },
  updated() {
    let that = this;
  },
};
</script>

<style lang="scss" scoped>
/* 日期筛选样式 */
.date-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .date-item {
    flex: 1;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 0.3rem;
    color: #333;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    &.active {
      background-color: #3d72fa;
      color: white;
      border-color: #3d72fa;
    }
  }
}

/* 总计信息样式 */
.total-info {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 15px;
  .total-item {
    flex: 1;
    text-align: center;
    .total-label {
      display: block;
      font-size: 0.28rem;
      color: #666;
      margin-bottom: 5px;
    }
    .total-value {
      display: block;
      font-size: 0.32rem;
      color: #333;
      font-weight: bold;
      &.negative {
        color: #ff4d4f;
      }
    }
  }
}

/* 游戏列表样式 */
.game-list {
  .game-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    &:last-child {
      border-bottom: none;
    }
    .game-icon {
      width: 40px;
      height: 40px;
      margin-right: 15px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      &.system-icon-pg {
        background-color: #084ccb;
        color: white;
      }
      &.system-icon-mg {
        background-color: #00afff;
        color: white;
      }
      &.system-icon-leyou {
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #e0e0e0;
      }
      &.system-icon-bbin-live {
        background-color: #c8ecfb;
        color: #000000;
      }
      &.system-icon-bbin-slot {
        background-color: #c8ecfb;
        color: #000000;
      }
      &.system-icon-cq9 {
        background-color: #cccf41;
        color: white;
      }
      &.system-icon-wali {
        background-color: #666fff;
        color: white;
      }
      &.system-icon-fg {
        background-color: #d5df35;
        color: white;
      }
      &.system-icon-dg {
        background-color: #b8dea3;
        color: white;
      }
      &.system-icon-mt {
        background-color: #999999;
        color: white;
      }
      &.system-icon-fb {
        background-color: #1877f2;
        color: white;
      }
      &.system-icon-default {
        background-color: #999999;
        color: white;
      }
    }
    .game-info {
      flex: 1;
      .game-name {
        font-size: 0.32rem;
        color: #333;
        margin-bottom: 5px;
      }
      .game-bet {
        font-size: 0.28rem;
        color: #666;
      }
    }
    .game-win-loss {
      font-size: 0.32rem;
      color: #333;
      font-weight: bold;
      margin-right: 15px;
      &.negative {
        color: #ff4d4f;
      }
    }
    .game-bets {
      font-size: 0.28rem;
      color: #666;
    }
  }
}
</style>
