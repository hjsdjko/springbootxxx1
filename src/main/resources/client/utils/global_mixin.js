window.userInfo = {value: null};
var myMixin = {
    methods:{
        async getUserInfo(){
            let sessionTable = toolUtil.storageGet('sessionTable')
            if(!sessionTable){
                location.href = `${baseUrl}client/page/login.html?redirect=`+encodeURIComponent(location.href)
                return
            }
            let res = await http.get(`${sessionTable}/session`)
            toolUtil.storageSet("userInfo",JSON.stringify(res.data.data))
            if(window.userInfo){
                Object.assign(window.userInfo.value,res.data.data)
            }
            return res
        }
    },
};
Vue.mixin(myMixin)

Vue.component('iconfont',{
    template:`
<i v-if="/^el-icon/.test(icon)" class="iconfont" :class="icon"></i>
<svg v-else class="iconfont" aria-hidden="true">
    <use :xlink:href="'#'+icon"></use>
</svg>
    `,
    props: {
        icon:{
            type:String,
            default:'',
        }
    },
})