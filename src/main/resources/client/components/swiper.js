Vue.component("swiper",{
    template:`
    <div class="swiper-container" :id="swiperID">
        <div class="swiper-wrapper">
            <div v-for="(item,index) in list" :key="index" class="swiper-slide">
                <slot :item="item" :index="index"></slot>
            </div>
        </div>
        <div v-if="option && option.prevButton" class="swiper-button-prev"></div>
        <div v-if="option && option.nextButton" class="swiper-button-next"></div>
        <div class="swiper-pagination" :id="paginationID"></div>
    </div>
    `,
    props:{
        option:{
            type:Object,
            default:()=>{}
        },
        list:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        const uid = new Date().getTime()%1000+parseInt(Math.random()*1000000).toString()
        return{
            swiper:undefined,
            swiperID:`swiper${uid}`,
            paginationID:`pagination${uid}`,
        }
    },
    mounted(){
        this.swiper = new Swiper(`#${this.swiperID}`, {
            pagination: `#${this.paginationID}`,
            ...this.option,
        });
    },
})