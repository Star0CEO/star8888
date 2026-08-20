<template>
  <div class="main">
    <div class="containerBlock">
      <div class="methodsDeposit">
        <div class="tabs">
          <div>
            <span 
              v-for="tab in tabList" 
              :key="tab"
              :class="{ active: currentTab === tab }"
              @click="selectTab(tab)"
            >{{ tab }}</span>
          </div>
        </div>
        <ul class="eWalletList">
          <li 
            v-for="method in filteredPaymentMethods" 
            :key="method.id"
            :class="{ active: selectedPaymentMethod && selectedPaymentMethod.id === method.id }"
            @click="selectPaymentMethod(method)"
          >
            <span v-if="method.bonus">
              <i>{{ method.bonus }}</i>
            </span>
            <div>
              <img :src="method.img" alt="">
              <span>{{ method.name }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="depositAmountSet">
        <h2>
          <span>存款金额</span>
          <a v-if="selectedPaymentMethod && selectedPaymentMethod.download_name && selectedPaymentMethod.download_url" :href="selectedPaymentMethod.download_url" target="_blank" class="download-btn">{{ selectedPaymentMethod.download_name }}</a>
        </h2>
        <div class="amount-input-wrapper">
          <input 
            type="number" 
            v-model="depositAmount" 
            class="amount-input"
            placeholder="请输入存款金额"
            :min="selectedPaymentMethod ? selectedPaymentMethod.min : 0"
            :max="selectedPaymentMethod ? selectedPaymentMethod.max : 999999"
          >
          <span class="currency">¥</span>
          <div v-if="selectedPaymentMethod && selectedPaymentMethod.remark" class="payment-remark">
            <span>{{ selectedPaymentMethod.remark }}</span>
          </div>
        </div>
        <div class="quick-amount-grid">
          <span @click="selectAmount(100)" class="quick-btn">100</span>
          <span @click="selectAmount(200)" class="quick-btn">200</span>
          <span @click="selectAmount(500)" class="quick-btn">500</span>
          <span @click="selectAmount(1000)" class="quick-btn">1000</span>
          <span @click="selectAmount(2000)" class="quick-btn">2000</span>
          <span @click="selectAmount(5000)" class="quick-btn">5000</span>
          <span @click="selectAmount(10000)" class="quick-btn">1万</span>
          <span @click="selectAmount(30000)" class="quick-btn">3万</span>
          <span @click="selectAmount(50000)" class="quick-btn">5万</span>
          <span @click="selectAmount(100000)" class="quick-btn">10万</span>
        </div>
      </div>
      <div class="btn">
        <button 
          :class="{ disabled: !canSubmit }"
          @click="confirmDeposit"
        >确认存款</button>
      </div>
      <div class="btns">
        <div>
          

          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'recharge',
  data() {
    return {
      pay_way: '',
      bankBox: {},
      payInfo: {},
      amount: null,
      cardLis: [],
      banklist: [],
      meyXi: 'TRC20',
      payWayList: {},
      payTypeList: [],
      payMethods: {},
      currentPayMethods: [],
      selectedMethod: null,
      show: false,
      userbank: [],
      userUSD: [1],
      min_price: 100,
      max_price: 10000,
      currentTab: '热门',
      tabList: ['热门', '钱包', '支付宝', '微信', '其他'],
      // 分类映射表
      categoryMap: {
        '热门': 'hot',
        '钱包': 'wallet',
        '支付宝': 'alipay',
        '微信': 'wechat',
        '其他': 'other'
      },
      allPaymentMethods: [],
      selectedPaymentMethod: null,
      depositAmount: '',
    };
  },
  created() {
    let that = this;
    that.getPayWay();
    that.getBanklist();
    that.getPaymentMethodsFromBackend();
  },
  methods: {
    selectTab(tab) {
      this.currentTab = tab;
      this.getPaymentMethodsFromBackend();
    },
    getPaymentMethodsFromBackend() {
      let that = this;
      that.showLoading();
      
      const category = that.categoryMap[that.currentTab];
      
      that.$apiFun
        .get('/api/getAllPaymentMethods', { category })
        .then(res => {
          if (res.code == 200 && res.data) {
            that.allPaymentMethods = res.data.map((item, index) => {
              let bonus = '';
              if (item.bonus_ratio) {
                const bonusValue = Math.floor(parseFloat(item.bonus_ratio));
                bonus = `送${bonusValue}%`;
              }
              
                return {
                id: item.id,
                type: item.type,
                name: item.name || '支付方式',
                category: that.currentTab,
                img: item.img || '',
                amount: `${item.min_price}-${item.max_price}`,
                bonus: bonus,
                isFee: false,
                min_price: item.min_price,
                max_price: item.max_price,
                data: item.data,
                bonus_ratio: item.bonus_ratio,
                exchange_rate: item.exchange_rate,
                wallet_address: item.wallet_address,
                pay_qrcode: item.pay_qrcode,
                remark: item.data ? item.data.remark : '',
                download_name: item.data ? item.data.download_name : '',
                download_url: item.data ? item.data.download_url : ''
              };
            });
            
            if (that.allPaymentMethods.length > 0) {
              that.selectedPaymentMethod = that.allPaymentMethods[0];
            }
          }
          that.hideLoading();
        })
        .catch(res => {
          that.hideLoading();
        });
    },
    getPayRange() {
      let that = this;
      let type = null;

      if (that.pay_way == 'bank') {
        type = 'bank';
      }
      if (that.pay_way == 'wechat') {
        type = 'wechat';
      }
      if (that.pay_way == 'alipay') {
        type = 'alipay';
      }
      if (that.pay_way == 'usdt') {
        if (that.meyXi == 'ERC20') {
          type = 'usdt-erc20';
        }
        if (that.meyXi == 'TRC20') {
          type = 'usdt-trc20';
        }
      }
      that.showLoading();

      that.$apiFun
        .post('/api/getPayRange', { type })
        .then(res => {
          if (res.code == 200) {
            that.min_price = res.data.min_price;
            that.max_price = res.data.max_price;
          }
          that.hideLoading();
        })
        .catch(res => {
          that.hideLoading();
        });
    },
    changShow() {
      this.show = !this.show;
    },
    onConfirm(value, index) {
      this.bankBox.bank = value.bank_name;
      this.show = false;
    },
    onChange(picker, value, index) {},
    onCancel() {
      this.show = false;
    },
    changXiyi(val) {
      if (this.meyXi == val) {
        return;
      }
      this.meyXi = val;
      this.getPayRange();
    },
    getPayWay() {
      let that = this;
      that.showLoading();

      // 使用旧接口获取支付类型列表
      that.$apiFun
        .get('/api/get_pay_way', {})
        .then(res => {
          if (res.code == 200 && res.data) {
            that.payWayList = res.data;
            // 将旧数据格式转换为新格式
            const typeMap = {
              'card': { type: 'bank', name: '网银转账' },
              'usdt': { type: 'usdt', name: 'USDT' },
              'wechat': { type: 'wechat', name: '微信' },
              'alipay': { type: 'alipay', name: '支付宝' }
            };
            
            that.payTypeList = [];
            for (let key in res.data) {
              if (res.data[key] == 1 && typeMap[key]) {
                that.payTypeList.push({
                  type: typeMap[key].type,
                  name: typeMap[key].name,
                  icon: that.getDefaultIcon(typeMap[key].type)
                });
              }
            }
            
            // 默认选中第一个
            if (that.payTypeList.length > 0) {
              that.pay_way = that.payTypeList[0].type;
              that.getPayMethods(that.pay_way);
            }
          }
          that.hideLoading();
        })
        .catch(res => {
          that.hideLoading();
        });
    },
    getPayMethods(type) {
      let that = this;
      that.showLoading();
      
      // 使用旧接口获取支付方式（银行卡列表）
      if (type === 'bank') {
        that.$apiFun
          .post('/api/getpaybank', {})
          .then(res => {
            if (res.code == 200 && res.data) {
              // 将银行卡数据转换为支付方式格式
              that.currentPayMethods = res.data.map((item, index) => ({
                id: item.id || index,
                name: item.bank_data ? item.bank_data.bank_name : '银行卡',
                icon: that.getDefaultIcon('bank'),
                description: item.bank_owner,
                bank_info: {
                  account_no: item.bank_no,
                  account_name: item.bank_owner,
                  bank_name: item.bank_data ? item.bank_data.bank_name : '',
                  bank_address: item.bank_address
                }
              }));
              // 默认选中第一个支付方式
              if (that.currentPayMethods.length > 0) {
                that.selectedMethod = that.currentPayMethods[0];
              }
            }
            that.getPayRange();
            that.hideLoading();
          })
          .catch(res => {
            that.hideLoading();
          });
      } else {
        // 其他支付方式（USDT、微信、支付宝）
        that.currentPayMethods = [{
          id: 1,
          name: type === 'usdt' ? 'USDT支付' : type === 'wechat' ? '微信支付' : '支付宝支付',
          icon: that.getDefaultIcon(type),
          description: ''
        }];
        that.selectedMethod = that.currentPayMethods[0];
        that.getPayRange();
        that.hideLoading();
      }
    },
    selectMethod(method) {
      this.selectedMethod = method;
    },
    getDefaultIcon(type) {
      const iconMap = {
        'bank': '/static/image/icoOnlineTransfer2@3x.png',
        'card': '/static/image/icoOnlineTransfer2@3x.png',
        'usdt': '/static/image/1595237922936176.png',
        'wechat': '/static/image/QuickWechat.png',
        'wxpay': '/static/image/QuickWechat.png',
        'alipay': '/static/image/icoAlipay2@3x.png',
      };
      return iconMap[type] || '/static/image/icoOnlineTransfer2@3x.png';
    },
    payTest() {
      let that = this;
      let info = {};

      if (!that.selectedMethod) {
        that.showTost(0, '请选择支付方式');
        return;
      }

      // bank 情况下  bank  bank_address  bank_no  bank_owner
      if (that.pay_way == 'bank') {
        info = {
          paytype: that.pay_way,
          method_id: that.selectedMethod.id,
          amount: that.amount * 1,
          bank: that.bankBox.bank,
          bank_address: that.bankBox.bank_address,
          bank_no: that.bankBox.bank_no,
          bank_owner: that.bankBox.bank_owner,
        };
        console.log(info);
        if (!info.bank_owner) {
          that.showTost(0, '请输入存款人姓名');
          return;
        }
        if (!info.bank) {
          that.showTost(0, '请输入银行类型');
          return;
        }
        if (!info.bank_no) {
          that.showTost(0, '请输入银行卡号');
          return;
        }
        if (!info.bank_address) {
          that.showTost(0, '请输入银行开户行地址');
          return;
        }
      } else {
        info = {
          paytype: that.pay_way,
          method_id: that.selectedMethod.id,
          amount: that.amount * 1,
        };
      }
      if (that.pay_way == 'usdt') {
        info.catepay = that.meyXi;
      }

      if (info.amount < that.min_price || info.amount > that.max_price) {
        that.showTost(0, `请输入金额在${that.min_price}-${that.max_price}之间！`);
        return;
      }
      that.showLoading();
      info.paytype = info.paytype == 'wechat' ? 'wxpay' : info.paytype;

      that.$apiFun
        .post('/api/recharge', info)
        .then(res => {
          console.log(res);
          if (res.code != 200) {
            that.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.amount = null;
            if (that.pay_way == 'bank') {
              that.showTost(1, '提交成功，等待后台审核');
              that.bankBox = {};
              that.amount = null;
              that.hideLoading();
              that.$router.push({ path: '/transRecord' });
              return;
            }
            that.bankBox = {};
            that.amount = null;
            that.$router.push({ path: `/payInfo?deposit_no=${res.message}` });
          }
          that.hideLoading();
        })
        .catch(res => {
          that.hideLoading();
        });
    },
    changMey(val) {
      this.amount = val * 1;
    },
    getBanklist() {
      let that = this;
      that.$apiFun
        .post('/api/banklist', {})
        .then(res => {
          if (res.code != 200) {
            that.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.banklist = res.data;
          }
          that.hideLoading();
        })
        .catch(res => {
          that.hideLoading();
        });
    },
    changPayway(val) {
      let that = this;
      if (val == that.pay_way) {
        return;
      }
      that.pay_way = val;
      that.bankBox = {};
      that.payInfo = {};
      that.amount = null;
      that.selectedMethod = null;
      that.getPayMethods(val);
    },
    goNav(url) {
      let that = this;
      that.$parent.goNav(url);
    },
    doCopy(msg) {
      let cInput = document.createElement('input');
      cInput.style.opacity = '0';
      cInput.value = msg;
      document.body.appendChild(cInput);
      cInput.select();
      document.execCommand('copy');
      this.showTost(1, '复制成功！');
    },
    getUserInfo() {
      let that = this;
      that.$parent.getUserInfo();
    },
    showLoading() {
      this.$parent.showLoading();
    },
    hideLoading() {
      this.$parent.hideLoading();
    },
    openKefu() {
      this.$parent.openKefu();
    },
    showTost(type, title) {
      this.$parent.showTost(type, title);
    },
    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;
      if (method.min_price) {
        this.min_price = method.min_price;
      }
      if (method.max_price) {
        this.max_price = method.max_price;
      }
      this.selectedMethod = method;
      
      // 根据支付方式类型设置pay_way
      if (method.type === 'usdt_pay') {
        this.pay_way = 'usdt';
      } else if (method.data && method.data.type) {
        this.pay_way = method.data.type;
      } else {
        this.pay_way = 'wechat';
      }
    },
    confirmDeposit() {
      if (!this.canSubmit) {
        return;
      }
      this.payTest();
    },
    selectAmount(val) {
      this.amount = val;
      this.depositAmount = val;
    },
  },
  computed: {
    filteredPaymentMethods() {
      return this.allPaymentMethods;
    },
    canSubmit() {
      return this.selectedPaymentMethod && this.amount && this.amount >= this.min_price && this.amount <= this.max_price;
    }
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
@import '../../static/css/2d87bbdbffeb4734e5c7.css';

// 主容器样式
.main {
  width: 100%;
  min-height: 100vh;
 
  padding: 80px 15px 15px 15px;
  box-sizing: border-box;
}

.containerBlock {
  background: #fff;
  border-radius: 10px;
  
  box-sizing: border-box;
}

// 标签栏样式
.tabs {
  margin-bottom: 15px;
  
  div {
    display: flex;
    background: #f0f0f0;
    border-radius: 30px;
    padding: 4px;
    
    span {
      flex: 1;
      text-align: center;
      padding: 5px 0;
      border-radius: 30px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: all 0.3s;
      
      &.active {
    background: -webkit-linear-gradient(right, #3e40ea 0%, #5a77ef 100%);
    background: linear-gradient(270deg, #3e40ea, #5a77ef);
    color: #fff;
      }
    }
  }
}

// 支付方式列表样式
.methodsDeposit {
  margin-bottom: 20px;
  
  .eWalletList {
    display: flex;
    flex-wrap: wrap;
    
    li {
width: calc(24.4% - .198rem);
    height: 1.86rem;
    margin-right: .1889rem;
    margin-bottom: 1rem;
    background-color: #fff;
    border-radius: .3rem;
    border: 1px solid #d7d5d5;
    overflow: hidden;
    text-align: center;
    cursor: pointer;
    -webkit-transition: all .3s;
    transition: all .3s;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    align-content: space-around;
    justify-content: center;
      
      &.active {
        border-color: #4a90e2;
       
      }
      
      > span {
    position: absolute;
    top: .1rem;
    top: -0.01rem;
    background: linear-gradient(135deg, #ff6b6b, #fd7f8a);
    color: #fff;
    padding: 0 .1rem;
    font-size: .1rem;
    font-weight: 500;
    z-index: 10;
    line-height: 1.2;
    right: -0.01rem;
    border-radius: 3px;
        
        i {
          font-style: normal;
        }
      }
      
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        width: 100%;
        padding-top: 0.4rem;
        
        img {
width: 2.32rem;
    height: .82rem;
    
    object-fit: contain;
    margin-bottom: .05rem;
        }
        
        span {
          font-size: .33rem;
          font-weight: 500;
          color: #333;
          line-height: 1.3;
          text-align: center;
        }
      }
    }
  }
}

// 存款金额设置样式
.depositAmountSet {
  margin-bottom: 20px;
  
  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      display: block;
    }
    
    .download-btn {
    
      color: #3d72fa;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      text-decoration: none;
      transition: all 0.3s;
      
      &:hover {
        background: #3a80d2;
      }
    }
  }
  
  .amount-input-wrapper {
    position: relative;
    margin-bottom: 15px;
    
    .amount-input {
     border: none;
    border-bottom: 0.01rem solid #dedede;
    width: 100%;
    outline: none;
    box-sizing: border-box;
    padding: 0.2rem 0;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
      
      &:focus {
      

      }
      
      &::placeholder {
        color: #999;
        font-size: 13px;
      }
    }
    
    .currency {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #66666600;
      font-weight: 500;
      z-index: 2;
    }
    
    .payment-remark {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      padding: 2px 6px;

      border-radius: 3px;
      white-space: nowrap;
      z-index: 1;
      
      span {
        font-size: 15px;
        
        line-height: 1.2;
      }
    }
  }
  
  .quick-amount-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    
    .quick-btn {
    background: #f7f7f7;
    border: 1px solid #f5efef;
    border-radius: 6px;
    padding: 8px 0;
    font-size: 13px;
    color: #333;
    text-align: center;
    cursor: pointer;
    -webkit-transition: all .3s;
    transition: all .3s;
      
      &:hover {
        background: #e6f0ff;
        border-color: #4a90e2;
        color: #4a90e2;
      }
      
      &.active {
        background: #4a90e2;
        border-color: #4a90e2;
        color: #fff;
      }
    }
  }
  
  .input {
    margin-bottom: 15px;
  }
  
  p {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    span {
      background: #f0f0f0;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: #e6f0ff;
        border-color: #4a90e2;
      }
      
      i {
        font-style: normal;
        font-size: 12px;
        color: #666;
        margin-left: 4px;
      }
    }
  }
}

// 确认存款按钮样式
.btn {
  margin-bottom: 15px;
  
  button {
    width: 100%;
    padding: 12px 0;
    background: #4a90e2;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    
    &.disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    &:hover:not(.disabled) {
      background: #3a80d2;
    }
  }
}

// 底部按钮样式
.btns {
  text-align: center;
  
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    
    span {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      
      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      
      &:hover {
        color: #4a90e2;
      }
    }
  }
}
</style>
