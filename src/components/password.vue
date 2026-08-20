<template>
  <div style="width: 100%; min-height: 100vh; background: #f5f5f5">
    <van-nav-bar style="position: fixed; top: 0; left: 0; width: 100%; background-color: #054dc4; color: white" left-arrow @click-left="$router.back()">
      <div slot="title" style="color: white; font-size: 18px; padding: 0 10px">{{ type == 1 ? '登录密码' : '提现密码' }}</div>
      <i slot="left" class="van-icon van-icon-arrow-left" style="color: white; font-size: 20px"></i>
    </van-nav-bar>
    <div style="height: 46px"></div>
    
    
    <!-- 密码长度提示 -->
    <div style="background-color: #fff; padding: 10px 15px; margin-bottom: 10px; display: flex; align-items: center; color: #ff4d4f; font-size: 14px">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAP1BMVEVHcEzQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKyvQKytyfubhAAAAFHRSTlMA9pkrGme15TfSBxBGhHZVIKfCjdjogvUAAAH3SURBVEjHnZbZeoQgDIVZZJVlAN//WVsDTkHC1Jab+Sb4Yzg5EQiZx+4Ck0YpI1lwG3kwXiLToxs0h9cviE4HMqT7gGzsWIzEV4x452VSCUIEn8w7FFBkvzJLsdvEFlPjMrK1TdW5Ms1tvmJUT6JVRqK5vxJK1fdQsdpurGsOS1qIqQ8F2Q2s2pdaAjMWf9uHvxYo02k9M7uk1CPUO2Yh3/E98O5xi3UP1xZAmzg8wI9bMuAxKFf3QL6JjEEEXOZ+Mtmw+XgLWnqttJ/TbNKYKTVXLVzFAun2uTIWK9f5qvL9m0/3kIejnLVp2cWnkK75OUyG9VBQvoBIWxfVWFSCaqe2CZkNmKSEeFBA9obqvNdbhow2NcTg/Q+WQBKMIJ+ajFkbYwG5/0Pmb1BNbyHECqpCMNSuS8hDGy2Ku4JqcR1u8hVUdVsYdgHxFjaojxaQr61Ru9E+hFSTbTsw0XFIvKMZkwKHaMuudWN6AvlONPnzOfvoct5/C2FVaud+uh1WZoiBgMbeO7fMZugdlxGKc4RR92TuFMKMCYOCh1peMjTs566Wric42zHE+nryTxbl7dwPc46i3RaQPHiuU6q4ntO+IQb9eBJ/XWmULCI6F4WX6oqxlUpari5U+dM9LGYMMeK3w6SYkVBMPzlOuCjnbRTuowIjvgAdhTjd396kCQAAAABJRU5ErkJggg==" alt="alert-error" style="width: 16px; height: 16px; margin-right: 8px" />
      密码长度为 8~16 位字母和数字组合
    </div>
    
    <div class="usrse">
      <div class="hgs">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f0f0f0">
          <div class="nams">旧密码</div>
          <div style="display: flex; align-items: center; flex: 1; margin-left: 15px">
            <input v-model="passwordInfo.password" :type="psw1 ? 'password' : 'text'" placeholder="请输入旧密码" style="flex: 1; border: none; outline: none; text-align: right; font-size: 14px" />
            <img @click="changPsw('psw1')" :src="psw1 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAApBAMAAAB94JwtAAAALVBMVEVHcEyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4u91FUCAAAADnRSTlMA3wrHcPOxnBiJTStfPDGCjsgAAAITSURBVDjLfVSxahRRFL07WbIzJoWxiILyGBuRgEvCEiQgYWMiVopJIUFksFYIC4oIQoiFVhFS2QjLFhYSQdKksFniDwRB7EQYl9kQTc43eO+dNzPvRcgtZuZx5rx7znl3hogrukGn1F205fbh6cxE69nH/9Ejvjaglc3t+OgVYI+oCVuDmz68JuQRYHnCCJz6cCTkYOlTTFd/vhO47aJ14E+52FwDhhsVGM7z+71yObYOPKjQH9KsItMYs7eKxThw8N0l0xmDg+J5nzUFBse+x0f2ReAi0WXgmwN3C3IfKSsMDf76LtRVkOCc3Jm846WrnUYBNVeDR24gi1VTLodNZi55XnUlubUAqcGqgzaFFSG1pg9ryJwAxwVo2o0jHLPsC97WPTaW2x7FCr1Sb0XtYpoMYoueJZ9cwz3m7pVceo00LtE+c5v4bf2x29Amo2W4b2QDreNQe5XkumgObPohMjnZhLdz/HJWK042uxh4WY3YdR9DicxYciOPPwQ6di4vxTRl7Mv5F0D0S/XIUOP+84QnbDo/305x0B17lHkNlTIsp2SgR3dLsSUdqc+ldiY/VFOLCdKX3JFp0aQzJXiiD2+3N5yWxfiylhfVcr8aZq033O9xEeFU9wSZvjJ8/o7g127LR+qTgwWRu9xqzSS5qy0fXkRZ6fuuDaiqL7MWvN6TkHsn4ND556yjfco/qjGpDv4Bsrs/49ZnrnQAAAAASUVORK5CYII=' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAAnBAMAAABH6v1dAAAAKlBMVEVHcEyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4tRx79UAAAADXRSTlMA2DGJ7RqvoEXEcQlcReF+4gAAAc9JREFUOMt1VM1LQkEQ34xXph6si3UQvPYhFCQFJXgsQgjBW4FgIR6E6hIdhFeHiCAIuvSB0KlLCBLRqUDsEB3Nl2Y4/0uzu7Pvu4HH7O7M7PzmtzOPMVPCc0vlm9LqLPOTrR0QYtxueo2nWVDSb7qNn2CT9r3TOM3Piif5fO58ny91u3EYT64StJmpAXRtuQNxgGtrG6wArFnbC4BJscidiXoCGG2mDgH8cq0tYD0HfBUB6ChrHQyBYlEA3iWU89KIjndcvxAbAl1VBSehK3SNqv2iKgQnWhYKXI8oLgzhm5ZeY9BWwEn2pLMhMW0Ia9y0ftMevcIAAnDAolni2eZXj0LPJFM9ArHQ5y4ZJtNb0qCrdSxMcjZksyYI5iWLywIcVp1OMqwiq/aJTUIUv//zNrHqjj/mCNcaXeSp9w1+xGtEfbmqIGTGnokOF8+YifdWkLrE9UZ12S+oB973DdEVyLQMdvRGmlqC5+81XH2FngWyYsYJZ08Gs2YovwZW7P2sVc2WlBCMR6v5NUwxsM3RMdK3rDavGNlP2MesjnBiLY7t6QEH2XBOMM8EsF46LPMhN1Ku6eZ4zTdKeX8NH+oZYrrfb0V7Pxofnyq2bEd/eh2JHErF6coAAAAASUVORK5CYII='" :alt="psw1 ? 'eye-close' : 'eye-open'" style="width: 20px; height: 16px; margin-left: 10px; cursor: pointer" />
          </div>
        </div>
      </div>
      <div class="hgs">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f0f0f0">
          <div class="nams">设置新密码</div>
          <div style="display: flex; align-items: center; flex: 1; margin-left: 15px">
            <input v-model="passwordInfo.paypassword" :type="psw2 ? 'password' : 'text'" placeholder="请输入新密码" style="flex: 1; border: none; outline: none; text-align: right; font-size: 14px" />
            <img @click="changPsw('psw2')" :src="psw2 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAApBAMAAAB94JwtAAAALVBMVEVHcEyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4u91FUCAAAADnRSTlMA3wrHcPOxnBiJTStfPDGCjsgAAAITSURBVDjLfVSxahRRFL07WbIzJoWxiILyGBuRgEvCEiQgYWMiVopJIUFksFYIC4oIQoiFVhFS2QjLFhYSQdKksFniDwRB7EQYl9kQTc43eO+dNzPvRcgtZuZx5rx7znl3hogrukGn1F205fbh6cxE69nH/9Ejvjaglc3t+OgVYI+oCVuDmz68JuQRYHnCCJz6cCTkYOlTTFd/vhO47aJ14E+52FwDhhsVGM7z+71yObYOPKjQH9KsItMYs7eKxThw8N0l0xmDg+J5nzUFBse+x0f2ReAi0WXgmwN3C3IfKSsMDf76LtRVkOCc3Jm846WrnUYBNVeDR24gi1VTLodNZi55XnUlubUAqcGqgzaFFSG1pg9ryJwAxwVo2o0jHLPsC97WPTaW2x7FCr1Sb0XtYpoMYoueJZ9cwz3m7pVceo00LtE+c5v4bf2x29Amo2W4b2QDreNQe5XkumgObPohMjnZhLdz/HJWK042uxh4WY3YdR9DicxYciOPPwQ6di4vxTRl7Mv5F0D0S/XIUOP+84QnbDo/305x0B17lHkNlTIsp2SgR3dLsSUdqc+ldiY/VFOLCdKX3JFp0aQzJXiiD2+3N5yWxfiylhfVcr8aZq033O9xEeFU9wSZvjJ8/o7g127LR+qTgwWRu9xqzSS5qy0fXkRZ6fuuDaiqL7MWvN6TkHsn4ND556yjfco/qjGpDv4Bsrs/49ZnrnQAAAAASUVORK5CYII=' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAAnBAMAAABH6v1dAAAAKlBMVEVHcEyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4tRx79UAAAADXRSTlMA2DGJ7RqvoEXEcQlcReF+4gAAAc9JREFUOMt1VM1LQkEQ34xXph6si3UQvPYhFCQFJXgsQgjBW4FgIR6E6hIdhFeHiCAIuvSB0KlLCBLRqUDsEB3Nl2Y4/0uzu7Pvu4HH7O7M7PzmtzOPMVPCc0vlm9LqLPOTrR0QYtxueo2nWVDSb7qNn2CT9r3TOM3Piif5fO58ny91u3EYT64StJmpAXRtuQNxgGtrG6wArFnbC4BJscidiXoCGG2mDgH8cq0tYD0HfBUB6ChrHQyBYlEA3iWU89KIjndcvxAbAl1VBSehK3SNqv2iKgQnWhYKXI8oLgzhm5ZeY9BWwEn2pLMhMW0Ia9y0ftMevcIAAnDAolni2eZXj0LPJFM9ArHQ5y4ZJtNb0qCrdSxMcjZksyYI5iWLywIcVp1OMqwiq/aJTUIUv//zNrHqjj/mCNcaXeSp9w1+xGtEfbmqIGTGnokOF8+YifdWkLrE9UZ12S+oB973DdEVyLQMdvRGmlqC5+81XH2FngWyYsYJZ08Gs2YovwZW7P2sVc2WlBCMR6v5NUwxsM3RMdK3rDavGNlP2MesjnBiLY7t6QEH2XBOMM8EsF46LPMhN1Ku6eZ4zTdKeX8NH+oZYrrfb0V7Pxofnyq2bEd/eh2JHErF6coAAAAASUVORK5CYII='" :alt="psw2 ? 'eye-close' : 'eye-open'" style="width: 20px; height: 16px; margin-left: 10px; cursor: pointer" />
          </div>
        </div>
      </div>
      <div class="hgs">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f0f0f0">
          <div class="nams">确认新密码</div>
          <div style="display: flex; align-items: center; flex: 1; margin-left: 15px">
            <input v-model="passwordInfo.newpasword" :type="psw3 ? 'password' : 'text'" placeholder="请再次输入新密码" style="flex: 1; border: none; outline: none; text-align: right; font-size: 14px" />
            <img @click="changPsw('psw3')" :src="psw3 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAApBAMAAAB94JwtAAAALVBMVEVHcEyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4u91FUCAAAADnRSTlMA3wrHcPOxnBiJTStfPDGCjsgAAAITSURBVDjLfVSxahRRFL07WbIzJoWxiILyGBuRgEvCEiQgYWMiVopJIUFksFYIC4oIQoiFVhFS2QjLFhYSQdKksFniDwRB7EQYl9kQTc43eO+dNzPvRcgtZuZx5rx7znl3hogrukGn1F205fbh6cxE69nH/9Ejvjaglc3t+OgVYI+oCVuDmz68JuQRYHnCCJz6cCTkYOlTTFd/vhO47aJ14E+52FwDhhsVGM7z+71yObYOPKjQH9KsItMYs7eKxThw8N0l0xmDg+J5nzUFBse+x0f2ReAi0WXgmwN3C3IfKSsMDf76LtRVkOCc3Jm846WrnUYBNVeDR24gi1VTLodNZi55XnUlubUAqcGqgzaFFSG1pg9ryJwAxwVo2o0jHLPsC97WPTaW2x7FCr1Sb0XtYpoMYoueJZ9cwz3m7pVceo00LtE+c5v4bf2x29Amo2W4b2QDreNQe5XkumgObPohMjnZhLdz/HJWK042uxh4WY3YdR9DicxYciOPPwQ6di4vxTRl7Mv5F0D0S/XIUOP+84QnbDo/305x0B17lHkNlTIsp2SgR3dLsSUdqc+ldiY/VFOLCdKX3JFp0aQzJXiiD2+3N5yWxfiylhfVcr8aZq033O9xEeFU9wSZvjJ8/o7g127LR+qTgwWRu9xqzSS5qy0fXkRZ6fuuDaiqL7MWvN6TkHsn4ND556yjfco/qjGpDv4Bsrs/49ZnrnQAAAAASUVORK5CYII=' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAAnBAMAAABH6v1dAAAAKlBMVEVHcEyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4tRx79UAAAADXRSTlMA2DGJ7RqvoEXEcQlcReF+4gAAAc9JREFUOMt1VM1LQkEQ34xXph6si3UQvPYhFCQFJXgsQgjBW4FgIR6E6hIdhFeHiCAIuvSB0KlLCBLRqUDsEB3Nl2Y4/0uzu7Pvu4HH7O7M7PzmtzOPMVPCc0vlm9LqLPOTrR0QYtxueo2nWVDSb7qNn2CT9r3TOM3Piif5fO58ny91u3EYT64StJmpAXRtuQNxgGtrG6wArFnbC4BJscidiXoCGG2mDgH8cq0tYD0HfBUB6ChrHQyBYlEA3iWU89KIjndcvxAbAl1VBSehK3SNqv2iKgQnWhYKXI8oLgzhm5ZeY9BWwEn2pLMhMW0Ia9y0ftMevcIAAnDAolni2eZXj0LPJFM9ArHQ5y4ZJtNb0qCrdSxMcjZksyYI5iWLywIcVp1OMqwiq/aJTUIUv//zNrHqjj/mCNcaXeSp9w1+xGtEfbmqIGTGnokOF8+YifdWkLrE9UZ12S+oB973DdEVyLQMdvRGmlqC5+81XH2FngWyYsYJZ08Gs2YovwZW7P2sVc2WlBCMR6v5NUwxsM3RMdK3rDavGNlP2MesjnBiLY7t6QEH2XBOMM8EsF46LPMhN1Ku6eZ4zTdKeX8NH+oZYrrfb0V7Pxofnyq2bEd/eh2JHErF6coAAAAASUVORK5CYII='" :alt="psw3 ? 'eye-close' : 'eye-open'" style="width: 20px; height: 16px; margin-left: 10px; cursor: pointer" />
          </div>
        </div>
      </div>
      <div style="padding: 20px">
        <button style="width: 100%; height: 44px; background-color: #054dc4; color: white; border: none; border-radius: 4px; font-size: 16px" @click="editPassword(type)">确定</button>
      </div>
      <div style="height: 60px"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'password',
  data() {
    return {
      passwordInfo: {},
      type: 1,
      psw1: true,
      psw2: true,
      psw3: true,
    };
  },
  created() {
    let that = this;
    let query = that.$route.query;

    if (query.type) {
      that.type = query.type * 1;
    }
  },
  methods: {
    changPsw(name) {
      this[name] = !this[name];
    },
    changtab() {
      let that = this;
      that.passwordInfo = {};
      that.info = {};
    },
    editPassword(pasType) {
      let that = this;
      if (!that.passwordInfo.password) {
        that.$parent.showTost(0, '请输入旧密码');
        return;
      }
      if (!that.passwordInfo.paypassword) {
        that.$parent.showTost(0, '请输入新密码');
        return;
      }
      if (that.passwordInfo.password.length < 6) {
        that.$parent.showTost(0, '请输入正确的旧密码长度');
        return;
      }
      if (that.passwordInfo.paypassword.length < 6) {
        that.$parent.showTost(0, '请输入正确的新密码长度');
        return;
      }
      if (!that.passwordInfo.newpasword) {
        that.$parent.showTost(0, '请输入确认密码');
        return;
      }
      if (that.passwordInfo.newpasword != that.passwordInfo.paypassword) {
        that.$parent.showTost(0, '两次密码不一致！');
        return;
      }
      if (that.passwordInfo.password == that.passwordInfo.paypassword) {
        that.$parent.showTost(0, '新旧密码不能一致！');
        that.passwordInfo = {};
        return;
      }
      let url = pasType == 1 ? '/api/editPassword' : '/api/editPayPassword';

      that.$parent.showLoading();
      that.$apiFun.post(url, {paypassword:that.passwordInfo.paypassword,password:that.passwordInfo.password}).then(res => {
        console.log(res);
        if (res.code != 200) {
          that.$parent.showTost(0, res.message);
        }
        that.$parent.hideLoading();
        if (res.code == 200) {
          that.$parent.showTost(1, '密码修改成功！');
          that.passwordInfo = {};
          if (pasType == 1) {
            that.$parent.closeDaoTime();
            localStorage.clear();
            sessionStorage.clear();
            that.$store.commit('changUserInfo');
            that.$store.commit('changToken');
            that.$router.push({ path: '/login' });
          }
        }
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
    margin-top: 10px;
   
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
