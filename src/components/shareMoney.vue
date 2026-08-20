<template>
  <div class="share-money">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="back" @click="$router.back()">
        <i class="van-icon van-icon-arrow-left"></i>
      </div>
      <h1>分享赚钱</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 页面内容 -->
    <div class="content">
      <!-- 推广链接 -->
      <div class="promotion-section">
        <div class="invite-container">
          <div class="invite-header-row">
            <div class="invite-header">
              <h3>邀请链接</h3>
            </div>
            
            <div class="invite-stats">
              <div class="invite-stat-item">
                <span class="stat-label">直接邀请</span>
                <span class="stat-value">{{ stats.directAgents || 0 }} 人</span>
              </div>
            </div>
          </div>
          
          <div class="invite-link-box">
            <input type="text" :value="normalLink" readonly class="invite-link-input">
            <button class="copy-btn" @click="copyLink('normal')">
              复制
            </button>
          </div>
          
          <div class="invite-qr-code">
            <img :src="qrCodeUrl" alt="二维码" class="qr-code-image" ref="qrCodeImage">
            <button class="save-qr-btn" @click="saveQRCode">保存到相册</button>
          </div>
          

        </div>
      </div>
      
      <!-- 阶梯领取奖励 -->
      <div class="tier-rewards-section">
        <div class="section-title">
          <span class="section-icon">阶梯领取奖励</span>
          <span class="section-note">邀请有效下级，每阶可领</span>
        </div>
        
        <div class="tier-rewards-grid">
          <div v-for="reward in tierRewards" :key="reward.tier" class="tier-reward-card" 
               :class="{ 
                 'can-claim': stats.totalAgents >= reward.inviteCount && !reward.claimed,
                 'claimed': reward.claimed
               }">
            <div class="reward-icon">
              <img v-if="reward.claimed" :src="getRewardIcon('claimed')" alt="已领取" class="icon-image">
              <img v-else-if="stats.totalAgents >= reward.inviteCount" :src="getRewardIcon('can-claim')" alt="可领取" class="icon-image">
              <img v-else :src="getRewardIcon('locked')" alt="未满足" class="icon-image">
            </div>
            <div class="invite-count">邀请{{ reward.inviteCount }}人</div>
        
            <div class="reward-amount">
              <span class="currency">¥</span>
              <span class="amount">{{ reward.reward }}</span>
            </div>
            <button class="claim-btn" 
                    @click="claimTierReward(reward.tier)"
                    :disabled="reward.claimed || stats.totalAgents < reward.inviteCount">
              {{ reward.claimed ? '已领取' : (stats.totalAgents >= reward.inviteCount ? '领取' : '未满足') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 邀请规则 -->
      <div class="promotion-section">
        <div class="invite-container">
          <div class="invite-header">
            <h3>邀请规则</h3>
          </div>
          <div class="invite-stats">
            <p class="rule-text">邀请真实有效下级并充值 累计500元以上 可以领取对应奖励.</p>
            <p class="rule-text">例如：邀请有效下级数量 1+累计充值500元 就可以领取 第一阶奖金！</p>
            <p class="rule-text warning">注意！禁止多IP 刷下级套取奖励，本站有防套利系统检测套利将永久封禁分享功能冻结分享奖励！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shareMoney',
  data() {
    return {
      normalLink: 'https://aa451...',
      wechatLink: 'http://7lb-7dwo...',
      rebateData: {
        daily: 0,
        weekly: 0,
        monthly: 0
      },
      currentSlide: 0, // 当前显示的幻灯片索引（从0开始）
      slideInterval: null,
      // 阶梯奖励数据（从API获取）
      tierRewards: [],
      currentInviteCount: 0, // 当前已邀请人数
      // 推广链接相关数据
      directInvites: 0, // 直接邀请人数
      validInvites: 0, // 有效邀请人数
      inviteCode: '', // 邀请码
      qrCodeUrl: '', // 二维码URL
      // 团队统计数据
      stats: {
        totalMembers: 0,
        totalAgents: 0,
        directMembers: 0,
        directAgents: 0
      }
    };
  },
  created() {
    this.getShareInfo();
    this.getTeamStats();
  },
  mounted() {
    this.startCarousel();
  },
  beforeDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  },
  methods: {
    getRewardIcon(type) {
      const icons = {
        'locked': '/static/style/baulock.png',
        'can-claim': '/static/style/bauliberado.png',
        'claimed': '/static/style/bauaberto.png'
      };
      return icons[type] || '';
    },
    getShareInfo() {
      let that = this;
      
      // 先获取阶梯奖励数据
      this.$apiFun.post('/api/tier-rewards', {}).then(res => {
        console.log('API返回数据:', res); // 添加调试日志
        if (res.code === 200 && res.data) {
          that.tierRewards = res.data.rewards || [];
          // 直接使用API返回的数据
          that.currentInviteCount = typeof res.data.currentInviteCount !== 'undefined' ? res.data.currentInviteCount : 0;
          that.directInvites = typeof res.data.directInvites !== 'undefined' ? res.data.directInvites : 0;
          that.validInvites = typeof res.data.validInvites !== 'undefined' ? res.data.validInvites : 0;
        }
      }).catch(err => {
        console.error('获取阶梯奖励错误:', err);
      });
      
      // 尝试从API获取分享信息
      this.$apiFun.get('/api/share/info').then(res => {
        if (res.code === 200) {
          that.normalLink = res.data.normalLink || that.normalLink;
          that.wechatLink = res.data.wechatLink || that.wechatLink;
          that.rebateData = res.data.rebateData || that.rebateData;
          that.inviteCode = res.data.inviteCode || 'PEMW88DUN';
          that.qrCodeUrl = res.data.qrCodeUrl || that.generateQrCodeUrl();
        }
      }).catch(err => {
        console.error('获取分享信息错误:', err);
        // 使用默认值
        const userId = localStorage.getItem('userId') || '1';
        that.normalLink = window.location.origin + '/#/register?pid=' + userId;
        that.wechatLink = window.location.origin + '/#/register?pid=' + userId + '&channel=wechat';
        that.inviteCode = 'PEMW88DUN';
        that.qrCodeUrl = that.generateQrCodeUrl();
      });
    },
    // 生成二维码URL
    generateQrCodeUrl() {
      // 使用草料二维码API生成二维码
      const encodedUrl = encodeURIComponent(this.normalLink);
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`;
    },
    // 保存二维码到相册
    saveQRCode() {
      const img = this.$refs.qrCodeImage;
      if (!img) {
        alert('二维码图片不存在');
        return;
      }
      
      // 创建一个canvas元素
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      // 绘制背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制二维码
      const imgWidth = 280;
      const imgHeight = 280;
      const imgX = (canvas.width - imgWidth) / 2;
      const imgY = (canvas.height - imgHeight) / 2;
      
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight);
        
        // 转换为图片并下载
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '邀请二维码.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          alert('二维码已保存到相册');
        });
      };
      image.onerror = () => {
        alert('保存二维码失败，请重试');
      };
      image.src = img.src;
    },
    // 复制邀请码
    copyInviteCode() {
      const input = document.createElement('input');
      input.value = this.inviteCode || 'PEMW88DUN';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('邀请码已复制');
    },
    // 获取团队统计数据
    getTeamStats() {
      let that = this;
      // 尝试从多个API获取团队统计数据
      const getFromPerformance = () => {
        that.$apiFun.post('/agent/index/getPerformance').then(res => {
          console.log('从 /agent/index/getPerformance 获取团队统计:', res);
          if (res.code === 200 && res.data) {
            that.stats = {
              totalMembers: res.data.totalMembers || 0,
              totalAgents: res.data.totalAgents || 0,
              directMembers: res.data.directMembers || 0,
              directAgents: res.data.directAgents || 0
            };
            // 更新邀请数据
            that.directInvites = res.data.directAgents || 0;
            that.currentInviteCount = res.data.totalAgents || 0;
            that.validInvites = res.data.totalAgents || 0;
          } else {
            // 尝试备用API
            getFromApiTeamPerformance();
          }
        }).catch(err => {
          console.error('获取团队统计错误:', err);
          // 尝试备用API
          getFromApiTeamPerformance();
        });
      };

      const getFromApiTeamPerformance = () => {
        that.$apiFun.get('/api/team/performance').then(res => {
          console.log('从 /api/team/performance 获取团队统计:', res);
          if (res.code === 200) {
            that.stats = {
              totalMembers: res.data.totalMembers || 0,
              totalAgents: res.data.totalAgents || 0,
              directMembers: res.data.directMembers || 0,
              directAgents: res.data.directAgents || 0
            };
            // 更新邀请数据
            that.directInvites = res.data.directAgents || 0;
            that.currentInviteCount = res.data.totalAgents || 0;
            that.validInvites = res.data.totalAgents || 0;
          } else {
            console.error('获取团队统计失败:', res);
            // 尝试从团队成员列表计算统计数据
            getStatsFromMembers();
          }
        }).catch(err => {
          console.error('获取团队统计错误:', err);
          // 尝试从团队成员列表计算统计数据
          getStatsFromMembers();
        });
      };

      const getStatsFromMembers = () => {
        that.$apiFun.post('/agent/index/getChildList').then(res => {
          console.log('从团队成员列表计算统计数据:', res);
          if (res.code === 200 && res.data && res.data.data) {
            const members = res.data.data;
            const directMembers = members.filter(member => member.is_direct === 1).length;
            const totalAgents = members.filter(member => member.is_agent === 1).length;
            const directAgents = members.filter(member => member.is_agent === 1 && member.is_direct === 1).length;
            
            that.stats = {
              totalMembers: members.length,
              totalAgents: totalAgents,
              directMembers: directMembers,
              directAgents: directAgents
            };
            // 更新邀请数据
            that.directInvites = directAgents;
            that.currentInviteCount = totalAgents;
            that.validInvites = totalAgents;
          } else {
            console.error('获取团队成员列表失败:', res);
          }
        }).catch(err => {
          console.error('获取团队成员列表错误:', err);
        });
      };

      // 优先从主要API获取数据
      getFromPerformance();
    },
    // 分享到社交媒体
    shareToSocial(platform) {
      const url = this.normalLink;
      const text = '来一起加入我们吧！';
      
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
          break;
        case 'instagram':
          alert('请手动分享到Instagram');
          break;
        default:
          break;
      }
    },
    copyLink(type) {
      const link = type === 'normal' ? this.normalLink : this.wechatLink;
      const input = document.createElement('input');
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('链接已复制');
    },
    shareImage(type) {
      // 模拟分享图片功能
      alert('分享图片功能已触发');
    },
    startCarousel() {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 3000);
    },
    nextSlide() {
      const slides = document.querySelectorAll('.banner-slide');
      const dots = document.querySelectorAll('.banner-dot');
      
      if (slides.length === 0 || dots.length === 0) return;
      
      // 隐藏当前幻灯片
      slides[this.currentSlide].style.display = 'none';
      dots[this.currentSlide].classList.remove('dot-active');
      
      // 计算下一张幻灯片索引
      this.currentSlide = (this.currentSlide + 1) % slides.length;
      
      // 显示下一张幻灯片
      slides[this.currentSlide].style.display = 'block';
      dots[this.currentSlide].classList.add('dot-active');
    },
    // 领取阶梯奖励
    claimTierReward(tier) {
      console.log('开始领取奖励，tier:', tier);
      const reward = this.tierRewards.find(r => r.tier === tier);
      console.log('找到的奖励:', reward);
      if (!reward) {
        alert('奖励不存在！');
        return;
      }
      
      if (reward.claimed) {
        alert('该奖励已领取过了！');
        return;
      }
      
      if (this.stats.totalAgents < reward.inviteCount) {
        alert(`还需邀请 ${reward.inviteCount - this.stats.totalAgents} 个下级代理才能领取该奖励！`);
        return;
      }
      
      // 调用后端API领取奖励
      console.log('调用后端API领取奖励，tier:', tier);
      this.$apiFun.post('/api/claim-tier-reward', { tier: tier }).then(res => {
        console.log('API返回结果:', res);
        if (res.code === 200) {
          reward.claimed = true;
          alert(`恭喜！成功领取第${tier}阶奖励 ${reward.reward} 元！`);
        } else {
          alert(res.msg || '领取奖励失败，下级未满足要求！');
        }
      }).catch(err => {
        console.error('领取奖励错误:', err);
        alert('领取奖励失败，下级未满足要求！');
      });
    }
  }
};
</script>

<style scoped>
/* 全局样式 */
.share-money {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff, #fff);
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-image: url(/static/css/top_area_bg-w1ddLS2U.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(58, 123, 213, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  
  > * {
    z-index: 2;
  }
}

.back {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  i {
    font-size: 20px;
    color: #fff;
    transition: all 0.3s ease;
  }
  
  &:hover i {
    transform: translateX(-2px);
  }
}

.header h1 {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.header-right {
  width: 40px;
}

/* 内容区域 */
.content {
  padding-top: 60px;
  padding-bottom: 30px;
  max-width: 600px;
  margin: 0 auto;
}

/* 顶部横幅 */
.banner-wrap {
  margin: 20px 15px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(58, 123, 213, 0.2);
  animation: fadeIn 0.8s ease forwards;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(58, 123, 213, 0.3);
  }
}

.banner-carousel {
  position: relative;
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 16px;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  display: none;
  
  &.banner-slide-visible {
    display: block;
  }
}

.banner-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.banner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.2);
  }
  
  &.dot-active {
    background: #fff;
    transform: scale(1.2);
  }
}

/* 返水赚钱 */
.rebate-section {
  background: #fff;
  margin: 20px 15px;
  border-radius: 16px;
  padding: 25px;

  animation: fadeIn 0.8s ease forwards;
  animation-delay: 0.1s;
  transition: all 0.3s ease;
  
  &:hover {

  }
}

.container-wrap-area1 {
  padding-left: 19px;
}

.container-card {
  height: 81.7px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.pt-\[19px\] {
  padding-top: 19px;
}

.pl-\[15px\] {
  padding-left: 15px;
}

.pr-\[23px\] {
  padding-right: 23px;
}

.w-\[45px\] {
  width: 45px;
}

.h-\[45px\] {
  height: 45px;
}

.mr-\[16px\] {
  margin-right: 16px;
}

.flex-col {
  flex-direction: column;
}

.justify-between {
  justify-content: space-between;
}

.text-\[17px\] {
  font-size: 17px;
}

.font-500 {
  font-weight: 500;
}

.leading-\[24px\] {
  line-height: 24px;
}

.text-\[14\.6px\] {
  font-size: 14.6px;
}

.leading-\[21px\] {
  line-height: 21px;
}

.pl-\[42px\] {
  padding-left: 42px;
}

.pb-\[5px\] {
  padding-bottom: 5px;
}

.ml-auto {
  margin-left: auto;
}

.text-\[\#fff\] {
  color: #fff;
}

.font-600 {
  font-weight: 600;
}

.space-x-2 {
  gap: 8px;
}

.mb-0 {
  margin-bottom: 0;
}

.fit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.red-bag {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-left: 42px;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-right: 15px;
  margin-left: auto;
  color: #fff;
  font-size: 14.6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  white-space: nowrap;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
 
    border-radius: 2px;
  }
}

.section-icon {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
  position: relative;
  
  &:before {

  }
}

.section-note {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.rebate-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff, #e3f2fd);
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid #e3f2fd;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    box-shadow: 0 6px 20px rgba(58, 123, 213, 0.15);
    transform: translateY(-3px);
    
    &:before {
      left: 100%;
    }
  }
  
  /* 确保左右两部分并列对齐 */
  .rebate-left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .rebate-right {
    display: flex;
    align-items: center;
  }
}

.rebate-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.rebate-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
}

.rebate-icon.daily {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
}

.rebate-icon.weekly {
  background: linear-gradient(135deg, #4ecdc4, #45b7d1);
}

.rebate-icon.monthly {
  background: linear-gradient(135deg, #45b7d1, #96ceb4);
}

.rebate-info {
  flex: 1;
}

.rebate-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  transition: color 0.3s ease;
  
  .rebate-item:hover & {
    color: #3a7bd5;
  }
}

.rebate-desc {
  font-size: 14px;
  color: #999;
  transition: color 0.3s ease;
  
  .rebate-item:hover & {
    color: #666;
  }
}

.rebate-right {
  display: flex;
  align-items: center;
}

.rebate-amount {
  background: linear-gradient(135deg, #ff9f43, #ee5a24);
  color: #fff;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(255, 159, 67, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(255, 159, 67, 0.4);
  }
}

.rebate-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
  color: #999;
}

.rebate-rule {
  color: #3a7bd5;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    color: #00d2ff;
    text-decoration: underline;
    transform: translateX(2px);
  }
}

/* 阶梯领取奖励 */
.tier-rewards-section {

  
  &:hover {

  }
}

.tier-rewards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.reward-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 12px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.4s ease;
}

.tier-reward-card:hover .icon-image {
  transform: scale(1.15) rotate(-5deg);
}

.tier-reward-card.can-claim .icon-image {
  animation: bounce 1s infinite;
}

.tier-reward-card {
  background: linear-gradient(135deg, #f8f9ff, #e3f2fd);
  border: 1px solid rgba(58, 123, 213, 0.2);
  border-radius: 16px;
  padding: 15px 12px;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    border-color: rgba(58, 123, 213, 0.4);
    
    &:before {
      left: 100%;
    }
  }
  
  &.can-claim {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border: 2px solid #ff9f43;
    animation: pulse 2s infinite;
  }
  
  &.claimed {
    background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
    border: 2px solid #4caf50;
    opacity: 0.9;
  }
}

.tier-number {
  font-size: 16px;
  font-weight: 600;
  color: #2b369a;
  margin-bottom: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.invite-count {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.reward-amount {
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
}

.reward-amount .currency {
  font-size: 16px;
  color: #ff6b6b;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.reward-amount .amount {
  font-size: 28px;
  font-weight: bold;
  color: #ff6b6b;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  .tier-reward-card:hover & {
    transform: scale(1.1);
  }
}

.claim-btn {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  background: linear-gradient(135deg, #e0e0e0, #bdbdbd);
  color: #666;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
    z-index: -1;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .tier-reward-card.can-claim & {
    background: linear-gradient(135deg, #ff9f43, #ee5a24);
    color: #fff;
  }
  
  .tier-reward-card.can-claim &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.05);
  }
  
  .tier-reward-card.claimed & {
    background: linear-gradient(135deg, #4caf50, #45a049);
    color: #fff;
  }
  
  .tier-reward-card.claimed &:hover {
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 159, 67, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 159, 67, 0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 推广链接 */
.promotion-section {
  background: #fff;
  margin: 20px 15px;
  border-radius: 16px;
  padding: 25px;
  animation: fadeIn 0.8s ease forwards;
  animation-delay: 0.2s;
  transition: all 0.3s ease;
  
}

/* 邀请容器 */
.invite-container {
 
  border-radius: 16px;
  padding: 25px;
  color: #000000;
 
  transition: all 0.3s ease;
  
}

.invite-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.invite-header {
  margin-bottom: 0;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
}

.invite-link-box {
  display: flex;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  .invite-link-input {
    flex: 1;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #050505;
    font-size: 14px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    backdrop-filter: blur(10px);
    
    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.4);
    }
  }
  
  .copy-btn {
        padding: 0 20px;
        background: linear-gradient(135deg, #3a7bd5, #3d72fa);
        border: none;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(58, 123, 213, 0.3);
        
        &:hover {
          background: linear-gradient(135deg, #00d2ff, #3a7bd5);
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(58, 123, 213, 0.4);
        }
      }
}

.invite-stats {

    
    .invite-stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stat-label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.8);
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #000000;
    }
    
    .copy-code-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 6px;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
      }
    }
    
    .rule-text {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 15px;
      color: rgba(36, 36, 36, 0.9);
      text-align: left;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
      
      &.warning {
        color: #ff6b6b;
        font-weight: 500;
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 107, 107, 0.2);
        border-radius: 8px;
       
      }
    }
  }

.invite-qr-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  
  .qr-code-image {
    width: 150px;
    height: 150px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: #fff;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    margin-bottom: 15px;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
  }
  
  .save-qr-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #3d72fa, #3d72fa);
    border: none;
    border-radius: 25px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(43, 54, 154, 0.3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #1e297d, #2b369a);
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 6px 16px rgba(43, 54, 154, 0.4);
    }
    
    &:active {
      transform: translateY(-1px) scale(0.98);
      box-shadow: 0 2px 8px rgba(43, 54, 154, 0.3);
    }
  }
}

.invite-actions {
  margin-bottom: 20px;
  
  .save-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #ff9f43, #ee5a24);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 159, 67, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #ee5a24, #ff9f43);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 159, 67, 0.4);
    }
  }
}

.share-buttons {
  h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .social-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .social-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
  
  .social-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .social-btn span {
    font-size: 12px;
    font-weight: 500;
  }
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff, #e3f2fd);
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid #e3f2fd;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    box-shadow: 0 6px 20px rgba(58, 123, 213, 0.15);
    transform: translateY(-3px);
    
    &:before {
      left: 100%;
    }
  }
}

.link-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.link-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
}

.link-icon.normal {
  background: linear-gradient(135deg, #4a6fa5, #3a7bd5);
}

.link-icon.wechat {
  background: linear-gradient(135deg, #07c160, #00b46c);
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  transition: color 0.3s ease;
  
  .link-item:hover & {
    color: #3a7bd5;
  }
}

.link-url {
  font-size: 14px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  
  .link-item:hover & {
    color: #666;
  }
}

.link-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.link-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.link-btn.copy {
  background: #e3f2fd;
  color: #3a7bd5;
  
  &:hover {
    background: #bbdefb;
  }
}

.link-btn.share {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: #fff;
  
  &:hover {
    box-shadow: 0 5px 12px rgba(58, 123, 213, 0.4);
  }
}

.promotion-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
  color: #999;
}

.agent-center {
  color: #3a7bd5;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    color: #00d2ff;
    text-decoration: underline;
    transform: translateX(2px);
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding-top: 50px;
  }
  
  .banner {
    margin: 15px;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
    padding: 25px 20px;
  }
  
  .banner-text {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .banner-title {
    font-size: 24px;
  }
  
  .banner-image {
    width: 100px;
    height: 70px;
  }
  
  .rebate-section,
  .tier-rewards-section,
  .promotion-section {
    margin: 15px;
    padding: 0px;
  }
  
  .tier-rewards-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .tier-reward-card {
    padding: 12px 8px;
  }
  
  .tier-number {
    font-size: 13px;
  }
  
  .invite-count {
    font-size: 11px;
  }
  
  .reward-amount .amount {
    font-size: 20px;
  }
  
  .claim-btn {
    padding: 7px 0;
    font-size: 11px;
  }
  
  .rebate-item,
  .link-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
  }
  
  .rebate-right,
  .link-right {
    align-self: flex-end;
  }
  
  .link-right {
    width: 100%;
    justify-content: flex-end;
  }
  
  .rebate-icon,
  .link-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .rebate-title,
  .link-title {
    font-size: 16px;
  }
  
  .link-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .banner-title {
    font-size: 22px;
  }
  
  .banner-subtitle {
    font-size: 14px;
  }
  
  .tier-rewards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .tier-reward-card {
    padding: 10px 6px;
  }
  
  .tier-number {
    font-size: 12px;
  }
  
  .invite-count {
    
  }
  
  .reward-amount .currency {
    font-size: 12px;
  }
  
  .reward-amount .amount {
    font-size: 18px;
  }
  
  .claim-btn {
    padding: 6px 0;
    font-size: 10px;
  }
  
  .rebate-item,
  .link-item {
    padding: 12px;
  }
  
  .rebate-icon,
  .link-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .rebate-title,
  .link-title {
    font-size: 15px;
  }
  
  .link-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .rebate-footer,
  .promotion-footer {
    font-size: 12px;
  }
  
  .invite-rules {
    padding: 15px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 8px;
    }
  }
}


</style>