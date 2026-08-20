<template>
  <div style="background-color:rgb(23 31 57);min-height: 100vh; padding-bottom: 50px">
    <van-nav-bar style="position: fixed; top: 0; left: 0; width: 100%; background-color: #1a1a2e; color: #fff; border-bottom: 1px solid #333" title="VIP特权" left-arrow @click-left="$router.back()" />
    <div style="height: 46px"></div>

    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <div class="user-avatar">
        <img :src="$store.state.userInfo.avatar || 'https://9pgh5.liwifi.top/assets/tp1-jr3eumHT.png'" alt="avatar" class="avatar-img">
      </div>
      <div class="user-details">
        <div class="username">{{ $store.state.userInfo.username || $store.state.userInfo.account || $store.state.userInfo.userid || $store.state.userInfo.id || $store.state.userInfo.user_id || $store.state.userInfo.name || $store.state.userInfo.nickname || $store.state.userInfo.user_name || '用户' }}</div>
        <div class="user-stats">您已完成{{ userStats.deposit }}存款和{{ userStats.flow }}流水</div>
        <div class="growth-section">
          <div class="growth-bar">
            <div class="growth-progress" :style="{ width: growthProgress + '%' }"></div>
          </div>
          <div class="growth-info">
            <span class="growth-value">VIP{{ vipTab }}成长值 {{ userStats.flow }}/{{ currentVipFlow }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP 卡片区域 -->
    <div class="vip-card" v-if="vipLis.length > 0">
      <div class="vip-card-content">
        <div class="vip-level">VIP{{ vipTab }}</div>
        <div class="vip-progress-text">VIP{{ vipTab }}成长值 {{ userStats.flow }}/{{ currentVipFlow }}</div>
        <div class="vip-requirements">
          <div class="requirement-item">
            <div class="requirement-value">{{ vipLis[vipTab - 1] && vipLis[vipTab - 1].recharge || 1000 }}</div>
            <div class="requirement-label">累计存款</div>
          </div>
          <div class="requirement-item">
            <div class="requirement-value">{{ vipLis[vipTab - 1] && vipLis[vipTab - 1].flow || 20000 }}</div>
            <div class="requirement-label">流水要求</div>
          </div>
          <div class="requirement-item">
            <div class="requirement-value">{{ vipLis[vipTab - 1] && vipLis[vipTab - 1].keep_flow || 500 }}</div>
            <div class="requirement-label">保级流水</div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP 等级选择器 -->
    <div class="vip-level-selector">
      <div class="vip-levels">
        <div 
          v-for="(item, index) in 10" 
          :key="index"
          :class="(index + 1) == vipTab ? 'vip-level-item active' : 'vip-level-item'"
          @click="changvipTab(index + 1)"
        >
          VIP{{ index + 1 }}
        </div>
      </div>
      <div class="vip-level-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: (vipTab / 10) * 100 + '%' }"></div>
        </div>
        <div class="progress-markers">
          <div v-for="(item, index) in 10" :key="index" class="progress-marker"></div>
        </div>
      </div>
    </div>

    <!-- VIP 特权详情 -->
    <div class="vip-privileges" v-if="currentVipPrivileges">
      <div class="privileges-title">VIP{{ vipTab }} 专属特权</div>
      
      <!-- 礼金卡片区域 -->
      <div class="info-card-section">
        <div class="info-row">
          <div class="info-card" @click="claimBonus('upgrade')">
            <img src="data:image/png;base64,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" alt="vip-info-1" class="info-icon" />
            <div class="info-detail">
              <div class="info-value">{{ (currentVipPrivileges.list.find(item => item.name === '升级奖励') || {}).value || '0元' }}</div>
              <div class="info-label">晋级礼金</div>
              <div class="claim-button">领取</div>
            </div>
          </div>
          <div class="info-card" @click="claimBonus('monthly')">
            <img src="data:image/png;base64,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" alt="vip-info-4" class="info-icon" />
            <div class="info-detail">
              <div class="info-value">{{ (currentVipPrivileges.list.find(item => item.name === '月俸禄') || {}).value || '0元' }}</div>
              <div class="info-label">月礼金</div>
              <div class="claim-button">领取</div>
            </div>
          </div>
        </div>
        <div class="info-row">
          <div class="info-card" @click="claimBonus('weekly')">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAACGCAMAAAAvpwKjAAAAmVBMVEVHcExhaH9ka4NdZHtWXHJ0fJZsdI1udo9QVmtLUmZXXnNjaoFfZn1dY3p4f5p4gJpHTWBZYHZnboZka4NcY3lhaH9tdI1WXXJeZXxqcYpTWm9wd5BzepRQVmtRWG12fphKUGROVGhMUmZITmH+8+fx4tHj0bp/gY/46tvs3Mnq2L+MjJfi2NK7treamaK5r6erpKHf0sXRxLgoe2p5AAAAEXRSTlMACdle29rbLCzbqkaHFKjryOOsHLkAAAwwSURBVHjaxZzpduq4EoUDZCSQjmdhG8gEhoAN+P0f7mq0S6NFOp1bPmv1+dV8Z6u0VSrJvrkxx2g0mj/8cszn+P964x+jh8nLy91g3N/du2JMHvKni/vpbPLoCTJ6nr3c/bOWo1yXXRRloURapCIWLEL80P8sQvxXGhGOMByPp7PnYZLRxMCgRFFKIGnPQJ4uxO93EDzC8XQyd1M8v9wZdIBiFCWFKIEQhSKFkKMXAlN0IAl+xrNnB8TDTIXAAHxEIIg0LEALHzEwRZJEGOTBLsXaEFCMQmO4UoyEc+CYPltS887AICWnmqIpTAxM0Sco0CICWhCKLsaTkSk3/7EwABJFCwJRaBBiQHqQCIAIMVCCTBw6hRgRKTshRwq1SO0DAnKzkwLhPyiZaHlh0UIeEtUvgBayGjA5AUrSgyAStwqHKS+EFsb8TFUtUkmLUNOCStEPCNECc4ylPH14MSWnmp2qFJIWcJrY0gIEYhFPH0F6zv5ZW1xLzs7SNFEXnlpEQIw+ZiPHkJT6VNW0SH+sBeIgMX5uu2GZvxisU6ZQfAtkhuSdHmIgSYwYoencPldlu9DV+C0xcIjZMnqxeefaqoXJO70miawFCTQdmTNDXVQNiWH0TmBbkcU7gRaEgoLwSatMk3KtIji0UL1TX1ITyT01LeI4CGbGMdGlKH29U1pSQy0vkEELHHRUHu5cecGEsGqRDmjBywsBYdACP7eP6jwpdccApRZb2Ye8M3KkBaBAYkyCW7zSKmPiSovUVmu5tHClBdUCPzMZo9TNU3OLa7UAU9WQFgENnByjO22OrAetUyrCnXkRDWuBk2N+M79zzBHKUErWWehigConjDTf0gcl7kFYYIx+ougM6qJaGGwrZHsi2yRxixFQkPj2ocMwrOzWRVX2zr7upEJ4emevBVbjEWKslZ3ZtXUnWEkSn0kSxAoGsIv19d5pWMw8vDOwqaHMEV/vNCzsQ94JGYKMY5SGNdXfO41aDHknn6qco1PDUWop3mkpL670TqhFJjBKb+9MbaVWdJV3QikyoUbp7530tw2+ILsTCS8tMipGBnPDyzvTRVgcGhAH8uhRhRpILJs4BKEYpXtVlbwzXBzqy1HEhTwgtu225XE+RD5zJKPBMNalp3fiaI5fX1+7rx2LzW7DYo/jmzw0ttvtd4s50GBigEHx9840IhS7L0Kyk0n2lITSMBDM4akFUMOv7lyULZViAzTAcdlfvumYsMAjs6V6FEN+IUgUNZz7EZIZbEja5uBKz0NVnSlIk8Q+WhgGRWprad4Z1lSMy4HZJvUM4R1wHUnPVJYTxxjQQsFQ+hcm76xJYux2x7qKVPPurXvBtBAYVu+0qTHonUQNmqG7y7lIlK4rQ4mTQ72lc4VjmKWAWkgYhaSG4p2Cg6hB9fja1IcoCaWmKzZwhIpzS+eJwBhKCxK5PCiaXRTqwk7U2FyYbVzOFUoiaUGLQybFN3YxgWHxzp4llzD0hcSwtBOM46E+UkF29SFMgBgoqc5bahvbc3WmGIFjIenFkDAcdaekxnGRNBdmXcdzlSDOgVB6aJl1tU2Unb8Zhn2OBJwhBxg+dSdeUCgGniVVfWQW2h4WCS0vUFSdLkyKU4XiSGAMJwZQw6/uDEOBEUWHdkON/HiqiGcnadOSVWX/3VLTSiQMm18wLToM5zqyAI1wjkGqzvWZCIIdvW0WUVjVF7q24aygZgExHFrkVAyO4ez9SmWnUIMWW1XNlrV9WxMIEmRZpZbFMFDgowVUw7hN1fap/aAQtyqaCwdhq9z2XPDSKwZqBO68wLGiGLbery5G0mFQ28JpKQQhgQ0tFitqr4bVO/NcVsN+SKNoEcVQDTpLcWaKkWmKOEYahl0KoYVBDbNdCC1Kus4DDOIWVXOq2/aEUzMA5YXACIAY0C6gFgKjtBbhQIwoalpad/UY9KwI4aGpqrBXQsEwemcOxciX6qBYzjIJBSt58MImqdFty5Tqt8OQ8gKCADGkQUktHWiWGFGz+WLRYfTNHL0GRwwjs/lF3ifGakXVuDf3flNpm5pUVAuyymOMpDu96/ZF5MdhB1rBUOZIBqRYMTXufXq/i4ZCHHdcjURsEcMI8bOiKAF1p4yh+YVMAdVw9i+SqiUUTU0xEnGQicKmPhcxpoij5tSEXbEVKGqofpFBitXqiWIMn5uhAxmTtjjR3EgS0Tk4XDabugrIiop3CU1f4kAMi3f2FPmTUGOg35lQjDN30S4zcd7uCEcWYor95pyIwlNWw+KdgmK15BjpUO+XZWiDBAbrYODKsyYOeqrw4oLXtSoIDGpkA1qslmJQbMtI179AKgYTo0jJqGAjJxSXBm8uA97hYxhx5vJODoFDYAydmxnUSFB1Iit8t43c1qf6VPFOo4Rh9s4eg6lhEwOcFSW6Gig87VjdA7bR+1MYyGo4vLMTY8kx3OdmkaJGyfZFRc239ZSDLfabNmUzNOYYNu+UKFYSxkJdUnsQpGMgXJ+zHgsV47LFG/q2PSe8Gy8wYF5k+hxZGtSw3zkwpSjCmyO6fz9hjvZQkScUSxnHyB3e2VNADOedA47Byp4ScY6wooExNi37axiIbryKYfDOjkJSw3XObsDoBwVPlv3lwlpeDbKpYfALA4b7aFnBQCxFRYaS3GCzVqRopmLk9hFZvr93GIuF82hZx8CZcep6X3sxZzd1ZMTI7Vq8v78LNZTCU+/GSxgF7++Vp5pGSwaFeBeOKjBhOLR4J9FhuMUwY8QJXZrDM5aiTunluyQzYOQDYggMrQjXjiZiBUPUWeQn84ZgMMPsai2GEeQu7+woGMagFroasPDMMMamRvKGJOgxbN7ZU3CMdOjOQcLVCFQMso5lQg1wKAAw7N7ZUchqOM5HkBmDLqfZmWzr40zaB3CM1cBMZfGhDYr5zoFFDVZr0UE5xfJeQGDkeSeHnQJiOM+WZQy59xvgCrAulP1IjzGkxcfHh6KG/c5BIGPwriuvO4OoCNX9SIeReVD0GO77F6oasdz7xbpr+xFFDSeFpIbr/gVXI+sw4NEy2KZ2NbgyKEbTohRwUAbPEFU1LMdVmhpLp11wLaAaljsH/AyRqVGzfcoijqU7B8a+lh+GNCgOMbgaQXWhddeZqhHQXhJsaild33wVQIwhMSjGGIoR6QeqdFBo8+2rrTd4J3sKAynU1jOO4EB75tnS7Rfv8qCEUAt456A7ag0qfsL2RXvl4hiJPKY4tOQIoSEYq0EtPt6YGqYbt8q93zg67XibhZwfbNTjtv33BT9bcdzGztpCvEv20OKNYtwrN24Nd11JsbWodxyCnqh87UxnoP3BIzl5zFceWry9MYyxWQv1qqvgkBA2BoTvLafIVi7Xeu8pOIbFL+S7rnjtONTHfjSOm+N+fzwe992RNHvo+SfeN1V4mtgp3oEWEkY0eL0zCBaVctJJEvRQGfI0RPnS4Z39iHyoanjc1wqkNXvJf2O1euc/0v8T35er3GOKvKlqeN3XMh1lmmzDzzsxhmFQfO9rSe14xgBO7wbrToMYnwIjCq+8rxWbe9A+FR9Izw91UK67mBM7z4oGKFQtejUi6f0R//tawz0+Hy2EGhAiuua+1q9oIdRQvDPyv691pRaSd/YgnwqGx/3OwXMzJ4VpQD4/VYzhKaLc1/LSYmBAOMZ8/IO7a3LdaWl3elN8Ps17DCUxfO5raQxXeWeP8Tq/GU2vTwz9fORfifFJrjTPOr+4IjHUOwfDFOb0fOswJmN+aJX8TIt/4Rc83siLZY9j/b2i5Ff9YkCLz1dy+R8nBzxD/HMtMAZ9QWUmTZHkz7xTgLzN2GsyY/l9s7/wTqDF5yt7TWY0TbylCH7NO3sQ/tLQzWT8M7vIBtqdDgqgxpN44XA+9fdO6b6WhxgO7xRidC8sP4+vuPj7G94JxXgGLxu6aq3f904Y4GXDm4fpH9Za8pA8Si+ijv/cO9Uh4bPl/6HFk/Z68CT5W++kob8sPZrcKu+b/bfeSbUwvjo+Br3fn3nn0t87sYlPzN9aeJ6iP/NOPEes3zd4nI1B7zc22tYv2cXT7NH1qYfprfx2k3zx4ad7dhXjaToZDXz4YjpWGuFX9y8GKN5eBz98wT4DMr29jU39X8/OgYvi6enV5zMgjORxQlCG4kk8vvE6nXp/FEV8IWY0f3j83XB8IuZ/gqWiUneZi14AAAAASUVORK5CYII=" alt="vip-info-3" class="info-icon" />
            <div class="info-detail">
              <div class="info-value">{{ (currentVipPrivileges.list.find(item => item.name === '周俸禄') || {}).value || '0元' }}</div>
              <div class="info-label">周礼金</div>
              <div class="claim-button">领取</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 特权网格区域 -->
      <div class="privileges-grid">
        <div class="privilege-item" v-for="(privilege, index) in currentVipPrivileges.list.filter(item => ['升级奖励', '周俸禄', '月俸禄'].indexOf(item.name) === -1)" :key="index">
          <img :src="privilege.icon" class="privilege-icon" />
          <div class="privilege-name">{{ privilege.name }}</div>
          <div class="privilege-value">{{ privilege.value }}</div>
        </div>
      </div>
      
      <!-- VIP 数据表格 -->
      <div class="table-wrapper">
        <table class="vip-data-table">
          <thead>
            <tr>
              <td>VIP等级</td>
              <td>晋级礼金</td>
              <td>周礼金</td>
              <td>月礼金</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in vipTableData" :key="index">
              <td>{{ item.level }}</td>
              <td>{{ item.upgradeBonus }}</td>
              <td>{{ item.weeklySalary }}</td>
              <td>{{ item.monthlySalary }}</td>
            </tr>
            <!-- 如果没有数据，显示默认数据 -->
            <tr v-if="vipTableData.length === 0">
              <td>VIP1</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP2</td>
              <td>3</td>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP3</td>
              <td>8</td>
              <td>2</td>
              <td>5</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP4</td>
              <td>18</td>
              <td>5</td>
              <td>10</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP5</td>
              <td>58</td>
              <td>10</td>
              <td>18</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP6</td>
              <td>188</td>
              <td>18</td>
              <td>28</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP7</td>
              <td>388</td>
              <td>28</td>
              <td>58</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP8</td>
              <td>888</td>
              <td>58</td>
              <td>118</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP9</td>
              <td>1888</td>
              <td>118</td>
              <td>288</td>
            </tr>
            <tr v-if="vipTableData.length === 0">
              <td>VIP10</td>
              <td>5888</td>
              <td>288</td>
              <td>588</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 规则说明区域 -->
      <div class="rule-wrap">
        <div class="title">
          <img src="https://9pgh5.liwifi.top/assets/vip-rule-title-Cb6LB53T.png" alt="vip-rule-title" />
        </div>
        <div class="rules">
          <div class="small-text">
            <span class="bold brown-text">晋升标准：</span>
            <span>会员的累计有效投注会得到相应的VIP成长值。达到相应级别的要求，即可在次日晋级相应VIP等级，数据统计时间从VIP系统上线当日0点开始。</span>
          </div>
          <div class="small-text">
            <span class="bold brown-text">VIP成长值：</span>
            <span>根据不同平台产生的有效流水会获得相应的VIP成长值、具体对应数值请杳看VIP专题页。</span>
          </div>
          <div class="small-text">
            <span class="bold brown-text">保级要求：</span>
            <span>会员在“VIP等级变更”后的30天内，需完成相应等级的有效投注要求方可继续保级30天。</span>
          </div>
          <div class="small-text">
            <span class="bold brown-text">降级标准：</span>
            <span>如果会员在30天内没有完成相应的保级要求有效投注，系统会自动降级一个等级，福利也会随之调整至降级后的等级。</span>
          </div>
          <div class="small-text">
            <span class="bold brown-text">晋级礼金：</span>
            <span>会员晋升到该级别后系统自动派发，每个级别的升级礼金仅能获得1次(1倍流水即可提款)。</span>
          </div>
          <div class="small-text">
            <span class="bold brown-text">周月礼金：</span>
            <span>周礼金于每周一08:00自动派发，月礼金于每月3日08:00自动派发，所得礼金一倍流水即可提款。</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vip',
  data() {
    return {
      url: null,
      vipLis: [],
      vipTab: 3,
      bfNum: 0,
      userStats: {
        deposit: 0,
        flow: 0,
        growth: 0,
        maxGrowth: 30000,
      },
      currentDate: '',
      vipTableData: [],
      currentVipFlow: 30000, // 当前选中 VIP 等级的流水要求
      vipPrivileges: {
        1: {
          title: '新手专享特权',
          list: [
            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '3元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '1元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '2元' },
          ]
        },
        2: {
          title: '进阶专属特权',
          list: [
            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '8元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '2元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '5元' },
          ]
        },
        3: {
          title: '白银尊享特权',
          list: [
            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '18元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '5元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '10元' },
          ]
        },
        4: {
          title: '黄金尊享特权',
          list: [
            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '58元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '10元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '18元' },
          ]
        },
        5: {
          title: '铂金尊享特权',
          list: [

            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '128元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '20元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '38元' },
          ]
        },
        6: {
          title: '钻石尊享特权',
          list: [

            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '288元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '50元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '88元' },
          ]
        },
        7: {
          title: '星耀至尊特权',
          list: [

            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '588元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '100元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '188元' },
          ]
        },
        8: {
          title: '王者至尊特权',
          list: [
      
            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '1288元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '200元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '388元' },
          ]
        },
        9: {
          title: '荣耀至尊特权',
          list: [

            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '2888元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '500元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '888元' },
          ]
        },
        10: {
          title: '传奇至尊特权',
          list: [
            { icon: '/static/image/vip-icon-5.png', name: '升级奖励', value: '5888元' },
            { icon: '/static/image/vip-icon-6.png', name: '周俸禄', value: '1000元' },
            { icon: '/static/image/vip-icon-7.png', name: '月俸禄', value: '1888元' },
          ]
        },
      }
    };
  },
  computed: {
    currentVipPrivileges() {
      return this.vipPrivileges[this.vipTab];
    },
    growthProgress() {
      if (!this.currentVipFlow) return 0;
      return Math.min((this.userStats.flow / this.currentVipFlow) * 100, 100);
    }
  },
  created() {
    let that = this;
    if (that.$store.state.token && that.$store.state.userInfo.vip) {
      that.vipTab = parseInt(that.$store.state.userInfo.vip) || 3;
    }
    // 初始化当前日期
    that.currentDate = '2026-03-31 00:00:00';
    that.uservip();
    // 获取真实数据
    that.getUserRealData();
    // 获取真实 VIP 特权数据
    that.getVipPrivilegesData();
  },
  methods: {
    changvipTab(val) {
      this.vipTab = val;
      // 更新当前 VIP 等级的流水要求
      if (this.vipLis[val - 1]) {
        this.currentVipFlow = this.vipLis[val - 1].flow || 30000;
      }
    },
    uservip() {
      let that = this;
      that.$parent.showLoading();

      that.$apiFun
        .post('/api/uservip', {})
        .then(res => {
          if (res.code == 200) {
            that.vipLis = res.data;
            that.getbfNum();
            // 更新当前 VIP 等级的流水要求
            if (that.vipLis[that.vipTab - 1]) {
              that.currentVipFlow = that.vipLis[that.vipTab - 1].flow || 30000;
            }
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    getbfNum() {
      let that = this;
      let num = 0; //当前vip充值钱
      let vip = that.$store.state.userInfo.vip * 1;
      that.vipLis.forEach((el, index) => {
        if (index == vip) {
          num = el.recharge * 1;
        }
      });
      let userMey = that.$store.state.userInfo.paysum * 1;
      let bfNum = userMey == 0 || num == 0 ? 0 : Math.round((userMey / num) * 100);
      that.bfNum = bfNum > 100 ? 100 : bfNum;
    },
    // 从会员列表获取真实数据
    getUserRealData() {
      let that = this;
      that.$parent.showLoading();
      
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
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
          console.log('获取会员列表数据失败:', res);
        });
    },
    // 获取真实 VIP 特权数据
    getVipPrivilegesData() {
      let that = this;
      that.$parent.showLoading();
      
      // 调用 VIP 特权接口获取数据
      that.$apiFun
        .post('/api/vip/privileges', {})
        .then(res => {
          if (res.code == 200 && res.data) {
            // 假设返回的数据是一个包含各等级特权的对象
            // 这里需要根据实际接口返回的数据结构进行调整
            const privilegesData = res.data;
            
            // 更新 VIP 特权数据
            // 假设后端返回的数据是按 VIP 等级排序的数组
            // 我们需要根据数组索引来确定 VIP 等级
            const vipLevels = Object.keys(privilegesData).sort((a, b) => parseInt(a) - parseInt(b));
            
            // 清空表格数据
            that.vipTableData = [];
            
            vipLevels.forEach((key, index) => {
              // 计算实际的 VIP 等级（从 1 开始）
              const level = index + 1;
              
              if (that.vipPrivileges[level]) {
                // 查找并更新升级奖励、周俸禄和月俸禄
                that.vipPrivileges[level].list.forEach(item => {
                  if (item.name === '升级奖励' && (privilegesData[key].upgrade_bonus || privilegesData[key].upgrade_reward)) {
                    item.value = (privilegesData[key].upgrade_bonus || privilegesData[key].upgrade_reward) + '元';
                  }
                  if (item.name === '周俸禄' && privilegesData[key].weekly_salary) {
                    item.value = privilegesData[key].weekly_salary + '元';
                  }
                  if (item.name === '月俸禄' && privilegesData[key].monthly_salary) {
                    item.value = privilegesData[key].monthly_salary + '元';
                  }
                });
              }
              
              // 更新表格数据
              that.vipTableData.push({
                level: 'VIP' + level,
                upgradeBonus: privilegesData[key].upgrade_bonus || privilegesData[key].upgrade_reward || 0,
                weeklySalary: privilegesData[key].weekly_salary || 0,
                monthlySalary: privilegesData[key].monthly_salary || 0
              });
            });
          }
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
          console.log('获取 VIP 特权数据失败:', res);
        });
    },
    // 领取奖励
    claimBonus(type) {
      let that = this;
      that.$parent.showLoading();
      
      let url = '';
      let bonusType = '';
      
      switch (type) {
        case 'upgrade':
          url = '/api/claim-upgrade-bonus';
          bonusType = '升级奖励';
          break;
        case 'weekly':
          url = '/api/claim-weekly-salary';
          bonusType = '周奖励';
          break;
        case 'monthly':
          url = '/api/claim-monthly-salary';
          bonusType = '月奖励';
          break;
        default:
          return;
      }
      
      that.$apiFun
        .post(url, {})
        .then(res => {
          that.$parent.hideLoading();
          if (res.code == 200) {
            alert('成功领取' + bonusType);
          } else {
            alert(res.msg || '领取失败！您已经领取或未达到当前等级。');
          }
        })
        .catch(res => {
          that.$parent.hideLoading();
          alert('领取失败！您已经领取或未达到当前等级。');
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
// 用户信息区域
.user-info-section {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  margin: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  .user-avatar {
    margin-right: 15px;
    
    .avatar-img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid #c69c69;
      object-fit: cover;
    }
  }
  
  .user-details {
    flex: 1;
    
    .username {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8px;
    }
    
    .user-stats {
      font-size: 13px;
      color: #a0a0a0;
      margin-bottom: 10px;
    }
    
    .growth-section {
      .growth-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 5px;
        
        .growth-progress {
          height: 100%;
          background: linear-gradient(90deg, #c69c69 0%, #edb976 50%, #fff4e5 100%);
          border-radius: 2px;
        }
      }
      
      .growth-info {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #a0a0a0;
        
        .growth-value {
          color: #edb976;
          font-weight: bold;
        }
      }
    }
  }
}

// VIP 卡片区域
.vip-card {
  margin: 10px;
  
  .vip-card-content {
    background: linear-gradient(135deg, #f0e6d2 0%, #e6d2b8 100%);
    border-radius: 16px;
    padding: 30px 20px;
    box-shadow: 0 8px 25px rgba(198, 156, 105, 0.3);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
      opacity: 0.1;
    }
    
    .vip-level {
          font-size: 36px;
          font-weight: bold;
          color: #8b5a2b;
          text-align: center;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(139, 90, 43, 0.3);
        }
        
        .vip-progress-text {
          font-size: 16px;
          font-weight: bold;
          color: #8b5a2b;
          text-align: center;
          margin-bottom: 30px;
        }
    
    .vip-requirements {
      display: flex;
      justify-content: space-around;
      
      .requirement-item {
        text-align: center;
        flex: 1;
        
        .requirement-value {
          font-size: 20px;
          font-weight: bold;
          color: #8b5a2b;
          margin-bottom: 8px;
        }
        
        .requirement-label {
          font-size: 12px;
          color: #8b5a2b;
          opacity: 0.8;
        }
      }
    }
  }
}

// VIP 等级选择器
.vip-level-selector {
  margin: 20px 10px;
  
  .vip-levels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(237, 185, 118, 0.5);
      border-radius: 2px;
    }
    
    .vip-level-item {
      font-size: 12px;
      color: #a0a0a0;
      cursor: pointer;
      padding: 5px 8px;
      border-radius: 4px;
      transition: all 0.3s;
      margin-right: 8px;
      flex-shrink: 0;
      
      &:last-child {
        margin-right: 0;
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      &.active {
        color: #edb976;
        font-weight: bold;
        background: rgba(237, 185, 118, 0.2);
      }
    }
  }
  
  .vip-level-progress {
    .progress-track {
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 5px;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #c69c69 0%, #edb976 100%);
        border-radius: 2px;
      }
    }
    
    .progress-markers {
      display: flex;
      justify-content: space-between;
      
      .progress-marker {
        width: 2px;
        height: 6px;
        background: #666;
        border-radius: 1px;
      }
    }
  }
}

// VIP 特权区域
.vip-privileges {
  margin: 20px 10px;
  
  .privileges-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 15px;
    text-align: center;
  }
  
  // 礼金卡片区域
  .info-card-section {
    margin-bottom: 20px;
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      
      .info-card {
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin: 0 5px;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        
        &:first-child {
          margin-left: 0;
        }
        
        &:last-child {
          margin-right: 0;
        }
        
        &:active {
          transform: scale(0.95);
          background: rgba(255, 255, 255, 0.2);
        }
        
        .info-icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        
        .info-detail {
          flex: 1;
          
          .info-value {
            font-size: 18px;
            font-weight: bold;
            color: #edb976;
            margin-bottom: 4px;
          }
          
          .info-label {
            font-size: 12px;
            color: #a0a0a0;
          }
          
          .claim-button {
            display: inline-block;
            padding: 6px 12px;
            background: linear-gradient(135deg, #c69c69 0%, #edb976 100%);
            color: #1a1a2e;
            font-size: 12px;
            font-weight: bold;
            border-radius: 12px;
            margin-top: 8px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(237, 185, 118, 0.3);
            
            &:active {
              transform: scale(0.95);
              box-shadow: 0 1px 4px rgba(237, 185, 118, 0.3);
            }
          }
        }
      }
    }
  }
  
  // 特权网格区域
  .privileges-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    
    .privilege-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 15px 10px;
      text-align: center;
      transition: all 0.3s;
      
      &:active {
        transform: scale(0.95);
        background: rgba(255, 255, 255, 0.2);
      }
      
      .privilege-icon {
        width: 32px;
        height: 32px;
        margin: 0 auto 8px;
      }
      
      .privilege-name {
        font-size: 11px;
        color: #a0a0a0;
        margin-bottom: 4px;
      }
      
      .privilege-value {
        font-size: 12px;
        font-weight: bold;
        color: #edb976;
      }
    }
  }
  
  // VIP 数据表格
  .table-wrapper {
    margin: 20px 10px;
    overflow-x: auto;
  }
  
  .vip-data-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    
    thead {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      
      tr {
        td {
          padding: 12px 8px;
          font-size: 12px;
          font-weight: bold;
          color: #edb976;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    tbody {
      tr {
        &:nth-child(even) {
          background: rgba(255, 255, 255, 0.05);
        }
        
        &:active {
          background: rgba(255, 255, 255, 0.15);
        }
        
        td {
          padding: 10px 8px;
          font-size: 11px;
          color: #a0a0a0;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          
          &:first-child {
            color: #edb976;
            font-weight: bold;
          }
        }
      }
    }
  }
  
  // 规则说明区域
  .rule-wrap {
    margin: 20px 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    
    .title {
      text-align: center;
      margin-bottom: 15px;
      
      img {
        max-width: 180px;
        height: auto;
      }
    }
    
    .rules {
      .small-text {
        font-size: 11px;
        line-height: 1.5;
        margin-bottom: 10px;
        color: #a0a0a0;
        
        .bold {
          font-weight: bold;
        }
        
        .brown-text {
          color: #edb976;
        }
      }
    }
  }
}
</style>
