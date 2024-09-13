Vue.component("login-info",{
    template:`
<div>
    <div class="right" v-if="!userInfo.value" style="cursor: pointer" @click="toLogin">登录</div>
    <div v-else class="index-avatar">
        <img :src="baseUrl+userInfo.value.touxiang"/>
        <div class="user-card">
            <div class="card-inner">
                <div class="option" @click="toCenter">个人中心</div>
                <div class="option" @click="loginOut">退出登录</div>
            </div>
        </div>
    </div>
</div>
    `,
    data(){
        return{
            userInfo:window.userInfo
        }
    },
    created(){
        this.getUserInfo()
        document.addEventListener("visibilitychange",(e)=>{
            if(document.hidden||this.userInfo)return;
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
            location.href = `${baseUrl}client/page/login.html?redirect=`+encodeURIComponent(location.href)
        },
        toCenter(){
            location.href = `${baseUrl}client/page/${toolUtil.storageGet("sessionTable")}/center.html`
        },
        getUserInfo(){
            const userInfo = toolUtil.storageGet('userInfo')
            if(userInfo){
                window.userInfo.value = JSON.parse(userInfo)
            }
        },
    }
})