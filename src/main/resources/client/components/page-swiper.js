Vue.component("page-swiper",{
    template:`
<div class="page-swiper">
    <el-carousel type="card" >
        <el-carousel-item v-for="item in swiperList" :key="item.id" style="height: 100%">
            <img style="width: 100%;height: 100%;object-fit: cover;" :src="baseUrl+item.value" alt="">
        </el-carousel-item>
    </el-carousel>
</div>
    `,
    data(){
        return{
            userInfo:window.userInfo,
            swiperList:[],
        }
    },
    created(){
        this.getSwiperList()
    },
    methods:{
        getSwiperList(){
            http.get('config/list',{
                params:{page:1,limit:6}
            }).then(res=>{
                this.swiperList = res.data.data.list
            })
        },
    }
})
