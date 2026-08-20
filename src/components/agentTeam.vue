<template>
  <div data-v-f531b812="" class="app app-ti_green">
    <div data-v-8a75a126="" data-v-f531b812="" class="header">
      <div data-v-8a75a126="" class="header__top-wrapper">
        <div data-v-8a75a126="" class="van-nav-bar van-nav-bar--fixed fixed-top nav-header">
          <div class="van-nav-bar__content">
            <div class="van-nav-bar__left" @click="$router.back()">
              <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i>
            </div>
            <div class="van-nav-bar__title van-ellipsis">团队管理</div>
          </div>
        </div>
      </div>
    </div>
    <div class="agent-team">
      <!-- 团队统计 -->
      <div class="team-stats">
        <div class="stats-item">
          <div class="stats-value">{{ teamStats.total_members || 0 }}</div>
          <div class="stats-label">总会员</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ teamStats.direct_members || 0 }}</div>
          <div class="stats-label">直推会员</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ teamStats.active_members || 0 }}</div>
          <div class="stats-label">活跃会员</div>
        </div>
      </div>

      <!-- 会员列表 -->
      <div class="member-list">
        <div class="list-header">
          <h3>团队会员</h3>
          <div class="filter">
            <van-dropdown-menu>
              <van-dropdown-item v-model="filter.type" :options="typeOptions" />
            </van-dropdown-menu>
          </div>
        </div>
        <div class="list-content">
          <div v-if="members.length === 0" class="empty">
            <img src="/static/image/emptyCart.jpg" alt="" />
            <p>暂无会员</p>
          </div>
          <div v-else class="member-item" v-for="member in members" :key="member.id">
            <div class="member-info">
              <div class="member-name">{{ member.username }}</div>
              <div class="member-level">{{ member.level || '普通会员' }}</div>
            </div>
            <div class="member-stats">
              <div class="stat">
                <span class="stat-label">注册时间</span>
                <span class="stat-value">{{ member.register_time || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">累计下注</span>
                <span class="stat-value">{{ member.total_bet || 0 }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">状态</span>
                <span class="stat-value" :class="{ 'active': member.status === 1 }">
                  {{ member.status === 1 ? '活跃' : '非活跃' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="members.length > 0" class="pagination">
          <van-pagination
            v-model="pagination.current"
            :total-items="pagination.total"
            :items-per-page="pagination.pageSize"
            @change="getMembers"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'agentTeam',
  data() {
    return {
      teamStats: {},
      members: [],
      filter: {
        type: 'all'
      },
      typeOptions: [
        { text: '全部', value: 'all' },
        { text: '直推', value: 'direct' },
        { text: '活跃', value: 'active' }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.getTeamStats();
    this.getMembers();
  },
  methods: {
    getTeamStats() {
      let that = this;
      that.$apiFun
        .get('/api/team/performance')
        .then(res => {
          if (res.code === 200) {
            that.teamStats = res.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    getMembers() {
      let that = this;
      let params = {
        page: that.pagination.current,
        page_size: that.pagination.pageSize
      };
      that.$apiFun
        .post('/api/team/childlist', params)
        .then(res => {
          if (res.code === 200) {
            that.members = res.data.data;
            that.pagination.total = res.data.total;
          }
        })
        .catch(res => {
          console.log(res);
        });
    }
  },
  watch: {
    'filter.type': function() {
      this.pagination.current = 1;
      this.getMembers();
    }
  }
};
</script>

<style lang="scss" scoped>
.agent-team {
  margin-top: 60px;
  padding: 15px;
  
  .team-stats {
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
  
  .member-list {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
      
      h3 {
        margin: 0;
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
      
      .member-item {
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .member-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          .member-name {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }
          
          .member-level {
            font-size: 12px;
            color: #666;
            background: #f5f5f5;
            padding: 2px 8px;
            border-radius: 10px;
          }
        }
        
        .member-stats {
          display: flex;
          flex-wrap: wrap;
          
          .stat {
            width: 50%;
            margin-bottom: 5px;
            
            .stat-label {
              font-size: 12px;
              color: #999;
              margin-right: 5px;
            }
            
            .stat-value {
              font-size: 12px;
              color: #333;
              
              &.active {
                color: #084ccb;
              }
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