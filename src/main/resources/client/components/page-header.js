Vue.component("page-header",{
    template:`
<div class="header-top">
    <div class="project-name" @click="location.href=baseUrl+'client/page/index.html'">{{projectName}}</div>
    <div class="user" v-if="showUser">
        <div class="unlogin" v-if="!userInfo.value" @click="toLogin">登录</div>
        <el-dropdown v-else >
            <div class="user-avatar">
                <el-image :src="baseUrl+userInfo.value.touxiang">
                    <template slot="error">
                        <img style="width: 100%;" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
                    </template>
                </el-image>
                <i v-if="true" class="el-icon-caret-bottom" style="cursor: pointer;position: absolute;right: -20px;top: 25px;font-size: 12px;"></i>
            </div>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item @click.native.stop="toCenter">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native.stop="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</div>
    `,
    props:{
        showUser:{
            type:Boolean,
            default:true
        },
        showChat:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            userInfo:window.userInfo,
            sessionTable:toolUtil.storageGet("sessionTable")
        }
    },
    created(){
        this.getUserInfo()
        document.addEventListener("visibilitychange",(e)=>{
            if(document.hidden)return;
            if(this.userInfo){
                if(this.sessionTable=="users"){
                    return this.loginOut();
                }
                return;
            }
            this.getUserInfo()
        })
    },
    methods:{
        loginOut(){
            window.userInfo.value = null
            toolUtil.storageClear()
            location.href=`${baseUrl}client/page/index.html`
        },
        toLogin(){
            let redirect = toolUtil.getUrlParamsByKey("redirect") || encodeURIComponent(location.href)
            location.href = `${baseUrl}client/page/login.html?redirect=`+redirect
        },
        toCenter(){
            location.href = `${baseUrl}client/page/${toolUtil.storageGet("sessionTable")}/center.html`
        },
        toCart(){
            location.href = `${baseUrl}client/page/shop_cart/list.html`
        },
        getUserInfo(){
            const userInfo = toolUtil.storageGet('userInfo')
            if(userInfo){
                window.userInfo.value = JSON.parse(userInfo)
            }
        },
    }
})

document.addEventListener('DOMContentLoaded',()=>{
    /*导航栏吸顶*/
    let menuDom = document.getElementById("nav-menu")
    if(menuDom){
      let navHeigh = menuDom.offsetHeight
      if(menuDom ){
          window.onscroll = function(){
              let scrollHeight = window.pageYOffset || document.documentElement.scrollTop;
              if(scrollHeight > navHeigh){
                  //补偿高度，防止抖动
                  document.getElementsByTagName('body')[0].style.marginTop = navHeigh+'px'
                  menuDom.style.position = 'fixed'
                  menuDom.style.top = 0
                  menuDom.style.left = 0
                  menuDom.style['z-index'] = 999
                  menuDom.style.margin = '0px auto 0'
              }else{
                  document.getElementsByTagName('body')[0].style.marginTop = 0
                  menuDom.style.position = ''
                  menuDom.style.top = ''
                  menuDom.style.left = ''
                  menuDom.style.margin = '20px auto 0'
                  menuDom.style['z-index'] = ''
              }
          }
      }
    }
})
