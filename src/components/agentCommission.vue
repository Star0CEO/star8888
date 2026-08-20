<template>
  <div data-v-f531b812="" class="app app-ti_green">
    <div data-v-8a75a126="" data-v-f531b812="" class="header">
      <div data-v-8a75a126="" class="header__top-wrapper">
        <div data-v-8a75a126="" class="van-nav-bar van-nav-bar--fixed fixed-top nav-header">
          <div class="van-nav-bar__content">
            <div class="van-nav-bar__left" @click="$router.back()">
              <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i>
            </div>
            <div class="van-nav-bar__title van-ellipsis">佣金记录</div>
          </div>
        </div>
      </div>
    </div>
    <div class="agent-commission">
      <!-- 佣金统计 -->
      <div class="commission-stats">
        <div class="stats-item">
          <div class="stats-value">{{ commissionStats.total_commission || 0 }}</div>
          <div class="stats-label">累计佣金</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ commissionStats.unsettled_commission || 0 }}</div>
          <div class="stats-label">未结算佣金</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ commissionStats.settled_commission || 0 }}</div>
          <div class="stats-label">已结算佣金</div>
        </div>
      </div>

      <!-- 佣金记录 -->
      <div class="commission-list">
        <div class="list-header">
          <h3>佣金记录</h3>
          <div class="date-picker">
            <van-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @confirm="getCommissions"
            />
          </div>
        </div>
        <div class="list-content">
          <div v-if="commissions.length === 0" class="empty">
            <img src="/static/image/emptyCart.jpg" alt="" />
            <p>暂无佣金记录</p>
          </div>
          <div v-else class="commission-item" v-for="commission in commissions" :key="commission.id">
            <div class="commission-header">
              <div class="commission-date">{{ commission.created_at || '-' }}</div>
              <div class="commission-status" :class="{ 'settled': commission.status === 1 }">
                {{ commission.status === 1 ? '已结算' : '未结算' }}
              </div>
            </div>
            <div class="commission-body">
              <div class="commission-info">
                <span class="commission-label">佣金金额</span>
                <span class="commission-amount">+{{ commission.money || 0 }}</span>
              </div>
              <div class="commission-info">
                <span class="commission-label">盈利金额</span>
                <span class="commission-profit">{{ commission.yl_money || 0 }}</span>
              </div>
              <div class="commission-info">
                <span class="commission-label">备注</span>
                <span class="commission-remark">{{ commission.remark || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="commissions.length > 0" class="pagination">
          <van-pagination
            v-model="pagination.current"
            :total-items="pagination.total"
            :items-per-page="pagination.pageSize"
            @change="getCommissions"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'agentCommission',
  data() {
    return {
      commissionStats: {},
      commissions: [],
      dateRange: null,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.getCommissionStats();
    this.getCommissions();
  },
  methods: {
    getCommissionStats() {
      let that = this;
      that.$apiFun
        .get('/api/team/performance')
        .then(res => {
          if (res.code === 200) {
            that.commissionStats = res.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    getCommissions() {
      let that = this;
      let params = {
        page: that.pagination.current,
        page_size: that.pagination.pageSize
      };
      if (that.dateRange) {
        params.start_date = that.dateRange[0];
        params.end_date = that.dateRange[1];
      }
      that.$apiFun
        .post('/api/team/report', params)
        .then(res => {
          if (res.code === 200) {
            that.commissions = res.data.data;
            that.pagination.total = res.data.total;
          }
        })
        .catch(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.agent-commission {
  margin-top: 60px;
  padding: 15px;
  
  .commission-stats {
    display: flex;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .stats-item {
      flex: 1;
      padding: 20px 15px;
      text-align: center;
      border-right: 1px solid #f5f5f5;
      
      &:last-child {
        border-right: none;
      }
      
      .stats-value {
        font-size: 20px;
        font-weight: bold;
        color: #084ccb;
        margin-bottom: 5px;
      }
      
      .stats-label {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .commission-list {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .list-header {
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
      
      h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #333;
      }
    }
    
    .list-content {
      padding: 0 15px;
      
      .empty {
        padding: 40px 0;
        text-align: center;
        
        img {
          width: 80px;
          margin-bottom: 10px;
        }
        
        p {
          color: #999;
          font-size: 14px;
        }
      }
      
      .commission-item {
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .commission-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          .commission-date {
            font-size: 14px;
            color: #333;
          }
          
          .commission-status {
            font-size: 12px;
            color: #ff6b6b;
            background: #ffe6e6;
            padding: 2px 8px;
            border-radius: 10px;
            
            &.settled {
              color: #52c41a;
              background: #f6ffed;
            }
          }
        }
        
        .commission-body {
          .commission-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            
            .commission-label {
              font-size: 12px;
              color: #999;
            }
            
            .commission-amount {
              font-size: 14px;
              font-weight: bold;
              color: #52c41a;
            }
            
            .commission-profit,
            .commission-remark {
              font-size: 12px;
              color: #333;
            }
          }
        }
      }
    }
    
    .pagination {
      padding: 15px;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>