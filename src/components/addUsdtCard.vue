<template>
  <div style="width: 100%; min-height: 100vh; background: #ffffff">
    <div class="pageTop" style="position: fixed; top: 0; left: 0; right: 0; height: 46px; line-height: 46px; text-align: center; color: white; font-size: 18px; background: url(/img/counter/top-bg.webp) no-repeat #084ccb; z-index: 1000;">
      <img src="/static/image/nav_chevron_back.bb0f0ac706614ab578365b31d203927a.png" alt="" style="width: 16px; height: 16px; position: absolute; left: 15px; top: 50%; transform: translateY(-50%); cursor: pointer;" @click="$router.back()" />
      新增USDT地址
    </div>
    <div style="height: 46px"></div>
    <!-- 头部显示 -->
    <div class="warnTips" style="background-color: #ffe6e6; padding: 10px; border-radius: 4px; margin: 10px; display: flex; align-items: center;">
      <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #ff4d4f; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px; font-weight: bold;">!</div>
      <div style="color: #333; font-size: 14px;">最多可以绑定5个提币地址</div>
    </div>
    <div class="row" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
      <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #52c41a; color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">T</div>
      <div style="color: #333; font-size: 16px;">USDT</div>
    </div>
    <div class="usrse">
      <div class="hgs">
        <div class="nams sc">
          钱包协议
          <div :class="usdtInfo.bank_owner == 'TRC20' ? ' ssa acti' : 'ssa'" @click="changXie('TRC20')">TRC20</div>
          
        </div>
        <div style="border-bottom: 1px solid #f2f2f2"></div>
      </div>
      <div class="hgs">
        <div class="nams">提币地址</div>
        <div style="border-bottom: 1px solid #f2f2f2; display: flex; align-items: center;">
          <div style="flex: 1;">
            <input type="text" v-model="usdtInfo.bank_no" placeholder="请输入地址" class="van-field__control" style="width: 100%; border: none; outline: none; padding: 10px 0; font-size: 14px; margin-left: 10px;" />
          </div>
          <div style="display: flex; align-items: center; gap: 10px; padding-left: 10px;">
            <div style="background-color: #f0f0f0; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;" @click="pasteAddress">粘贴</div>
          </div>
        </div>
      </div>
      <div class="hgs">
        <div class="nams">支付密码</div>
        <div style="border-bottom: 1px solid #f2f2f2">
          <van-cell-group>
            <van-field v-model="usdtInfo.pay_pass" type="password" placeholder="请输入支付密码" />
          </van-cell-group>
        </div>
      </div>
      <van-button type="info" style="margin-top: 20px; width: 100%" @click="bindUsdss">确认添加</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addUsdtCard',
  data() {
    return {
      usdtInfo: { bank_owner: 'TRC20' },
    };
  },
  created() {
    let that = this;
  },
  methods: {
    changXie(name) {
      this.usdtInfo.bank_owner = name;
    },
    bindUsdss() {
      let that = this;
      let usdtInfo = that.usdtInfo;
      usdtInfo.bank = 'USDT';
      if (usdtInfo.bank_no == null || usdtInfo.bank_no == '') {
        that.$parent.showTost(0, '请输入USDT地址');
        return;
      }
      if (!usdtInfo.bank_owner || usdtInfo.bank_owner == null) {
        that.$parent.showTost(0, '请选择钱包协议');
        return;
      }
      if (!usdtInfo.pay_pass) {
        that.$parent.showTost(0, '请输人支付密码');
        return;
      }
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/bindcard', usdtInfo)
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.$parent.showTost(1, res.message);
            that.$router.back();
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    pasteAddress() {
      let that = this;
      // 尝试使用现代的 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.readText()
          .then(text => {
            that.usdtInfo.bank_no = text;
            that.$parent.showTost(1, '粘贴成功！');
          })
          .catch(err => {
            console.error('无法读取剪贴板内容:', err);
            // 失败时尝试使用传统方法
            that.legacyPaste();
          });
      } else {
        // 使用传统方法
        that.legacyPaste();
      }
    },
    legacyPaste() {
      let that = this;
      try {
        // 创建一个临时输入元素
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        
        // 聚焦并执行粘贴命令
        input.focus();
        const success = document.execCommand('paste');
        
        if (success) {
          that.usdtInfo.bank_no = input.value;
          that.$parent.showTost(1, '粘贴成功！');
        } else {
          throw new Error('粘贴命令执行失败');
        }
        
        // 清理临时元素
        document.body.removeChild(input);
      } catch (err) {
        console.error('传统粘贴方法失败:', err);
        that.$parent.showTost(0, '粘贴失败，请手动输入');
      }
    },
  },
  mounted() {
    let that = this;
  },
  updated() {
    let that = this;
  },
};
</script>

<style lang="scss" scoped>
.tipsh {
  width: 95%;
  margin: 6px auto;
  border-radius: 10px;
  background: #f8f8f8;
  box-sizing: border-box;
  padding: 6px;

  .tops {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.4rem;
    font-weight: 700;
    color: #333;
    height: 1rem;
    span {
      font-size: 0.29rem;
      font-weight: 400;
    }
  }
  .tsg {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tsgs {
      height: 0.56rem;
      line-height: 0.56rem;
      color: #a5a9b3;
      font-size: 0.2rem;
      text-align: center;
      padding: 4px 8px;
      flex: 1;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAA0CAYAAADPCHf8AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALCSURBVHgB7d0hcNtAEIXhtWh4y8vDixseXHPz4ibYKW2Kw1UsHt7g8vCWB7u7mYsnss7S3elmam3+b8bjxM6Evaz1tFJWu91uKyLnAixbt1qt7qSyRh+3Aizfpf6xv5TKGk3dX31uBVi+jYak6qehJjx3+ngSYPmuNCTvpZLngOgUsXBU//wG/Adn+thqSM6kgpcJYiG516ffAizfO31cSQXNwfc/BfDhXKfIRmbqBUSniE2QewF8sGZrLTM0kdfsWIQDdnix1pB8lEKDgIQD9k4AP75oSD5IgdgEsZDYeZE/AvhgjVZR/duMvPdDAD+s2fqaW/8eDUg4YKf2hSf2MSur2Wom3mdPC95c5DRbowFhTwtOWbN1kfKDUxPEsKcFjzYpzdZkQNjTglNJzVbKBGFPC15NNltJAQnY04JHo81WckDY04JjR5utnAli2NOCV+vYJbtZAWFPC84Nmq3cCWIsIOxpwavt62YrOyBhirCnBa96l+yWTBD2tODd/pLdlRTShNkv4QQiPOuKJgjwRjzNCcisa32BE/dgFw4WBSRsQiZtQwILZFvs3+2L0gnyWQCfLBzXoa3ND0g4JV/t1o7AibnRcOzP82UFJDRX1e+gDZyIOw3H4+sXcieITY8q9zwFTkyr4RisUSUHJEwPDszh0UO41dVAzgTZCuDPvrGKSQpIqHU5MIc3vcYqZjIg4aMVtS68sVD0GquYlAlirRXTA960h41VzGhAqHXhVLSxipmaIOxbwZvuWGMVczQg7FvBocfc/6U+NkE4MIcn1lh9k0zRgLBvBWessbqeaqxiBgEJB+afBPDjtiQcJjZBmB7wxBqrX1KoFxD2reBMVmMVczhB2LeCF9mNVcw+IOxbwZGixirmOSDsW8GR4sYq5mWCMD3gxU2tcJgmTA9WSuBBG+76WY1NEMIBD9q5jVXMPzyG0oj5jr9QAAAAAElFTkSuQmCC);
      background-size: cover;
    }
  }
}
.usrse {
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  .nams {
    font-size: 0.38rem;
    color: #000;
    vertical-align: middle;
    margin-top: 10px;
    margin-left: 10px;
    
  }
  .imgsa {
    position: relative;
    height: 2rem;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 0.2rem;
    .bisn {
      width: 0.8rem;
      position: absolute;
      bottom: 0.3rem;
      left: 1.4rem;
    }
    img {
      width: 2rem;
      border-radius: 50%;
    }
  }
}
[class*='van-hairline']:after {
  border: none;
}
.sc {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  .ssa {
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    width: 2rem;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.4rem;
    font-weight: 700;
    text-align: center;
    margin-left: 1rem;
  }
  .acti {
    color: #414655 !important;
    border: 1px solid #ebedf0 !important;
  }
}
</style>
