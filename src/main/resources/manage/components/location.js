Vue.component('location-form',{
    template:`
<el-dialog :visible.sync="locationVisible" :title="'选择地点'" width="70%" destroy-on-close>
    <div id="aMap" style="width: 100%;height:50vh"></div>
    <div class="aMapAddress">
        <p>
            <span>坐标：</span>
            <span>{{ markerPosition.lng }}</span>，
            <span>{{ markerPosition.lat }}</span>
        </p>
        <p>
            <span>地址：</span>
            <span>{{ markerPosition.address }}</span>
        </p>
    </div>
    <div style="display: flex;justify-content: center;">
        <el-button type="primary" @click="choosePosition">确定位置</el-button>
    </div>
</el-dialog>
    `,
    data(){
        return{
            locationVisible:false,
            zoom:16,
            markerPosition: {
                lng:this.position.lng || 113.887902,
                lat:this.position.lat || 22.554732,
                address:''
            },
            toParentsMapInfo:{},
            map:undefined,  //地图对象
            marker:undefined,   //标记点对象
            geocoder:undefined, //地理编码对象
        }
    },
    props:{
        position:{  // 父组件传来的默认数据
            type: Object,
            default: {}
        },
        isShowAMap:{    // 控制是否展示搜索框
            type: Boolean,
            default: true
        },
        isDisplayAMap:{ // 控制是否展示地图试图
            type: Boolean,
            default: true
        }
    },
    mounted(){
        window._AMapSecurityConfig = {
            securityJsCode:'4d8f1bda690b722d8a547dabb51a9933'
        }
    },
    methods:{
        choosePosition(){
            this.$emit('choose',this.markerPosition)
            this.locationVisible = false;
        },
        initMap(){
            toolUtil.loadScript("https://webapi.amap.com/maps?v=1.4.4&key=5c1c06db19e483c5b00dc052ca37848b",()=>{
                this.$nextTick(()=>{
                    this.map = new AMap.Map('aMap', {
                        center:[this.markerPosition.lng,this.markerPosition.lat],
                        zoom:this.zoom
                    });
                    this.marker = new AMap.Marker({
                        position: [this.markerPosition.lng,this.markerPosition.lat],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    });
                    AMap.plugin('AMap.Geocoder',()=>{
                        this.geocoder = new AMap.Geocoder()
                        this.getAddress([this.markerPosition.lng,this.markerPosition.lat])
                    })
                    this.map.on('click',(e)=>{
                        this.marker.setPosition(e.lnglat)
                        this.getAddress([e.lnglat.lng,e.lnglat.lat])
                    })
                    this.map.add(this.marker);
                })
            })
        },
        getAddress(lnglat){
            this.geocoder.getAddress(lnglat, (status, result)=>{
                if (status === 'complete'&&result.regeocode) {
                    this.markerPosition = {
                        lng:lnglat[0],
                        lat:lnglat[1],
                        address:result.regeocode.formattedAddress
                    }
                }else{
                    log.error('根据经纬度查询地址失败')
                }
            });
        },
        mapShow(){
            this.locationVisible = true
            this.initMap()
        },
    },
})