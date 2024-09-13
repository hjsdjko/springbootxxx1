Vue.component("approval", {
    template: `
    <div>
      <el-dialog :visible.sync="approvalVisible" :title="'审核'" width="70%" destroy-on-close>
      <el-form ref="ruleFormRef" :model="approvalForm" label-width="120px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核回复" prop="shhf">
              <el-input v-model="approvalForm.shhf" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <span class="dialog-footer">
          <el-button type="danger" @click="approvalSave('否')">拒绝</el-button>
          <el-button type="primary" @click="approvalSave('是')">
            通过
          </el-button>
        </span>
      </template>
    </el-dialog>
    </div>
    `,
    props:["tableName"],
    data() {
        return{
            rules:{
                shhf: [{
                    required: true,
                    message: '请输入审核回复',
                    trigger: 'blur'
                }, ],
            },
            approvalVisible:false,
            approvalForm:{},
        }
    },
    methods: {
        approvalClick(row){
            this.approvalForm = JSON.parse(JSON.stringify(row))
            this.approvalVisible = true
        },
        approvalSave(type){
            this.approvalForm.sfsh = type
            this.$refs["ruleFormRef"].validate((valid) => {
                if (valid) {
                    let url = `${this.tableName}/update`
                    http.post(url,this.approvalForm).then(res=>{
                        this.$message.success('审核成功')
                        this.approvalVisible = false
                        this.$emit('change')
                    })
                }
            })
        },
    }
})