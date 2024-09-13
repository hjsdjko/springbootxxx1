
Vue.component('nav-menu',{
    template:`
<div id="nav-menu">
    <el-menu mode="horizontal"   :default-active="''">
        <el-menu-item @click="location.href=baseUrl+'client/page/index.html'" index="home">
            首页
        </el-menu-item>
        <template v-for="(item,index) in indexMenuList" :key="item.name">
            <el-menu-item v-if="item.child.length==1" @click="navigateTo(item.child[0])" :index="index+''">
                {{item.child[0].name}}
            </el-menu-item>
            <el-submenu v-else index="index+''">
                <template slot="title">
                    {{item.name}}
                </template>
                <el-menu-item v-for="(item1,index1) in item.child" :key="item1.name" @click="navigateTo(item1)" :index="index+'-'+index1">
                    {{item1.name}}
                </el-menu-item>
            </el-submenu>
        </template>
    </el-menu>
</div>
`,
    props:{
        tableName:{
            type:String,
            default:''
        },
    },
    data(){
        return{
            selectIndex:undefined,
        }
    },
    mounted(){
        let index = indexMenuList.findIndex(item=>{
            let rgx = new RegExp(`client/page/${this.tableName}/`,"g")
            if(rgx.test(item.url||item.child[0].url)){
                return true
            }
            if(item.child.length>1){
                return item.child.find(item1=>(rgx.test(item1.url)))
            }
        })
        if(index==-1){
            if(new RegExp(`index.html`,"g").test(location.href)){
                this.selectIndex = index
            }
        }else{
            this.selectIndex = index
        }
    },
    methods: {
        navigateTo(item){
            let url = item.url||item.child[0].url
            location.href = baseUrl+url
        },
    },
})