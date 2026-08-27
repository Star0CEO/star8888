<template>
  <div class="acts" style="background: #ffffff" v-if="activitytypeList.length > 0">
    <div class="pageTop">优惠活动</div>
    <van-tabs v-model="actType" class="topsa" @click="activitylist">
      <van-tab title="全部优惠" :name="''"> </van-tab>
      <van-tab v-for="(item, index) in activitytypeList" :name="item.id" :title="item.name" :key="index"> </van-tab>
    </van-tabs>
    <div class="consg">
      <div class="lis" v-for="(item, index) in activitylistList" :key="index" @click="$parent.goNav(`/activityInfo?id=${item.id}`)">
        <div class="activity-wrapper">
          <img :src="item.banner" alt="" />
          <img :src="getActivityTypeIcon(item)" alt="" class="activity-type-icon" />
        </div>
      </div>
      <van-divider dashed :style="{ color: '#ccc', borderColor: '#ccc', padding: '20px 16px' }">END</van-divider>
    </div>
  </div>
</template>
<script>
export default {
  name: 'activity',
  data() {
    return {
      activitytypeList: [],
      actType: '',
      activitylistList: [],
    };
  },
  created() {
    let that = this;
    that.activitytype();
    that.activitylist();
  },
  methods: {
    activitytype() {
      let that = this;
      that.$apiFun.post('/api/activitytype', {}).then(res => {
        console.log(res);
        if (res.code !== 200) {
          that.$parent.showTost(0, res.message);
        }
        if (res.code === 200) {
          that.activitytypeList = res.data;
        }
      });
    },
    activitylist() {
      let that = this;
      let info = that.actType == '' ? {} : { type: that.actType };
      that.$parent.showLoading();
      that.$apiFun.post('/api/activitylist', info).then(res => {
        console.log(res);
        console.log('活动列表数据:', res.data);
        if (res.code !== 200) {
          that.$parent.showTost(0, res.message);
        }
        if (res.code === 200) {
          that.activitylistList = res.data.data;
          console.log('活动列表项示例:', that.activitylistList[0]);
        }
        that.$parent.hideLoading();
      });
    },
    changActType(val) {
      let that = this;
      if (val == that.actType) {
        return;
      }
      that.actType = val;
      that.activitylist();
    },
    getActivityTypeIcon(item) {
      let that = this;
      console.log('========== 活动类型图标查找 ==========');
      console.log('当前活动项:', item);
      console.log('活动项所有字段:', Object.keys(item));
      console.log('活动类型列表:', that.activitytypeList);
      
      // 打印活动类型列表的详细信息
      that.activitytypeList.forEach((type, index) => {
        console.log(`活动类型 ${index}:`, type);
        console.log(`活动类型 ${index} 字段:`, Object.keys(type));
      });
      
      let imgSrc = '';
      
      // 先在活动项本身查找图标字段（扩展更多可能的字段）
      const activityIconFields = [
        'activity_type_icon', 'type_icon', 'icon', 'image', 'img', 
        'type_image', 'type_img', 'activity_icon', 'activity_image', 'activity_img',
        'logo', 'thumb', 'thumbnail', 'pic', 'picture', 'banner_type',
        'type_banner', 'icon_url', 'img_url', 'image_url'
      ];
      
      for (const field of activityIconFields) {
        if (item[field] && item[field].trim() !== '') {
          imgSrc = item[field].trim();
          console.log('在活动项中找到图标字段:', field, '值:', imgSrc);
          break;
        }
      }
      
      // 再通过 type 字段在活动类型列表中查找
      if (!imgSrc && item.type !== undefined) {
        console.log('通过 type 查找活动类型, type:', item.type);
        
        // 尝试多种匹配方式
        let type = that.activitytypeList.find(t => 
          t.id == item.type || 
          t.name == item.type ||
          t.type == item.type
        );
        
        if (type) {
          console.log('找到的活动类型:', type);
          console.log('活动类型所有字段:', Object.keys(type));
          
          const typeIconFields = [
            'icon', 'image', 'img', 'logo', 'thumb', 'thumbnail', 
            'pic', 'picture', 'banner', 'icon_url', 'img_url', 'image_url'
          ];
          
          for (const field of typeIconFields) {
            if (type[field] && type[field].trim() !== '') {
              imgSrc = type[field].trim();
              console.log('在活动类型中找到图标字段:', field, '值:', imgSrc);
              break;
            }
          }
        } else {
          console.log('未找到匹配的活动类型');
        }
      }
      
      // 处理图片路径，添加 baseURL 和 uploads 前缀
      if (imgSrc) {
        let baseURL = sessionStorage.getItem('baseURL') || 'http://127.0.0.13';
        console.log('baseURL:', baseURL);
        console.log('原始图片地址:', imgSrc);
        
        let result = '';
        if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
          result = imgSrc;
        } else if (imgSrc.startsWith('/uploads/')) {
          result = baseURL + imgSrc;
        } else if (imgSrc.startsWith('/')) {
          // 检查是否已经包含 uploads，如果没有则添加
          if (!imgSrc.includes('/uploads/')) {
            result = baseURL + '/uploads' + imgSrc;
          } else {
            result = baseURL + imgSrc;
          }
        } else {
          // 相对路径，添加 uploads 前缀
          result = baseURL + '/uploads/' + imgSrc;
        }
        console.log('最终图片地址:', result);
        console.log('=====================================');
        return result;
      }
      
      console.log('未找到任何图标');
      console.log('=====================================');
      return '';
    },
  },
  mounted() {
    let that = this;
  },
  updated() {
    let that = this;
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
// @import '../../../static/css/dashboard-activity.b2be1233.css';
.topsa {
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  z-index: 200;
  background: #fff;
  padding: 10px 1px;
  box-sizing: border-box;
}
.topsa ::v-deep .van-tabs__nav {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
}
.topsa ::v-deep .van-tab {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 auto;
  flex: 1 0 auto;
  padding: 0 42px !important;
  background: #fff !important;
  border-width: 0.02415rem;
  border-style: solid;
  border-radius: 0.19324rem;
  border-color: transparent;
  margin-right: 12px;
}
.topsa ::v-deep .van-tab--active {
  background: #cf886b;
  color: #fff;
  border-color: #cf886b;
}
.topsa ::v-deep .van-tab__text {
  font-size: 15px;
}
.topsa ::v-deep .van-tabs__line {
  display: none;
}
.consg {
  padding-top: 110px;
  padding-bottom: 120px;
  .lis {
    margin-top: 20px;
    border-radius: 10px;
    -webkit-box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
    padding-bottom: 0;
    .activity-wrapper {
      position: relative;
      img {
        width: 100%;
        min-height: auto;
        height: auto;
        display: block;
      }
      .activity-type-icon {
        position: absolute;
        top: 10px;
        left: -8px;
        width: 70px;
        height: 50px;
        z-index: 10;
      }
    }
    .tite_sf {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      padding: 0 20px;
    }
  }
}
</style>
