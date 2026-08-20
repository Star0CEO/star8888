<template>
  <div style="padding: 20px; background: #f5f5f5; min-height: 100vh">
    <h1 style="text-align: center; margin-bottom: 20px">用户信息测试</h1>
    
    <div class="test-section">
      <h2>localStorage 用户信息</h2>
      <pre>{{ localStorageUserInfo }}</pre>
    </div>
    
    <div class="test-section">
      <h2>Store 用户信息</h2>
      <pre>{{ storeUserInfo }}</pre>
    </div>
    
    <div class="test-section">
      <h2>用户ID字段测试</h2>
      <div class="test-item">userid: {{ $store.state.userInfo.userid }}</div>
      <div class="test-item">id: {{ $store.state.userInfo.id }}</div>
      <div class="test-item">user_id: {{ $store.state.userInfo.user_id }}</div>
      <div class="test-item">username: {{ $store.state.userInfo.username }}</div>
      <div class="test-item">name: {{ $store.state.userInfo.name }}</div>
      <div class="test-item">account: {{ $store.state.userInfo.account }}</div>
      <div class="test-item">nickname: {{ $store.state.userInfo.nickname }}</div>
      <div class="test-item">user_name: {{ $store.state.userInfo.user_name }}</div>
    </div>
    
    <div class="test-section">
      <h2>所有字段</h2>
      <div class="all-fields">
        <div v-for="(value, key) in $store.state.userInfo" :key="key" class="field-item">
          {{ key }}: {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test-userinfo',
  computed: {
    localStorageUserInfo() {
      return JSON.stringify(JSON.parse(localStorage.getItem('userInfo') || '{}'), null, 2);
    },
    storeUserInfo() {
      return JSON.stringify(this.$store.state.userInfo, null, 2);
    }
  }
};
</script>

<style scoped>
.test-section {
  background: white;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

pre {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
}

.test-item {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.all-fields {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
}

.field-item {
  padding: 3px 0;
  border-bottom: 1px solid #e0e0e0;
}
</style>
