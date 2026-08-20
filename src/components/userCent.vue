<template>
  <div style="width: 100%; min-height: 100vh; background: #f5f5f5">
    <div class="pageTop" style="position: fixed; top: 0; left: 0; right: 0; height: 46px; line-height: 46px; text-align: center; color: white; font-size: 18px; background: url(/img/counter/top-bg.webp) no-repeat #084ccb; z-index: 1000;">
      <img src="/static/image/nav_chevron_back.bb0f0ac706614ab578365b31d203927a.png" alt="" style="width: 16px; height: 16px; position: absolute; left: 15px; top: 50%; transform: translateY(-50%); cursor: pointer;" @click="$router.back()" />
      财务报表
    </div>
    <div style="height: 46px"></div>
    
    <!-- 日期筛选 -->
    <div class="date-filter" style="display: flex; justify-content: space-between; margin: 10px; padding: 0 5px;">
      <div 
        v-for="(date, index) in dateOptions" 
        :key="index" 
        class="date-item" 
        :class="{ active: selectedDate === date.value }" 
        @click="selectDate(date.value)"
        style="flex: 1; text-align: center; padding: 8px 0; font-size: 14px; border-radius: 16px; cursor: pointer; margin: 0 5px;"
      >
        {{ date.label }}
      </div>
    </div>

    <!-- 数据卡片 -->
    <div class="data-cards" style="padding: 0 10px;">
      <div class="card-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">充值(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.recharge || 0 }}</div>
        </div>
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">取款(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.withdrawal || 0 }}</div>
        </div>
      </div>
      
      <div class="card-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">投注额(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.betAmount || 0 }}</div>
        </div>
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">有效投注(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.validBet || 0 }}</div>
        </div>
      </div>
      
      <div class="card-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">游戏返水(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.gameRebate || 0 }}</div>
        </div>
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">代理佣金(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.agentCommission || 0 }}</div>
        </div>
      </div>
      
      <div class="card-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">活动优惠(元)</div>
          <div class="card-value" style="font-size: 18px; font-weight: bold;">{{ reportData.activityBonus || 0 }}</div>
        </div>
      </div>
      
      <div class="card-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">游戏输赢(元)</div>
          <div class="card-value" :style="{ color: (reportData.gameWinLoss || 0) >= 0 ? '#ff4d4f' : '#52c41a' }" style="font-size: 18px; font-weight: bold;">{{ reportData.gameWinLoss || 0 }}</div>
        </div>
        <div class="data-card" style="flex: 1; background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 5px; text-align: center;">
          <div class="card-label" style="font-size: 14px; color: #666; margin-bottom: 10px;">净输赢(元)</div>
          <div class="card-value" :style="{ color: (reportData.netWinLoss || 0) >= 0 ? '#ff4d4f' : '#52c41a' }" style="font-size: 18px; font-weight: bold;">{{ reportData.netWinLoss || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-message" style="margin: 20px 10px; padding: 10px; background-color: #fff; border-radius: 10px; font-size: 12px; color: #666;">
      <span style="color: #ff4d4f; margin-right: 5px;">①</span>
      提示：第三方游戏数据可能存在延迟，实时数据可以直接进入第三方游戏查询
    </div>
  </div>
</template>
<script>
export default {
  name: 'userCent',
  data() {
    return {
      dateOptions: [
        { label: '今日', value: 'today' },
        { label: '昨日', value: 'yesterday' },
        { label: '本周', value: 'week' },
        { label: '上周', value: 'lastWeek' }
      ],
      selectedDate: 'today',
      reportData: {
        recharge: 0,
        withdrawal: 0,
        betAmount: 0,
        validBet: 0,
        gameRebate: 0,
        agentCommission: 0,
        texasInsurance: 0,
        activityBonus: 0,
        gameWinLoss: 0,
        netWinLoss: 0
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    selectDate(date) {
      this.selectedDate = date;
      this.getData();
    },
    getData() {
      let that = this;
      let params = {
        start_date: '',
        end_date: ''
      };

      // 根据选择的日期设置时间范围
      const today = new Date();
      if (that.selectedDate === 'today') {
        params.start_date = today.toISOString().split('T')[0];
        params.end_date = today.toISOString().split('T')[0];
      } else if (that.selectedDate === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        params.start_date = yesterday.toISOString().split('T')[0];
        params.end_date = yesterday.toISOString().split('T')[0];
      } else if (that.selectedDate === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        params.start_date = weekStart.toISOString().split('T')[0];
        params.end_date = today.toISOString().split('T')[0];
      } else if (that.selectedDate === 'lastWeek') {
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        params.start_date = lastWeekStart.toISOString().split('T')[0];
        params.end_date = lastWeekEnd.toISOString().split('T')[0];
      }

      this.$apiFun
        .post("/api/financeReport", params)
        .then(res => {
          if (res.code === 200) {
            // 假设接口返回的数据结构与我们需要的一致
            that.reportData = {
              recharge: res.data.recharge || 0,
              withdrawal: res.data.withdrawal || 0,
              betAmount: res.data.betAmount || 0,
              validBet: res.data.validBet || 0,
              gameRebate: res.data.gameRebate || 0,
              agentCommission: res.data.agentCommission || 0,
              texasInsurance: res.data.texasInsurance || 0,
              activityBonus: res.data.activityBonus || 0,
              gameWinLoss: res.data.gameWinLoss || 0,
              netWinLoss: res.data.netWinLoss || 0
            };
          }
        })
        .catch(err => {
          console.log(err);
          // 错误处理，使用默认数据
          that.reportData = {
            recharge: 0,
            withdrawal: 0,
            betAmount: 0,
            validBet: 0,
            gameRebate: 0,
            agentCommission: 0,
            texasInsurance: 0,
            activityBonus: 0,
            gameWinLoss: 0,
            netWinLoss: 0
          };
        });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import '../../static/css/chunk-764158fc.acb18eaa.css';

// 日期筛选样式
.date-filter {
  .date-item {
    &.active {
      background-color: #084ccb;
      color: white;
    }
  }
}
</style>
