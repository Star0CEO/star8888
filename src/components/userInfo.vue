<template>
  <div style="width: 100%; min-height: 100vh; background: #ffffff">
    <van-nav-bar style="position: fixed; top: 0; left: 0; width: 100%; background-color: #054dc4; color: white" title="设置" left-arrow @click-left="$router.back()">
      <template #title>
        <div style="color: white; font-size: 18px; padding: 0 10px">设置</div>
      </template>
      <template #left>
        <div style="color: white" @click="$router.back()">
          <i class="van-icon van-icon-arrow-left" style="color: white; font-size: 20px"></i>
        </div>
      </template>
    </van-nav-bar>
    <div style="height: 46px"></div>
    
    <!-- 头像区域 -->
    <div class="avatar-section">
      <div class="avatar-container">
        <img :src="$store.state.userInfo.avatar ? $store.state.userInfo.avatar : '/static/image/imageAvatar02@3x.png'" alt="" class="avatar" />
        <input class="inputsw" type="file" @change="onchangemd" single accept="image/gif,image/png" />
        <img class="edit-icon" src="/static/image/avatarEdit.cf65ea838bb7aba043f461f551f740ac.png" />
      </div>
    </div>
    
    <!-- 信息列表 -->
    <div class="info-section">
      <div class="info-item">
        <div class="info-label">账户名称</div>
        <div class="info-value">{{ $store.state.userInfo.username || $store.state.userInfo.userid || $store.state.userInfo.id || $store.state.userInfo.user_id || $store.state.userInfo.account || $store.state.userInfo.name || $store.state.userInfo.nickname || $store.state.userInfo.user_name || '' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">注册日期</div>
        <div class="info-value">{{ formatDate($store.state.userInfo.regtime || $store.state.userInfo.register_time || $store.state.userInfo.created_at || $store.state.userInfo.created || $store.state.userInfo.reg_time || $store.state.userInfo.signup_time || $store.state.userInfo.join_time || $store.state.userInfo.registration_date) }}</div>
      </div>
      <div class="info-item with-border" @click="goEditRealname">
        <div class="info-label">真实姓名</div>
        <div class="info-value with-arrow">{{ $store.state.userInfo.realname || '未设置' }} <img src="/static/style/icoArrowGrey@2x.abc43ab099390c4587d33290a76fc15e.png" alt="" class="arrow-icon" /></div>
      </div>
      <div class="info-item" @click="resetLoginPassword">
        <div class="info-label">登录密码</div>
        <div class="info-value with-arrow">重置 <img src="/static/style/icoArrowGrey@2x.abc43ab099390c4587d33290a76fc15e.png" alt="" class="arrow-icon" /></div>
      </div>
      <div class="info-item" @click="resetWithdrawPassword">
        <div class="info-label">取款密码</div>
        <div class="info-value with-arrow">{{ $store.state.userInfo.security_password ? '已设置' : '重置' }} <img src="/static/style/icoArrowGrey@2x.abc43ab099390c4587d33290a76fc15e.png" alt="" class="arrow-icon" /></div>
      </div>

    </div>
    
    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <van-button type="default" style="width: 100%; margin-top: 30px; border-radius: 4px; color: #ffffff; border: 1px solid #1989fa00; background-color: #3d40e9" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'userInfo',
  data() {
    return {
    };
  },
  created() {
    // 组件加载时获取用户信息
    this.getUserInfo();
  },
  methods: {
    onchangemd(e) {
      let that = this;
      console.log(e.target.files); //这个就是选中文件信息
      let formdata = new FormData();
      Array.from(e.target.files).map(item => {
        console.log(item);
        formdata.append('file', item); //将每一个文件图片都加进formdata
      });
      that.$parent.showLoading();
      that.$apiFun.post('/api/uploadimg', formdata).then(res => {
        that.$parent.hideLoading();
        that.$parent.getUserInfoShowLoding();
      });
    },
    // 获取用户信息
    getUserInfo() {
      let that = this;
      that.$parent.getUserInfo();
    },
    formatMobile(mobile) {
      if (!mobile) return '未绑定';
      return '+86 ' + mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
    },
    // 格式化日期
    formatDate(date) {
      if (!date) return '2025-08-03 02:17:07';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    goEditRealname() {
      // 跳转到编辑真实姓名页面
      this.$parent.goNav('/edit-realname');
    },
    resetLoginPassword() {
      // 跳转到重置登录密码页面
      this.$parent.goNav('/password?type=1');
    },
    resetWithdrawPassword() {
      // 跳转到重置取款密码页面
      this.$parent.goNav('/password?type=2');
    },

    logout() {
      // 退出登录逻辑
      let that = this;
      that.$dialog
        .confirm({
          title: '提示',
          message: '您确定要退出登录吗?',
        })
        .then(() => {
          that.$parent.showLoading();
          that.$apiFun
            .post('/api/logoff', {})
            .then(res => {
              localStorage.clear();
              sessionStorage.clear();
              that.$store.commit('changUserInfo');
              that.$store.commit('changToken');
              that.$parent.hideLoading();
              that.$parent.showTost(1, '退出成功！');
              that.$router.push('/');
            })
            .catch(() => {
              localStorage.clear();
              sessionStorage.clear();
              that.$store.commit('changUserInfo');
              that.$store.commit('changToken');
              that.$parent.hideLoading();
              that.$parent.showTost(1, '退出成功！');
              that.$router.push('/');
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-section {
  background-color: #e6e6e6;
  
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  
  .avatar-container {
    position: relative;
    transform: translateY(40px);
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid #e0e0e0;
    }
    
    .inputsw {
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      opacity: 0;
      cursor: pointer;
    }
    
    .edit-icon {
    position: absolute;
    right: 0;
    width: 25px;
    height: 25px;
    background-color: #054dc4;
    border-radius: 50%;
    padding: 1px;
    }
  }
}

.info-section {
  background-color: white;
  
  .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 17px 29px;
      
      &.with-border {
        border-bottom: 1px solid #f0f0f0;
      }
    
    .info-label {
      font-size: 16px;
      color: #333;
    }
    
    .info-value {
      font-size: 16px;
      color: #666;
      
      &.with-arrow {
        display: flex;
        align-items: center;
        color: #434343;
        
        .arrow-icon {
          width: 10px;
          height: 10px;
          margin-left: 5px;
        }
      }
    }
  }
}

.logout-section {
  padding: 0 20px;
  margin-top: 20px;
}
</style>
