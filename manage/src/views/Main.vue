<template>
  <div class="main">
    <div class="header">
      <div class="fl">商家后台</div>
      <div class="fr clearfix">
        <div class="fl title-img">
          <img
            class="user_img"
            :src="staticUrl + '/' + userInfo.user_img"
            alt=""
          />
        </div>
        <div class="fl nickname">{{ userInfo.nickname }}</div>
        <div class="fl set" @click="set(userInfo.user_id,userInfo.email)">设置</div>
        <div class="fl quit" @click="quit()">退出</div>
      </div>
    </div>
    <div class="box">
      <div class="aside">
        <!-- 手风琴 -->
        <div class="accordion" id="accordion">

          <div class="card" v-for="(item, index) in asideMenu" :key="index">
            <div class="card-header">
              <div class="aside-item" data-toggle="collapse" :data-target="'#c' + index">
                <div class="fl fa-box"><i class="fa" :class="[item.icon]"></i></div> 
                <div class="fl fa-title">
                  <span class="fl">{{item.title}}</span><i class="fa fa-angle-down fr down-arrow"></i>
                </div>
              </div>
            </div>

            <div :id="'c' + index" class="collapse c-box" :class="{show: index == 0}"  data-parent="#accordion">
              <div class="card-body">
                <div class="type-item" :class="{active: v.isActive}" v-for="(v, i) in item.subTitle" :key="i" @click="toggleAsideMenu(v)"><i class="fa"></i>{{v.name}}</div>
              </div>
            </div>
          </div>

          <!-- <div class="card">
            <div class="card-header" id="headIngOne">
            <div class="aside-item" data-toggle="collapse" data-target="#c1">
              <div class="fl fa-box"><i class="fa fa-cube"></i></div> 
              <div class="fl fa-title">
                <span class="fl">类型管理</span><i class="fa fa-angle-down fr down-arrow"></i>
              </div>
            </div>
            </div>

            <div id="c1" class="collapse show c-box" aria-labelledby="" data-parent="#accordion">
              <div class="card-body">
                <div class="type-item">商品类型</div>
              </div>
            </div>
          </div> -->

        </div>

        <!-- <div v-for="(item,index) in asideMenu" :key="index">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item :name="index+1">
              <template #title>
                <div><i class="fa" :class="item.icon" aria-hidden="true"></i>{{item.title}}</div>
              </template>
              <div class="svbTitle" v-for="(v, i) in item.subTitle" :key="i">
                  <div><i class="fa" aria-hidden="true"></i>{{v.subName}}</div>
              </div>
              
            </van-collapse-item>
          </van-collapse>  
        </div> -->
        
      </div>
      <div class="content">
        <!-- 二级路由 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      // 获取用户信息
      userInfo: {},
      // 侧边栏
      asideMenu: [
        {
          title: '商品管理',
          icon: 'fa-cube',
          subTitle: [
            {
              name: '商品类型',
              isActive: true,

              //路由名称
              routerName: 'Type'
            },
            {
              name: '商品列表',
              isActive: false ,
              routerName: 'Products'
            }
          ]
        },
        {
          title: '订单管理',
          icon: 'fa-file-text-o',
          subTitle: [
            {
              name: '订单列表',
              isActive: false,
              routerName: ''
            }
          ]
        },
        {
          title: '数据统计',
          icon: 'fa-bar-chart',
          subTitle: [
            {
              name: '商品统计',
              isActive: false,
              routerName: ''
            },
            {
              name: '订单统计',
              isActive: false,
              routerName: ''
            }
          ]
        }
      ],
    };
  },
  created() {
    // 
    // 调用获取用户信息
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.axios({
        method: "GET",
        url: "/userInfo",
      })
        .then((result) => {
          
          this.userInfo = result.data.result[0];
        })
        .catch((err) => {
          
        });
    },

    //切换侧边栏菜单
    toggleAsideMenu(item) {
      //如果当前选中，不做任何事情
      if (item.isActive) {
        return;
      }
      //将其他选中修改为未选中状态
      this.asideMenu.forEach(v1 => {
        v1.subTitle.forEach(v2 => {
          v2.isActive = false;
        })
      })
      item.isActive = true;
      this.$router.push({name: item.routerName});
    },

    // 设置
    set(user_id,email){
      this.$router.push({ name: 'Login', params: { user_id,email }})
    },

    // 退出
    quit(){
      this.$router.push(`/login`);
    }
  },
};
</script>

<style lang="less" scoped>
.title-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #444;
  margin: 10px 20px;
  overflow: hidden;
}
/deep/ .user_img {
  width: 100%;
  line-height: 60px;
  vertical-align: baseline;
}
.set {
  margin-left: 20px;
  cursor: pointer;
  &:hover{
    font-weight: 800;
    color: #fff;
  }
}
.quit {
  margin-left: 20px;
  cursor: pointer;
  &:hover{
    font-weight: 800;
    color: #fff;
  }
}
.header {
  height: 80px;
  line-height: 80px;
  position: sticky;
  top: 0;
  background: #111;
  color: #bbb;
  border-bottom: 1px solid #bbb;
  padding: 0 20px;
  z-index: 9999;
}
.aside {
  width: 150px;
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  background: #222222;
  color: #bbb;
  font-weight: 800;
}
.content {
  // height: 1200px;
  width: calc(100% - 150px);
  margin-left: 150px;
  // background: #eee;
  padding: 20px;
}
/deep/ .van-cell {
  background-color: #222;
  color: #bbb;
  
}
/deep/ .van-collapse-item__content {
  background-color: #222;
  color: #bbb;
  padding: 0;
}
// van-collapse-item__content
// .svbTitle{
//   padding: 0 15px;
//   line-height: 40px;
//   background-color: #000;
//   border-bottom: 1px solid #ebedf0;
//   color: #bbb;
//   &:last-child{
//     border-bottom:0 solid #ebedf0 ;
//   }
// }
.card{
  border:0;
  .card-header{
    padding: 12px 0;
    margin-bottom: 0;
    background-color: #111;
    border-bottom: 1px solid #ebedf0;
    .aside-item{
      cursor: pointer;
    }
    .fa-box{
      width: 34px;
      text-align: right;
      padding-right: 2px;
    }
    .fa-title{
      width: 116px;
    }
  }
  .card-body{
    padding: 0;
    .type-item{
      // padding: 0;
      height: 40px;
      line-height:40px;
      color: #bbb;
      padding:0 15px;
      background-color: #333;
      border-bottom: 1px solid #888;
      cursor: pointer;
      &:hover{
        background-color: #222;
      }
      &.active{
        background-color: #222;
      }
    }
  }
}

i.fa{
  width: 14px;
  line-height: 24px;
  margin-right: 5px;
}
i.down-arrow{
  font-size: 24px;
  margin-right: 10px;
}
</style>