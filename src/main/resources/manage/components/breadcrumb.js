Vue.component("breadcrumb",{
    data(){
        return {
            moduleName:'',
        }
    },
    props:["pageName"],
    created(){
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
    template: `
<div class="breadcrumb-row">
    <div class="pageName">{{pageName}}</div>
    <div class="breadcrumb">
        <iconfont icon="el-icon-s-home"></iconfont>
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item @click.native="location.href = baseUrl+'manage/page/index.html'"><span style="cursor: pointer">首页</span></el-breadcrumb-item>
            <el-breadcrumb-item v-if="moduleName">{{moduleName}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="pageName">{{pageName}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</div>
`
})