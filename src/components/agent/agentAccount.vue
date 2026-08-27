<template>
  <div class="agent-account">
    <div class="account-header">
      <h2>代理账号管理</h2>
      <div class="search-bar">
        <input type="text" v-model="searchUsername" placeholder="搜索用户名" @keyup.enter="searchAccounts">
        <button class="search-btn" @click="searchAccounts">搜索</button>
      </div>
    </div>
    
    <div class="account-content">
      <div class="add-account-btn">
        <button class="primary-btn" @click="showAddAccountModal = true">添加代理账号</button>
      </div>
      
      <div class="account-list">
        <div class="account-item" v-for="account in accounts" :key="account.id">
          <div class="account-info">
            <div class="account-name">{{ account.username }}</div>
            <div class="account-detail">
              <span>真实姓名: {{ account.realname }}</span>
              <span>注册时间: {{ account.created_at }}</span>
              <span>状态: {{ account.status === 1 ? '正常' : '禁用' }}</span>
              <span>代理等级: {{ account.level }}</span>
            </div>
          </div>
          <div class="account-actions">
            <button class="action-btn" @click="goToAccountDetail(account.id)">查看详情</button>
            <button class="action-btn" @click="editAccount(account)">编辑</button>
            <button class="action-btn" @click="toggleStatus(account.id, account.status)" :class="{ danger: account.status === 1 }">
              {{ account.status === 1 ? '禁用' : '启用' }}
            </button>
          </div>
        </div>
        
        <div class="no-data" v-if="accounts.length === 0">
          暂无代理账号
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
    
    <!-- 添加/编辑代理账号弹窗 -->
    <div class="modal" v-if="showAddAccountModal || showEditAccountModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ showEditAccountModal ? '编辑代理账号' : '添加代理账号' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAccount">
            <div class="form-item">
              <label>用户名</label>
              <input type="text" v-model="currentAccount.username" placeholder="请输入用户名" required>
            </div>
            <div class="form-item">
              <label>密码</label>
              <input type="password" v-model="currentAccount.password" placeholder="请输入密码" :required="!showEditAccountModal">
            </div>
            <div class="form-item">
              <label>真实姓名</label>
              <input type="text" v-model="currentAccount.realname" placeholder="请输入真实姓名" required>
            </div>
            <div class="form-item">
              <label>代理等级</label>
              <select v-model="currentAccount.level" required>
                <option value="">请选择代理等级</option>
                <option value="1">一级代理</option>
                <option value="2">二级代理</option>
                <option value="3">三级代理</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModal">取消</button>
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
  name: 'agentAccount',
  data() {
    return {
      searchUsername: '',
      accounts: [],
      currentPage: 1,
      totalPages: 1,
      showAddAccountModal: false,
      showEditAccountModal: false,
      currentAccount: {
        id: '',
        username: '',
        password: '',
        realname: '',
        level: ''
      }
    };
  },
  created() {
    this.getAgentAccounts();
  },
  methods: {
    getAgentAccounts() {
      let that = this;
      let params = {
        page: this.currentPage,
        username: this.searchUsername
      };
      this.$apiFun.get('/game/agents', { params }).then(res => {
        if (res.code === 200) {
          that.accounts = res.data || [];
          that.totalPages = Math.ceil(that.accounts.length / 10) || 1;
        }
      });
    },
    searchAccounts() {
      this.currentPage = 1;
      this.getAgentAccounts();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getAgentAccounts();
      }
    },
    addAccount() {
      this.currentAccount = {
        id: '',
        username: '',
        password: '',
        realname: '',
        level: ''
      };
      this.showAddAccountModal = true;
      this.showEditAccountModal = false;
    },
    editAccount(account) {
      this.currentAccount = {
        id: account.id,
        username: account.username,
        password: '',
        realname: account.realname,
        level: account.level
      };
      this.showEditAccountModal = true;
      this.showAddAccountModal = false;
    },
    saveAccount() {
      let that = this;
      let url = this.showEditAccountModal ? '/api/agent/update' : '/api/agent/create';
      this.$apiFun.post(url, this.currentAccount).then(res => {
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, this.showEditAccountModal ? '编辑代理账号成功' : '添加代理账号成功');
          } else {
            alert(this.showEditAccountModal ? '编辑代理账号成功' : '添加代理账号成功');
          }
          that.closeModal();
          that.getAgentAccounts();
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '操作失败');
          } else {
            alert(res.message || '操作失败');
          }
        }
      });
    },
    closeModal() {
      this.showAddAccountModal = false;
      this.showEditAccountModal = false;
      this.currentAccount = {
        id: '',
        username: '',
        password: '',
        realname: '',
        level: ''
      };
    },
    goToAccountDetail(id) {
      this.$router.push(`/agent/account/${id}`);
    },
    toggleStatus(id, status) {
      let that = this;
      this.$apiFun.post('/api/agent/toggleStatus', { id, status: status === 1 ? 0 : 1 }).then(res => {
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, status === 1 ? '禁用代理账号成功' : '启用代理账号成功');
          } else {
            alert(status === 1 ? '禁用代理账号成功' : '启用代理账号成功');
          }
          that.getAgentAccounts();
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '操作失败');
          } else {
            alert(res.message || '操作失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.agent-account {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.account-header h2 {
  margin: 0;
  color: #333;
}

.search-bar {
  display: flex;
  gap: 10px;
  flex: 1;
  max-width: 300px;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
}

.account-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.add-account-btn {
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

.account-list {
  margin-bottom: 20px;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.account-item:last-child {
  border-bottom: none;
}

.account-info {
  flex: 1;
}

.account-name {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.account-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.account-actions {
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

.action-btn.danger {
  background: #dc3545;
}

.action-btn.danger:hover {
  background: #c82333;
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

.form-item input,
.form-item select {
  width: 100%;
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
  .account-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .account-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .account-actions {
    align-self: flex-end;
  }
  
  .account-detail {
    flex-direction: column;
    gap: 5px;
  }
}
</style>