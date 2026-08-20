<template>
  <div class="slider-captcha">
    <div class="botion_box">
      <div class="botion_header">
        <div class="botion_title">
          <div class="botion_text_tips">请拖动滑块完成拼图</div>
        </div>
      </div>
      
      <div class="botion_container">
        <div class="botion_window">
          <!-- 背景图 -->
          <div class="botion_bg" :style="{ backgroundImage: `url(${bgImage})` }"></div>
          
          <!-- 缺口阴影（目标位置） -->
          <div 
            class="botion_gap" 
            :style="{ 
              left: targetX + 'px', 
              top: sliceTop + 'px'
            }"
          ></div>
          
          <!-- 拼图块 -->
          <div 
            class="botion_slice" 
            :style="{ 
              left: currentX + 'px', 
              top: sliceTop + 'px',
              backgroundImage: `url(${sliceImage})`,
              backgroundPosition: `-${targetX}px -${sliceTop}px`
            }"
          ></div>
          
          <!-- 结果提示 -->
          <div class="botion_result_tips" :class="{ 'success': isSuccess, 'fail': isFail }" v-if="showResult">
            {{ isSuccess ? '验证成功' : '验证失败，请重试' }}
          </div>
        </div>
        
        <!-- 滑块轨道 -->
        <div class="botion_slider">
          <div class="botion_track">
            <div class="botion_process" :style="{ width: currentX + 'px' }"></div>
            <div class="botion_track_tips" v-if="currentX === 0">向右滑动完成验证</div>
            <div 
              class="botion_btn"
              :style="{ left: currentX + 'px' }"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              <div class="botion_arrow" :class="{ 'success': isSuccess, 'fail': isFail }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div class="botion_footer">
        <div class="botion_footer_left">
          <button class="botion_close" @click="$emit('close')" title="关闭验证">
            <span>×</span>
          </button>
          <button class="botion_refresh" @click="refreshCaptcha" title="刷新验证">
            <span>⟳</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderCaptcha',
  data() {
    return {
      bgImage: '',
      sliceImage: '',
      targetX: 0,
      currentX: 0,
      sliceTop: 0,
      isDragging: false,
      startX: 0,
      isSuccess: false,
      isFail: false,
      showResult: false,
      maxWidth: 0,
      tolerance: 5,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.updateMaxWidth();
      this.refreshCaptcha();
    });
    window.addEventListener('resize', this.updateMaxWidth);
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('touchend', this.endDrag);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateMaxWidth);
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.endDrag);
  },
  methods: {
    updateMaxWidth() {
      const container = this.$el.querySelector('.botion_window');
      if (container) {
        this.maxWidth = container.offsetWidth - 50;
      }
    },
    refreshCaptcha() {
      this.isSuccess = false;
      this.isFail = false;
      this.showResult = false;
      this.currentX = 0;
      
      // 生成随机背景图（使用占位图，实际项目中应该从后端获取）
      const randomId = Math.random().toString(36).substring(7);
      this.bgImage = `https://picsum.photos/300/160?random=${randomId}`;
      this.sliceImage = this.bgImage;
      
      // 随机位置
      if (this.maxWidth > 0) {
        this.targetX = Math.floor(Math.random() * (this.maxWidth - 80)) + 40;
        this.sliceTop = Math.floor(Math.random() * 80) + 20;
      } else {
        this.targetX = 100;
        this.sliceTop = 50;
      }
      
      this.$emit('refresh');
    },
    startDrag(e) {
      if (this.isSuccess) return;
      this.isDragging = true;
      this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      e.preventDefault();
    },
    onDrag(e) {
      if (!this.isDragging) return;
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      let diff = clientX - this.startX;
      this.currentX = Math.max(0, Math.min(diff, this.maxWidth));
    },
    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      
      if (Math.abs(this.currentX - this.targetX) <= this.tolerance) {
        this.isSuccess = true;
        this.showResult = true;
        this.$emit('success');
      } else {
        this.isFail = true;
        this.showResult = true;
        this.$emit('fail');
        setTimeout(() => {
          this.refreshCaptcha();
        }, 1500);
      }
    },
    reset() {
      this.refreshCaptcha();
    }
  }
};
</script>

<style scoped>
.slider-captcha {
  width: 100%;
  user-select: none;
}

.botion_box {
  display: block;
  background: linear-gradient(0deg,#fff,#ebf1f9 45%,#e7eef8);
  border-radius: 28px;
  overflow: hidden;
}

.botion_header {

  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.botion_title {
  font-size: 16px;
  color: #33333300;
}

.botion_text_tips {
  font-weight: 500;
}

.botion_container {
  padding: 12px;
}

.botion_window {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  background: #f5f5f5;
}

.botion_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.botion_slice {
  position: absolute;
  width: 50px;
  height: 50px;
  background-size: 300px 160px;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  cursor: grab;
  z-index: 10;
}

.botion_slice:active {
  cursor: grabbing;
}

.botion_gap {
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.4);
  border: 2px dashed rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 5px rgba(255, 255, 255, 0.3);
  z-index: 5;
}

.botion_gap::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 50%;
}

.botion_result_tips {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  z-index: 20;
}

.botion_result_tips.success {
  background: rgba(82, 196, 26, 0.9);
}

.botion_result_tips.fail {
  background: rgba(255, 77, 79, 0.9);
}

.botion_slider {
  margin-top: 15px;
}

.botion_track {
  position: relative;
  width: 100%;
  height: 40px;
  background: #e8e8e8;
  border-radius: 20px;
  overflow: hidden;
}

.botion_process {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #5b8ff9 0%, #5ad8a6 100%);
  border-radius: 20px;
  transition: width 0.1s;
}

.botion_track_tips {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  pointer-events: none;
}

.botion_btn {
  position: absolute;
  top: 0;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.1s;
}

.botion_btn:hover {
  transform: scale(1.05);
}

.botion_arrow {
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 12px solid #5b8ff9;
}

.botion_arrow.success {
  border-left-color: #52c41a;
}

.botion_arrow.fail {
  border-left-color: #ff4d4f;
}

.botion_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #f0f0f0;
}

.botion_footer_left {
  display: flex;
  gap: 15px;
}

.botion_close,
.botion_refresh {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
  span {
    font-size: 24px !important;
  }
}

.botion_close:hover,
.botion_refresh:hover {
  background: #f5f5f5;
  color: #666;
}

.botion_refresh:hover {
  transform: rotate(180deg);
}
</style>
