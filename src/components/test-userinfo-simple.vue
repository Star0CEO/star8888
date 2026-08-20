<template>
  <div style="padding: 20px; background: #f5f5f5; min-height: 100vh">
    <h1 style="text-align: center; margin-bottom: 20px">用户信息测试</h1>
    
    <div class="test-section">
      <h2>所有用户信息字段</h2>
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
  name: 'test-userinfo-simple'
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