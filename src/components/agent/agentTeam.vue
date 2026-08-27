<template>
  <div class="agent-team">
    <div class="team-header">
      <div class="search-bar">
        <input type="text" v-model="searchUsername" placeholder="搜索用户名" @keyup.enter="searchTeam">
        <button class="search-btn" @click="searchTeam">搜索</button>
      </div>
    </div>
    
    <div class="team-stats">

      <div class="stat-item">
        <div class="stat-value">{{ stats.totalAgents }}</div>
        <div class="stat-label">总下级会员</div>
      </div>
  
      <div class="stat-item">
        <div class="stat-value">{{ stats.directAgents }}</div>
        <div class="stat-label">直属下级会员</div>
      </div>
    </div>
    
    <div class="team-content">
      <div class="add-member-btn">
        <button class="primary-btn" @click="showAddMemberModal = true">添加会员</button>
      </div>
      
      <div class="member-list">
        <div class="member-item" v-for="member in members" :key="member.id">
          <div class="member-info">
            <div class="member-name">{{ member.username }}</div>
            <div class="member-detail">
              <span>真实姓名: {{ member.realname }}</span>
              <span>注册时间: {{ member.created_at }}</span>
              <span>是否直属: {{ member.is_direct ? '是' : '否' }}</span>
              <span>是否代理: {{ member.isagent ? '是' : '否' }}</span>
            </div>
          </div>
          <div class="member-actions">
            <button class="action-btn" @click="goToMemberDetail(member.id)">查看详情</button>
            <button class="action-btn" @click="goToRecharge(member.id)">充值</button>
            <button class="action-btn" @click="setAgent(member.id)" v-if="!member.isagent">设为代理</button>
          </div>
        </div>
        
        <div class="no-data" v-if="members.length === 0">
          暂无团队成员
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
    
    <!-- 添加会员弹窗 -->
    <div class="modal" v-if="showAddMemberModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加会员</h3>
          <button class="close-btn" @click="showAddMemberModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addMember">
            <div class="form-item">
              <label>用户名</label>
              <input type="text" v-model="newMember.username" placeholder="请输入用户名" required>
            </div>
            <div class="form-item">
              <label>密码</label>
              <input type="password" v-model="newMember.password" placeholder="请输入密码" required>
            </div>
            <div class="form-item">
              <label>真实姓名</label>
              <input type="text" v-model="newMember.realname" placeholder="请输入真实姓名" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showAddMemberModal = false">取消</button>
              <button type="submit" class="submit-btn">确定</button>
            </div>
          </form>
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
      searchUsername: '',
      stats: {
        totalMembers: 0,
        totalAgents: 0,
        directMembers: 0,
        directAgents: 0
      },
      members: [],
      currentPage: 1,
      totalPages: 1,
      showAddMemberModal: false,
      newMember: {
        username: '',
        password: '',
        realname: ''
      }
    };
  },
  created() {
    this.getTeamStats();
    this.getTeamMembers();
  },
  methods: {
    getTeamStats() {
      let that = this;
      // 尝试从多个API获取团队统计数据
      const getFromPerformance = () => {
        that.$apiFun.post('/agent/index/getPerformance').then(res => {
          console.log('从 /agent/index/getPerformance 获取团队统计:', res);
          if (res.code === 200 && res.data) {
            that.stats = {
              totalMembers: res.data.totalMembers || 0,
              totalAgents: res.data.totalAgents || 0,
              directMembers: res.data.directMembers || 0,
              directAgents: res.data.directAgents || 0
            };
          } else {
            // 尝试备用API
            getFromApiTeamPerformance();
          }
        }).catch(err => {
          console.error('获取团队统计错误:', err);
          // 尝试备用API
          getFromApiTeamPerformance();
        });
      };

      const getFromApiTeamPerformance = () => {
        that.$apiFun.get('/api/team/performance').then(res => {
          console.log('从 /api/team/performance 获取团队统计:', res);
          if (res.code === 200) {
            that.stats = {
              totalMembers: res.data.totalMembers || 0,
              totalAgents: res.data.totalAgents || 0,
              directMembers: res.data.directMembers || 0,
              directAgents: res.data.directAgents || 0
            };
          } else {
            console.error('获取团队统计失败:', res);
            // 尝试从团队成员列表计算统计数据
            getStatsFromMembers();
          }
        }).catch(err => {
          console.error('获取团队统计错误:', err);
          // 尝试从团队成员列表计算统计数据
          getStatsFromMembers();
        });
      };

      const getStatsFromMembers = () => {
        that.$apiFun.post('/agent/index/getChildList').then(res => {
          console.log('从团队成员列表计算统计数据:', res);
          if (res.code === 200 && res.data && res.data.data) {
            const members = res.data.data;
            const directMembers = members.filter(member => member.is_direct === 1).length;
            const totalAgents = members.filter(member => member.is_agent === 1).length;
            const directAgents = members.filter(member => member.is_agent === 1 && member.is_direct === 1).length;
            
            that.stats = {
              totalMembers: members.length,
              totalAgents: totalAgents,
              directMembers: directMembers,
              directAgents: directAgents
            };
          } else {
            console.error('获取团队成员列表失败:', res);
            that.stats = {
              totalMembers: 0,
              totalAgents: 0,
              directMembers: 0,
              directAgents: 0
            };
          }
        }).catch(err => {
          console.error('获取团队成员列表错误:', err);
          that.stats = {
            totalMembers: 0,
            totalAgents: 0,
            directMembers: 0,
            directAgents: 0
          };
        });
      };

      // 优先从主要API获取数据
      getFromPerformance();
    },
    getTeamMembers() {
      let that = this;
      let params = {
        page: this.currentPage,
        username: this.searchUsername
      };
      // 尝试从多个API获取团队成员信息
      const getFromChildList = () => {
        that.$apiFun.post('/agent/index/getChildList', params).then(res => {
          console.log('从 /agent/index/getChildList 获取团队成员:', res);
          if (res.code === 200 && res.data && res.data.data) {
            that.members = res.data.data || [];
            that.totalPages = Math.ceil(that.members.length / 10) || 1;
          } else {
            // 尝试备用API
            getFromApiTeamChildlist();
          }
        }).catch(err => {
          console.error('获取团队成员错误:', err);
          // 尝试备用API
          getFromApiTeamChildlist();
        });
      };

      const getFromApiTeamChildlist = () => {
        that.$apiFun.get('/api/team/childlist', { params }).then(res => {
          console.log('从 /api/team/childlist 获取团队成员:', res);
          if (res.code === 200) {
            that.members = res.data.data || [];
            that.totalPages = res.data.totalPages || 1;
          } else {
            console.error('获取团队成员失败:', res);
            that.members = [];
            that.totalPages = 1;
          }
        }).catch(err => {
          console.error('获取团队成员错误:', err);
          that.members = [];
          that.totalPages = 1;
        });
      };

      // 优先从主要API获取数据
      getFromChildList();
    },
    searchTeam() {
      this.currentPage = 1;
      this.getTeamMembers();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getTeamMembers();
      }
    },
    addMember() {
      let that = this;
      this.$apiFun.post('/api/team/addMember', this.newMember).then(res => {
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, '添加会员成功');
          } else {
            alert('添加会员成功');
          }
          that.showAddMemberModal = false;
          that.newMember = {
            username: '',
            password: '',
            realname: ''
          };
          that.getTeamMembers();
          that.getTeamStats();
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '添加会员失败');
          } else {
            alert(res.message || '添加会员失败');
          }
        }
      });
    },
    goToMemberDetail(id) {
      this.$router.push(`/agent/member/${id}`);
    },
    goToRecharge(id) {
      this.$router.push(`/agent/recharge/${id}`);
    },
    setAgent(id) {
      let that = this;
      this.$apiFun.post('/api/team/setAgent', { user_id: id }).then(res => {
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, '设置代理成功');
          } else {
            alert('设置代理成功');
          }
          that.getTeamMembers();
          that.getTeamStats();
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '设置代理失败');
          } else {
            alert(res.message || '设置代理失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.agent-team {
  padding: 20px;
  background: #ffffff;
  min-height: 100vh;
}

.team-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
  min-width: 0;
}

.search-btn {
  padding: 10px 15px;
  background: #084ccb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.search-btn:hover {
  background: #063aae;
}

@media (max-width: 768px) {
  .search-bar {
    max-width: 100%;
  }
  
  .team-header {
    justify-content: center;
  }
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 0;
}

.stat-value {
  font-size: 24px;

  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.team-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.add-member-btn {
  margin-bottom: 20px;
  text-align: right;
}

.primary-btn {
  padding: 10px 20px;
  background: #084ccb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.primary-btn:hover {
  background: #063aae;
}

.member-list {
  margin-bottom: 20px;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.member-item:last-child {
  border-bottom: none;
}

.member-info {
  flex: 1;
}

.member-name {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.member-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.member-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 12px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.action-btn:hover {
  background: #0069d9;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

.form-item input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background: #5a6268;
}

.submit-btn {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:hover {
  background: #0069d9;
}

@media (max-width: 768px) {
  .team-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1 1 45%;
    margin: 5px;
  }
  
  .member-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .member-actions {
    align-self: flex-end;
  }
}
</style>