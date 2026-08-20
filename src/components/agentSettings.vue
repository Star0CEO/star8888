<template>
  <div data-v-f531b812="" class="app app-ti_green">
    <div data-v-8a75a126="" data-v-f531b812="" class="header">
      <div data-v-8a75a126="" class="header__top-wrapper">
        <div data-v-8a75a126="" class="van-nav-bar van-nav-bar--fixed fixed-top nav-header">
          <div class="van-nav-bar__content">
            <div class="van-nav-bar__left" @click="$router.back()">
              <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i>
            </div>
            <div class="van-nav-bar__title van-ellipsis">代理设置</div>
          </div>
        </div>
      </div>
    </div>
    <div class="agent-settings">
      <!-- 代理设置表单 -->
      <div class="settings-form">
        <van-form @submit="submitForm">
          <van-field label="代理链接前缀" v-model="settings.agent_uri_pre" placeholder="请输入代理链接前缀" />
          <van-field label="PC代理链接" v-model="settings.agent_pc_uri" placeholder="请输入PC代理链接" />
          <van-field label="WAP代理链接" v-model="settings.agent_wap_uri" placeholder="请输入WAP代理链接" />
          <div class="form-tips">
            <p>提示：</p>
            <p>1. 代理链接前缀将用于生成默认的代理推广链接</p>
            <p>2. 如不填写PC/WAP代理链接，将使用系统默认链接</p>
          </div>
          <van-button type="primary" native-type="submit" block>保存设置</van-button>
        </van-form>
      </div>

      <!-- 代理规则 -->
      <div class="agent-rules">
        <div class="rules-header">
          <h3>代理规则</h3>
        </div>
        <div class="rules-content">
          <div class="rule-item">
            <div class="rule-title">佣金规则</div>
            <div class="rule-desc">
              <p>1. 代理佣金基于下级会员的游戏盈利计算</p>
              <p>2. 佣金比例根据代理等级和游戏类型而定</p>
              <p>3. 佣金将在每月固定日期结算</p>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-title">返点规则</div>
            <div class="rule-desc">
              <p>1. 返点基于会员的有效下注金额计算</p>
              <p>2. 不同游戏类型有不同的返点比例</p>
              <p>3. 返点实时结算到代理账户</p>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-title">推广规则</div>
            <div class="rule-desc">
              <p>1. 代理可通过推广链接发展下级会员</p>
              <p>2. 所有通过推广链接注册的会员自动成为代理的下级</p>
              <p>3. 代理可查看团队业绩和佣金明细</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'agentSettings',
  data() {
    return {
      settings: {
        agent_uri_pre: '',
        agent_pc_uri: '',
        agent_wap_uri: ''
      }
    };
  },
  created() {
    this.getAgentSettings();
  },
  methods: {
    getAgentSettings() {
      let that = this;
      // 尝试从多个API获取代理设置
      const getFromInviteList = () => {
        that.$apiFun.get('/api/team/invite/list').then(res => {
          console.log('从 /api/team/invite/list 获取代理设置:', res);
          if (res.code === 200) {
            that.settings = res.data;
          } else {
            console.error('获取代理设置失败:', res);
            // 使用默认值
            that.settings = {
              agent_uri_pre: '',
              agent_pc_uri: '',
              agent_wap_uri: ''
            };
          }
        }).catch(err => {
          console.error('获取代理设置错误:', err);
          // 使用默认值
          that.settings = {
            agent_uri_pre: '',
            agent_pc_uri: '',
            agent_wap_uri: ''
          };
        });
      };

      // 优先从主要API获取数据
      getFromInviteList();
    },
    submitForm() {
      let that = this;
      that.$apiFun.post('/api/team/invite/update', that.settings).then(res => {
        console.log('保存代理设置:', res);
        if (res.code === 200) {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(1, '设置保存成功');
          } else {
            alert('设置保存成功');
          }
        } else {
          if (that.$parent && that.$parent.showTost) {
            that.$parent.showTost(0, res.message || '保存失败');
          } else {
            alert(res.message || '保存失败');
          }
        }
      }).catch(err => {
        console.error('保存代理设置错误:', err);
        if (that.$parent && that.$parent.showTost) {
          that.$parent.showTost(0, '保存失败，请重试');
        } else {
          alert('保存失败，请重试');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.agent-settings {
  margin-top: 60px;
  padding: 15px;
  
  .settings-form {
    background: #fff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .form-tips {
      margin: 15px 0;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 5px;
      
      p {
        margin: 5px 0;
        font-size: 12px;
        color: #666;
        
        &:first-child {
          font-weight: bold;
          color: #333;
        }
      }
    }
    
    .van-button {
      margin-top: 10px;
      background: #084ccb;
      color: #fff;
    }
  }
  
  .agent-rules {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .rules-header {
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }
    }
    
    .rules-content {
      padding: 15px;
      
      .rule-item {
        margin-bottom: 15px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .rule-title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        
        .rule-desc {
          p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
        }
      }
    }
  }
}
</style>