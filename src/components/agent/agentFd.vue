<template>
  <div class="agent-fd">
    <div class="fd-header">
      <h2>返点管理</h2>
      <div class="date-filter">
        <input type="date" v-model="startDate" @change="getFdStats">
        <span class="date-separator">至</span>
        <input type="date" v-model="endDate" @change="getFdStats">
        <button class="filter-btn" @click="getFdStats">查询</button>
      </div>
    </div>
    
    <div class="fd-stats">
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalFd }}</div>
        <div class="stat-label">总返点</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalValidBet }}</div>
        <div class="stat-label">总有效投注</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.avgFdRate }}</div>
        <div class="stat-label">平均返点率</div>
      </div>
    </div>
    
    <div class="fd-content">
      <div class="fd-list">
        <div class="fd-item" v-for="fd in fdRecords" :key="fd.id">
          <div class="fd-info">
            <div class="fd-date">{{ fd.date }}</div>
            <div class="fd-detail">
              <span>用户名: {{ fd.username }}</span>
              <span>游戏类型: {{ fd.gameType }}</span>
              <span>有效投注: {{ fd.validBet }}</span>
              <span>返点金额: {{ fd.amount }}</span>
              <span>返点率: {{ fd.rate }}%</span>
            </div>
          </div>
        </div>
        
        <div class="no-data" v-if="fdRecords.length === 0">
          暂无返点记录
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
    
    <!-- 设置返点弹窗 -->
    <div class="modal" v-if="showSetFdModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>设置返点</h3>
          <button class="close-btn" @click="showSetFdModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="setFd">
            <div class="form-item">
              <label>用户名</label>
              <input type="text" v-model="setFdForm.username" placeholder="请输入用户名" required>
            </div>
            <div class="form-item">
              <label>返点率</label>
              <input type="number" v-model="setFdForm.rate" placeholder="请输入返点率" step="0.1" min="0" max="100" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showSetFdModal = false">取消</button>
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
  name: 'agentFd',
  data() {
    return {
      startDate: '',
      endDate: '',
      stats: {
        totalFd: 0,
        totalValidBet: 0,
        avgFdRate: 0
      },
      fdRecords: [],
      currentPage: 1,
      totalPages: 1,
      showSetFdModal: false,
      setFdForm: {
        username: '',
        rate: ''
      }
    };
  },
  created() {
    // 设置默认日期范围为最近7天
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    this.startDate = sevenDaysAgo.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
    
    this.getFdStats();
    this.getFdRecords();
  },
  methods: {
    getFdStats() {
      let that = this;
      let params = {
        start_date: this.startDate,
        end_date: this.endDate
      };
      // 尝试从API获取返水统计数据
      this.$apiFun.get('/api/team/fdinfo', { params }).then(res => {
        console.log('获取返水统计数据:', res);
        if (res.code === 200) {
          that.stats = {
            totalFd: res.data.totalFd || 0,
            totalValidBet: res.data.totalValidBet || 0,
            avgFdRate: res.data.avgFdRate || 0
          };
        } else {
          console.error('获取返水统计数据失败:', res);
          // 设置默认值
          that.stats = {
            totalFd: 0,
            totalValidBet: 0,
            avgFdRate: 0
          };
        }
      }).catch(err => {
        console.error('获取返水统计数据错误:', err);
        // 设置默认值
        that.stats = {
          totalFd: 0,
          totalValidBet: 0,
          avgFdRate: 0
        };
      });
    },
    getFdRecords() {
      let that = this;
      let params = {
        page: this.currentPage,
        start_date: this.startDate,
        end_date: this.endDate
      };
      // 尝试从API获取返水记录
      this.$apiFun.get('/api/team/fdList', { params }).then(res => {
        console.log('获取返水记录:', res);
        if (res.code === 200) {
          that.fdRecords = res.data.data || [];
          that.totalPages = res.data.totalPages || 1;
        } else {
          console.error('获取返水记录失败:', res);
          that.fdRecords = [];
          that.totalPages = 1;
        }
      }).catch(err => {
        console.error('获取返水记录错误:', err);
        that.fdRecords = [];
        that.totalPages = 1;
      });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getFdRecords();
      }
    },
    setFd() {
      let that = this;
      this.$apiFun.post('/api/team/setFd', this.setFdForm).then(res => {
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, '设置返点成功');
          } else {
            alert('设置返点成功');
          }
          that.showSetFdModal = false;
          that.setFdForm = {
            username: '',
            rate: ''
          };
          that.getFdStats();
          that.getFdRecords();
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '设置返点失败');
          } else {
            alert(res.message || '设置返点失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.agent-fd {
  padding: 20px;
  background: #ffffff;
  min-height: 100vh;
}

.fd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.fd-header h2 {
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

.fd-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 0 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.fd-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.fd-list {
  margin-bottom: 20px;
}

.fd-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.fd-item:last-child {
  border-bottom: none;
}

.fd-date {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.fd-detail {
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
  .fd-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .fd-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1 1 45%;
    margin: 5px;
  }
  
  .date-filter {
    flex-wrap: wrap;
  }
  
  .fd-detail {
    flex-direction: column;
    gap: 5px;
  }
}
</style>