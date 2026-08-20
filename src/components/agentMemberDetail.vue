<template>
  <div class="agent-member-detail">
    <div class="header">
      <div class="back" @click="goBack">
        <i class="van-icon van-icon-arrow-left"></i>
      </div>
      <div class="title">会员详情</div>
    </div>
    <div class="content">
      <div class="member-info">
        <div class="info-item">
          <span class="label">会员账号</span>
          <span class="value">{{ memberInfo.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">真实姓名</span>
          <span class="value">{{ memberInfo.realname }}</span>
        </div>
        <div class="info-item">
          <span class="label">注册时间</span>
          <span class="value">{{ memberInfo.created_at }}</span>
        </div>
        <div class="info-item">
          <span class="label">当前余额</span>
          <span class="value balance">{{ memberInfo.balance }}</span>
        </div>
      </div>
      
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'bet' }" @click="activeTab = 'bet'">下注记录</div>
        <div class="tab" :class="{ active: activeTab === 'recharge' }" @click="activeTab = 'recharge'">充值记录</div>
        <div class="tab" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">提现记录</div>
        <div class="tab" :class="{ active: activeTab === 'profit' }" @click="activeTab = 'profit'">盈亏记录</div>
      </div>
      
      <div class="tab-content">
        <!-- 下注记录 -->
        <div v-if="activeTab === 'bet'" class="bet-record">
          <div class="date-filter">
            <input type="date" v-model="betDateRange.start" placeholder="开始日期">
            <span>至</span>
            <input type="date" v-model="betDateRange.end" placeholder="结束日期">
            <button class="filter-btn" @click="getBetRecord">查询</button>
          </div>
          <div class="record-list">
            <div class="record-item" v-for="record in betRecords" :key="record.id">
              <div class="record-info">
                <div class="game-name">{{ record.game_name }}</div>
                <div class="bet-time">{{ record.created_at }}</div>
              </div>
              <div class="record-amount">
                <div class="bet-amount">投注: {{ record.bet_amount }}</div>
                <div class="win-loss" :class="{ win: record.win_loss > 0, loss: record.win_loss < 0 }">
                  {{ record.win_loss > 0 ? '+' : '' }}{{ record.win_loss }}
                </div>
              </div>
            </div>
            <div class="no-data" v-if="betRecords.length === 0">
              暂无下注记录
            </div>
          </div>
          <div class="pagination" v-if="betTotalPages > 1">
            <button class="page-btn" @click="changeBetPage(1)" :disabled="betCurrentPage === 1">首页</button>
            <button class="page-btn" @click="changeBetPage(betCurrentPage - 1)" :disabled="betCurrentPage === 1">上一页</button>
            <span class="page-info">第 {{ betCurrentPage }} / {{ betTotalPages }} 页</span>
            <button class="page-btn" @click="changeBetPage(betCurrentPage + 1)" :disabled="betCurrentPage === betTotalPages">下一页</button>
            <button class="page-btn" @click="changeBetPage(betTotalPages)" :disabled="betCurrentPage === betTotalPages">末页</button>
          </div>
        </div>
        
        <!-- 充值记录 -->
        <div v-if="activeTab === 'recharge'" class="recharge-record">
          <div class="date-filter">
            <input type="date" v-model="rechargeDateRange.start" placeholder="开始日期">
            <span>至</span>
            <input type="date" v-model="rechargeDateRange.end" placeholder="结束日期">
            <button class="filter-btn" @click="getRechargeRecord">查询</button>
          </div>
          <div class="record-list">
            <div class="record-item" v-for="record in rechargeRecords" :key="record.id">
              <div class="record-info">
                <div class="pay-way">{{ record.pay_way }}</div>
                <div class="recharge-time">{{ record.created_at }}</div>
              </div>
              <div class="record-amount">
                <div class="amount">充值: {{ record.amount }}</div>
                <div class="status" :class="{ success: record.state === 2 }">
                  {{ record.state === 2 ? '成功' : '处理中' }}
                </div>
              </div>
            </div>
            <div class="no-data" v-if="rechargeRecords.length === 0">
              暂无充值记录
            </div>
          </div>
          <div class="pagination" v-if="rechargeTotalPages > 1">
            <button class="page-btn" @click="changeRechargePage(1)" :disabled="rechargeCurrentPage === 1">首页</button>
            <button class="page-btn" @click="changeRechargePage(rechargeCurrentPage - 1)" :disabled="rechargeCurrentPage === 1">上一页</button>
            <span class="page-info">第 {{ rechargeCurrentPage }} / {{ rechargeTotalPages }} 页</span>
            <button class="page-btn" @click="changeRechargePage(rechargeCurrentPage + 1)" :disabled="rechargeCurrentPage === rechargeTotalPages">下一页</button>
            <button class="page-btn" @click="changeRechargePage(rechargeTotalPages)" :disabled="rechargeCurrentPage === rechargeTotalPages">末页</button>
          </div>
        </div>
        
        <!-- 提现记录 -->
        <div v-if="activeTab === 'withdraw'" class="withdraw-record">
          <div class="date-filter">
            <input type="date" v-model="withdrawDateRange.start" placeholder="开始日期">
            <span>至</span>
            <input type="date" v-model="withdrawDateRange.end" placeholder="结束日期">
            <button class="filter-btn" @click="getWithdrawRecord">查询</button>
          </div>
          <div class="record-list">
            <div class="record-item" v-for="record in withdrawRecords" :key="record.id">
              <div class="record-info">
                <div class="bank-card">{{ record.bank_card }}</div>
                <div class="withdraw-time">{{ record.created_at }}</div>
              </div>
              <div class="record-amount">
                <div class="amount">提现: {{ record.amount }}</div>
                <div class="status" :class="{ success: record.state === 2 }">
                  {{ record.state === 2 ? '成功' : '处理中' }}
                </div>
              </div>
            </div>
            <div class="no-data" v-if="withdrawRecords.length === 0">
              暂无提现记录
            </div>
          </div>
          <div class="pagination" v-if="withdrawTotalPages > 1">
            <button class="page-btn" @click="changeWithdrawPage(1)" :disabled="withdrawCurrentPage === 1">首页</button>
            <button class="page-btn" @click="changeWithdrawPage(withdrawCurrentPage - 1)" :disabled="withdrawCurrentPage === 1">上一页</button>
            <span class="page-info">第 {{ withdrawCurrentPage }} / {{ withdrawTotalPages }} 页</span>
            <button class="page-btn" @click="changeWithdrawPage(withdrawCurrentPage + 1)" :disabled="withdrawCurrentPage === withdrawTotalPages">下一页</button>
            <button class="page-btn" @click="changeWithdrawPage(withdrawTotalPages)" :disabled="withdrawCurrentPage === withdrawTotalPages">末页</button>
          </div>
        </div>
        
        <!-- 盈亏记录 -->
        <div v-if="activeTab === 'profit'" class="profit-record">
          <div class="date-filter">
            <input type="date" v-model="profitDateRange.start" placeholder="开始日期">
            <span>至</span>
            <input type="date" v-model="profitDateRange.end" placeholder="结束日期">
            <button class="filter-btn" @click="getProfitRecord">查询</button>
          </div>
          <div class="profit-summary">
            <div class="summary-item">
              <span class="label">总充值</span>
              <span class="value">{{ profitSummary.totalRecharge }}</span>
            </div>
            <div class="summary-item">
              <span class="label">总提现</span>
              <span class="value">{{ profitSummary.totalWithdraw }}</span>
            </div>
            <div class="summary-item">
              <span class="label">总投注</span>
              <span class="value">{{ profitSummary.totalBet }}</span>
            </div>
            <div class="summary-item">
              <span class="label">总盈亏</span>
              <span class="value" :class="{ win: profitSummary.totalProfit > 0, loss: profitSummary.totalProfit < 0 }">
                {{ profitSummary.totalProfit > 0 ? '+' : '' }}{{ profitSummary.totalProfit }}
              </span>
            </div>
          </div>
          <div class="record-list">
            <div class="record-item" v-for="record in profitRecords" :key="record.id">
              <div class="record-info">
                <div class="date">{{ record.date }}</div>
              </div>
              <div class="record-amount">
                <div class="bet-amount">投注: {{ record.betAmount }}</div>
                <div class="win-loss" :class="{ win: record.winLoss > 0, loss: record.winLoss < 0 }">
                  {{ record.winLoss > 0 ? '+' : '' }}{{ record.winLoss }}
                </div>
              </div>
            </div>
            <div class="no-data" v-if="profitRecords.length === 0">
              暂无盈亏记录
            </div>
          </div>
          <div class="pagination" v-if="profitTotalPages > 1">
            <button class="page-btn" @click="changeProfitPage(1)" :disabled="profitCurrentPage === 1">首页</button>
            <button class="page-btn" @click="changeProfitPage(profitCurrentPage - 1)" :disabled="profitCurrentPage === 1">上一页</button>
            <span class="page-info">第 {{ profitCurrentPage }} / {{ profitTotalPages }} 页</span>
            <button class="page-btn" @click="changeProfitPage(profitCurrentPage + 1)" :disabled="profitCurrentPage === profitTotalPages">下一页</button>
            <button class="page-btn" @click="changeProfitPage(profitTotalPages)" :disabled="profitCurrentPage === profitTotalPages">末页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'agentMemberDetail',
  data() {
    return {
      memberId: '',
      memberInfo: {
        username: '',
        realname: '',
        created_at: '',
        balance: 0
      },
      activeTab: 'bet',
      
      // 下注记录
      betRecords: [],
      betCurrentPage: 1,
      betTotalPages: 1,
      betDateRange: {
        start: '',
        end: ''
      },
      
      // 充值记录
      rechargeRecords: [],
      rechargeCurrentPage: 1,
      rechargeTotalPages: 1,
      rechargeDateRange: {
        start: '',
        end: ''
      },
      
      // 提现记录
      withdrawRecords: [],
      withdrawCurrentPage: 1,
      withdrawTotalPages: 1,
      withdrawDateRange: {
        start: '',
        end: ''
      },
      
      // 盈亏记录
      profitRecords: [],
      profitCurrentPage: 1,
      profitTotalPages: 1,
      profitDateRange: {
        start: '',
        end: ''
      },
      profitSummary: {
        totalRecharge: 0,
        totalWithdraw: 0,
        totalBet: 0,
        totalProfit: 0
      }
    };
  },
  created() {
    this.memberId = this.$route.params.id;
    this.getMemberInfo();
    this.getBetRecord();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    getMemberInfo() {
      let that = this;
      this.$apiFun.get(`/api/user/${this.memberId}`).then(res => {
        if (res.code === 200) {
          that.memberInfo = res.data;
        }
      });
    },
    
    // 下注记录
    getBetRecord() {
      let that = this;
      let params = {
        page: this.betCurrentPage,
        start: this.betDateRange.start,
        end: this.betDateRange.end
      };
      this.$apiFun.get(`/api/team/member/bet/${this.memberId}`, { params }).then(res => {
        if (res.code === 200) {
          that.betRecords = res.data.data || [];
          that.betTotalPages = res.data.totalPages || 1;
        }
      });
    },
    changeBetPage(page) {
      if (page >= 1 && page <= this.betTotalPages) {
        this.betCurrentPage = page;
        this.getBetRecord();
      }
    },
    
    // 充值记录
    getRechargeRecord() {
      let that = this;
      let params = {
        page: this.rechargeCurrentPage,
        start: this.rechargeDateRange.start,
        end: this.rechargeDateRange.end
      };
      this.$apiFun.get(`/api/team/member/recharge/${this.memberId}`, { params }).then(res => {
        if (res.code === 200) {
          that.rechargeRecords = res.data.data || [];
          that.rechargeTotalPages = res.data.totalPages || 1;
        }
      });
    },
    changeRechargePage(page) {
      if (page >= 1 && page <= this.rechargeTotalPages) {
        this.rechargeCurrentPage = page;
        this.getRechargeRecord();
      }
    },
    
    // 提现记录
    getWithdrawRecord() {
      let that = this;
      let params = {
        page: this.withdrawCurrentPage,
        start: this.withdrawDateRange.start,
        end: this.withdrawDateRange.end
      };
      this.$apiFun.get(`/api/team/member/withdraw/${this.memberId}`, { params }).then(res => {
        if (res.code === 200) {
          that.withdrawRecords = res.data.data || [];
          that.withdrawTotalPages = res.data.totalPages || 1;
        }
      });
    },
    changeWithdrawPage(page) {
      if (page >= 1 && page <= this.withdrawTotalPages) {
        this.withdrawCurrentPage = page;
        this.getWithdrawRecord();
      }
    },
    
    // 盈亏记录
    getProfitRecord() {
      let that = this;
      let params = {
        page: this.profitCurrentPage,
        start: this.profitDateRange.start,
        end: this.profitDateRange.end
      };
      this.$apiFun.get(`/api/team/member/profit/${this.memberId}`, { params }).then(res => {
        if (res.code === 200) {
          that.profitRecords = res.data.data || [];
          that.profitTotalPages = res.data.totalPages || 1;
          that.profitSummary = res.data.summary || {
            totalRecharge: 0,
            totalWithdraw: 0,
            totalBet: 0,
            totalProfit: 0
          };
        }
      });
    },
    changeProfitPage(page) {
      if (page >= 1 && page <= this.profitTotalPages) {
        this.profitCurrentPage = page;
        this.getProfitRecord();
      }
    }
  }
};
</script>

<style scoped>
.agent-member-detail {
  padding-top: 60px;
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: url(/img/counter/top-bg.webp) no-repeat #084ccb;
  background-size: cover;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
}

.back {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  i {
    font-size: 20px;
    color: #fff;
    transition: all 0.3s ease;
  }
  
  &:hover i {
    transform: translateX(-2px);
  }
}

.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.content {
  padding: 20px;
}

.member-info {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-item .label {
  font-size: 16px;
  color: #666;
}

.info-item .value {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.info-item .balance {
  color: #084ccb;
}

.tabs {
  display: flex;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #084ccb;
  border-bottom-color: #084ccb;
  font-weight: bold;
}

.tab-content {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.date-filter {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.date-filter input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.date-filter span {
  margin: 0 10px;
  color: #666;
}

.filter-btn {
  padding: 8px 16px;
  background: #084ccb;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.record-list {
  margin-bottom: 20px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  flex: 1;
}

.game-name, .pay-way, .bank-card, .date {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.bet-time, .recharge-time, .withdraw-time {
  font-size: 14px;
  color: #999;
}

.record-amount {
  text-align: right;
}

.bet-amount, .amount {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.win-loss {
  font-size: 16px;
  font-weight: bold;
}

.win-loss.win {
  color: #00c853;
}

.win-loss.loss {
  color: #ff3b30;
}

.status {
  font-size: 14px;
}

.status.success {
  color: #00c853;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
}

.page-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

.page-info {
  margin: 0 10px;
  font-size: 14px;
  color: #666;
}

.profit-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.summary-item {
  text-align: center;
}

.summary-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  display: block;
}

.summary-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.summary-item .value.win {
  color: #00c853;
}

.summary-item .value.loss {
  color: #ff3b30;
}
</style>