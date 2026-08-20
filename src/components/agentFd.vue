<template>
  <div data-v-f531b812="" class="app app-ti_green">
    <div data-v-8a75a126="" data-v-f531b812="" class="header">
      <div data-v-8a75a126="" class="header__top-wrapper">
        <div data-v-8a75a126="" class="van-nav-bar van-nav-bar--fixed fixed-top nav-header">
          <div class="van-nav-bar__content">
            <div class="van-nav-bar__left" @click="$router.back()">
              <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i>
            </div>
            <div class="van-nav-bar__title van-ellipsis">返点管理</div>
          </div>
        </div>
      </div>
    </div>
    <div class="agent-fd">
      <!-- 返点统计 -->
      <div class="fd-stats">
        <div class="stats-item">
          <div class="stats-value">{{ fdStats.total_fd || 0 }}</div>
          <div class="stats-label">累计返点</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ fdStats.unsettled_fd || 0 }}</div>
          <div class="stats-label">未结算返点</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ fdStats.settled_fd || 0 }}</div>
          <div class="stats-label">已结算返点</div>
        </div>
      </div>

      <!-- 返点记录 -->
      <div class="fd-list">
        <div class="list-header">
          <h3>返点记录</h3>
          <div class="date-picker">
            <van-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @confirm="getFdLogs"
            />
          </div>
        </div>
        <div class="list-content">
          <div v-if="fdLogs.length === 0" class="empty">
            <img src="/static/image/emptyCart.jpg" alt="" />
            <p>暂无返点记录</p>
          </div>
          <div v-else class="fd-item" v-for="fd in fdLogs" :key="fd.id">
            <div class="fd-header">
              <div class="fd-date">{{ fd.created_at || '-' }}</div>
              <div class="fd-game-type">{{ fd.game_type_text || fd.game_type || '-' }}</div>
            </div>
            <div class="fd-body">
              <div class="fd-info">
                <span class="fd-label">返点金额</span>
                <span class="fd-amount">+{{ fd.fd_money || 0 }}</span>
              </div>
              <div class="fd-info">
                <span class="fd-label">下注金额</span>
                <span class="fd-bet">{{ fd.bet_amount || 0 }}</span>
              </div>
              <div class="fd-info">
                <span class="fd-label">返点比例</span>
                <span class="fd-rate">{{ fd.agent_member_rate || 0 }}%</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="fdLogs.length > 0" class="pagination">
          <van-pagination
            v-model="pagination.current"
            :total-items="pagination.total"
            :items-per-page="pagination.pageSize"
            @change="getFdLogs"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'agentFd',
  data() {
    return {
      fdStats: {},
      fdLogs: [],
      dateRange: null,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.getFdStats();
    this.getFdLogs();
  },
  methods: {
    getFdStats() {
      let that = this;
      that.$apiFun
        .get('/api/team/fdinfo')
        .then(res => {
          if (res.code === 200) {
            that.fdStats = res.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    getFdLogs() {
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
            that.fdLogs = res.data.data;
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
.agent-fd {
  margin-top: 60px;
  padding: 15px;
  
  .fd-stats {
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
  
  .fd-list {
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
      
      .fd-item {
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .fd-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          .fd-date {
            font-size: 14px;
            color: #333;
          }
          
          .fd-game-type {
            font-size: 12px;
            color: #666;
            background: #f5f5f5;
            padding: 2px 8px;
            border-radius: 10px;
          }
        }
        
        .fd-body {
          .fd-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            
            .fd-label {
              font-size: 12px;
              color: #999;
            }
            
            .fd-amount {
              font-size: 14px;
              font-weight: bold;
              color: #52c41a;
            }
            
            .fd-bet,
            .fd-rate {
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