<template>
  <div data-v-f531b812="" class="app app-ti_green">
    <!-- 顶部导航栏 -->
    <div class="agent-header">
      <div class="header-top">
        <div class="back" @click="$router.back()">
          <i class="van-icon van-icon-arrow-left"></i>
        </div>
        <h1>代理中心</h1>
        <div class="header-right"></div>
      </div>
      


    </div>
    
    <!-- 代理功能导航 -->
    <div class="agent-nav">
      <div 
        v-for="(item, index) in navItems" 
        :key="index"
        :class="['nav-item', { active: activeTab === index }]"
        @click="switchTab(index)"
      >
        {{ item.title }}
      </div>
    </div>

    <!-- 代理功能内容 -->
    <div class="agent-content">
      <agent-dashboard v-if="activeTab === 0" />
      <agent-team v-if="activeTab === 1" />
      <agent-commission v-if="activeTab === 2" />
      <agent-fd v-if="activeTab === 3" />
    </div>

  </div>
</template>
<script>
import AgentDashboard from './agent/agentDashboard.vue';
import AgentTeam from './agent/agentTeam.vue';
import AgentCommission from './agent/agentCommission.vue';
import AgentFd from './agent/agentFd.vue';

export default {
  name: 'agentCenter',
  components: {
    AgentDashboard,
    AgentTeam,
    AgentCommission,
    AgentFd
  },
  data() {
    return {
      activeTab: 0,
      navItems: [
        { title: '代理首页' },
        { title: '团队管理' },
        { title: '佣金记录' },
        { title: '返水管理' }
      ],
      userInfo: {
        username: 'abcd199127',
        balance: 0,
        avatar: ''
      },
      commissionInfo: {
        total: 0,
        rate: 100
      },
  
    };
  },
  created() {
    this.getUserInfo();
    this.getCommissionInfo();
  },
  methods: {
    switchTab(index) {
      this.activeTab = index;
    },
    getUserInfo() {
      let that = this;
      // 尝试从后端代理列表接口获取真实代理账号信息
      this.$apiFun.get('/game/agents').then(res => {
        console.log('获取代理列表:', res);
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 假设返回的是代理列表，取第一个代理的信息
          const agentInfo = res.data[0];
          that.userInfo = {
            username: agentInfo.username || agentInfo.name || '代理用户',
            balance: agentInfo.balance || 0,
            avatar: agentInfo.avatar || ''
          };
          console.log('从代理列表获取的用户信息:', that.userInfo);
        } else {
          // 如果代理列表接口失败，尝试从用户接口获取
          that.$apiFun.get('/user').then(res => {
            console.log('获取用户信息:', res);
            if (res.code === 200) {
              that.userInfo = res.data;
            } else {
              console.error('获取用户信息失败:', res);
            }
          }).catch(err => {
            console.error('获取用户信息错误:', err);
          });
        }
      }).catch(err => {
        console.error('获取代理列表错误:', err);
        // 如果代理列表接口失败，尝试从用户接口获取
        that.$apiFun.get('/user').then(res => {
          console.log('获取用户信息:', res);
          if (res.code === 200) {
            that.userInfo = res.data;
          } else {
            console.error('获取用户信息失败:', res);
          }
        }).catch(err => {
          console.error('获取用户信息错误:', err);
        });
      });
    },
    getCommissionInfo() {
      // 模拟数据，实际应该从API获取
      this.commissionInfo = {
        total: 0,
        rate: 100
      };
    },

  }
};
</script>

<style lang="scss" scoped>
.agent-header {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  background-image: url(/static/css/top_area_bg-w1ddLS2U.png);
  background-size: cover;
  background-position: center;
  color: #fff;
  
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmMTAiPjwvcmVjdD4KPC9zdmc+');
    opacity: 0.1;
  }
  

  
  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    position: relative;
    z-index: 1;
    
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
    
    h1 {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
    
    .header-right {
      width: 40px;
    }
  }
  
  .user-info-section {
    padding: 0 15px;
    position: relative;
    z-index: 1;
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.3);
        margin-right: 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .user-details {
        flex: 1;
        
        .username {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .balance {
          display: flex;
          align-items: center;
          
          .balance-label {
            font-size: 14px;
            margin-right: 5px;
          }
          
          .balance-value {
            font-size: 20px;
            font-weight: bold;
            margin-right: 15px;
          }
          
          .withdraw-btn {
            padding: 4px 12px;
            background: #fff;
            color: #3a7bd5;
            border: none;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
    }
    
    .commission-info {
      display: flex;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 15px;
      
      .commission-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .commission-label {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .commission-value {
          font-size: 18px;
          font-weight: bold;
        }
        
        .commission-rate {
          font-size: 18px;
          font-weight: bold;
          color: #ffd700;
        }
        
        i {
          font-size: 14px;
          opacity: 0.8;
        }
      }
      
      .commission-divider {
        width: 1px;
        background: rgba(255, 255, 255, 0.3);
        margin: 0 15px;
      }
    }
  }
}

.agent-nav {
  display: flex;
  background: #fff;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  .nav-item {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
    color: #666;
    position: relative;
    
    &.active {
      color: #3a7bd5;
      font-weight: bold;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: #3a7bd5;
      }
    }
  }
}

.agent-content {
  background: #f5f5f5;
  min-height: calc(100vh - 200px);
}
</style>