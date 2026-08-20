<template>
  <div style="width: 100%; min-height: 100vh; background: #ffffff">
    <van-nav-bar style="position: fixed; top: 0; left: 0; width: 100%; background: url(/img/counter/top-bg.webp) no-repeat rgb(8, 76, 203);" title="交易记录" left-arrow @click-left="$router.back()" />
    <div style="height: 46px"></div>
    <div style="width: 100%; min-width: 250px; margin: 0 auto; background: #f4f4f4; box-sizing: border-box; padding: 10px; min-height: 100vh">
      <!-- 筛选条件 -->
      <div class="saibox" ref="saibox">
        <div class="sai" @click="toggleDropdown('type')">
          {{ typeName[type] }}
          <span class="arrow-down" :class="{ 'active': dropdownType === 'type' }"></span>
        </div>
        <div class="sai" @click="toggleDropdown('date')">
          {{ dateName[date] }}
          <span class="arrow-down" :class="{ 'active': dropdownType === 'date' }"></span>
        </div> 
      </div>
      
      <!-- 下拉滚动选择框 -->
      <div class="dropdown-container" v-if="dropdownType">
        <div class="dropdown-content" @click.stop>
          <div class="dropdown-grid" v-if="dropdownType === 'type'">
            <div class="dropdown-grid-item" v-for="(item, index) in typeName" :key="index" @click="selectType(index)">
              <div :class="{ 'active': type === index }">{{ item }}</div>
            </div>
          </div>
          <div class="dropdown-grid" v-else-if="dropdownType === 'date'">
            <div class="dropdown-grid-item" v-for="(item, index) in dateName" :key="index" v-if="index > 0" @click="selectDate(index)">
              <div :class="{ 'active': date === index }">{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <van-list style="margin-top: 10px; padding-bottom: 120px" finished-text="没有更多了" offset="300" v-model="loading" :finished="list.length == pageData.total" @load="getData" v-if="list.length > 0">
        <van-cell v-for="(item, index) in list" :key="index">
          <div style="font-size: 0.3rem" v-if="type == 1 || type == 2">订单号：{{ item.out_trade_no }}</div>
          <div style="display: flex; justify-content: space-between;">
            <div style="font-size: 0.3rem">金额 :{{ item.amount }}</div>
            <div style="font-size: 0.3rem">{{ item.pay_way }}</div>
            <div style="font-size: 0.3rem">{{ type == 1 || type == 2 ? stateType12[item.state] : stateType34[item.state] }}</div>
          </div>
          <div style="font-size: 0.3rem">{{ item.created_at }}</div>
        </van-cell>
      </van-list>
      <div v-else style="margin-top: 60px; text-align: center">
        <img src="/static/image/mescroll-empty.png" style="width: 35%" alt="" />
        <van-divider dashed :style="{ color: '#ccc', borderColor: '#ccc', padding: '20px ' }">暂无数据</van-divider>
      </div>
    </div>
    <!-- 平台选择弹出层 -->
    <van-popup v-model="popup" position="bottom" :style="{ height: 'auto', maxHeight: 'calc(100% - 46px)' }">
      <div class="lisg">
        <div class="bs" v-for="(item, index) in dogameLis" :key="index" @click="changDogame(item.name, item.platname)">
          <div :class="api_type == item.platname ? 'lisga act' : 'lisga'"> {{ item.name }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: 'transRecord',
  data() {
    return {
      date: 4,
      list: [],
      pageData: {},
      type: 0,
      page: 1,
      stateType12: ['未定义', '待审核', '审核通过', '审核拒绝'],
      stateType34: ['失败', '成功', '待结算', '未定义'],
      dogameLis: [],
      api_type: '',
      loading: false,
      name: '全平台',
      dateName: ['', '今日', '近7日', '近15日', '近30日'],
      typeName: ['全部', '存款', '取款', '转入', '转出', '转账', '活动', '返佣'],

      popup: false,
      showXuan: 1, //1平台选择 2 日期选择
      dropdownType: null, // 'type' or 'date'
    };
  },
  created() {
    let that = this;
    that.getdogame();
    that.getData();
  },
  methods: {
    changDogame(name, type) {
      let that = this;
      that.name = name;
      that.api_type = type;
      that.popup = false;
      that.page = 1;
      that.getData();
    },
    changtype(name, val) {
      let that = this;
      that[name] = val;
      that.popup = false;
      that.page = 1;
      that.getData();
    },
    showPopup(val) {
      this.popup = true;
      this.showXuan = val;
    },
    toggleDropdown(type) {
      if (this.dropdownType === type) {
        this.dropdownType = null;
      } else {
        this.dropdownType = type;
      }
    },
    selectType(index) {
      this.type = index;
      this.dropdownType = null;
      this.page = 1;
      this.getData();
    },
    selectDate(index) {
      this.date = index;
      this.dropdownType = null;
      this.page = 1;
      this.getData();
    },
    openOrclose() {
      this.show = !this.show;
    },
    changtab() {
      let that = this;
      that.page = 1;
      that.list = [];
      that.pageData = {};
      that.getData();
    },
    getdogame() {
      let that = this;

      that.$apiFun.post('/api/balancelist', {}).then(res => {
        console.log(res);
        if (res.code != 200) {
          that.showTost(res.message);
        }
        if (res.code == 200) {
          that.dogameLis = res.data;
          that.dogameLis.unshift({ name: '全平台', platname: '' });
        }
      });
    },
    changeDate() {
      let that = this;
      that.page = 1;
      that.getData();
    },

    // 获取交易记录
    getData() {
      let that = this;
      let page = that.page;
      if (page > that.pageData.last_page) {
        that.loading = false;

        return;
      }
      that.$parent.showLoading();
      let info = {
        date: that.date,
        type: that.type,
        page: that.page,
        api_type: that.api_type,
      };
      that.$apiFun
        .post('/api/gettransrecord', info)
        .then(res => {
          if (res.code != 200) {
            that.$parent.showTost(0, res.message);
          }
          if (res.code == 200) {
            that.pageData = res.data;
            if (that.page == 1) {
              that.list = res.data.data;
            } else {
              let list = JSON.parse(JSON.stringify(that.list));
              res.data.data.forEach(el => {
                list.push(el);
              });
              that.list = list;
            }
            that.page = page + 1;
          }
          that.loading = false;
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
          that.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.saibox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.1rem;
  box-sizing: border-box;
  padding: 0 12px;
  border-bottom: 1px solid #e0e0e0;
  .sai {
    height: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48%;
    font-size: 0.3rem;
    position: relative;
    color: #333;
    .arrow-down {
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #333;
      margin-left: 5px;
    }
  }
}

.lisg {
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #f5f5f5;
  .bs {
    width: 31%;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .lisga {
      width: 100%;
      height: 1.2rem;
      border: 1px solid #3d72fa;
      border-radius: 4px;
      color: #333;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.3rem;
      text-align: center;
    }
    .lisga.act {
      background: #3d72fa;
      color: #fff;
    }
  }
}

/* 下拉滚动选择框样式 */
.dropdown-container {
  position: relative;
  z-index: 1000;
  margin-top: 2px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  .dropdown-content {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    .dropdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      padding: 10px;
      .dropdown-grid-item {
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        text-align: center;
        &:hover {
          background-color: #f5f5f5;
        }
        div {
          font-size: 0.3rem;
          color: #333;
          &.active {
            color: #3d72fa;
            font-weight: bold;
          }
        }
      }
    }
  }
}

/* 箭头动画 */
.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #333;
  margin-left: 5px;
  transition: transform 0.3s ease;
  &.active {
    transform: rotate(180deg);
  }
}
</style>
