<template>
  <div style="width: 100%; min-height: 100vh; background: #ffffff">
    <van-nav-bar style="position: fixed; top: 0; left: 0; width: 100%;background: url(/img/counter/top-bg.webp) no-repeat rgb(8, 76, 203);
    z-index: 1000; color: white;" title="绑定电子钱包" left-arrow @click-left="$router.back()" />
    <div style="height: 46px "></div>
    <div class="usrse">
      <div class="hgs" style="display: flex; align-items: center; justify-content: space-between;">
        <div class="nams">真实姓名</div>
        <div style="flex: 1; margin-left: 10px;">
          <div data-v-a12ec382="" class="van-cell-group van-hairline--top-bottom">
            <div data-v-a12ec382="" class="van-cell van-field">
              <div class="van-cell__value van-cell__value--alone van-field__value">
                <div class="van-field__body"><input type="text" readonly onfocus="this.removeAttribute('readonly');" auto-complete="off" onblur="this.setAttribute('readonly',true);" v-model="cardInfo.bank_owner" placeholder="请输入真实姓名" class="van-field__control" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="font-size: 0.30rem; color: #3d72fa; text-align: center; box-sizing: border-box; padding: 6px">为了您的资金能够迅速到账，请确保填写的姓名与钱包开户姓名一致</div>
    <div class="usrse">
      <div class="hgs" @click="changShow" style="display: flex; align-items: center; justify-content: space-between;">
        <div class="nams">选择钱包</div>
        <div style="flex: 1; margin-left: 10px; border-bottom: 1px solid #f2f2f2">
          <div data-v-a12ec382="" class="van-cell-group van-hairline--top-bottom">
            <div data-v-a12ec382="" class="van-cell van-field">
              <div class="van-cell__value van-cell__value--alone van-field__value">
                <div class="van-field__body"><input type="text" readonly onfocus="this.removeAttribute('readonly');" auto-complete="off" onblur="this.setAttribute('readonly',true);" v-model="cardInfo.bank" placeholder="请选择钱包类型" class="van-field__control" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hgs" style="display: flex; align-items: center; justify-content: space-between;">
        <div class="nams">钱包地址</div>
        <div style="flex: 1; margin-left: 10px; border-bottom: 1px solid #f2f2f2">
          <div data-v-a12ec382="" class="van-cell-group van-hairline--top-bottom">
            <div data-v-a12ec382="" class="van-cell van-field">
              <div class="van-cell__value van-cell__value--alone van-field__value">
                <div class="van-field__body"><input type="text" readonly onfocus="this.removeAttribute('readonly');" auto-complete="off" onblur="this.setAttribute('readonly',true);" v-model="cardInfo.bank_no" placeholder="请输入钱包地址" class="van-field__control" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hgs" style="display: flex; align-items: center; justify-content: space-between;">
        <div class="nams">确认姓名</div>
        <div style="flex: 1; margin-left: 10px; border-bottom: 1px solid #f2f2f2">
          <div data-v-a12ec382="" class="van-cell-group van-hairline--top-bottom">
            <div data-v-a12ec382="" class="van-cell van-field">
              <div class="van-cell__value van-cell__value--alone van-field__value">
                <div class="van-field__body"><input type="text" readonly onfocus="this.removeAttribute('readonly');" auto-complete="off" onblur="this.setAttribute('readonly',true);" v-model="cardInfo.bank_address" placeholder="请输真实姓名" class="van-field__control" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hgs" style="display: flex; align-items: center; justify-content: space-between;">
        <div class="nams">支付密码</div>
        <div style="flex: 1; margin-left: 10px; border-bottom: 1px solid #f2f2f2">
          <van-cell-group>
            <van-field v-model="cardInfo.pay_pass" type="password" placeholder="请输入支付密码" />
          </van-cell-group>
        </div>
      </div>
      <van-button type="info" style="margin-top: 20px; width: 100%" @click="bindCard">确认添加</van-button>
      <div style="height: 60px"></div>
    </div>
    <div v-if="show" style="position: fixed; width: 100%; height: 100%; top: 0; z-index: 999; background: rgba(0, 0, 0, 0.39)">
      <van-picker style="position: absolute; bottom: 0; left: 0; width: 100%" title="钱包类型" show-toolbar :columns="banklist" @confirm="onConfirm" @cancel="onCancel" @change="onChange" value-key="bank_name" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'addBankCard',
  data() {
    return {
      cardInfo: {},
      banklist: [],
      show: false,
    };
  },
  created() {
    let that = this;
    that.getBanklist();
  },
  methods: {
    changShow() {
      this.show = !this.show;
    },
    onConfirm(value, index) {
      this.cardInfo.bank = value.bank_name;
      console.log(this.cardInfo.bank);
      this.show = false;
    },
    onChange(picker, value, index) {},
    onCancel() {
      this.show = false;
    },
    getBanklist() {
      let that = this;
      that.$parent.showLoading();

      that.$apiFun
        .post('/api/banklist', {})
        .then(res => {
          if (res.code != 200) {
            that.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.banklist = res.data;
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    bindCard() {
      let that = this;
      if (!that.cardInfo.bank_owner) {
        that.$parent.showTost(0, '请输入姓名');
        return;
      }
      if (!that.cardInfo.bank) {
        that.$parent.showTost(0, '请输入钱包类型');
        return;
      }
      if (!that.cardInfo.bank_address) {
        that.$parent.showTost(0, '请输入正确信息');
        return;
      }
      if (!that.cardInfo.bank_no) {
        that.$parent.showTost(0, '请输人地址');
        return;
      }
      if (!that.cardInfo.pay_pass) {
        that.$parent.showTost(0, '请输人支付密码');
        return;
      }
      if (that.cardInfo.bank_no.length < 8) {
        that.$parent.showTost(0, '请输人正确的长度');
        return;
      }
      if (that.cardInfo.pay_pass.length < 6 || that.cardInfo.pay_pass.length > 18) {
        that.$parent.showTost(0, '请输人支付密码长度');
        return;
      }
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/bindcard', that.cardInfo)
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.$parent.showTost(1, '绑定成功');
            that.$router.back();
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
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
.usrse {
  background: #fff;
  box-sizing: border-box;
  padding: 6px 20px 0;
  .nams {
    font-size: 0.38rem;
    color: #000;
    vertical-align: middle;
  }
  .hgs {
    margin-top: 10px;
    margin-bottom: 15px;
    padding: 8px 0;
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
</style>
<style>
/* 全局样式，确保导航栏标题和返回箭头为白色 */
.van-nav-bar__title {
  color: white !important;
}
.van-icon-arrow-left {
  color: white !important;
}
</style>
