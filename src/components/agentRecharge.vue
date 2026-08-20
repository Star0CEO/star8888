<template>
  <div class="agent-recharge">
    <div class="header">
      <div class="back" @click="goBack">
        <i class="van-icon van-icon-arrow-left"></i>
      </div>
      <div class="title">给下级充值</div>
    </div>
    <div class="content">
      <div class="form">
        <div class="form-item">
          <label>会员账号</label>
          <input type="text" v-model="memberUsername" disabled>
        </div>
        <div class="form-item">
          <label>充值金额</label>
          <input type="number" v-model="amount" placeholder="请输入充值金额" required>
        </div>
        <div class="form-item">
          <label>当前余额</label>
          <input type="text" v-model="currentBalance" disabled>
        </div>
        <button class="submit-btn" @click="submitRecharge">确认充值</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'agentRecharge',
  data() {
    return {
      memberId: '',
      memberUsername: '',
      amount: '',
      currentBalance: ''
    };
  },
  created() {
    this.memberId = this.$route.params.id;
    this.getMemberInfo();
    this.getCurrentBalance();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    getMemberInfo() {
      let that = this;
      this.$apiFun.get(`/api/user/${this.memberId}`).then(res => {
        if (res.code === 200) {
          that.memberUsername = res.data.username;
        }
      });
    },
    getCurrentBalance() {
      let that = this;
      this.$apiFun.post('/api/balance').then(res => {
        if (res.code === 200) {
          that.currentBalance = res.data.balance;
        }
      });
    },
    submitRecharge() {
      if (!this.amount || isNaN(this.amount) || this.amount <= 0) {
        alert('请输入正确的充值金额');
        return;
      }
      
      let that = this;
      this.$apiFun.post('/api/team/recharge', {
        user_id: this.memberId,
        amount: this.amount
      }).then(res => {
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, '充值成功');
          } else {
            alert('充值成功');
          }
          that.$router.back();
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '充值失败');
          } else {
            alert(res.message || '充值失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.agent-recharge {
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

.form {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.form-item input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-item input:disabled {
  background: #f5f5f5;
  color: #999;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #084ccb;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background: #063aae;
}
</style>