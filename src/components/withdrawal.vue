<template>
  <div class="sdg sdgg" style="width: 100%; min-height: 100vh; background-color: #ffffff; padding-bottom: 50px">
    <div class="pageTop" style="position: fixed; top: 0; left: 0; right: 0; height: 46px; line-height: 46px; text-align: center; color: white; font-size: 18px; background: url(/img/counter/top-bg.webp) no-repeat #084ccb; z-index: 1000;">
      <img src="/static/image/nav_chevron_back.bb0f0ac706614ab578365b31d203927a.png" alt="" style="width: 16px; height: 16px; position: absolute; left: 15px; top: 50%; transform: translateY(-50%); cursor: pointer;" @click="$router.back()" />
      取款
    </div>
    <div style="height: 46px"></div>

    <div class="filter-wrapper">
      <div class="block-selector flex filter fat-button">
        <div :class="activeName == 1 ? 'select-item active' : 'select-item'" @click="changevT(1)">USDT取款</div>
        <div :class="activeName == 2 ? 'select-item active' : 'select-item'" @click="changevT(2)">数字钱包取款</div>
      </div>
    </div>
    <div style="background: #fff; box-sizing: border-box; padding: 0 20px">
      <div class="mesg">
        <div class="bosgf">
          <div class="top"><img src="/static/image/qianbao123.png" alt="" />中心钱包</div>
          <div class="bots">{{ $store.state.userInfo.balance }}</div>
        </div>
        <div class="bosgf">
          <div class="top"><img src="/static/image/qianbao123.png" alt="" />游戏钱包</div>
          <div class="bots">{{ $store.state.userInfo.gameblance }}</div>
        </div>
        <div class="btns" @click="transall">
          <span style="margin-right: 5px; font-size: 0.32rem;">🔄</span>
          一键回收
        </div>
      </div>


    </div>
    <div class="usrse" v-if="activeName == 1">
      <div class="hgs" v-if="usdssLis.length == 0">
        <div class="unboundItem" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #ffffff; border-radius: 4px;">
          <p style="margin: 0; color: #666;">请添加提币地址</p>
          <span @click="$parent.goNav('/addUsdtCard')" style="background: #1890ff; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;">去添加</span>
        </div>
      </div>
      <div class="hgs" v-else @click="changShow">

        <div class="cardhgs" v-if="bankId">
          <img src="/static/image/1595237922936176.png" alt="" />
          <div>{{ hgInfo.bank_owner }} <span>****</span><span>****</span><span>****</span>{{ hgInfo.bank_no.substr(-4) }}</div>
        </div>
        <div v-else class="toggleItem" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px; height: 30px; line-height: 30px;">
          <div style="font-size: 0.38rem; color: #000; vertical-align: middle;">选择地址</div>
          <span>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAoBAMAAAAWIydmAAAAJFBMVEVHcEwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiqRB8DyAAAAC3RSTlMAjMKjeOETB9ZENFt/MGcAAACKSURBVCjPjdGrDYAwFIXhyyPU4jE4BAaPwTMCmgVImALNCAwARZCc5cC0PbwCVb35+yVNKxIU4layur0HVHaoAZcmALEZooZTC1LRwKm/qvmP6lipm4p/KBlelTqStikHNrMPjmOZGUpgoWdBSkGzSJ9EyCEh4V3C8hZOovgUfCsZSYjKNf22b4Xs9iZbSCDxh4AAAAAASUVORK5CYII=" style="width: 12px; height: 12px;">
          </span>
        </div>
      </div>
      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
      <div class="hgs">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="nams">取款金额</div>
          <div style="color: #1890ff; font-size: 14px;"> 仅限TRC20 </div>
        </div>
        <div>
          <van-cell-group>
            <van-field v-model="amount" type="text" placeholder="请输入取款金额">
              <template #button> <van-button size="mini" @click="bigMey($store.state.userInfo.balance)" type="info">最大金额</van-button> </template>
            </van-field>
          </van-cell-group>
          <div style="text-align: right; font-size: 12px; color: #999; margin-top: 5px;">限额 10-500,000 元</div>
        </div>
        <div style="margin-top: 15px;">
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div class="quick-amount" @click="selectAmount(100)">100</div>
            <div class="quick-amount" @click="selectAmount(300)">300</div>
            <div class="quick-amount" @click="selectAmount(500)">500</div>
            <div class="quick-amount" @click="selectAmount(1000)">1000</div>
            <div class="quick-amount" @click="selectAmount(3000)">3000</div>
            <div class="quick-amount" @click="selectAmount(5000)">5000</div>
            <div class="quick-amount" @click="selectAmount(8000)">8000</div>
            <div class="quick-amount" @click="selectAmount(10000)">10000</div>
            <div class="quick-amount" @click="selectAmount(15000)">15000</div>
            <div class="quick-amount" @click="selectAmount(20000)">20000</div>
            <div class="quick-amount" @click="selectAmount(30000)">30000</div>
            <div class="quick-amount" @click="selectAmount(50000)">50000</div>
          </div>
        </div>
      </div>

      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
      <div class="hgs">
        <div class="nams">支付密码</div>
        <div>
          <van-cell-group>
            <van-field v-model="password" type="password"  autocomplete="new-password"  placeholder="请输入支付密码"> </van-field>
          </van-cell-group>
        </div>
      </div>

      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
      <div class="hgs" v-if="chanmeyXi">
        <div class="nams">每笔手续费</div>
        <div>{{ chanmeyXi == 'ERC20' ? $store.state.userInfo.withdrawcashfee : $store.state.userInfo.withdrawfeeusdttrc }} USDT</div>
      </div>

      <div v-if="chanmeyXi" style="height: 0.2rem; background: #f8f8f8; width: 100wh"></div>
      <div class="hgs">
        <div class="nams">折合USDT</div>
        <div style="padding-top: 5px;margin-left: 10px">
          <span style="color: rgb(240, 80, 80)">≈ </span>{{ amount ? Math.floor((amount / $store.state.userInfo.withdrawusdtrate) * 100) / 100 : '0.00' }} SDT &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;参考汇率：{{ $store.state.userInfo.withdrawusdtrate }} 实时变化
        </div>
        <div class="lasthg" style="padding: 5px 0;margin-left: 10px">实际到账：{{ amount ? Math.floor((amount / $store.state.userInfo.withdrawusdtrate) * 100) / 100 - (chanmeyXi == 'ERC20' ? $store.state.userInfo.withdrawcashfee * 1 : $store.state.userInfo.withdrawfeeusdttrc * 1) : '0.00' }}USDT</div>
      </div>

      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
    </div>
    <div class="usrse" v-if="activeName == 2">
      <div class="hgs" v-if="usercardLis.length == 0">
        <div class="unboundItem" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #ffffff; border-radius: 4px;">
          <p style="margin: 0; color: #666;">请添加数字钱包</p>
          <span @click="$parent.goNav('/addBankCard')" style="background: #1890ff; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;">去添加</span>
        </div>
      </div>
      <div class="hgs" v-else @click="changShow">
        <div class="nams"></div>
        <div class="cardhgs" v-if="bankId">
          <img :src="hgInfo.ico" alt="" />
          <div>{{ hgInfo.bank }} <span>{{ hgInfo.bank_owner }}</span><span>****</span>{{ hgInfo.bank_no.substr(-4) }}</div>
        </div>
        <div v-else class="toggleItem" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px; height: 30px; line-height: 30px;">
          <div style="font-size: 0.38rem; color: #000; vertical-align: middle;">数字钱包</div>
          <span>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAoBAMAAAAWIydmAAAAJFBMVEVHcEwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiqRB8DyAAAAC3RSTlMAjMKjeOETB9ZENFt/MGcAAACKSURBVCjPjdGrDYAwFIXhyyPU4jE4BAaPwTMCmgVImALNCAwARZCc5cC0PbwCVb35+yVNKxIU4layur0HVHaoAZcmALEZooZTC1LRwKm/qvmP6lipm4p/KBlelTqStikHNrMPjmOZGUpgoWdBSkGzSJ9EyCEh4V3C8hZOovgUfCsZSYjKNf22b4Xs9iZbSCDxh4AAAAAASUVORK5CYII=" style="width: 12px; height: 12px;">
          </span>
        </div>

      </div>
      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
      <div class="hgs">
        <div class="nams">取款金额</div>
        <div>
          <van-cell-group>
            <van-field v-model="amount" type="text" placeholder="请输入取款金额">
              <template #button> <van-button @click="bigMey($store.state.userInfo.balance)" size="mini" type="info">最大金额</van-button> </template>
            </van-field>
          </van-cell-group>
          <div style="text-align: right; font-size: 12px; color: #999; margin-top: 5px;">限额 100-500,000 元</div>
        </div>
        <div style="margin-top: 15px;">
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <div class="quick-amount" @click="selectAmount(100)">100</div>
            <div class="quick-amount" @click="selectAmount(300)">300</div>
            <div class="quick-amount" @click="selectAmount(500)">500</div>
            <div class="quick-amount" @click="selectAmount(1000)">1000</div>
            <div class="quick-amount" @click="selectAmount(3000)">3000</div>
            <div class="quick-amount" @click="selectAmount(5000)">5000</div>
            <div class="quick-amount" @click="selectAmount(8000)">8000</div>
            <div class="quick-amount" @click="selectAmount(10000)">10000</div>
            <div class="quick-amount" @click="selectAmount(15000)">15000</div>
            <div class="quick-amount" @click="selectAmount(20000)">20000</div>
            <div class="quick-amount" @click="selectAmount(30000)">30000</div>
            <div class="quick-amount" @click="selectAmount(50000)">50000</div>
          </div>
        </div>
      </div>

      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
      <div class="hgs">
        <div class="nams">支付密码</div>
        <div>
          <van-cell-group>
            <van-field v-model="password"  autocomplete="new-password"  type="password" placeholder="请输入支付密码"> </van-field>
          </van-cell-group>
        </div>
      </div>

      <div style="height: 0.2rem; background: #ffffff; width: 100wh"></div>
    </div>
    <div style="margin: 0 auto; width: 86%" v-if="activeName == 2">
      <van-button type="info" style="margin-top: 20px; width: 100%" @click="withdraw">立即取款</van-button>
      <div class="textcns" style="text-align: center; color: #999; padding: 10px 0">取款遇到问题？联系 <span @click="$parent.openKefu" style="color: #cf866b; display: inline-block; margin: 0 6px">人工客服</span> 解决</div>
    </div>
    <div style="margin: 0 auto; width: 86%" v-if="activeName == 1">
      <van-button type="info" style="margin-top: 20px; width: 100%" @click="withdraw1">立即取款</van-button>
      <div class="textcns" style="text-align: center; color: #999; padding: 10px 0">取款遇到问题？联系 <span @click="$parent.openKefu" style="color: #cf866b; display: inline-block; margin: 0 6px">人工客服</span> 解决</div>
    </div>

    <!-- 弹出层  -->
    <van-popup v-model="show" position="bottom" v-if="activeName == 2 && show" :style="{ height: '70%', background: '#f8f8f8' }" class="card">
      <div class="poptit">请选择银行卡</div>

      <div class="lis" v-for="(item, index) in usercardLis" :key="index" @click="changApiType(item)">
        <img class="lefs" :src="item.ico" alt="" />
        <div class="cest">
          <div class="type">{{ item.bank }}</div>
          <div class="type">{{ item.bank_owner }}</div>
          <!-- <div class="type">{{ item.bank_address }}</div> -->
          <div class="num">
            <span>****</span><span>****</span><span>****</span><span>{{ item.bank_no.substr(-4) }}</span>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="show" position="bottom" v-if="activeName == 1 && show" :style="{ height: '70%', background: '#f8f8f8' }" class="card">
      <div class="poptit">请选择USDT地址</div>
      <div class="lis" v-for="(item, index) in usdssLis" :key="index" @click="changApiType(item)">
        <img class="lefs" src="/static/image/1595237922936176.png" alt="" />
        <div class="cest">
          <div class="type">{{ item.bank }}-{{ item.bank_owner }}</div>
          <div class="num">
            <span>****</span><span>****</span><span>****</span><span>{{ item.bank_no.substr(-4) }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: 'withdrawal',
  data() {
    return {
      usercardLis: [],
      usdssLis: [],
      amount: null,
      bankId: null,
      chanmeyXi: null,
      password: null,
      activeName: 1,
      daoTime: null,
      balancelist: [],
      showLis: 3,
      show: false,
      hgInfo: {},
      betAmount: null,

    };
  },
  computed: {
    navBarStyle() {
      return {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        zIndex: '222',
        background: 'url(/static/css/top_area_bg-w1ddLS2U.png) no-repeat center center',
        backgroundSize: 'cover',
        backgroundColor: 'transparent',
        color: 'white',
        '--van-nav-bar-title-color': 'white',
        '--van-nav-bar-arrow-color': 'white',
        '--van-nav-bar-background': 'transparent'
      };
    }
  },
  created() {
    let that = this;
    that.getBetAmount();

    that.getUsercard();
    that.getUsdssList();
    that.getbalancelist();
    that.daoTime = setInterval(() => {
      that.getbalancelistNoLoding();
    }, 3500);
  },
  methods: {
        getBetAmount() {
      let that = this;
      that.$apiFun
        .post('/api/getBetAmount', {})
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.betAmount = res.data.bet_amount;
          }
        })
        .catch(res => {});
    },
    bigMey(val) {
      this.amount = val * 1;
    },
    changShow() {
      this.show = !this.show;
    },
    changShowLis(val) {
      this.showLis = val;
    },
    getbalancelist() {
      let that = this;
      that.$parent.showLoading();

      that.$apiFun
        .post('/api/balancelist', {})
        .then(res => {
          if (res.code !== 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code === 200) {
            that.balancelist = res.data;
            let balancelist = res.data;
            that.balancelist = balancelist;
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    getbalancelistNoLoding() {
      let that = this;

      that.$apiFun
        .post('/api/balancelist', {})
        .then(res => {
          if (res.code !== 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code === 200) {
            that.balancelist = res.data;
            let balancelist = res.data;
            that.balancelist = balancelist;
          }
        })
        .catch(res => {});
    },

    transall() {
      let that = this;
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/transall', {})
        .then(res => {
          that.$parent.showTost(1, res.message);
          that.getbalancelist();
          // Refresh user money by calling parent method
          that.$parent.getUserInfo();
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    changApiType(e) {
      let that = this;
      that.hgInfo = e;
      console.log(e);
      // Handle chanmeyXi based on activeName
      if (that.activeName == 1) {
        let chanmeyXi = null;
        that.usdssLis.forEach(el => {
          if (el.id == e.id) {
            chanmeyXi = el.bank_owner;
            return;
          }
        });
        that.chanmeyXi = chanmeyXi;
      } else {
        that.chanmeyXi = null;
      }
      that.bankId = e.id;
      that.password = null;
      that.amount = null;
      that.show = false;
    },
    selectAmount(amount) {
      this.amount = amount;
    },
    changevT(type) {
      let that = this;
      console.log(type);
      // If no type provided, just reset form
      if (!type) {
        that.hgInfo = {};
        that.amount = null;
        this.bankId = null;
        this.chanmeyXi = null;
        this.password = null;
        return;
      }
      if (type == that.activeName) {
        return;
      }
      that.hgInfo = {};
      that.activeName = type;
      that.amount = null;
      this.bankId = null;
      this.chanmeyXi = null;
      this.password = null;
    },
    withdraw() {
      let that = this;
      // amount	是	float	金额
      // bank	是	int	提现银行卡id
      let bank = that.bankId;
      let amount = that.amount;
      let password = that.password;
      if (!bank) {
        that.$parent.showTost(0, '请选择您要提现到的银行卡');
        return;
      }
      if (amount < 100) {
        that.$parent.showTost(0, '单笔取款不能低于100元');
        return;
      }

      if (!password) {
        that.$parent.showTost(0, '请输入您的支付密码');
        return;
      }
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/withdraw', { amount, bank, password })
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.$parent.showTost(1, '提交成功，等待后台审核');

            that.changevT();
            setTimeout(() => {
              that.$router.push({ path: '/transRecord' });
            }, 1500);
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    withdraw1() {
      let that = this;
      let bank = that.bankId;
      let amount = that.amount;
      let password = that.password;
      if (!bank) {
        that.$parent.showTost(0, '请选择USDT地址');
        return;
      }
      if (amount < 100) {
        that.$parent.showTost(0, '单笔取款不能低于100元');
        return;
      }

      if (!password) {
        that.$parent.showTost(0, '请输入您的支付密码');
        return;
      }
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/withdraw', { amount, bank, password })
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.$parent.showTost(1, '提交成功，等待后台审核');
            that.changevT();
            setTimeout(() => {
              that.$router.push({ path: '/transRecord' });
            }, 1500);
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },

    getUsercard() {
      let that = this;
      this.$parent.showLoading();

      that.$apiFun.post('/api/getcard', { type: 1 }).then(res => {
        if (res.code == 200) {
          that.usercardLis = res.data;
        }
        this.$parent.hideLoading();
      });
    },
    getUsdssList() {
      let that = this;
      this.$parent.showLoading();

      that.$apiFun.post('/api/getcard', { type: 2 }).then(res => {
        if (res.code == 200) {
          that.usdssLis = res.data;
        }
        this.$parent.hideLoading();
      });
    },
  },
  mounted() {
    let that = this;
  },
  updated() {
    let that = this;
  },
  beforeDestroy() {
    let that = this;
    if (that.daoTime) {
      clearInterval(that.daoTime);
    }
    that.daoTime = null;
  },
};
</script>

<style lang="scss" scoped>
.filter-wrapper {

  background: #ffffff;
  .block-selector {
    display: flex;
    background: white;
    border-radius: 8px;
    padding: 10px;
    .select-item {
      flex: 1;
      text-align: center;
      padding: 8px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      &.active {
        background: #1890ff;
        color: white;
      }
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}

.quick-amount {
  flex: 1;
  min-width: calc(25% - 8px);
  max-width: calc(25% - 8px);
  padding: 10px 0;
  text-align: center;
  background: #f8f8f8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #333;
  &:hover {
    background: #e8f4ff;
    color: #1890ff;
  }
}

.qibao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.4rem;
  box-sizing: border-box;
  border-bottom: 1px solid #f8f8f8;
  .fes {
    font-size: 0.4rem;
    font-weight: 700;
  }
  .imgs {
    flex: 1;
    img {
      width: 0.4rem;
      margin-left: 0.1rem;
      display: flex;
      align-items: center;
    }
  }
  .btns {
    color: #697b8c;
    font-size: 0.28rem;
  }
}

.mesg {
  display: flex;
  align-items: center;
  height: 2rem;
  border-bottom: 1px solid #f8f8f8;

  .bosgf {
    flex: 1;
    text-align: center;
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.4rem;
      img {
        width: 0.4rem;
        margin-right: 0.1rem;
      }
    }
    .bots {
      margin-top: 0.1rem;
      font-size: 0.5rem;
      color: #158bf4;
      span {
        font-size: 0.23rem;
      }
    }
  }
  .btns {
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    color: white;
    font-size: 0.28rem;
    white-space: nowrap;
    margin-left: 10px;
    padding: 0.2rem 0.4rem;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    &:hover {
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.5);
      transform: translateY(-1px);
    }
  }
}

.gameBox {
  display: flex;
  flex-wrap: wrap;
  .lis {
    width: 25%;
    text-align: center;
    box-sizing: border-box;
    padding-top: 0.4rem;
    .name {
      font-size: 0.23rem;
      color: #383b43;
      line-height: 1;
      overflow: hidden; //超出隐藏
      text-overflow: ellipsis; //显示省略号
      white-space: nowrap; //强制不换行
    }
    .num {
      font-size: 0.23rem;
      color: #cbced8;
      margin-top: 0.2rem;
    }
    img {
      width: 0.32rem;
    }
  }
}

.usrse {
  background: #fff;
  box-sizing: border-box;
  padding-top: 5px;
  .hgs {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
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

.card {
  .lis {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 10px 25px;
    min-height: 80px;
    border-radius: 10px;
    position: relative;
    border-radius: 0.16rem;
    background-color: #f8f9ff;
    -webkit-box-shadow: 0 0.04rem 0.2rem rgb(199 212 255 / 42%);
    box-shadow: 0 0.04rem 0.2rem rgb(199 212 255 / 42%);
    border: 0.02rem solid #fff;
    .lefs {
      width: 1.5rem;
    }
    .cest {
      flex: 1;
      margin: 0 20px;
      .type {
        font-size: 0.4rem;
        font-weight: 700;
        color: #98a8c5;
        margin-top: 6px;
      }
      .num {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 6px;
        color: #98a8c5;
        span {
          font-size: 0.6rem;
        }
      }
    }
    .rigss {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 0.6rem;
    }
  }
}

.poptit {
  height: 1.4rem;
  font-size: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 22;
}

.cardhgs {
  display: flex;
  align-items: center;
  color: #cf866b;
  font-size: 0.23rem;
  height: 1.2rem;
  img {
    width: 0.8rem;
    margin: 0 1rem;
  }
  span {
    display: inline-block;
    margin: 0 4px;
    font-size: 0.23rem;
  }
}

/* Navigation bar styles */
:deep(.van-nav-bar) {
  background: url(/static/css/top_area_bg-w1ddLS2U.png) no-repeat center center;
  background-size: cover;
  background-color: transparent !important;
}

:deep(.van-nav-bar__title) {
  color: white !important;
  font-weight: bold !important;
  font-size: 18px !important;
}

:deep(.van-icon-arrow-left) {
  color: white !important;
  font-size: 18px !important;
}

:deep(.van-nav-bar__content) {
  background: url(/static/css/top_area_bg-w1ddLS2U.png) no-repeat center center;
  background-size: cover;
  background-color: transparent !important;
}

:deep(.van-nav-bar__left) {
  color: white !important;
}

/* Ensure all navigation bar text is white */
:deep(.van-nav-bar *),
:deep(.van-nav-bar__title),
:deep(.van-nav-bar__left),
:deep(.van-icon),
:deep(.van-ellipsis),
:deep(.van-nav-bar .van-icon),
:deep(.van-nav-bar__arrow) {
  color: white !important;
  fill: white !important;
  font-weight: bold !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

/* Additional specific rule for the title */
:deep(.van-nav-bar__title.van-ellipsis) {
  color: white !important;
  font-weight: bold !important;
  font-size: 18px !important;
  line-height: 46px !important;
  text-align: center !important;
  margin: 0 auto !important;
  width: auto !important;
  max-width: 60% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* Override global styles from App.vue */
:deep(.van-nav-bar) {
  background: url(/static/css/top_area_bg-w1ddLS2U.png) no-repeat center center !important;
  background-size: cover !important;
  background-color: transparent !important;
}

:deep(.van-nav-bar__content) {
  background: url(/static/css/top_area_bg-w1ddLS2U.png) no-repeat center center !important;
  background-size: cover !important;
  background-color: transparent !important;
}

:deep(.van-nav-bar .van-icon) {
  color: white !important;
  font-size: 18px !important;
}

:deep(.van-nav-bar__arrow) {
  color: white !important;
  font-size: 18px !important;
}

/* Ultra specific rule to override any other styles */
.van-nav-bar__title.van-ellipsis {
  color: #ffffff !important;
  font-weight: bold !important;
  font-size: 18px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

/* Even more specific rule with parent selectors */
.sdg.sdgg .van-nav-bar__title.van-ellipsis {
  color: #ffffff !important;
  font-weight: bold !important;
  font-size: 18px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}
</style>
