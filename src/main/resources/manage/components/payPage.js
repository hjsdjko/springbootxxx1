Vue.component('pay-form',{
    template:`
    <el-dialog :visible.sync="payVisible" :title="'支付'" width="60%" destroy-on-close>
      <el-alert title="支付前请先核对订单信息" type="success" :closable="false" />
      <div class="payList">
        <div class="payView">
          <el-radio v-model="payType" label="微信支付"></el-radio>
          <img :src="baseUrl+'manage/static/img/pay_icon/weixin.png'" alt>
        </div>
        <div class="payView">
          <el-radio v-model="payType" label="支付宝支付"></el-radio>
          <img :src="baseUrl+'manage/static/img/pay_icon/zhifubao.png'" alt>
        </div>
        <div class="payView">
          <el-radio v-model="payType" label="建设银行"></el-radio>
          <img :src="baseUrl+'manage/static/img/pay_icon/jianshe.png'" alt>
        </div>
        <div class="payView">
          <el-radio v-model="payType" label="农业银行"></el-radio>
          <img :src="baseUrl+'manage/static/img/pay_icon/nongye.png'" alt>
        </div>
        <div class="payView">
          <el-radio v-model="payType" label="中国银行"></el-radio>
          <img :src="baseUrl+'manage/static/img/pay_icon/zhongguo.png'" alt>
        </div>
        <div class="payView">
          <el-radio v-model="payType" label="交通银行"></el-radio>
          <img :src="baseUrl+'manage/static/img/pay_icon/jiaotong.png'" alt>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="payVisible=false">取消</el-button>
          <el-button type="primary" @click="paySave">
            确认支付
          </el-button>
        </span>
      </template>
    </el-dialog>
    `,
    data(){
        return{
            payVisible:false,
            tableName:'',
            form:{},
            payType:'',
        }
    },
    methods:{
        payClick(tableName, row){
            this.tableName = tableName
            this.form = row
            this.payVisible = true
        },
        paySave(){
            if (this.payType == '') {
                this.message.error('请选择支付方式')
                return false
            }
            this.form.ispay = '已支付'
            http.post(`${this.tableName}/update`,this.form).then(res=>{
                this.$message.success('支付成功')
                this.payVisible = false
                this.$emit('payChange')
            })
        },
    }
})