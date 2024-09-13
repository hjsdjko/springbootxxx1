window.isCollapse = {value: toolUtil.storageGet('isCollapse')?toolUtil.storageGet('isCollapse')=='true':false};
window.userInfo = {value:null}
Vue.component('page-header',{
    data(){
        return{
            sessionTable:toolUtil.storageGet('sessionTable'),
            userInfo:window.userInfo,
            isCollapse:window.isCollapse,
            moduleName:'',
        }
    },
    props:["pageName"],
    created(){
        this.getUserInfo()
        let menuList = JSON.parse(toolUtil.storageGet('menuList'))
        let p = location.href.split('/manage/page/')[1].split('/')
        switch (p[0]){
            case "index":return;
            case "center":this.moduleName = "个人中心";break;
            default:
                for(let i in menuList){
                    for(let j in menuList[i].child){
                        if(menuList[i].child[j].tableName==p[0]){
                            this.moduleName = menuList[i].menu
                            break;
                        }
                    }
                }
        }
    },
    methods:{
        getUserInfo(){
            const userInfo = toolUtil.storageGet('userInfo')
            if(userInfo){
                window.userInfo.value = JSON.parse(userInfo)
            }
        },
        logout(){
            Object.keys(localStorage).forEach(key=>{
                if(key.startsWith('admin_')){
                    localStorage.removeItem(key);
                }
            })
            location.href=`${baseUrl}manage/page/login.html`
        },
        navigateTo(name){
            let url = `${baseUrl}manage/page/`
            if(name=="index"){
                url += 'index.html'
            }else if(name=="info"){
                url += this.sessionTable+'/info.html'
            }else if(name=="updatePassword"){
                url += 'center/updatePassword.html'
            }
            window.location.href = url
        },
        changeCollapse(b){
            window.isCollapse.value = b
            toolUtil.storageSet('isCollapse',b)
        },
    },
    template:`
<div id="pageHeader">
    <div class="menu-switch">
        <iconfont icon="el-icon-s-fold" v-if="!isCollapse.value" @click.native="changeCollapse(true)"></iconfont>
        <iconfont icon="el-icon-s-unfold" v-else @click.native="changeCollapse(false)"></iconfont>
    </div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right" >
        <el-breadcrumb-item @click.native="navigateTo('index')"><span style="cursor: pointer">首页</span></el-breadcrumb-item>
        <el-breadcrumb-item v-if="moduleName">{{moduleName}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageName">{{pageName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="project-name">{{projectName}}</div>
    <el-dropdown >
        <div class="user-avatar">
            <img v-if="userInfo.value && userInfo.value.touxiang" :src="baseUrl+userInfo.value.touxiang"/>
            <img v-else src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"/>
            <iconfont icon="el-icon-caret-bottom"></iconfont>
            <span></span>
        </div>
        <el-dropdown-menu class="dropdown-menu" slot="dropdown">
            <el-dropdown-item icon="el-icon-user" @click.native="navigateTo('info')" v-if="sessionTable!='users'">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-lock" @click.native="navigateTo('updatePassword')">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-files" @click.native="logout()">退出登录</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</div>
`
})