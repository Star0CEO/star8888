<template>
  <div class="agent-commission">
    <div class="commission-header">
      <h2>佣金记录</h2>
      <div class="date-filter">
        <input type="date" v-model="startDate" @change="getCommissionStats">
        <span class="date-separator">至</span>
        <input type="date" v-model="endDate" @change="getCommissionStats">
        <button class="filter-btn" @click="getCommissionStats">查询</button>
      </div>
    </div>
    
    <div class="commission-stats">
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalRecharge }}</div>
        <div class="stat-label">总存款</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalWithdraw }}</div>
        <div class="stat-label">总提款</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalValidBet }}</div>
        <div class="stat-label">总有效投注</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalWinLoss }}</div>
        <div class="stat-label">总输赢</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalFanshui }}</div>
        <div class="stat-label">总返水</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalRedpacket }}</div>
        <div class="stat-label">总红包</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalCommission }}</div>
        <div class="stat-label">总佣金</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.waitCommission }}</div>
        <div class="stat-label">待结算佣金</div>
      </div>
    </div>
    
    <div class="commission-content">
      <div class="commission-list">
        <div class="commission-item" v-for="commission in commissions" :key="commission.id">
          <div class="commission-info">
            <div class="commission-date">{{ commission.date }}</div>
            <div class="commission-detail">
              <span>用户名: {{ commission.username }}</span>
              <span>有效投注: {{ commission.validBet }}</span>
              <span>佣金金额: {{ commission.amount }}</span>
              <span>状态: {{ commission.status }}</span>
            </div>
          </div>
        </div>
        
        <div class="no-data" v-if="commissions.length === 0">
          暂无佣金记录
        </div>
      </div>
      
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" @click="changePage(1)" :disabled="currentPage === 1">首页</button>
        <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        <button class="page-btn" @click="changePage(totalPages)" :disabled="currentPage === totalPages">末页</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'agentCommission',
  data() {
    return {
      startDate: '',
      endDate: '',
      stats: {
        totalRecharge: 0,
        totalWithdraw: 0,
        totalValidBet: 0,
        totalWinLoss: 0,
        totalFanshui: 0,
        totalRedpacket: 0,
        totalCommission: 0,
        waitCommission: 0
      },
      commissions: [],
      currentPage: 1,
      totalPages: 1
    };
  },
  created() {
    // 设置默认日期范围为最近7天
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    this.startDate = sevenDaysAgo.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
    
    this.getCommissionStats();
    this.getCommissionList();
  },
  methods: {
    getCommissionStats() {
      let that = this;
      let params = {
        start_date: this.startDate,
        end_date: this.endDate
      };
      // 尝试从API获取佣金统计数据
      this.$apiFun.get('/api/team/report', { params }).then(res => {
        console.log('获取佣金统计数据:', res);
        if (res.code === 200) {
          that.stats = {
            totalRecharge: res.data.recharge || 0,
            totalWithdraw: res.data.withdrawal || 0,
            totalValidBet: res.data.validBet || 0,
            totalWinLoss: res.data.gameWinLoss || 0,
            totalFanshui: res.data.gameRebate || 0,
            totalRedpacket: res.data.activityBonus || 0,
            totalCommission: res.data.agentCommission || 0,
            waitCommission: res.data.waitCommission || 0
          };
        } else {
          console.error('获取佣金统计数据失败:', res);
          // 设置默认值
          that.stats = {
            totalRecharge: 0,
            totalWithdraw: 0,
            totalValidBet: 0,
            totalWinLoss: 0,
            totalFanshui: 0,
            totalRedpacket: 0,
            totalCommission: 0,
            waitCommission: 0
          };
        }
      }).catch(err => {
        console.error('获取佣金统计数据错误:', err);
        // 设置默认值
        that.stats = {
          totalRecharge: 0,
          totalWithdraw: 0,
          totalValidBet: 0,
          totalWinLoss: 0,
          totalFanshui: 0,
          totalRedpacket: 0,
          totalCommission: 0,
          waitCommission: 0
        };
      });
    },
    getCommissionList() {
      let that = this;
      let params = {
        page: this.currentPage,
        start_date: this.startDate,
        end_date: this.endDate
      };
      // 尝试从API获取佣金记录
      this.$apiFun.get('/api/team/commissionList', { params }).then(res => {
        console.log('获取佣金记录:', res);
        if (res.code === 200) {
          that.commissions = res.data.data || [];
          that.totalPages = res.data.totalPages || 1;
        } else {
          console.error('获取佣金记录失败:', res);
          that.commissions = [];
          that.totalPages = 1;
        }
      }).catch(err => {
        console.error('获取佣金记录错误:', err);
        that.commissions = [];
        that.totalPages = 1;
      });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getCommissionList();
      }
    }
  }
};
</script>

<style scoped>
.agent-commission {
  padding: 20px;
  background: #ffffff;
  min-height: 100vh;
}

.commission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.commission-header h2 {
  margin: 0;
  color: #333;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-filter input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.date-separator {
  color: #666;
  font-size: 14px;
}

.filter-btn {
  padding: 8px 15px;
  background: #084ccb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.filter-btn:hover {
  background: #063aae;
}

.commission-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.stat-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.commission-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.commission-list {
  margin-bottom: 20px;
}

.commission-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.commission-item:last-child {
  border-bottom: none;
}

.commission-date {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.commission-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 12px;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .commission-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .commission-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .date-filter {
    flex-wrap: wrap;
  }
  
  .commission-detail {
    flex-direction: column;
    gap: 5px;
  }
}
</style>