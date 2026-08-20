<template>
  <div id="__next">
    <div class="login_modal__overlay" @click="$emit('close'); goNav('/')"></div>
    <div class="slide-up pop-up-content 9P login" :class="infoType == 0 ? 'login-modal' : 'register-modal'">
      <div class="popup-content">
        <div class="auth-modal-content login">
          <div class="modal-body">
            <div class="colse-btn" @click="$emit('close'); goNav('/')">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABVCAMAAAAPK1hoAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURUdwTKC7+Z25+Z25+WJ/2GOB14ai7WSB2qG9+5ez92uH3J22/GyE15iy9oCb6aXA/Iun8Ft50o2p8P///26K33GN4mqH3XSQ5GiE24mj8WOA2HaS5YSf72B91nuX6GWC2oah8HmU532Z6oGc7ICb64um81161I6p9IOe7aG695Ww9o6k6e7x/LrI8vf4/dLc99p4Q/QAAAATdFJOUwDgk+/cSR99fj+REBBl18y2q89QfdhKAAAGDklEQVRYw6WZi2KiOhCGUbEoatttAaUiKkLBW33/tzuZS5IJ4qU9f0Iymcx8maLbVep5jzQZj/rvb709qPf21h+NJ97/02Tcf9tf660//jtz3B8A4wCquSntD8o5+Bt4MhoQUbFaQrS6HbOXvzAPyKtqGquaO14I7o1+xdXMClXzVVWajjZxn7+fPYG8pRrOUODec/d30ld1PkAadK3q7T8BfelpZoq9EnZKJlsp34h97+HdnQ0AmqbY1cDiZZXqGdHoVtjB7MHLZJgpT9KozBnyPOCOnoDeUdfuA6yCdmRtpLXpPusOdrSvqw0mbwjQanZQkxKF4vI2VlVK0a5SPaZiSZPFb9K6GztTP/4VrOOEzg0Frvcd74SXAVSaZSoigw6NlW0aMho0MwHT4So6PQyu3reTnoJmsNsgkMZNw3aTsbfBFZ/RIA4aZKaHXvv3ef9QZZgDHS/IZoNnttRRjV6iA07J1JAeWv94x+qecjBnmkkbUC8GZE1mQug8SFTYrD64v2p6NVfTVtbcUta2VLV1z3lTHdLmF9qZoXVuehjJ31NVtlOCUDXSTHk702ixowjrRN9OJ1YD+4KN6gz3dhTgzl2rjk3CZ7bYl17KUeVOzjyWYHA3G6WAlugvIbBJTbGzusFUTocgDNlfLkdtmwDKV+Phcqk1jI7Dk2pdbG9Tdmn/qXR2fTtjndXmz6GVUpRlOuD3KpRacINO2+UJqD9nWhRmwmsH0M/PC/kLSkF7V9N7tp+WhVVpxk/SviiutguCfp4cJ05lSv/ABk3RpfLC2HNRtrcY+nnpysPXa1xhUo4XNBhgdfgx1dpNbBp6OpoE0Sq4Bf2NglgV2HGoDZYc1PLCQk1CkXOamjZwCz52+S0dNfYsvVdQUw5p96F+sVbFTWp5dKrtgnaoqCfeOEVza73b7mq3tCWhWx29ddI2Y2/W5FulHC9oaLLywlaLGwLKWTolZ4iCNzOvX26vJLm2Wli60BtZZd97L7Z3lctqBXRpQ5ZixJR37yNXa2g8OQ39FutAbWtn5R/eK7pJWzFaj8UKaCuOluzJX71N7iDNLHNc7OnYwXTgjdfc2l7ewBL0rhR1OVdNaU6eOa3n2qI9iz01Ymu+bGXSqvF2yzmKJ20tpU9F6hfq8yzibA45lpSz3HmluzHv1tnegf3VZjtJUV/nMVgxXsaEIWan6mf5au3tNobSLBNekRrHc6e56xZUYTkDu4jVqfGr984WTFrmINoyb/4fieUMN534715oN2NTqMXHAip+McbmJxJ0nTcPvZkssksWGscS21IkftSZN16CI6Ih5imiOLAENHKxkQzmJY7zsTdZClSkQ1W7gqLTrVZzIl0HWsup572qWEBERIqMAREWSic52EifrveY86r+Nwxji4tkoJKAaiUWG4lyyKYCQ/g8IIAtGWghvS3slWL4PDCNuzejxEBzx508wMb4iShUkdCTiA2e9hKayBiDPVI4DXoK6TOhOh7iE550O2kobFEncpKUjL0k7NbZMAzpo2bsbBkZqFGkJ13tiRMtMol8/lQcRDJPnxrhZ8LTtgVELRbNj65V5MJuzKV6U7dGrfxkodc6Xu8uYPDNl9kAHAsaErKwHY8xBZvOl2qL+HikHH1hjwLzzUgVy16QASwonY/EbXviQgbo1MXCF9+7A+1M+DILq8RxJPZKhJEE8iun32K4wLZuh/rud+5W3nrxSJ0RydD9Kh+quPVaxa7XOFu5noXoGO4cELaeOkx9ztQ5tulBzPZ8fSKG+tfPXWR9qK/1k+LD14uO54VD4HytqWP7EgbKrPnipjXsevQUrHU2pTH2i44xQLPFpg5bB92PyQIJvKH1la09wa1HesHX3xXcfvyI2FU7YdVlr9y44N6j0mC1UuHQV3rUU8v+MkGAD+4/1h22AJasD/ty2QgdPnyu7a9+K/+ZvxqEFPv9LDScPvVsf+gr5PcKh4fNHz79d4jA/1Za8YAzr6UPpuA3fzJ5Ia4GUlnf0gWzH0x/+fedl6H/fV+rXzPp/v67wwyH3p81DLsq9sPh1Pt/mg6D8J9PcN//FwZPEP8Dkj14FdS2VHkAAAAASUVORK5CYII=" alt="close" class="close-icon" />
            </div>
            <div class="head-warp">
              <div class="head-title">{{ infoType == 0 ? '账号登录' : '账号注册' }}</div>
              <div class="head-subtitle">
                <span>{{ infoType == 0 ? '还没有账号？' : '已有账号？' }}</span>
                <span class="tab-btn" @click="changInfoType(infoType == 0 ? 1 : 0)">{{ infoType == 0 ? '马上注册' : '立即登录' }}</span>
              </div>
            </div>
            <div class="form-wrapper">
              <form autocomplete="off" novalidate="novalidate" class="auth-form modal-login-form" v-if="infoType == 0">
                <div class="form-item account-wrapper">
                  <div class="input-with-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2BAMAAAB+a3fuAAAAKlBMVEUAAACusMaur8atsMatrsWtsMWussessMStscWtsMWuscevssatsMWtsMX8TXQVAAAADXRSTlMA4D+/YKYdhW/vTy/QY/CSsgAAAR5JREFUOMvdkj9Lw0AYh8/GVLAuOrhIIHRzK6g4CQ6uhQ6iXYRTEdcuHQOCZOxHyBcQBFdnP0HaSoz4fBetOXqXu1tCtz7L+8LD/Xt/J9aMu/HHaexXjxmQn/tUJ4KFlB73TsWBq9oZ5WU3hdJduAFXf+UBeo5LKFSdOy5i8F8Dfmy1DbI6F+w3bvGpujOeLBfwrboJA8dNVfdKr4ELmes9G9ylRbl8w5uwyNRWO+TCZqJmduOZWVDN+t4363YEw5dnf7i3VOzbQi0EZlJ42IwWKhZeOunJUIpGtMZHmuu4piJMclMm1CnMEGxGS9eH4wtNClPj/+0Jk0NmOjukFSaxk7lwsg/5spz+M4ETZ99wRbdOYjiHlV246zIS68EvfxflFMGx5wsAAAAASUVORK5CYII=" alt="account" class="input-icon">
                    <input id="account" type="text" inputmode="email" autocomplete="off" placeholder="请输入账号" maxlength="20" v-model="loginInfo.name" class="login-input">
                    <span class="clear-btn" v-if="loginInfo.name" @click="loginInfo.name = ''">×</span>
                  </div>
                </div>
                <div class="form-item password-wrapper">
                  <div class="input-with-icon">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2BAMAAAB+a3fuAAAAIVBMVEUAAACur8etsMWtscSssMWtscWvssitsMWqr8StsMWtsMUG28f7AAAACnRSTlMAPtyBp2cf7xC/flNnLgAAAP1JREFUOMvV1D3vAUEQBvD7vxBUqFCJCMlWl2hEpZOoBJVKo1GJQqEUidBpVewdcs+nxLozuZm7TsFTTfaXzM5mN2t9YZJDda32IunngHt0M8pagMGspC38nKV1Ad0YdACILf8A794t1QcW3KaAbYZV8GRL51msAD6NQts/JWCzwwHjV4cyNx2UJczCloAblDsc+RGcoMy8y9Zwc35KuISoiFD2oY4sPbIptxNZl5tHtuR2JXst1YNKmC5Y+Tirma250eQbYbSQFkbD/UebeSe/0WZezCjGnMf9xxhsK/MxNq8oaRRhipMma3FzyVbcamRJair/ignh84/5ptwAiPhE8pK6/b0AAAAASUVORK5CYII=" alt="password" class="input-icon">
                    <input id="password" autocomplete="off" placeholder="请输入登录密码" maxlength="18" :type="psw1 ? 'password' : 'text'" v-model="loginInfo.password" class="login-input">
                    <span class="eye-btn" @click="changPsw('psw1')">
                      <img v-if="psw1" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKcSURBVHgB7ZZfchJBEMa7B8JDqlSOsN4AH6NR4QRmjPpKOIHxBElOkHACllclDp4AUJK8khvsDaR80him7V5Y3dldtMQUVabmV5Xszl++6fm6AcDj8Xg8Hs//BCYvp/2zAT/q/Bd+oas3Ld2YwpoxZlCzuME6cAqE7V398ET6lfzrmY87C4HC3h2sDHhBAGvk/YeL5kJglZsBIB0kY7FIEuUpOLx8osrgrRnXYA2Y/vkxkQ0XAmGuCaKUnjnvzKdDheogvwWeKPrW1roRwQ3Dn1lHVMcSlMxQpEg1tN6KHJGCXDtiqcOv1dwiVCHYryL2n70q4ni/1/y6kx3jCE5KpHQiMCdSMOYisGgliYKC/WXh0JLtvtSPh/AXsMeroCpNS5D2vyuQqP1Cb+9n+3HZpr3+eICAdVgKcURxwhtfWrATnhs5o0DBhirdY1E1jk6t4EpdIaj2nj/b6haOFXX2zDlfOxlYL+zDq0aR91W2Q0oPou1kuvscMTllBDcAR3moEPYz+wUzrJiO2CJDGTICpfSAmzh8ws2W1g/ihIkzEpAjjU3IJ9jv4OSDE7Cb3WQvY8Yji/jz88QSd7FyzK+t9EI3u/M+dEpB6jBVPsznpC0ZaWnWzqoqzStFwnB351EjO+fUjPfYkM7NZf1ZdhVj8KtFU0WlnEDhGso1xydEo1f6SZgT0D+TuhssmoWJs6u3Q76dIF2jZ/b6fnqO60miI4h9QlMi1SoSuKDubKLiK8vBPh6lmlUpb0XzuJwdclk7itewX8tQDtPjTiTlVPwI4Q+wH586basuC+exDfjRTNoWvteX7S9C+XFYNKZgBdD9ro+WRdwCTZx1aoNgBVYSqVK2WFikEPlW4h8OcULJNaKFEXg8Ho/H47n1/ADVvw9eCvqfmQAAAABJRU5ErkJggg==" alt="eye-off" class="eye-icon">
                      <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPXSURBVHgB7VhJctpAFP3d4CRVSRyOoNzAXnpK4ATQ8bC1OYHhBIgTBJ/AeJsEC04ArhizNEdQThBclUViI/38BklugdQS9iJZ6FVRoB5f/6mfAMiQIUOGfwYGz4Bl9QtTyG8goMGAyU+BMfbORffHfHEcu8DtI7E7hmdgZZKSGPBXp0SkSI/FdLNwAsAHdIDup/LWBayI1CS/Wt+LnPFGemKxsGmdNri/L4Qo2WkmJJIkyxkue3EOieSktdhEaTD048EGZGf7YruVME5P0uoNya1o0rDCYh/F4QARr+jnIA9vxkJsTpbmW9cbDrgGubpCrv4YQ9zmeF/SWTWWpNW9+ewC1iK62hSPF4dibwAromNdnwBjjQiytoMo4hIskmSnO5TuPVHbpOVymKsKsWVDDCxrZExhauRhSpYtTVYlyxg/iUosloYgubx+KHZb0cT8bHdqalggwJgSpBWXzfJADnPOqWwVw3u5pUUvhUh2esMGrW4+tuCEI1C8RLvBS6o+aJKEiJqivNWM66eqYXpVwwfteb+pxigPCEoXrEBQIongbAy6Zse6qcX1k9VMGqMeoiDXPZceUklKi3gx8kgReVVHcHaoMEEKfqcq3YXonoUGM2yom0YRpa+u0mSsw4taiCSwl6ehDRGaB2K7Cxogg2OVIEdeOhIf2jKeDsRejU5ZV/oL65Cr6NYjF1flOkEDg8bMeLJvFlfhUmPvix0TEiDvauVxsJj1+/NECzLcDY9fgqwG5IWq2kZun3mXewsFi6HyOy2oqN/FdBVgBXBgRmS7d4IghijdNzpUyCGJGKAdzGHs2HeND3lbqc85zm9160XlBYVQc06eQMVXusZWKNSkoNAtyhDU+jfLyMve6FjOs3qjhoug1lX7zr2/0q1H86VhjEcK0PRDKKiTnsrpK/MmdFWVdFrwsju8pfDYgAToLgOJ5fpMeVHZee8/BHVSZuVivcox1v9CIiFucYZcQMgDESCL6AhKjbBcn3kptM/ipG/WdVvGWHgjVo+TVPJadCBv0r1bBsVdnkpqxgmROAmYeC1qiQLrcvxT10kqK7D6aztKugXj4iQgYpVKV3txfKxUi7hTfbSp8DbTquqAGFnchbUKzA9fDPfqr2Ct6KWrr+aVhQjRC2O6/nowE73R0kwqnQd4KOZYjgQvVuLEc5IETPH6QJIKHHPZ/Uvbrfj6gFSf9UmVmqQPr0TJAl2BZ0GSwzN65Wjp4lbFE15pRwZwt0w1tLIoWHXEZOIhOr0cvB2kJfdkkios65b+HPgV+edAnvOfD65ztwZrA128ZciQIcN/jr/3wQA86023OAAAAABJRU5ErkJggg==" alt="eye" class="eye-icon">
                    </span>
                  </div>
                </div>
                
                <div class="remember-forgot">
                  <div class="remember">
                    <input type="checkbox" id="remember" v-model="rememberPassword">
                    <label for="remember">记住密码</label>
                  </div>
                  <div class="forgot">
                    <a href="#">忘记密码</a>
                  </div>
                </div>
                <div class="action-wrapper">
                  <button @click="handleLoginClick" class="login-button" type="button"><span>登录</span></button>
                </div>
                <div class="login_visitorBtn__2xo1h"><img src="https://9pgh5.liwifi.top/assets/pg-auth-bouns-lVaxOJOJ.png" alt="" class="pg-auth-bouns login-page"></div>
              </form>
              <form autocomplete="off" class="auth-form modal-regist-form" v-if="infoType == 1">
                <div class="form-item account-wrapper">
                  <div class="input-with-icon">
                    <i class="icon-user"></i>
                    <input id="account" type="text" inputmode="email" placeholder="设置账号6-16个字母及数字组合" maxlength="16" v-model="registerInfo.name" class="login-input">
                    <span class="clear-btn" v-if="registerInfo.name" @click="registerInfo.name = ''">×</span>
                  </div>
                </div>
                <div class="form-item password-wrapper">
                  <div class="input-with-icon">
                    <i class="icon-lock"></i>
                    <input id="password" autocomplete="new-password" placeholder="设置密码8-16个字母及数字组合" maxlength="16" :type="psw2 ? 'password' : 'text'" v-model="registerInfo.password" class="login-input">
                    <span class="eye-btn" @click="changPsw('psw2')">
                      <i v-if="psw2" class="icon-eye-off"></i>
                      <i v-else class="icon-eye"></i>
                    </span>
                  </div>
                </div>
                <div class="form-item password-wrapper">
                  <div class="input-with-icon">
                    <i class="icon-lock"></i>
                    <input id="password-confirm" autocomplete="new-password" placeholder="请再次输入登录密码" maxlength="18" :type="psw2 ? 'password' : 'text'" v-model="registerInfo.confirmPass" class="login-input">
                    <span class="eye-btn" @click="changPsw('psw2')">
                      <i v-if="psw2" class="icon-eye-off"></i>
                      <i v-else class="icon-eye"></i>
                    </span>
                  </div>
                </div>
                <div class="form-item account-wrapper">
                  <div class="input-with-icon">
                    <i class="icon-user"></i>
                    <input placeholder="真实姓名" maxlength="32" v-model="registerInfo.realname" class="login-input" type="text" />
                    <span class="clear-btn" v-if="registerInfo.realname" @click="registerInfo.realname = ''">×</span>
                  </div>
                </div>
                <div class="form-item password-wrapper">
                  <div class="input-with-icon">
                    <i class="icon-lock"></i>
                    <input placeholder="支付密码" v-model="registerInfo.paypassword" maxlength="32" :type="psw3 ? 'password' : 'text'" class="login-input" autocomplete="off" />
                    <span class="eye-btn" @click="changPsw('psw3')">
                      <i v-if="psw3" class="icon-eye-off"></i>
                      <i v-else class="icon-eye"></i>
                    </span>
                  </div>
                </div>
                
                <div class="action-wrapper">
                  <button @click="handleRegisterClick" class="login-button"><span>注册</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 滑动验证码弹窗 -->
    <div class="captcha-modal" v-if="showCaptchaModal" @click.self="closeCaptchaModal">
      <div class="captcha-modal-content">
        <div class="captcha-modal-body">
          <SliderCaptcha 
            ref="loginSlider"
            @success="onSliderSuccess"
            @fail="onSliderFail"
            @close="closeCaptchaModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SliderCaptcha from './SliderCaptcha.vue';

export default {
  name: 'login',
  components: {
    SliderCaptcha
  },
  props: {
    initialType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      registerInfo: {},
      loginInfo: {},
      infoType: 0,
      psw1: true,
      psw2: true,
      psw3: true,
      pid: '',
      rememberPassword: true,
      sliderVerified: false,
      registerSliderVerified: false,
      showCaptchaModal: false,
      pendingLoginInfo: null,
      pendingRegisterInfo: null,
      isRegisterCaptcha: false,
    };
  },
  created() {
    let that = this;
    if (that.initialType !== undefined) {
      that.infoType = that.initialType;
    }
    var query = that.$route.query;
    if (query.type) {
      that.infoType = parseInt(query.type);
    }
    if (query.pid) {
      that.pid = query.pid;
    }
  },
  methods: {
    changPsw(name) {
      this[name] = !this[name];
    },
    changInfoType(type) {
      let that = this;
      if (that.infoType == type) {
        return;
      }
      that.infoType = type;
      that.loginInfo = {};
      that.registerInfo = {};
      that.sliderVerified = false;
      that.registerSliderVerified = false;
      this.psw1 = true;
      this.psw2 = true;
      this.psw3 = true;
      
      that.$nextTick(() => {
        if (that.$refs.loginSlider) {
          that.$refs.loginSlider.reset();
        }
      });
    },
    onSliderSuccess() {
      this.sliderVerified = true;
      console.log('滑动验证成功');
      this.showCaptchaModal = false;
      // 验证成功后执行登录或注册
      if (this.pendingLoginInfo) {
        this.doLogin(this.pendingLoginInfo);
        this.pendingLoginInfo = null;
      } else if (this.pendingRegisterInfo) {
        this.doRegister(this.pendingRegisterInfo);
        this.pendingRegisterInfo = null;
      }
    },
    onSliderFail() {
      this.sliderVerified = false;
      console.log('滑动验证失败');
    },
    closeCaptchaModal() {
      this.showCaptchaModal = false;
      this.pendingLoginInfo = null;
      this.pendingRegisterInfo = null;
    },
    handleLoginClick() {
      console.log('========== 登录按钮被点击 ==========');
      this.login();
    },
    handleRegisterClick() {
      console.log('========== 注册按钮被点击 ==========');
      this.register();
    },
    register() {
      let that = this;

      let info = that.registerInfo;
      console.log(info);
      if (!info.name || info.name.length < 6) {
        that.showTost(0, ' 用户名长度6~16位，以字母或数字组合！');
        return;
      }
      if (!info.password || info.password.length < 6) {
        that.showTost(0, '请输入正确的密码长度，最少6位！');
        return;
      }
      if (!info.confirmPass || info.confirmPass != info.password) {
        that.showTost(0, '两次密码不一致！');
        return;
      }
      if (!info.realname || info.realname.length < 2) {
        that.showTost(0, '请输入您的真实姓名!');
        return;
      }

      if (!info.paypassword || info.paypassword.length < 6) {
        that.showTost(0, '请输入正确的支付密码长度，最少6位！');
        return;
      }
      
      console.log('=== 准备显示滑动验证 ===');
      console.log('当前 showCaptchaModal:', that.showCaptchaModal);
      
      // 先保存注册信息，然后弹出滑动验证
      that.pendingRegisterInfo = { ...info };
      
      // 强制设置为true
      that.showCaptchaModal = true;
      console.log('设置后 showCaptchaModal:', that.showCaptchaModal);
      
      that.sliderVerified = false;
      that.isRegisterCaptcha = true;
      
      // 确保滑动验证码组件重置
      that.$nextTick(() => {
        console.log('=== nextTick 执行 ===');
        console.log('nextTick 中 showCaptchaModal:', that.showCaptchaModal);
        if (that.$refs.loginSlider) {
          console.log('重置滑动验证码');
          that.$refs.loginSlider.reset();
        }
        // 再次确认弹窗显示状态
        if (!that.showCaptchaModal) {
          console.log('弹窗被意外关闭，重新显示');
          that.showCaptchaModal = true;
        }
      });
    },
    doRegister(info) {
      let that = this;
      
      that.showLoading();
      if (that.pid) {
        info.pid = that.pid;
      }
      console.log(info)
      that.$apiFun.register(info).then(res => {
        that.showTost(1, res.message);
        if (res.code == 200) {
          sessionStorage.setItem('token', res.data.api_token);
          that.$store.commit('changToken');
          
          let userInfo = {};
          
          if (res.data.userInfo || res.data.user) {
            userInfo = res.data.userInfo || res.data.user;
            console.log('注册接口返回了用户信息:', userInfo);
            
            if (userInfo.current_vip) {
              let str = userInfo.current_vip;
              let index = str.indexOf('P');
              let vip = str.substr(index + 1, str.length);
              userInfo.vip = vip;
            }
          }
          
          if (!userInfo.username) userInfo.username = '';
          if (!userInfo.balance) userInfo.balance = '0.00';
          
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.$store.commit('changUserInfo');
          
          that.openDaoTime();
          
          console.log('注册成功，立即获取余额...');
          that.$apiFun.post('/api/balance', {}).then(balanceRes => {
            console.log('余额接口返回:', balanceRes);
            if (balanceRes.code == 200 && balanceRes.data && balanceRes.data.balance !== undefined) {
              let currentUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
              currentUserInfo.balance = balanceRes.data.balance;
              if (!currentUserInfo.username) currentUserInfo.username = '';
              
              localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
              that.$store.commit('changUserInfo');
              console.log('余额已更新:', currentUserInfo.balance);
            }
            
            that.hideLoading();
            that.$emit('success');
            that.$emit('close');
          }).catch(balanceErr => {
            console.error('获取余额失败:', balanceErr);
            that.hideLoading();
            that.$emit('success');
            that.$emit('close');
          });
        } else {
          that.hideLoading();
        }
      }).catch(err => {
        console.error('注册失败:', err);
        that.hideLoading();
      });
    },
    login() {
      console.log('========== 登录按钮被点击 ==========');
      let that = this;
      let info = that.loginInfo;
      console.log('登录信息:', info);
      
      if (!info.name || !info.password) {
        that.showTost(0, '请输入您的账号和密码！');
        return;
      }
      
      // 先保存登录信息，然后弹出滑动验证
      that.pendingLoginInfo = { ...info };
      that.showCaptchaModal = true;
      that.sliderVerified = false;
      
      // 重置滑动验证码
      that.$nextTick(() => {
        if (that.$refs.loginSlider) {
          that.$refs.loginSlider.reset();
        }
      });
    },
    // 本地实现加载状态和提示方法
    showLoading() {
      // 简单实现：可以添加一个加载遮罩
      console.log('显示加载中');
    },
    hideLoading() {
      // 简单实现：移除加载遮罩
      console.log('隐藏加载中');
    },
    showTost(type, message) {
      // 简单实现：使用alert显示提示
      alert(message);
    },
    openDaoTime() {
      // 简单实现：启动定时刷新
      console.log('启动定时刷新');
    },
    goNav(path) {
      // 简单实现：导航到指定路径
      this.$router.push(path);
    },
    doLogin(info) {
      let that = this;
      that.showLoading();
      
      (async function() {
        try {
          let res = await that.$apiFun.login(info);
          console.log('===== 登录接口完整返回 =====');
          console.log('登录接口返回:', res);
          console.log('res.data:', res.data);
          
          if (res.code !== 200) {
            that.showTost(0, '您输入的账号或密码错误！');
            that.hideLoading();
            return;
          }
          
          console.log('===== 登录成功，开始处理 =====');
          sessionStorage.setItem('token', res.data.api_token);
          that.$store.commit('changToken');
          
          let userInfo = {};
          
          if (res.data.userInfo || res.data.user) {
            userInfo = res.data.userInfo || res.data.user;
            console.log('登录接口返回了用户信息:', userInfo);
            
            if (userInfo.current_vip) {
              let str = userInfo.current_vip;
              let index = str.indexOf('P');
              let vip = str.substr(index + 1, str.length);
              userInfo.vip = vip;
            }
          }
          
          if (!userInfo.username) userInfo.username = '';
          if (!userInfo.balance) userInfo.balance = '0.00';
          
          console.log('===== 先保存基本 userInfo =====');
          console.log('保存前的 userInfo:', userInfo);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.$store.commit('changUserInfo');
          console.log('已保存到 store，当前 store.userInfo:', that.$store.state.userInfo);
          
          console.log('===== 立即获取余额 =====');
          let balanceRes = await that.$apiFun.post('/api/balance', {});
          console.log('余额接口完整返回:', balanceRes);
          console.log('balanceRes.code:', balanceRes.code);
          console.log('balanceRes.data:', balanceRes.data);
          
          if (balanceRes.code == 200) {
            if (balanceRes.data && balanceRes.data.balance !== undefined) {
              console.log('===== 获取到真实余额，准备更新 =====');
              let currentUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
              currentUserInfo.balance = balanceRes.data.balance;
              if (!currentUserInfo.username) currentUserInfo.username = '';
              
              console.log('准备保存到 localStorage 的 userInfo:', currentUserInfo);
              localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
              
              console.log('准备提交到 store...');
              that.$store.commit('changUserInfo');
              
              console.log('余额已更新:', currentUserInfo.balance);
              console.log('完整的 userInfo:', currentUserInfo);
              console.log('store 中的 userInfo:', that.$store.state.userInfo);
              console.log('store.getters.safeBalance:', that.$store.getters.safeBalance);
            } else {
              console.log('余额接口返回成功但缺少 balance 字段！');
              console.log('balanceRes.data 的字段:', Object.keys(balanceRes.data || {}));
            }
          } else {
            console.log('余额接口返回失败！code:', balanceRes.code);
          }
          
          console.log('===== 启动定时刷新 =====');
          that.openDaoTime();
          
          console.log('===== 准备跳转，延迟 500ms =====');
          setTimeout(() => {
            console.log('===== 跳转前最后检查 =====');
            console.log('store.state.token:', that.$store.state.token);
            console.log('store.state.userInfo:', that.$store.state.userInfo);
            console.log('store.getters.safeBalance:', that.$store.getters.safeBalance);
            console.log('localStorage.userInfo:', localStorage.getItem('userInfo'));
            
            that.hideLoading();
            that.$emit('success');
            that.$emit('close');
          }, 500);
          
        } catch (err) {
          console.error('===== 登录或获取余额失败 =====');
          console.error(err);
          that.hideLoading();
        }
      })();
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
@import '../../static/css/79a97583f57023fe4fa8.css';
@import '../../static/css/438b8f8fe59c79885d4c.css';
@import '../../static/css/4186aeadfd68d65ea7ad.css';
#__next {
  width: 100vw;
  
  position: relative;
}
.login_modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  animation: fadeIn 0.3s ease;
}
.slide-up {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}
.login-modal {
  top: calc(100% - 400px);
}
.register-modal {
  top: calc(100% - 510px);
}
.pop-up-content {
  background: linear-gradient(to top, #fff, #ebf1f9 45%, #e7eef8);
  background-position: 80% 6%;
  background-size: 100% 100%;
}
.popup-content {
  padding: 20px;
}
.auth-modal-content {
  width: 100%;
}
.modal-body {
  width: 100%;
}
.colse-btn {
  position: absolute;
  top: 5px;
  right: 15px;
  z-index: 10000;
  cursor: pointer;
}
.fit-image {
  width: 35px;
  height: 50px;
  object-fit: contain;
}
.head-warp {
  margin-bottom: 20px;
  text-align: left;
}
.head-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}
.head-subtitle {
  color: #666;
  font-size: 0.44rem !important;
  span {
    font-size: 0.44rem !important;
  }
}
.tab-btn {
  color: #338ddd;
    cursor: pointer;
    margin-left: -7px;
}
.form-wrapper {
  width: 100%;
}
.auth-form {
  width: 100%;
}
.form-item {
  margin-bottom: 15px;
}
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #cfd0d1;
  border-radius: 8px;
  padding: 0 15px;
  height: 48px;
  background-color: #fff;
  transition: border-color 0.3s;
  background-color: rgb(248 251 255 / var(--un-bg-opacity));
  &:focus-within {
    border-color: #6c757d;
  }
}
.icon-user,
.icon-lock,
.icon-code {
  font-size: 18px;
  color: #6c757d;
  margin-right: 10px;
  flex-shrink: 0;
}
.icon-user {
  width: 18px;
  height: 18px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2BAMAAAB+a3fuAAAAKlBMVEUAAACusMaur8atsMatrsWtsMWussessMStscWtsMWuscevssatsMWtsMX8TXQVAAAADXRSTlMA4D+/YKYdhW/vTy/QY/CSsgAAAR5JREFUOMvdkj9Lw0AYh8/GVLAuOrhIIHRzK6g4CQ6uhQ6iXYRTEdcuHQOCZOxHyBcQBFdnP0HaSoz4fBetOXqXu1tCtz7L+8LD/Xt/J9aMu/HHaexXjxmQn/tUJ4KFlB73TsWBq9oZ5WU3hdJduAFXf+UBeo5LKFSdOy5i8F8Dfmy1DbI6F+w3bvGpujOeLBfwrboJA8dNVfdKr4ELmes9G9ylRbl8w5uwyNRWO+TCZqJmduOZWVDN+t4363YEw5dnf7i3VOzbQi0EZlJ42IwWKhZeOunJUIpGtMZHmuu4piJMclMm1CnMEGxGS9eH4wtNClPj/+0Jk0NmOjukFSaxk7lwsg/5spz+M4ETZ99wRbdOYjiHlV246zIS68EvfxflFMGx5wsAAAAASUVORK5CYII=);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.icon-user::before {
  content: "";
}
.icon-lock {
  width: 18px;
  height: 18px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2BAMAAAB+a3fuAAAAIVBMVEUAAACur8etsMWtscSssMWtscWvssitsMWqr8StsMWtsMUG28f7AAAACnRSTlMAPtyBp2cf7xC/flNnLgAAAP1JREFUOMvV1D3vAUEQBvD7vxBUqFCJCMlWl2hEpZOoBJVKo1GJQqEUidBpVewdcs+nxLozuZm7TsFTTfaXzM5mN2t9YZJDda32IunngHt0M8pagMGspC38nKV1Ad0YdACILf8A794t1QcW3KaAbYZV8GRL51msAD6NQts/JWCzwwHjV4cyNx2UJczCloAblDsc+RGcoMy8y9Zwc35KuISoiFD2oY4sPbIptxNZl5tHtuR2JXst1YNKmC5Y+Tirma250eQbYbSQFkbD/UebeSe/0WZezCjGnMf9xxhsK/MxNq8oaRRhipMma3FzyVbcamRJair/ignh84/5ptwAiPhE8pK6/b0AAAAASUVORK5CYII=);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.icon-lock::before {
  content: "";
}
.icon-code::before {
  content: "🔐";
}
.icon-eye {
  width: 18px;
  height: 18px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPXSURBVHgB7VhJctpAFP3d4CRVSRyOoNzAXnpK4ATQ8bC1OYHhBIgTBJ/AeJsEC04ArhizNEdQThBclUViI/38BklugdQS9iJZ6FVRoB5f/6mfAMiQIUOGfwYGz4Bl9QtTyG8goMGAyU+BMfbORffHfHEcu8DtI7E7hmdgZZKSGPBXp0SkSI/FdLNwAsAHdIDup/LWBayI1CS/Wt+LnPFGemKxsGmdNri/L4Qo2WkmJJIkyxkue3EOieSktdhEaTD048EGZGf7YruVME5P0uoNya1o0rDCYh/F4QARr+jnIA9vxkJsTpbmW9cbDrgGubpCrv4YQ9zmeF/SWTWWpNW9+ewC1iK62hSPF4dibwAromNdnwBjjQiytoMo4hIskmSnO5TuPVHbpOVymKsKsWVDDCxrZExhauRhSpYtTVYlyxg/iUosloYgubx+KHZb0cT8bHdqalggwJgSpBWXzfJADnPOqWwVw3u5pUUvhUh2esMGrW4+tuCEI1C8RLvBS6o+aJKEiJqivNWM66eqYXpVwwfteb+pxigPCEoXrEBQIongbAy6Zse6qcX1k9VMGqMeoiDXPZceUklKi3gx8kgReVVHcHaoMEEKfqcq3YXonoUGM2yom0YRpa+u0mSsw4taiCSwl6ehDRGaB2K7Cxogg2OVIEdeOhIf2jKeDsRejU5ZV/oL65Cr6NYjF1flOkEDg8bMeLJvFlfhUmPvix0TEiDvauVxsJj1+/NECzLcDY9fgqwG5IWq2kZun3mXewsFi6HyOy2oqN/FdBVgBXBgRmS7d4IghijdNzpUyCGJGKAdzGHs2HeND3lbqc85zm9160XlBYVQc06eQMVXusZWKNSkoNAtyhDU+jfLyMve6FjOs3qjhoug1lX7zr2/0q1H86VhjEcK0PRDKKiTnsrpK/MmdFWVdFrwsju8pfDYgAToLgOJ5fpMeVHZee8/BHVSZuVivcox1v9CIiFucYZcQMgDESCL6AhKjbBcn3kptM/ipG/WdVvGWHgjVo+TVPJadCBv0r1bBsVdnkpqxgmROAmYeC1qiQLrcvxT10kqK7D6aztKugXj4iQgYpVKV3txfKxUi7hTfbSp8DbTquqAGFnchbUKzA9fDPfqr2Ct6KWrr+aVhQjRC2O6/nowE73R0kwqnQd4KOZYjgQvVuLEc5IETPH6QJIKHHPZ/Uvbrfj6gFSf9UmVmqQPr0TJAl2BZ0GSwzN65Wjp4lbFE15pRwZwt0w1tLIoWHXEZOIhOr0cvB2kJfdkkios65b+HPgV+edAnvOfD65ztwZrA128ZciQIcN/jr/3wQA86023OAAAAABJRU5ErkJggg==);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.icon-eye::before {
  content: "";
}
.icon-eye-off {
  width: 18px;
  height: 18px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKcSURBVHgB7ZZfchJBEMa7B8JDqlSOsN4AH6NR4QRmjPpKOIHxBElOkHACllclDp4AUJK8khvsDaR80him7V5Y3dldtMQUVabmV5Xszl++6fm6AcDj8Xg8Hs//BCYvp/2zAT/q/Bd+oas3Ld2YwpoxZlCzuME6cAqE7V398ET6lfzrmY87C4HC3h2sDHhBAGvk/YeL5kJglZsBIB0kY7FIEuUpOLx8osrgrRnXYA2Y/vkxkQ0XAmGuCaKUnjnvzKdDheogvwWeKPrW1roRwQ3Dn1lHVMcSlMxQpEg1tN6KHJGCXDtiqcOv1dwiVCHYryL2n70q4ni/1/y6kx3jCE5KpHQiMCdSMOYisGgliYKC/WXh0JLtvtSPh/AXsMeroCpNS5D2vyuQqP1Cb+9n+3HZpr3+eICAdVgKcURxwhtfWrATnhs5o0DBhirdY1E1jk6t4EpdIaj2nj/b6haOFXX2zDlfOxlYL+zDq0aR91W2Q0oPou1kuvscMTllBDcAR3moEPYz+wUzrJiO2CJDGTICpfSAmzh8ws2W1g/ihIkzEpAjjU3IJ9jv4OSDE7Cb3WQvY8Yji/jz88QSd7FyzK+t9EI3u/M+dEpB6jBVPsznpC0ZaWnWzqoqzStFwnB351EjO+fUjPfYkM7NZf1ZdhVj8KtFU0WlnEDhGso1xydEo1f6SZgT0D+TuhssmoWJs6u3Q76dIF2jZ/b6fnqO60miI4h9QlMi1SoSuKDubKLiK8vBPh6lmlUpb0XzuJwdclk7itewX8tQDtPjTiTlVPwI4Q+wH586basuC+exDfjRTNoWvteX7S9C+XFYNKZgBdD9ro+WRdwCTZx1aoNgBVYSqVK2WFikEPlW4h8OcULJNaKFEXg8Ho/H47n1/ADVvw9eCvqfmQAAAABJRU5ErkJggg==);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.icon-eye-off::before {
  content: "";
}
.close-icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
  display: block;
}
.input-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-right: 10px;
  flex-shrink: 0;
}
.eye-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  cursor: pointer;
}
.login-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
  &::placeholder {
    color: #adb5bd;
  }
}
.clear-btn {
  color: #adb5bd;
  cursor: pointer;
  font-size: 26px;
  margin-left: 10px;
  &:hover {
    color: #6c757d;
  }
}
.eye-btn {
  color: #adb5bd;
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;
  &:hover {
    color: #6c757d;
  }
}
.slider-captcha-wrapper {
  margin-bottom: 15px;
}
.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}
.remember {
  display: flex;
  align-items: center;
  font-size: 16px !important;
  input[type="checkbox"] {
    margin-right: 5px;
    transform: scale(1.2);
  }
  label {
    color: #666;
    cursor: pointer;
    font-size: 16px !important;
  }
}
.forgot a {
  color: #6c757d;
  text-decoration: none;
  font-size: 16px !important;
  &:hover {
    text-decoration: underline;
  }
}
.action-wrapper {
  margin-top: 20px;
  margin-bottom: 15px;
  position: relative;
  z-index: 1001;
}
.login-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(to bottom right, #5b77ef, #3d40e9);
  color: #fff;
  border: none;
  border-radius: 8px;

  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  z-index: 1002;
  pointer-events: auto;
  display: block;
  &:hover {
    background-color: #5a32a3;
  }
  &:active {
    background-color: #4a2987;
  }
}
.pg-auth-bouns {
  width: 100%;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
}
.login_visitorBtn__2xo1h {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.login_visitorBtn__2xo1h a {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  &:hover {
    color: #6f42c1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

// 滑动验证码弹窗样式
.captcha-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.captcha-modal-content {
 
  border-radius: 30px;
  width: 90%;
  max-width: 360px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.captcha-modal-body {
  padding: 20px;
}

.captcha-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .close-btn {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    
    &:hover {
      color: #666;
    }
  }
}

.captcha-modal-body {

  
  .captcha-tip {
    text-align: center;
    color: #666;
    margin-bottom: 15px;
    font-size: 14px;
  }
}
</style>
