Vue.component('page-aside',{
    data(){
        return{
        }
    },
    created(){

    },
    methods:{
    },
    template:`
<el-aside id="pageAside" width="auto">
    <slot name="menu"></slot>
</el-aside>
`
})