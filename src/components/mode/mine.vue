<template>
  <div style="background-color: #ffffff; min-height: 100vh; box-sizing: border-box">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="top-left">
        <img :src="$store.state.userInfo.avatar ? $store.state.userInfo.avatar : '/static/image/imageAvatar02@3x.png'" alt="" class="avatar" />
      </div>
      <div class="top-center">
        <div class="username-row">
          <div class="username">{{ $store.state.userInfo.username || $store.state.userInfo.userid || $store.state.userInfo.id || $store.state.userInfo.user_id || $store.state.userInfo.account || $store.state.userInfo.name || $store.state.userInfo.nickname || $store.state.userInfo.user_name || '' }}</div>
          <div class="right-buttons">
            <div class="settings-btn" @click="$parent.goNav('/userInfo')">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAMAAACf4xmcAAAARVBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////9X1DS3AAAAFnRSTlMAGS/foQqV7bPpd77Q+KjIWkuehmc9s4NUtAAAARhJREFUOMuNlFkShCAMRAPI5gau9z/qOAQLGIhO/yDyKiakI8BXrDfCJg3Q1DadhURxejBch/NHY0HFbUWdOqOWa79eax8jmCSVKB8OO5BhHXg76x1j9BiMKO3+0gJgrmVibxQIOtiG1PF91rGSWgqrxqwtha05FbCuQc3YjztrAjMlRWDYmVHCIzYGymVvGphEqrimGmMiUAZ33Hu/NDBmAzXnFcsK4zpQKr9kXWF8Kqk2dmAbN3jElttej1g04Q6PmMS8PDxjmL+HNww4WvUNg90Dja1AK2L6P0ykLjfVXec2DqCkMY3G63M7EON19Y6hbdoDzXAIWRpaZ2o5bMuaGZ+WKKxPUqwc8Lbm7Ba4clbXsk7Ff8MHTt0sQUfXju4AAAAASUVORK5CYII=" alt="设置" class="settings-icon" />
              <span>设置</span>
            </div>
            <img src="/static/image/message-icon.png" alt="消息" class="message-icon" @click="$parent.goNav('/message')">
          </div>
        </div>
        <div class="days">加入我们第{{ $store.state.userInfo.joinday || 0 }}天</div>
      </div>
    </div>
    
    <!-- 余额区域 -->
    <div class="balance-section">
      <div class="balance-info">
        <div class="balance-label">我的余额</div>
        <div class="balance-amount">
          <span>￥</span>{{ Math.floor($store.state.userInfo.balance || 0) }}
          <img :class="{ 'rotate': isRefreshing }" @click="refreshBalance" src="/static/style/sx.png" alt="reload" class="refresh-icon" />
        </div>
      </div>
      <div class="balance-buttons">
        <button class="deposit-btn" @click="$parent.goNav('/recharge')">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAABVCAMAAABgtsYAAAAAUVBMVEVHcEwfc/FGme0ecvFFmO49ke42ie8yhu82ie8fc/FFmO0lefBCle40h+8hdfEfc/EqffA+ku45je8vg/Dw8PBcnPDH2fCSvPBopu+HtfCryvBW0UanAAAACnRSTlMA47mod/0aiFNZOMZGUgAAB6ZJREFUaN7FW4t2ozoMbNKclALmGQjm/z/0+o0kyxCK91yRs9uz7bbT8Uga28rXF4pnUfwmo/gt/n08v5JRfN/apm1cVE0FolOP+UM9W4zdiELgGHD0+vFRq5ePsi5B3AsW3ePWBmwanUGIMeIY/eOw2Ud4kIOCJ8yzgcMQewBRo9ziEXOn0OlA/Cl0DWCwQuSNEX/CgNzgiQAOMAiw6Wdj0D4+CIe/TevwwcD0KWwaXkUJBPSJES+vfe3x12P+ap7Cn7Yl+Cr38hA7+8IEWngdL0BLH0B4xB+R4Q9gr43wWXgsgWF1Owgv8DdidAf6g/zVJUIYABYthw8L0PMX5wcSINSfgOkR5S+jP8zfpsEbj4/ozy9vRfKjg9mLF9jCEg7ccJK/snSFpW359a1whWH1h9UX6Q/yR9Ed8udW+NYm+SPB6o8nkNGfTQ9E3wF/5RMnxw5/sf5GKkBU/mL9WfoAwmP+TJH5bts/6U9DRPlLC6AHJ3B5OaG/8k6X94T+NHcofzF/nj3CH+rAh/ypBX627V/0l+APlhfnD6ICM3zOnyoxBY/PNY9mt/7RAkjsAc7fP/FXkPSg/SOpv5EWGK4AQv31f9GfSpAkPsxfle6/qfzdSkyoMKf528MX+RcKj/TfyMAMpP4F+Q3X+av8AjP6W3rWv0T5i90Lpe8qf1WTKC/l6zWvYvMvIpW/cp7nCSIsX/P8PpW/B/pjC/T7pQBC/XXsAg9Cf+EC5beof1gz66+J9DernyI76v/GOH8tPrDA5h/6TPlb0f2RSw5NwquP8ldQA8Pwp3+z8kz/PeLP4asnEKte3omJZVpqDVB/YEJ/pVxc1Aqi/p99Hv4q4J8b/Xt/FG/F28h/9TL0mvl3n4s/UJxP4FP8pfANms+pz6W/TYG5+KOfuKi/LTkWGcL8DCnf+tEvHBOTvyEmCvmi/hq8/zXpK/T3XZMeEO3OKb71lZU/WvwMQKm/78AUP6b8UXya+tnHVf4awp9tHwOijxpA3UHS/cM0D28OSlNqcukvnA6ZJRrB0iJ35dFJQJL/0C7v4g2CtKXmmv4qyp9pHaq1lRMbg+VufDPpO9Qa7GAsg8JlwGarfw7g+HLOIFFvFqc/Fp9hzHfgyXeSa/7FZEgT8tes7qRMQgLf5Ba49A0OhCl+pcf3tkYmr382ufvu0vxNJH/hBlPa7HD4Zt9JLvZfoL+uNqtrfCnVn0Gu1KXR4ROEYF4MIo9vccubU3/jy9GHzsdNWHjrEPzVOwrtZVaF0+IzDjJf/zXw7JrK+ADGtVUJ3B/TmIf6ray+52+dX9f9H1Kfk5yE+1/Dn03WeYL7Iw7f5qANcdN1/wf7h++dktA3zWFtwfkBj0/v3maPL4f/2/pvaO0S62/yhY/tvwJfLQwO35LL/3n+OgtPxvqbAHn0/JQeP5vNL8SXS38uNZaJrq/lb06ev9D7LQXw5fpujv1Hg+zzUjl80rhTa07NXgmUEWn8MxtS02f4nnPrT/eLpfL49vz9rPlLWH/Nn/S+Oav+1ArX1Yf4RBqf4s8KecmrPx8Z+LMfrpn0R87vHT7aeNFeHdeXUJhdgZEOa5l5/4v460j9m7fKEirMIvsN3yThDuQdem/W/hvwVbT+zcz1pXYDqvZ5S2oBWttShgyuM+8/EH8j5g/f/5Zuq67/qq2z8sdD0uSIzFX/Yv66NH9h/2ZcgF9fQ1jtistsvb1RYIb6hwiccP+N+kfYv+k01cvr9Getsz0+0MTNIIUv1j8kwAP+hOXP0VcKrz+/szS7Tb3/9UBz6K+J9Vfx+tuupy19G39maymNTyzN/td8OOXpv+n6ov1f7A/Uy3hkEfhTLkGutSl9crC789l1kQz9t4nwGf7sDYNxpys5gil9n7NpDM6uVn/BsLw8g9f0V4ELEMyf3BqXJPyZja7ZIq3hfNz6ljpcDy6+D1/UX5I/cJbXE/3Vq659/rPldvJXg9tL+/vJf6Y/AQ41RnrBOvWmg9glVfyVdjnRBf9qCfxX+uvs2dQqBbmegWd/r9Xdfix2c47ut1ZfYy75P3j/NuojKtzfunj+YOQGnCZ9z0VGOOTaZ9AfPgGkF/zo9gijG/B0E746D1cMF/VHIcLmNkYQRzTeFNDRC/6Bma/LcP7sRxP35tfIBSY7v4bN8+X9B2xxaHoyGl/j5zfQCGBO/uIDfDpAyWRHtEOn/PVn+SsO6h++P6+4AaJul7+IvTP8Fen5F/Z6uiPnV3F1GeH8ixtBRfNrp/grvr6aD+8/oundMb4BjsebRMzeGf6eO/NXFTM/1JH5jfFj/UXjnZ/wd0/Or1XEIST0hysMrz8R6DvNnx4AfDYX9Bf3j1h/yfGrY/6eeHj3lP7I+AalL65/0QDMIX93O3N/+5P+mAkJMe7VP49u+Ji/ZzRevHf+kqh/8H4Q31/iAc/z/D3i8eyd85dU/eP58/N/Ap8/IwEe8HffBrS/0+cvyf4bTV/F82uD2DcIu/zd2QH3z/vvyFhAwdvTxPzpLn938gaB2+n+G/srbv4vHnBP87f3Dovnd3Oy/o2MPcUVmrVXn+jvzr2L5vlza/j5pqS/So8/Cyy+LX/7/uj9Kfef5Ht8nsXv4+f/jMeDvAHpP0TIAksIEINcAAAAAElFTkSuQmCC" alt="" class="btn-icon" />
          <span></span>
        </button>
        <button class="withdraw-btn" @click="$parent.goNav('/withdraw')">
          <img src="data:image/png;base64,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" alt="" class="btn-icon" />
          <span></span>
        </button>
      </div>
    </div>
    
    <!-- VIP等级区域 -->
    <div class="vip-section">
      <div class="vip-info">
        <div class="vip-level">当前等级VIP{{ $store.state.userInfo.vip || 0 }}</div>
        <div class="growth-value">VIP{{ vipTab }}成长值 {{ userStats.flow || 0 }}/{{ currentVipFlow  || 0 }}</div>
       
      </div>
      <div class="vip-progress">
        <div class="vip-progress-bar">
          <div class="vip-progress-fill" :style="{ width: (vipProgress || 0) + '%' }"></div>
        </div>
      </div>
      <div class="vip-tabs">
        <div class="vip-tab" @click="$parent.goNav('/vip')">晋级礼包</div>
        <div class="vip-tab" @click="$parent.goNav('/vip')">每月红包</div>
        <div class="vip-tab" @click="$parent.goNav('/vip')">每周红包</div>
        <div class="vip-tab" @click="$parent.goNav('/vip')">专属活动</div>
      </div>
    </div>
    
    <!-- 功能按钮区 -->
    <div class="function-section">
      <div class="function-grid">
        <div class="function-item" @click="$parent.goNav('/transRecord')">
          <img src="data:image/png;base64,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" alt="资金明细" class="function-icon" />
          <span>资金明细</span>
        </div>
        <div class="function-item" @click="$parent.goNav('/betRecord')">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACtCAMAAAD1cQ9xAAAAYFBMVEVHcEzz+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/f5Orz+P8qKioAXOA0NTW+wsfU2d98rPBAhunp7fVJSUqmqa2JjI+2ub7A2PloaWtvpO/IzNKanaE0bcrGAAAADnRSTlMAhnFc16q/7g8iSZg32cdhaewAAATzSURBVHja7Z1tT+MwDMeXNI9NlV230bEx4Pt/y0Njxx1jWxPbjRPp/i+QkPrih3FtJ03s1YpSzvedlEKIED5+yK4fvFtVqKETWtl4Q9Zo0ftqQH0XVJyTNaJnN7PrtI3JUqJnNKo0MVdWdxwmdgDUL+DCrL2OGFnhC5pVRbRMGRf2wkYSqeUdwoVIJyuXZaWyawn7SmLWM+9C/turuIj0AvHB67iYyN23s3FBqYHUsCYuLNGKYS/ZwlcYYh8EX5Jg5lUspEAQt2wsJrQ3yFhSFhcbQiwri8hsTsfiAmcKZyKDREuwQFynIpNCS7AAXC43ADkDL2xuZNCRWTlFg4js6itNt3eyWmrNMMQapNL2y5ytgjbqJFoTK5Fs4w37o/n6sa8Hdt51ORNuvuvqWJW6ZvzgHHVdA8ErrRwLsTr1lSexq7hQf15IyRFdjbB3XzRVJe2dF03GSnWzdrS10oaWTHvLuM7WS6sbCQgXuUYCwu39hb5m2B8xF5XGjvvxofYH2oTmUbDrWWFxFd1ibJynXW8pl2iY8DUlwK6PhBkC946l2PYN+56RVeEptBvCqhzgCMfT/o8+ed43N3X8/Fu+Hj69Y/NZviNsT8nv0Q/L7484V8h2hGlM/l9nPJroCtlZd79G0a4xUSE7NWzWSFpIslDQyvaEpd0jqlwDc4TT86fexwTaw+Xhw/m3EbHLlB2/roLA+DD+j98fhtNqYEXz3ZgX6x2nm9p+f3gLp1XABdlN2nvl4pqK9tNxAw1tWubF0PawNc4VbU4NhqGVsCIBQPtGQKthy4arkHWYh/0KsBhaBattrwPsaRZ2oqCNsD2aH+lgu3mof0IxitaDKvERXkmhaHvQ2pyLtgNt0nDRCtAqh4v2o8SN7dDqlWuI1oD2lLhoFegb2X/atFV6T0K7e3qg3VQX7dOvx5poaCMJ7csM7K/Xmmh3c7RPTdl2R+W3JDHhNdW0VdDGl90DvdBFsLZyWVu0bVU1jdW3ba0dGlqXSdBZQMY1r2iH1oOOUXDROtABO6b69rzd3Ex9qyn2b4vVtwJ2QJipvu0ovjvEOM3RvpDQetg5Vp761gK/l/HUtxr4LZIn3krgESAe2gF4AJuF1kIPqrDQBuiVDBbaDno+lIXWQc/ectBq8O0cDtoOfFSYg9aBj2Ez0Gr4BR0G2h5+Q6c8rUKcbS5PKxFH8svTesR1B8Rx5QlEGzAXYy8H0rYAPYNoPeYuyWmN1B4RvrKNe8TSnkCVLdS4I5J2yoI1yCvdSOM+o02bZ9wNxroHtNfmbixMh5nbLvdvwWyxAaHme1CilXvd58Wja+XO/FUV/qPPWnXXDU3t3VSSXrEqL3fPtP6oyxfMbO/FmuLBfIcd3UQ8qK9PSVKbsKES11WJbUNbcdqK2gGlN5LUTbxhtTSKy+xsxx0Y9CpLvDktE5YX16xW7eAayEwFLlwNGwDhVRM+y4mLaN5cPu7i2roX7sGF7eJdcqVm8Q3oyxWQhmIajC/kvFSt8ktUkJZuKsWgKk0JLJ39LfV4kiXNqxcYtiQXCg4LzVHxS7jDgjN1BupgZsOiE7doecPiw6sGTWbXIoO2SPzXymJT19AzwUzhgWtDAAc0JThGHPbaQlCHFZcGkeMS1kjuwZGuFylRzWo51DKXc+iEuWdlq7SsaBjn39A2dFIErbX5kNbhPOmU0qC/AeggEimpppznAAAAAElFTkSuQmCC" alt="投注记录" class="function-icon" />
          <span>投注记录</span>
        </div>
        <div class="function-item" @click="$parent.goNav('/userCent')">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACtCAMAAAD1cQ9xAAAAV1BMVEVHcEzz+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P/z+P8qKioAXOBtb3E9PT7IzNKFh4tVVlebnqGeoaVxpe/D2vkkc+Xc5O+av/SLrd+1uL11zEmIAAAADHRSTlMAcuG0D4bMJPRYPZ7iDpYgAAAFCUlEQVR42tWdi07jMBBF47cdm1IK2zao//+dW2gpgTyIx2N7fKWVUKQlR8PNeOLY467DlDS9Y0wp5a//GHOuNx1Byd4pwW2YEdeeEYI2zPPwl6xQvaxO6oQNm6VVXxFV6RAr610rqF/ApSPsREgRV+UeO6l4SJUVZQJsvA0o0q4Aa8BTZl5U1sy8UtmArlz+dTxkkc8wxhkdcsmi2yGHCUZ2MI0E9h5ehgfLbMgugeReKUIJWZTk0PNQSAhucDYUU7IbVCgpbRqw7KiUTDCv1KG04COF4aGCXEuwwNRQCxaEWw8WgFsTNtq7sipsJG6F1JVQNIhQW9wQHW4XcLfWDC5QkNiYDiwJ2qBaSAdxiUFQgQ3WNGLae7nbimm3WVdTgv1rkGCBlnQ7PvirHBPUYNfyggv0tDykcYK0i2OEoggb+MKQa0nSLjxonibsfO1oiIZ2PrhUQ3vNYrKh0M4FV9GFnaYFSTi005zLKMNOgstJ04aflWMf+9+Hw3OCDi+Rt/NJ6evwlKjnyBvKhGfs+SlZrwM4ibHisLHR1eAqfHhC0SXqpt9VuakQ2qsXgK+/kUbYf95sfwDr9fYLgFYQENoLPHu+AGgfVojNCDfal8K0DPjyWIdWAIeGOrQWWCPUob3XCjK0Qctgcx6VaAXsraESrYVNglaivWVc2wqtiy8SKtIq0MRiLVoBen+sRctBczTxtO/n8zGd1oLmw9dpf5F9XtpddU6m/UgKHJf2+EF2nF7a7U7JtD0gga3STsgel3bpsXXxVcIq7RfZbnrplE7LAOl2hfYB++3SGVgwrYqfpVmh/Ybd7d6XYcG0HvLVaYl2DHv3wiwsmFYg0j7Izg8vzMOCaTVkKnSe9pvs9OWFBVgCtGOy28/nJdj6tD/JzmMDnwI12l9hPK3C1qad/M2Pa7CVad+nZOcV2Lq0w51sPH98WoFNoEXItzey8zCpEs+nQI/206UTstPxOOC+O1zHMpQ64f14LPCmc60TUGuw7LSyIVrWdW3R8nZoe8hawGq0psx8AhKthCyjqDlX09Y8WFtzjG3N37YzN96DFoJV/e7Q1jcdA6Md4LQDiFalfIv8B6e9JHyLBH7nfXoFC7Ka4rEQKNa4B5y1H88Q28Z/6EVaVxP5mDLolow3DNhDfAEGXB96KO6D0VLG+FLh8prGun8LsPwF3J1zeUvQJf5+fSvrWX8aAWKF0lK0N+gsZQSqO3Tmhoa7LG1ah7Ekf/gXrZfUZwy8Jn/Y5x9wf466KVtJQENE/DTCzGYSSBKDjWNDWvoCJ7F9Gdq53YaA4F4gsG8YoQU59xK/1eEfgmspD78LG6Zp7jBbavtAcx8Ua2Vf94d0K3vmf1fhkz5r5GA99W4qWx4xak0/ZitF2l7wLXTW2eYDYnlhS7MlOtuQN7UJo2Ldja2LaFhXb20LRWF2wW5uuSV1E08YnUEiqlVc7cQQ2TWwr4qruq4dXN917eACYOvhgmBr4aoOqBrtOROaN5vSw0RaW/fCrZCTu3iXLHF0egP6ci28UQ4jKPSsYbXKl74NF+Q+iALZBYXCy7GP+8gZXoV/1ofMdXyGznOOiskxVPB8Z9T0Gj1tZT3UzGHyWpX9ADY0Xq6KHBbXY/hXs2IH25nEM8FKnQc2CrBtIKyjBOwgwFpVO41R9lGWsMLVPjjSOL8lS3DB+o6GbkdxLkVUe+YIniD6ccqp8l7c5L1izhnMJ+o/15NdAeyN5E4AAAAASUVORK5CYII=" alt="个人报表" class="function-icon" />
          <span>个人报表</span>
        </div>
        <div class="function-item" @click="$parent.goNav('/welfare')">
          <img src="data:image/png;base64,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" alt="优惠活动" class="function-icon" />
          <span>优惠活动</span>
        </div>
        <div class="function-item" @click="$parent.goNav('/shareMoney')">
          <img src="data:image/png;base64,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" alt="分享赚钱" class="function-icon" />
          <span>分享赚钱</span>
        </div>
        <div class="function-item" @click="$parent.goNav('/agentCenter')">
          <img src="data:image/png;base64,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" alt="代理中心" class="function-icon" />
          <span>代理中心</span>
        </div>
      </div>
    </div>
    
    <!-- 新人福利中心 -->
    <div class="welfare-section" @click="$parent.goNav('/welfare')">
      <div class="welfare-content">
        <div class="welfare-text">
          <div class="welfare-title"></div>
          <div class="welfare-subtitle"></div>
        </div>
        <div class="welfare-button"></div>
      </div>
    </div>
    
    <!-- 底部菜单 -->
    <div class="bottom-menu">
      <div class="menu-item" @click="$parent.goNav('/about')">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9CAMAAAApvJHbAAAAS1BMVEVHcEwAXOAqKioqKioqKioqKioAXOAqKioqKioqKioAXOAqKioAXOAAXOAqKioqKioqKioAXOAqKioqKioqKioqKioqKioqKioAXOBocunxAAAAF3RSTlMA2p4s2cnjwALlghnMb2l/rSzk4tvuTM6TgrEAAAD2SURBVEjH7dfLEoMgDAXQCKI8xGfV/v+XloBT25kummBX5W5wcwwiMwSAENeLlhbRSzgy7JwIHfG486L4lWP18M3paSZlSUhCj0MtNS2uTcUFDg7IMVgU8CULHUeX9MzQKrhb0pqn66Kv1r7rPFv7e4hlat2gbri183Scuc9ZNQv6/3bLZO3E1XrCNZ+4tTvUXdZuqYouuuhfaZtzGgReNbac35drfsfVZtU2n/S3Xe6Yutw3vSlD67BftGxp3f0Ip5bUG4bSSZtgBetWE1dePy8nhnajwvmu5rDrQPx3/TkXtETtzg9x4W9TN812WAmsSFHXTPsABiFaUjfYl4kAAAAASUVORK5CYII=" alt="关于我们" class="menu-icon" />
        <span>关于我们</span>
        <img src="/static/style/icoArrowGrey@2x.abc43ab099390c4587d33290a76fc15e.png" alt="" class="menu-arrow" />
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <Foot />
  </div>
</template>
<script>
import Foot from '../libs/Foot';
export default {
  name: 'mine',
  components: {
    Foot
  },
  data() {
    return {
      isRefreshing: false,
      vipProgress: 0, // 示例进度
      vipGrowth: 0, // 示例成长值
      vipTarget: 63000, // 示例目标值
      vipTab: 3,
      userStats: {
        flow: 0
      },
      currentVipFlow: 0
    };
  },
  created() {
    let that = this;
    if (that.$store.state.token && that.$store.state.userInfo.vip) {
      that.vipTab = parseInt(that.$store.state.userInfo.vip) || 3;
    }
    // 获取完整的用户信息
    that.getUserInfo();
    that.refreshBalance();
    // 获取 VIP 特权数据
    that.uservip();
    // 获取用户真实数据
    that.getUserRealData();
  },
  methods: {
    getUserInfo() {
      let that = this;
      that.$apiFun.post('/api/user', {}).then(res => {
        if (res.code === 200) {
          let userInfo = res.data;
          let str = userInfo.current_vip;
          let index = str.indexOf('P');
          let vip = str.substr(index + 1, str.length);
          userInfo.vip = vip;
          that.vipTab = parseInt(vip) || 3;
          
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.$store.commit('changUserInfo');
          console.log('用户信息已获取:', userInfo);
        }
      }).catch(err => {
        console.error('获取用户信息失败:', err);
      });
    },
    refreshBalance() {
      let that = this;
      if (that.isRefreshing) return;
      that.isRefreshing = true;
      console.log('刷新余额...');
      that.$apiFun.post('/api/balance', {}).then(res => {
        console.log('余额刷新接口返回:', res);
        if (res.code == 200 && res.data && res.data.balance !== undefined) {
          let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
          userInfo.balance = res.data.balance;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.$store.commit('changUserInfo');
          console.log('余额已刷新:', userInfo.balance);
        }
      }).catch(err => {
        console.error('刷新余额失败:', err);
      }).finally(() => {
        that.isRefreshing = false;
      });
    },
    uservip() {
      let that = this;
      that.$apiFun
        .post('/api/uservip', {})
        .then(res => {
          if (res.code == 200) {
            // 更新当前 VIP 等级的流水要求
            if (res.data[that.vipTab - 1]) {
              that.currentVipFlow = res.data[that.vipTab - 1].flow || 30000;
            }
          }
        })
        .catch(res => {
          console.log('获取 VIP 数据失败:', res);
        });
    },
    getUserRealData() {
      let that = this;
      
      // 调用会员列表接口获取数据
      that.$apiFun
        .post('/api/game/users', {})
        .then(res => {
          if (res.code == 200 && res.data) {
            // 假设返回的数据中包含当前用户的信息
            // 这里需要根据实际接口返回的数据结构进行调整
            const userData = res.data.find(user => user.id == that.$store.state.userInfo.id) || {};
            
            // 更新用户统计数据
            that.userStats = {
              deposit: userData.recharge || userData.deposit || userData.total_recharge || that.userStats.deposit,
              flow: userData.flow || userData.bet || userData.total_bet || userData.total_flow || that.userStats.flow,
              growth: userData.growth || userData.exp || userData.experience || that.userStats.growth,
              maxGrowth: that.userStats.maxGrowth
            };
          }
        })
        .catch(res => {
          console.log('获取会员列表数据失败:', res);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
// 顶部导航栏
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: #054dc4;
  color: white;
  
  .top-left {
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid white;
    }
  }
  
  .top-center {
    flex: 1;
    margin-left: 15px;
    
    .username-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      
      .username {
        font-size: 18px;
        font-weight: 600;
      }
      
      .right-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .settings-btn {
          display: flex;
          align-items: center;
         background-color: hsl(0deg 0% 0% / 21%);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          cursor: pointer;
          
          .settings-icon {
            width: 13px;
            height: 13px;
            margin-right: 3px;
          }
        }
        
        .message-icon {
          width: 18px;
          height: 18px;
        }
      }
    }
    
    .days {
      font-size: 12px;
      opacity: 0.9;
    }
  }
}

// VIP等级区域
.balance-section {
  padding: 25px;
  background-color: #054dc4;
  color: white;
  
  .balance-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    
    .balance-label {
    font-size: 14px;
    opacity: .9;
    /* left: 80px; */
    /* justify-content: flex-start; */
    /* -webkit-box-pack: start; */
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    /* -webkit-box-align: center; */
    -ms-flex-align: center;
    align-items: center;
    /* font-size: 16px; */
    /* font-weight: 700; */
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    position: relative;
    left: 20px;
    position: absolute;
    font-size: px;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: transform;
    }
    
    .balance-amount {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      justify-content: flex-start;
      position: relative;
      left: 80px;
      position: absolute;
   
    font-size: px;
    transform-origin: left top;
    transform: scale(1);
    backface-visibility: hidden;
    will-change: transform;
      
      span {
        font-size: 16px;
        
      }
      
      .refresh-icon {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        cursor: pointer;
        
        &.rotate {
          animation: rotate 1s linear infinite;
        }
      }
    }
  }
  
  .balance-buttons {
    display: flex;
    left: 219px;
    will-change: transform;
    backface-visibility: hidden;
    transform: scale(1);
    transform-origin: left top;
    position: absolute;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    padding: 0px;
    top: 5.9em;
    flex-wrap: nowrap;
    
    button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      
      .btn-icon {
        width: 52px;
        height: 28px;
      }
      
      &.deposit-btn {
        background-color: #054dc4;
        color: white;
        
      }
      
      &.withdraw-btn {
        background-color: #054dc4;
        color: #054dc4;
      }
    }
  }
}

// VIP等级区域
.vip-section {
margin: -15px 0 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
    background-image: url(https://pph5.baijin.xyz/assets/mine-vip-background-DOPhuAkg.png);
    background-size: cover;
    height: 2.07729rem;
    padding-top: 0.33816rem;
    background-repeat: no-repeat;
	border-radius: 18px 18px 0 0;
  
  .vip-info {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    align-content: stretch;
    flex-wrap: nowrap;
    padding-left: 20px;
    
    .vip-level {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 0;
      margin-right: 30px;
    }
    
    .vip-progress-text {
      font-size: 12px;
      color: #999;
    }
  }
  
  .vip-progress {
    margin-bottom: 15px;
    
    .vip-progress-bar {
      width: 100%;
      height: 3px;
      background-color: #f0f0f0;
      border-radius: 3px;
      overflow: hidden;
      
      .vip-progress-fill {
        height: 100%;
        background-color: #ff6b6b;
        border-radius: 3px;
      }
    }
  }
  
  .vip-tabs {
    display: flex;
    justify-content: space-between;
    
    .vip-tab {
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: #666;
      
      border-bottom: 2px solid transparent;
      
      &:hover {
        color: #4a90e2;
        border-bottom-color: #4a90e2;
      }
    }
  }
}

// 功能按钮区
.function-section {
  padding: 0 15px;
  margin-bottom: 15px;
  
  .function-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    
    .function-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      padding: 20px 10px;
      border-radius: 8px;
     
      
      .function-icon {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
      
      span {
        font-size: 12px;
        color: #333;
      }
    }
  }
}

// 新人福利中心
.welfare-section {
      margin: 0 18px 12px;
  background-image: url('https://pph5.baijin.xyz/assets/mine-new-member-banner-0o8020v_.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  cursor: pointer;
  
  .welfare-content {
    display: flex;
    align-items: center;
    padding: 20px;
    
    .welfare-text {
      flex: 1;
      
      .welfare-title {
        font-size: 14px;
        font-weight: 600;
        color: white;
        margin-bottom: 5px;
      }
      
      .welfare-subtitle {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .welfare-button {
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
  
  @media (max-width: 768px) {
    .welfare-content {
      padding: 15px;
    }
    
    .welfare-text .welfare-title {
      font-size: 12px;
    }
    
    .welfare-text .welfare-subtitle {
      font-size: 10px;
    }
    
    .welfare-button {
      padding: 6px 10px;
      font-size: 10px;
    }
  }
}

// 底部菜单
.bottom-menu {

  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .menu-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    
    span {
      font-size: 14px;
      color: #333;
      flex: 1;
    }
    
    .menu-arrow {
      width: 10px;
      height: 10px;
    }
  }
}

// 动画
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
