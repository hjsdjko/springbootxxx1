Vue.component("import-data", {
    template: `
    <div>
      <el-dialog :title="'导入'" destroy-on-close :visible.sync="importVisible" width="70%">
        <el-form :model="importForm" label-width="120px" ref="ruleFormRef">
          <el-row>
            <el-col :span="24">
              <el-upload :action="uploadUrl" :headers="uploadHeaders" :on-error="uploadError" :on-success="uploadSuccess" accept=".xls,.xlsx"
                class="upload-demo" drag multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text" style="width: 100%">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <template slot="tip">
                  <div class="el-upload__tip">
                    {{tips}}
                  </div>
                </template>
              </el-upload>
            </el-col>
    
          </el-row>
        </el-form>
        <template slot="footer">
          <span class="dialog-footer">
            <el-button @click="importVisible=false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    `,
    props:["tableName","action","tip"],
    data() {
        return{
            importVisible:false,
            importForm:{},
            uploadHeaders:{},
            uploadUrl:'',
            tips:'',
        }
    },
    methods: {
        importClick(){
            this.init()
            this.importVisible = true
        },
        uploadSuccess(){
            this.$message.success('导入成功')
            this.$emit('change')
            this.importVisible = false
        },
        uploadError(e){
            this.$message.error('导入失败')
        },
        init(){
            this.uploadUrl = `${baseUrl}${this.tableName}/importExcel`
            this.uploadHeaders = {
                'Token': toolUtil.storageGet("Token")
            }
            if (this.tip) {
                this.tips = this.tip
            }
        }
    }
})