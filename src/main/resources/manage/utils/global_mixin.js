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