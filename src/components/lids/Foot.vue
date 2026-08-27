<template>
  <nav class="flex items-center bg-white nav" style="border-top: 1px solid rgb(233 233 233 / 48%);box-sizing: border-box; z-index: 200">
    <div class="flex flex-col flex-1 items-center justify-center" :class="{ active: type === 0 }" @click="onChange(0)">
      <div class="relative icon">
        <div class="icon w-[36px]" :class="{ active: type === 0 }">
          <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g :filter="type === 0 ? 'url(#home-shadow)' : 'none'">
              <path d="M33.333 15.104v-.018l-.001-.027c0-.022-.005-.044-.008-.065l.006-.04v-.003a.58.58 0 0 0 .003-.06v-.033l-.001-.026a.718.718 0 0 0-.097-.318.757.757 0 0 0-.232-.246L19.764 1.926l-.01-.013a.812.812 0 0 0-.555-.246h-.064a.812.812 0 0 0-.556.246l-.01.013-13.31 12.402-.015.014a.411.411 0 0 0-.054.054.732.732 0 0 0-.048.06l-.02.027-.021.033c-.007.01-.011.02-.016.03a.831.831 0 0 0-.018.034l-.014.032a.981.981 0 0 0-.024.069l-.01.034a.527.527 0 0 0-.007.036l-.006.037-.004.034c0 .012 0 .028-.002.04v.034c0 .014 0 .028.002.041l.003.033.004.025c.002.009-.002.014-.003.02 0 .012-.003.024-.004.035 0 .012 0 .028-.002.04v.065c0 .014 0 .028.002.042l.003.032.004.025c.002.009-.002.014-.003.02l-.004.036c0 .012 0 .027-.002.04v.033c0 .014 0 .028.002.042l.003.032.007.039c.002.012.003.023.006.034l.01.036.01.034a.532.532 0 0 0 .014.035l.014.033.016.032.018.033.02.03.021.033.022.028.027.032.01.012.014.013a.786.786 0 0 0 .086.075l.032.023.03.019.034.02a.42.42 0 0 0 .032.016c.01.005.023.012.034.016l.034.014a.772.772 0 0 0 .034.012l.039.012.034.008.04.008a.503.503 0 0 0 .036.005l.038.003a.75.75 0 0 0 .042.002h2.835v11.06c0 .197.041.391.12.573.079.181.195.346.34.484.146.139.32.249.51.323.19.075.394.114.6.113h4.481c.415 0 .813-.158 1.106-.438.293-.28.458-.659.458-1.054v-2.786c0-.198.083-.388.23-.528a.803.803 0 0 1 .553-.218h4.348c.208 0 .407.078.554.218.147.14.23.33.23.528v2.786c0 .395.164.775.457 1.054.294.28.691.438 1.106.438h4.482c.415 0 .813-.157 1.107-.437.294-.28.458-.66.458-1.055V16.11H32c.105.015.65.009.753-.017a.796.796 0 0 0 .281-.135.755.755 0 0 0 .203-.23.72.72 0 0 0 .091-.286v-.003a.58.58 0 0 0 .004-.06v-.033c0-.005 0-.018-.002-.026 0-.023-.004-.045-.007-.066l.005-.04v-.003a.576.576 0 0 0 .004-.06v-.031l.001-.017z" :fill="type === 0 ? 'url(#home-active-bg)' : '#999'"/>
            </g>
            <defs>
              <linearGradient id="home-active-bg" x1="33" y1="25.5" x2="7.561" y2="24.654" gradientUnits="userSpaceOnUse">
                <stop stop-color="#005CE0"/>
                <stop offset="1" stop-color="#005CE0"/>
              </linearGradient>
              <filter id="home-shadow" x="-1.667" y="-1.666" width="41.667" height="40.333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3.333"/>
                <feGaussianBlur stdDeviation="3.333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix values="0 0 0 0 0.31 0 0 0 0 0.69 0 0 0 0 1 0 0 0 0.3 0"/>
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div class="text-[11px] font-medium relative text" :class="{ active: type === 0 }"> 首页 </div>
    </div>
    <div class="flex flex-col flex-1 items-center justify-center" :class="{ active: type === 1 }" @click="onChange(1)">
      <div class="relative icon">
        <div class="icon w-[36px]" :class="{ active: type === 1 }">
          <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g :filter="type === 1 ? 'url(#activity-shadow)' : 'none'">
              <path d="M31.271 12v14.333a2.638 2.638 0 0 1-.79 1.886 2.702 2.702 0 0 1-1.91.781h-9.383V12h12.083zm-13.297 0v17H8.59a2.73 2.73 0 0 1-1.91-.781 2.665 2.665 0 0 1-.79-1.886V12h12.083zM11.28 2.214l.09.063 4.288 3.257c.306-.471.726-.858 1.223-1.126A3.406 3.406 0 0 1 18.5 4c1.193 0 2.241.612 2.842 1.534l4.289-3.257a1.348 1.348 0 0 1 1.921.299c.063.086.115.18.157.28l1.591 3.81h1.35c.358 0 .701.141.955.391.253.25.395.59.395.943v1.333c0 .354-.142.693-.395.943-.254.25-.597.39-.955.39H6.35c-.358 0-.701-.14-.955-.39A1.325 1.325 0 0 1 5 9.333V8c0-.353.142-.693.395-.943.254-.25.597-.39.955-.39H7.7l1.591-3.81c.041-.1.094-.194.157-.281.428-.6 1.23-.75 1.832-.362z" :fill="type === 1 ? 'url(#activity-active-bg)' : '#999'"/>
            </g>
            <defs>
              <linearGradient id="activity-active-bg" x1="31.682" y1="25.833" x2="7.438" y2="25.064" gradientUnits="userSpaceOnUse">
                <stop stop-color="#005CE0"/>
                <stop offset="0.808" stop-color="#005CE0"/>
              </linearGradient>
              <filter id="activity-shadow" x="-1.667" y="-1.333" width="40.333" height="40.333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3.333"/>
                <feGaussianBlur stdDeviation="3.333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix values="0 0 0 0 0.31 0 0 0 0 0.69 0 0 0 0 1 0 0 0 0.3 0"/>
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div class="text-[11px] font-medium relative text" :class="{ active: type === 1 }"> 活动 </div>
    </div>
    <div class="flex flex-col flex-1 items-center justify-center" :class="{ active: type === 2 }" @click="onChange(2)">
      <div class="relative icon">
        <span class="label px-[4px] absolute top-[-5px] right-[-17px] text-white z-1 h-[28px] leading-[28px] font-medium text-[20px] scale-[0.5] origin-right-top" style="background: linear-gradient(90deg, #ff6b6b, #ee5a6f); border-radius: 4px;"> 送3% </span>
        <div class="icon w-[36px]" :class="{ active: type === 2 }">
          <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g :filter="type === 2 ? 'url(#deposit-shadow)' : 'none'" clip-path="url(#deposit-clip)">
              <path d="M16.024 9.53a17.579 17.579 0 0 1 4.25-.093c3.203.323 6.077 1.925 7.884 4.386 1.38 1.883 2.265 4.153 2.628 6.747.357 2.607-.185 7.726-4.79 8.44l-.05.01H11.21c-.076 0-1.886-.018-3.336-1.586-1.356-1.469-1.923-3.751-1.684-6.779 0-.138.118-4.215 3.173-7.65 1.662-1.867 4.027-3.102 6.66-3.475zm-.487 4.556a.793.793 0 0 0-1.12 1.12l2.915 2.916h-2.57a.792.792 0 1 0 0 1.586h3.007v1.599h-3.007a.792.792 0 1 0 0 1.586h3.007v1.522a.793.793 0 1 0 1.586 0v-1.522h2.933a.792.792 0 1 0 0-1.586v.003h-2.93v-1.6h3.076a.792.792 0 1 0 0-1.585h-2.752l2.782-2.792a.793.793 0 0 0 0-1.12.793.793 0 0 0-1.12 0l-2.84 2.84-2.967-2.967zm15.25-9.343c.375 0 .68.306.68.682v1.423h1.423a.682.682 0 0 1 0 1.362h-1.422v1.423a.682.682 0 0 1-1.363 0V8.21h-1.423a.682.682 0 0 1 0-1.362h1.424V5.425c0-.376.305-.682.68-.682zM18.424 1.937c1.517 0 2.483.636 2.943 1.042 1.023-.306 1.832-.224 2.77.272.72.409 1.19 1.066 1.37 1.914.149.687.068 1.423-.229 2.122l-.55 1.296a1.116 1.116 0 0 1-1.34.632l-.178-.05a15.658 15.658 0 0 0-4.792-.713c-2.352.01-4.171.536-4.946.76a1.112 1.112 0 0 1-1.354-.672l-.539-1.393a3.455 3.455 0 0 1-.24-1.552c.137-1.456 1.127-2.201 1.17-2.232 1.065-.887 2.512-.638 3.16-.46 1.209-.967 2.684-.969 2.755-.966z" :fill="type === 2 ? 'url(#deposit-active-bg)' : '#999'"/>
            </g>
            <defs>
              <linearGradient id="deposit-active-bg" x1="33.248" y1="25.843" x2="8.617" y2="25.052" gradientUnits="userSpaceOnUse">
                <stop stop-color="#005CE0"/>
                <stop offset="0.808" stop-color="#005CE0"/>
              </linearGradient>
              <clipPath id="deposit-clip">
                <path fill="#fff" d="M0 0h37v37H0z"/>
              </clipPath>
              <filter id="deposit-shadow" x="-.528" y="-1.396" width="40.765" height="40.416" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3.333"/>
                <feGaussianBlur stdDeviation="3.333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix values="0 0 0 0 0.31 0 0 0 0 0.69 0 0 0 0 1 0 0 0 0.3 0"/>
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div class="text-[11px] font-medium relative text" :class="{ active: type === 2 }"> 存款 </div>
    </div>
    <div class="flex flex-col flex-1 items-center justify-center" :class="{ active: type === 3 }" @click="onChange(3)">
      <div class="relative icon">
        <div class="icon w-[36px]" :class="{ active: type === 3 }">
          <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g :filter="type === 3 ? 'url(#money-shadow)' : 'none'" clip-path="url(#money-clip)">
              <path d="M18.5 2C11.043 2 5 8.043 5 15.5S11.043 29 18.5 29 32 22.957 32 15.5 25.957 2 18.5 2zm0 2.217c3.256 0 6.289 1.387 8.416 3.768a.675.675 0 0 1-1.004.9A9.911 9.911 0 0 0 18.5 5.566a.676.676 0 0 1-.675-.675c0-.371.303-.675.675-.675zM15.33 25.65a.675.675 0 0 1-.872.387 11.287 11.287 0 0 1-1.176-20.542.675.675 0 0 1 .625 1.194 9.94 9.94 0 0 0 1.036 18.088.675.675 0 0 1 .388.873zm2.382-7.235H14.46a.772.772 0 1 1 0-1.546h3.252v-2.315H14.46a.772.772 0 1 1 0-1.545h2.856L15.1 10.791c-.301-.3-.301-.791 0-1.092.3-.3.79-.3 1.091 0l2.318 2.318 2.32-2.318c.3-.3.791-.3 1.092 0 .3.3.3.791 0 1.092l-2.218 2.217h2.861a.772.772 0 1 1 0 1.545h-3.306v2.318h3.306a.772.772 0 1 1 0 1.545h-3.306l.002 2.508a.772.772 0 1 1-1.545 0l-.002-2.51zm.788 8.368a.676.676 0 0 1-.675-.674c0-.372.303-.675.675-.675 5.484 0 9.933-4.446 9.933-9.933a9.93 9.93 0 0 0-.623-3.467.676.676 0 0 1 .396-.868.675.675 0 0 1 .867.396c.467 1.25.707 2.579.707 3.939.002 6.23-5.05 11.282-11.28 11.282z" :fill="type === 3 ? 'url(#money-active-bg)' : '#999'"/>
            </g>
            <defs>
              <linearGradient id="money-active-bg" x1="31.682" y1="25.833" x2="7.438" y2="25.064" gradientUnits="userSpaceOnUse">
                <stop stop-color="#005CE0"/>
                <stop offset="0.808" stop-color="#005CE0"/>
              </linearGradient>
              <clipPath id="money-clip">
                <path fill="#fff" d="M0 0h37v37H0z"/>
              </clipPath>
              <filter id="money-shadow" x="-1.667" y="-1.333" width="40.333" height="40.333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3.333"/>
                <feGaussianBlur stdDeviation="3.333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix values="0 0 0 0 0.31 0 0 0 0 0.69 0 0 0 0 1 0 0 0 0.3 0"/>
                <feBlend in="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div class="text-[11px] font-medium relative text" :class="{ active: type === 3 }"> 赚钱 </div>
    </div>
    <div class="flex flex-col flex-1 items-center justify-center" :class="{ active: type === 4 }" @click="onChange(4)">
      <div class="relative icon">
        <div class="icon w-[36px]" :class="{ active: type === 4 }">
          <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g :filter="type === 4 ? 'url(#mine-shadow)' : 'none'">
              <path d="m29.984 20.26-.1-.13-.241-.156a6.24 6.24 0 0 0-.938-.487 20.017 20.017 0 0 0-9.741-2.645 19.97 19.97 0 0 0-9.529 2.402 7.451 7.451 0 0 0-1.278.687l-.07.1a3.455 3.455 0 0 0-1.04 1.216 3.48 3.48 0 0 0-.381 1.558v3.432c0 .379.15.743.416 1.01.266.269.627.42 1.004.42h21.827c.376 0 .737-.151 1.004-.42.266-.267.416-.631.416-1.01v-3.432a4.084 4.084 0 0 0-1.35-2.546zm-11.02-4.419a6.28 6.28 0 0 0 2.441-.476 6.314 6.314 0 0 0 2.07-1.388 6.366 6.366 0 0 0 1.378-2.084c.318-.78.478-1.615.473-2.458a6.458 6.458 0 0 0-1.872-4.55A6.368 6.368 0 0 0 18.935 3c-1.694 0-3.32.678-4.518 1.885a6.458 6.458 0 0 0-1.872 4.55 6.4 6.4 0 0 0 1.87 4.563 6.282 6.282 0 0 0 4.548 1.843z" :fill="type === 4 ? 'url(#mine-active-bg)' : '#999'"/>
            </g>
            <defs>
              <linearGradient id="mine-active-bg" x1="31.043" y1="24.774" x2="8.894" y2="24.071" gradientUnits="userSpaceOnUse">
                <stop stop-color="#005CE0"/>
                <stop offset="0.808" stop-color="#005CE0"/>
              </linearGradient>
              <filter id="mine-shadow" x="-.001" y="-.333" width="37.999" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3.333"/>
                <feGaussianBlur stdDeviation="3.333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix values="0 0 0 0 0.31 0 0 0 0 0.69 0 0 0 0 1 0 0 0 0.3 0"/>
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div class="text-[11px] font-medium relative text" :class="{ active: type === 4 }"> 我的 </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'Foot',
  data() {
    return { type: 0 };
  },
  methods: {
    onChange(type) {
      let that = this;
      that.type = type;
      if (type == 0) {
        that.$router.push(`/`);
      }
      if (type == 1) {
        that.$router.push(`/activity`);
      }
      if (type == 2) {
        that.$router.push(`/recharge`);
      }
      if (type == 3) {
        that.$router.push(`/shareMoney`);
      }
      if (type == 4) {
        that.$router.push(`/mine`);
      }
    },
    changPath() {
      let that = this;
      let path = this.$route.path;
      if (path == '/') {
        that.type = 0;
      }
      if (path == '/activity') {
        that.type = 1;
      }
      if (path == '/recharge') {
        that.type = 2;
      }
      if (path == '/makeMoney') {
        that.type = 3;
      }
      if (path == '/mine') {
        that.type = 4;
      }
    },
  },
  mounted() {},
  watch: {
    $route: {
      immediate: true,
      handler() {
        let that = this;
        that.changPath();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.flex-1 {
  flex: 1;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.bg-white {
  background-color: #fff;
}
.relative {
  position: relative;
}
.w-\[36px\] {
  width: 36px;
}
.text-\[11px\] {
  font-size: 15px;
}
.font-medium {
  font-weight: 500;
}
.text {
  color: #999;
  margin-top: -6px;
}
.text.active {
  color: #005CE0;
}
.icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon svg {
  width: 100%;
  height: 100%;
}
.px-\[4px\] {
  padding-left: 4px;
  padding-right: 4px;
}
.absolute {
  position: absolute;
}
.top-\[-5px\] {
  top: -5px;
}
.right-\[-17px\] {
  right: -17px;
}
.z-1 {
  z-index: 1;
}
.h-\[28px\] {
  height: 28px;
}
.leading-\[28px\] {
  line-height: 28px;
}
.text-\[20px\] {
  font-size: 20px;
}
.scale-\[0\.5\] {
  transform: scale(0.5);
}
.origin-right-top {
  transform-origin: right top;
}
.text-white {
  color: #fff;
}
.label {
  background: linear-gradient(90deg, #ff6b6b, #ee5a6f);
  border-radius: 4px;
  white-space: nowrap;
}
</style>