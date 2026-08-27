<template>
  <div class="agent-dashboard">


    <!-- 代理概况 -->
    <div class="section">
      <h3>代理概况</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ agentStats.rechargeTotal }}</div>
          <div class="stat-label">下级会员充值总额</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ agentStats.withdrawTotal }}</div>
          <div class="stat-label">下级会员提现总额</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ agentStats.betTotal }}</div>
          <div class="stat-label">下级会员总投注</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ agentStats.rebateTotal }}</div>
          <div class="stat-label">下级会员返水总额</div>
        </div>
      </div>
    </div>

  
    

    
    <!-- 推广信息 -->
    <div class="section">
      <h3>推广信息</h3>
      <div class="promotion-links">
        <div class="link-item">
          <label>推广链接</label>
          <div class="link-input">
            <input type="text" :value="promotionLinks.wapUrl" readonly>
            <button class="copy-btn" @click="copyLink(promotionLinks.wapUrl)">复制</button>
          </div>
        </div>
      </div>
      <div class="qrcode-section">
        <h4>推广二维码</h4>
        <div class="qrcode-container">
          <img :src="qrcodeUrl" alt="推广二维码" v-if="qrcodeUrl">
          <div class="loading" v-else>加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'agentDashboard',
  data() {
    return {
      activeTimeTab: 0,
      timeTabs: ['今日', '昨日', '本周', '上周'],
      dateRange: '2026-04-06 至 2026-04-06',
      agentStats: {
        rechargeTotal: 0.00,
        withdrawTotal: 0.00,
        betTotal: 0.00,
        rebateTotal: 0.00
      },
      fundsStats: {
        recharge: 0.00,
        withdraw: 0.00,
        validBet: 5.60,
        gameWinLoss: -5.04,
        insuranceWinLoss: 0.00,
        rebate: 0.01,
        commission: 0.00,
        activityBonus: 5.00,
        netWinLoss: -0.03
      },
      userStats: {
        teamNew: 0,
        directNew: 0,
        betCount: 1,
        firstDepositCount: 0,
        rechargeCount: 0,
        withdrawCount: 0,
        monthlyActive: 0,
        dailyActive: 0
      },
      promotionLinks: {
        pcUrl: '',
        wapUrl: ''
      },
      qrcodeUrl: ''
    };
  },
  created() {
    this.getPromotionLinks();
    this.getAgentStats();
  },
  mounted() {
    // 页面挂载后再次尝试获取数据，确保数据加载
    setTimeout(() => {
      this.getAgentStats();
    }, 500);
  },
  methods: {
    switchTimeTab(index) {
      this.activeTimeTab = index;
      // 这里可以根据选择的时间范围更新数据
    },
    getPromotionLinks() {
      let that = this;
      // 尝试从多个API获取推广链接
      const getFromAgentInfo = () => {
        that.$apiFun.post('/api/getAgentInfo').then(res => {
          console.log('从 /api/getAgentInfo 获取推广链接:', res);
          if (res.code === 200 && res.data) {
            // 处理推广链接，确保域名后面有 /#
            const processUrl = (url) => {
              if (!url) return '';
              // 检查是否已经包含 /#
              if (url.includes('/#')) {
                return url;
              }
              // 找到域名部分，在后面添加 /#
              const domainMatch = url.match(/^(https?:\/\/[^/]+)/);
              if (domainMatch) {
                const domain = domainMatch[1];
                const path = url.substring(domain.length);
                return domain + '/#' + path;
              }
              return url;
            };
            
            const processedPcUrl = processUrl(res.data.pc_url);
            const processedWapUrl = processUrl(res.data.wap_url);
            
            that.promotionLinks = {
              pcUrl: processedPcUrl || '',
              wapUrl: processedWapUrl || ''
            };
            // 生成二维码
            if (processedWapUrl) {
              that.generateQrcode(processedWapUrl);
            }
          } else {
            console.error('获取推广链接失败:', res);
            // 尝试备用方案
            that.promotionLinks = {
              pcUrl: '',
              wapUrl: ''
            };
          }
        }).catch(err => {
          console.error('获取推广链接错误:', err);
          that.promotionLinks = {
            pcUrl: '',
            wapUrl: ''
          };
        });
      };

      // 优先从主要API获取数据
      getFromAgentInfo();
    },
    generateQrcode(url) {
      this.qrcodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
    },
    copyLink(url) {
      navigator.clipboard.writeText(url).then(() => {
        if (this.$parent && this.$parent.showTost) {
          this.$parent.showTost(1, '链接已复制');
        } else {
          alert('链接已复制');
        }
      }).catch(err => {
        console.error('复制失败:', err);
        if (this.$parent && this.$parent.showTost) {
          this.$parent.showTost(0, '复制失败');
        } else {
          alert('复制失败');
        }
      });
    },
    getAgentStats() {
      let that = this;
      console.log('开始获取真实代理统计数据');
      
      // 调用代理后端API获取代理概况数据
      const getAgentOverview = () => {
        console.log('尝试获取代理概况数据');
        
        // 尝试从多个API获取代理概况数据
        const getFromApiTeamReport = () => {
          that.$apiFun.get('/api/team/report').then(res => {
            console.log('从 /api/team/report 获取代理概况数据:', res);
            if (res.code === 200) {
              that.$set(that, 'agentStats', {
                rechargeTotal: res.data.recharge || 0,
                withdrawTotal: res.data.withdrawal || 0,
                betTotal: res.data.validBet || 0,
                rebateTotal: res.data.gameRebate || 0
              });
              console.log('成功获取到代理概况数据！');
            } else {
              console.error('从 /api/team/report 获取代理概况数据失败:', res);
              // 尝试使用默认值
              that.$set(that, 'agentStats', {
                rechargeTotal: 0,
                withdrawTotal: 0,
                betTotal: 0,
                rebateTotal: 0
              });
            }
          }).catch(err => {
            console.error('获取代理概况数据错误:', err);
            // 尝试使用默认值
            that.$set(that, 'agentStats', {
              rechargeTotal: 0,
              withdrawTotal: 0,
              betTotal: 0,
              rebateTotal: 0
            });
          });
        };

        // 优先从主要API获取数据
        getFromApiTeamReport();
      };
      
      // 调用代理后端API获取团队业绩统计
      const getPerformance = () => {
        console.log('尝试从 /agent/index/getPerformance 获取团队业绩统计');
        
        that.$apiFun.post('/agent/index/getPerformance').then(res => {
          console.log('从 /agent/index/getPerformance 获取数据结果:', res);
          if (res.code === 200 && res.data) {
            // 更新用户概况数据
            that.$set(that, 'userStats', {
              teamNew: res.data.totalMembers || 0,
              directNew: res.data.directMembers || 0,
              betCount: 0, // 需要从其他接口获取
              firstDepositCount: 0, // 需要从其他接口获取
              rechargeCount: 0, // 需要从其他接口获取
              withdrawCount: 0, // 需要从其他接口获取
              monthlyActive: 0, // 需要从其他接口获取
              dailyActive: 0 // 需要从其他接口获取
            });
            console.log('成功获取到团队业绩统计数据！');
            // 继续获取其他数据
            getChildList();
          } else {
            console.error('从 /agent/index/getPerformance 获取数据失败:', res);
            // 尝试备用API
            getFromApiTeamPerformance();
          }
        }).catch(err => {
          console.error('从 /agent/index/getPerformance 获取数据错误:', err);
          // 尝试备用API
          getFromApiTeamPerformance();
        });
      };
      
      // 尝试从备用API获取团队业绩统计
      const getFromApiTeamPerformance = () => {
        console.log('尝试从 /api/team/performance 获取团队业绩统计');
        
        that.$apiFun.get('/api/team/performance').then(res => {
          console.log('从 /api/team/performance 获取数据结果:', res);
          if (res.code === 200) {
            // 更新用户概况数据
            that.$set(that, 'userStats', {
              teamNew: res.data.totalMembers || 0,
              directNew: res.data.directMembers || 0,
              betCount: 0, // 需要从其他接口获取
              firstDepositCount: 0, // 需要从其他接口获取
              rechargeCount: 0, // 需要从其他接口获取
              withdrawCount: 0, // 需要从其他接口获取
              monthlyActive: 0, // 需要从其他接口获取
              dailyActive: 0 // 需要从其他接口获取
            });
            console.log('成功从备用API获取到团队业绩统计数据！');
            // 继续获取其他数据
            getChildList();
          } else {
            console.error('从 /api/team/performance 获取数据失败:', res);
            // 尝试获取团队成员列表
            getChildList();
          }
        }).catch(err => {
          console.error('从 /api/team/performance 获取数据错误:', err);
          // 尝试获取团队成员列表
          getChildList();
        });
      };
      
      // 调用代理后端API获取团队成员列表
      const getChildList = () => {
        console.log('尝试从 /agent/index/getChildList 获取团队成员列表');
        
        that.$apiFun.post('/agent/index/getChildList').then(res => {
          console.log('从 /agent/index/getChildList 获取数据结果:', res);
          if (res.code === 200 && res.data && res.data.data) {
            const members = res.data.data;
            console.log('获取到团队成员数量:', members.length);
            
            // 更新用户概况数据
            const directMembers = members.filter(member => member.is_direct === 1).length;
            that.$set(that, 'userStats', {
              ...that.userStats,
              teamNew: members.length,
              directNew: directMembers
            });
            console.log('成功获取到团队成员列表！');
            
            // 如果有成员，尝试获取第一个成员的详细信息
            if (members.length > 0) {
              getMemberInfo(members[0].id);
            }
          } else {
            console.error('从 /agent/index/getChildList 获取数据失败:', res);
            // 尝试备用API
            getFromApiTeamChildlist();
          }
        }).catch(err => {
          console.error('从 /agent/index/getChildList 获取数据错误:', err);
          // 尝试备用API
          getFromApiTeamChildlist();
        });
      };
      
      // 尝试从备用API获取团队成员列表
      const getFromApiTeamChildlist = () => {
        console.log('尝试从 /api/team/childlist 获取团队成员列表');
        
        that.$apiFun.get('/api/team/childlist').then(res => {
          console.log('从 /api/team/childlist 获取数据结果:', res);
          if (res.code === 200 && res.data && res.data.data) {
            const members = res.data.data;
            console.log('获取到团队成员数量:', members.length);
            
            // 更新用户概况数据
            const directMembers = members.filter(member => member.is_direct === 1).length;
            that.$set(that, 'userStats', {
              ...that.userStats,
              teamNew: members.length,
              directNew: directMembers
            });
            console.log('成功从备用API获取到团队成员列表！');
            
            // 如果有成员，尝试获取第一个成员的详细信息
            if (members.length > 0) {
              getMemberInfo(members[0].id);
            }
          } else {
            console.error('从 /api/team/childlist 获取数据失败:', res);
          }
        }).catch(err => {
          console.error('从 /api/team/childlist 获取数据错误:', err);
        });
      };
      
      // 调用代理后端API获取会员详细信息
      const getMemberInfo = (userId) => {
        console.log(`尝试从 /agent/index/getUserInfo/${userId} 获取会员详细信息`);
        
        that.$apiFun.post(`/agent/index/getUserInfo/${userId}`).then(res => {
          console.log(`从 /agent/index/getUserInfo/${userId} 获取数据结果:`, res);
          if (res.code === 200 && res.data) {
            console.log('成功获取到会员详细信息！');
          } else {
            console.error(`从 /agent/index/getUserInfo/${userId} 获取数据失败:`, res);
            // 接口失败，不影响其他功能
          }
        }).catch(err => {
          console.error(`从 /agent/index/getUserInfo/${userId} 获取数据错误:`, err);
          // 接口错误，不影响其他功能
        });
      };
      
      // 开始获取数据
      getAgentOverview();
      getPerformance();
    },

  }
};
</script>

<style scoped>
.agent-dashboard {
 
  background: #ffffff;
  min-height: 100vh;
}

.time-selector {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  .time-range {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    span {
      font-size: 14px;
      color: #666;
      margin-right: 10px;
    }
    
    .date-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
    }
    
    i {
      margin-left: 10px;
      color: #999;
      font-size: 16px;
    }
  }
  
  .time-tabs {
    display: flex;
    gap: 10px;
    
    .time-tab {
      flex: 1;
      text-align: center;
      padding: 8px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      background: #f5f5f5;
      cursor: pointer;
      
      &.active {
        background: #3a7bd5;
        color: #fff;
        font-weight: bold;
      }
    }
  }
}

.section {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }
  
  h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #666;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  
  .stat-card {
      background: #f9f9f9;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPUAAACKBAMAAACA6xFCAAAAGFBMVEVHcEz0+f/0+f/0+f/0+f/0+f/t8//i6v/O6QthAAAABXRSTlMA8bsrZAkVPqoAAANQSURBVHja7ZzBbtswDIaNpQ+wYci97Zb7NmD3bMPuWxGx111IP0Gs1x9JibbstjfJ2lCqQOHYRj7x5y9KNqAMA7fD97t3e7b7H4O1w104hn3bB2N/C7u3421Cvwkd2sMnZZ96sMP7bmHnwH/2YQfO+OHYiX3pJjmLPgyfe7HDuVu6JeGnV8l+25H9azg629nOdrazne1sZzvb2c52trOd7WxnO9vZzna2s53tbGc729nOdvb/zibqxYYxxgn7sBnN8C5sYPAUI/Zgx0hAFOP2/J/2bIgT8H96EvgO7JGhoF3YnQ3xGhAB+AD3Zj8yEokQA3di1an27HGS0kIEetSSDbQpIqI0aduKXpsNT4rIY2T0JGwM40p0qjy+tYLhRnJVXAJfi16ZzWFzEVkR4hVGStMJQmzIHiOl8VymW2yW57LVFazLlpARyrH0KJJzaUFllwmvzM5GLtM6TkApWLY7wtSMzVCJsBxL8aph58DLK1R3HhtTBSsqt4wwxkEe+3LHzIaqbEplpHCbSK4xI2xEB6wbN2urRWR2G2TJMUUOuIgOWNnnkKunBc7zSHKa6o6l6FR73aKeXjIuqwb+oEFDAtJkd9Zmp6WwVG6B8/JUQs1RauyYi5wcVc43aXw6ZcWJpAPcD/lLkssNeZ4Tgeqyce4CxTSrpBEGeZRx/ClwdWDtMQapgCU4BU03quDaCRmFk0xqWHuNDAmtgZvv5vOiuSqjs7ncV3t9niCUB3RO9+xzENOBriOq5zvLa49+5nJDZ49B7kv95xItoLQ4PlfULHqg+a7qbJyLTKoy8zlIZgtyAdLJymzNI6ac6hINig7lWVwNCfV9njW3ym7xqsVNeWylef5azG7e9CuY07D+MzBYbsvPkKXI1ufAMSnQwudWSBYZzOa55gK0ePYHK57Ggs0AKH1XW/PNkXkMLH6cE9NGcywmrqI7CJvAG2heHIPhcUl703c9aMPMNDcmLt1p9p5pNa7AZrCd3yuipR3hOfgu7/ZeON+cDS9fasyGZ/y/o+Zrb++d7xCc/e+wT6+Sfdt1r+LXbuxzv72pv4fh0It96bYFW/cidxNd9mB32gh90X3vX7o47Zx+5qBHxu2HDm72h3+cf+Dh5n7fnD8k9F8Bvs5JiJjiAwAAAABJRU5ErkJggg==);
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      position: relative;
    
    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
      
      &.negative {
        color: #ff4d4f;
      }
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
    }
    
    i {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 14px;
      color: #999;
    }
  }
}

.promotion-links {
  margin-bottom: 20px;
  
  .link-item {
    margin-bottom: 15px;
    
    label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      color: #666;
    }
    
    .link-input {
      display: flex;
      
      input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px 0 0 4px;
        font-size: 14px;
      }
      
      .copy-btn {
        padding: 0 15px;
        background: #3a7bd5;
        color: #fff;
        border: none;
        border-radius: 0 4px 4px 0;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  
  .stat-item {
    background: #f9f9f9;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPUAAACKBAMAAACA6xFCAAAAGFBMVEVHcEz0+f/0+f/0+f/0+f/0+f/t8//i6v/O6QthAAAABXRSTlMA8bsrZAkVPqoAAANQSURBVHja7ZzBbtswDIaNpQ+wYci97Zb7NmD3bMPuWxGx111IP0Gs1x9JibbstjfJ2lCqQOHYRj7x5y9KNqAMA7fD97t3e7b7H4O1w104hn3bB2N/C7u3421Cvwkd2sMnZZ96sMP7bmHnwH/2YQfO+OHYiX3pJjmLPgyfe7HDuVu6JeGnV8l+25H9azg629nOdrazne1sZzvb2c52trOd7WxnO9vZzna2s53tbGc729nOdvb/zibqxYYxxgn7sBnN8C5sYPAUI/Zgx0hAFOP2/J/2bIgT8H96EvgO7JGhoF3YnQ3xGhAB+AD3Zj8yEokQA3di1an27HGS0kIEetSSDbQpIqI0aduKXpsNT4rIY2T0JGwM40p0qjy+tYLhRnJVXAJfi16ZzWFzEVkR4hVGStMJQmzIHiOl8VymW2yW57LVFazLlpARyrH0KJJzaUFllwmvzM5GLtM6TkApWLY7wtSMzVCJsBxL8aph58DLK1R3HhtTBSsqt4wwxkEe+3LHzIaqbEplpHCbSK4xI2xEB6wbN2urRWR2G2TJMUUOuIgOWNnnkKunBc7zSHKa6o6l6FR73aKeXjIuqwb+oEFDAtJkd9Zmp6WwVG6B8/JUQs1RauyYi5wcVc43aXw6ZcWJpAPcD/lLkssNeZ4Tgeqyce4CxTSrpBEGeZRx/ClwdWDtMQapgCU4BU03quDaCRmFk0xqWHuNDAmtgZvv5vOiuSqjs7ncV3t9niCUB3RO9+xzENOBriOq5zvLa49+5nJDZ49B7kv95xItoLQ4PlfULHqg+a7qbJyLTKoy8zlIZgtyAdLJymzNI6ac6hINig7lWVwNCfV9njW3ym7xqsVNeWylef5azG7e9CuY07D+MzBYbsvPkKXI1ufAMSnQwudWSBYZzOa55gK0ePYHK57Ggs0AKH1XW/PNkXkMLH6cE9NGcywmrqI7CJvAG2heHIPhcUl703c9aMPMNDcmLt1p9p5pNa7AZrCd3yuipR3hOfgu7/ZeON+cDS9fasyGZ/y/o+Zrb++d7xCc/e+wT6+Sfdt1r+LXbuxzv72pv4fh0It96bYFW/cidxNd9mB32gh90X3vX7o47Zx+5qBHxu2HDm72h3+cf+Dh5n7fnD8k9F8Bvs5JiJjiAwAAAABJRU5ErkJggg==);
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    
    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
    }
  }
}

.qrcode-section {
  .qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    
    img {
      max-width: 180px;
      max-height: 180px;
    }
    
    .loading {
      color: #999;
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>