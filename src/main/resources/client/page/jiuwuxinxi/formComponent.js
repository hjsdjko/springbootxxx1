Vue.component('jiuwuxinxi-form',{
    template: `
    <div>
        <el-dialog :fullscreen="false" width="80%" 
                   :visible.sync="formVisible"
                   :title="formTitle"
                   v-if="formVisible"
                   custom-class="formModel">
            <el-form ref="formRef" :model="form" class="formModel_form" :rules="rules" label-width="120px" >
                <el-form-item label="旧物名称" prop="jiuwumingcheng" class="input-item">
                    <el-input v-model="form.jiuwumingcheng" placeholder="旧物名称"
                              type="text"
                        :readonly="!isAdd||disabledForm.jiuwumingcheng?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="旧物分类" prop="jiuwufenlei" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.jiuwufenlei?true:false"
                            v-model="form.jiuwufenlei"
                            placeholder="请选择旧物分类"
                    >
                    <el-option v-for="(item,index) in jiuwufenleiLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="tupian" class="upload-item img-upload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.tupian?true:false"
                            action="file/upload"
                            tip="请上传图片"
                            :limit="3"
                            :fileUrls="form.tupian?form.tupian:''"
                            @change="tupianUploadSuccess">
                    </file-upload>
                </el-form-item>
                <el-form-item label="回收单价" prop="huishoudanjia" class="input-item">
                    <el-input v-model="form.huishoudanjia" placeholder="回收单价"
                              type="text"
                        :readonly="!isAdd||disabledForm.huishoudanjia?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="zhuangtai" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.zhuangtai?true:false"
                            v-model="form.zhuangtai"
                            placeholder="请选择状态"
                    >
                    <el-option v-for="(item,index) in zhuangtaiLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="详情" prop="xiangqing" class="input-item">
                    <el-input v-model="form.xiangqing" placeholder="详情"
                              type="text"
                        :readonly="!isAdd||disabledForm.xiangqing?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="地区" prop="diqu" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.diqu?true:false"
                            v-model="form.diqu"
                            placeholder="请选择地区"
                    >
                    <el-option v-for="(item,index) in diquLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div v-if="isAdd||type=='reply'" class="formModel-btns">
                <el-button class="formModel_cancel" @click="closeClick">取消</el-button>
                <el-button class="formModel_confirm" type="primary" @click="save">
                    提交
                </el-button>
            </div>
        </el-dialog>
    </div>
`,
    data(){
        return{
            sessionTable:localStorage.getItem('sessionTable'),
            tableName:'jiuwuxinxi',
            formName:'旧物信息',
            formVisible:false,
            formTitle:'',
            form:{
                jiuwumingcheng: '',
                jiuwufenlei: '',
                tupian: '',
                huishoudanjia: '',
                zhuangtai: '',
                xiangqing: '',
                storeupnum: '0',
                clicknum: '0',
                diqu: '',
            },
            id:0,
            type:'',
            disabledForm:{
                jiuwumingcheng : false,
                jiuwufenlei : false,
                tupian : false,
                huishoudanjia : false,
                zhuangtai : false,
                xiangqing : false,
                storeupnum : false,
                clicknum : false,
                diqu : false,
            },
            isAdd:false,
            rules:{
                jiuwumingcheng: [
                ],
                jiuwufenlei: [
                ],
                tupian: [
                ],
                huishoudanjia: [
                    { validator: toolUtil.fromValidate.number, trigger: 'blur' },
                ],
                zhuangtai: [
                ],
                xiangqing: [
                ],
                storeupnum: [
                    { validator: toolUtil.fromValidate.intNumber, trigger: 'blur' },
                ],
                clicknum: [
                    { validator: toolUtil.fromValidate.intNumber, trigger: 'blur' },
                ],
                diqu: [
                ],
            },
            //旧物分类列表
                jiuwufenleiLists:[],
            //状态列表
                zhuangtaiLists:[],
            //地区列表
                diquLists:[],
            crossRow:'',
            crossTable:'',
            crossTips:'',
            crossColumnName:'',
            crossColumnValue:'',
        }
    },
    watch:{
    },
    methods:{
        //获取唯一标识
        getUUID(){
            return new Date().getTime();
        },
        //图片上传回调
        tupianUploadSuccess(e){
        this.form.tupian = e
        },
        getInfo(){
            http.get(`${this.tableName}/info/${this.id}`).then(res=>{
                this.form = res.data.data
                this.formVisible = true
            })
        },
        init(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null){
            if(formId){
                this.id = formId
                this.type = formType
            }
            if(formType == 'add'){
                this.isAdd = true
                this.formTitle = '新增' + this.formName
                this.formVisible = true
            } else if(formType == 'info'){
                this.isAdd = false
                this.formTitle = '查看' + this.formName
                this.getInfo()
            } else if(formType == 'edit'){
                this.isAdd = true
                this.formTitle = '修改' + this.formName
                this.getInfo()
            } else if(formType == 'reply'){
                this.type = formType
                this.isAdd = true
                this.disabledForm.cpicture = true
                this.disabledForm.content = true
                this.formTitle = '回复'
                this.getInfo()
            } else if(formType == 'cross'){
                this.isAdd = true
                this.formTitle = formNames
                for(let x in row){
                    if(x=='jiuwumingcheng'){
                        this.form.jiuwumingcheng = row[x];
                        this.disabledForm.jiuwumingcheng = true;
                        continue;
                    }
                    if(x=='jiuwufenlei'){
                        this.form.jiuwufenlei = row[x];
                        this.disabledForm.jiuwufenlei = true;
                        continue;
                    }
                    if(x=='tupian'){
                        this.form.tupian = row[x];
                        this.disabledForm.tupian = true;
                        continue;
                    }
                    if(x=='huishoudanjia'){
                        this.form.huishoudanjia = row[x];
                        this.disabledForm.huishoudanjia = true;
                        continue;
                    }
                    if(x=='zhuangtai'){
                        this.form.zhuangtai = row[x];
                        this.disabledForm.zhuangtai = true;
                        continue;
                    }
                    if(x=='xiangqing'){
                        this.form.xiangqing = row[x];
                        this.disabledForm.xiangqing = true;
                        continue;
                    }
                    if(x=='storeupnum'){
                        this.form.storeupnum = row[x];
                        this.disabledForm.storeupnum = true;
                        continue;
                    }
                    if(x=='clicknum'){
                        this.form.clicknum = row[x];
                        this.disabledForm.clicknum = true;
                        continue;
                    }
                    if(x=='diqu'){
                        this.form.diqu = row[x];
                        this.disabledForm.diqu = true;
                        continue;
                    }
                }
                if(row){
                    this.crossRow = row
                }
                if(table){
                    this.crossTable = table
                }
                if(tips){
                    this.crossTips = tips
                }
                if(statusColumnName){
                    this.crossColumnName = statusColumnName
                }
                if(statusColumnValue){
                    this.crossColumnValue = statusColumnValue
                }
                this.form.storeupnum='0'
                this.form.clicknum='0'
                this.formVisible = true
            }
            http.get(this.sessionTable+'/session').then(res=>{
                var json = res.data.data
            })
            http.get(`option/jiuwufenlei/jiuwufenlei`).then(res=>{
                this.jiuwufenleiLists = res.data.data
            })
            this.zhuangtaiLists = "可用,损坏".split(',')
            http.get(`option/diqu/diqu`).then(res=>{
                this.diquLists = res.data.data
            })
        },
        //关闭
        closeClick(){
            this.formVisible = false
        },
        //提交
        save(){
            if(this.form.tupian!=null) {
                this.form.tupian = this.form.tupian.replace(new RegExp(baseUrl,"g"),"");
            }
            let objcross;
            let crossUserId = ''
            let crossRefId = ''
            let crossOptNum = ''
            if(this.type == 'cross'){
                objcross = JSON.parse(JSON.stringify(this.crossRow))
                if(this.crossColumnName!=''){
                    if(!this.crossColumnName.startsWith('[')){
                        for(let o in objcross){
                            if(o == this.crossColumnName){
                                objcross[o] = this.crossColumnValue
                            }
                        }
                    }else{
                        crossUserId = toolUtil.storageGet('userid')
                        crossRefId = objcross['id']
                        crossOptNum = this.crossColumnName.replace(/\[|\]/g,"")
                    }
                }
            }
            this.$refs.formRef.validate((valid)=>{
                if(!valid)return
                if(crossUserId&&crossRefId){
                    this.form.crossuserid = crossUserId
                    this.form.crossrefid = crossRefId
                    let params = {
                        page: 1,
                        limit: 1000,
                        crossuserid:this.form.crossuserid,
                        crossrefid:this.form.crossrefid,
                    }
                    http.get('jiuwuxinxi/page',{
                        params:params
                    }).then(res=>{
                        if(res.data.data.total>=crossOptNum){
                            return this.$message.error(this.crossTips)
                        }else{
                            http.post(`jiuwuxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
                                if(this.type == 'cross'){
                                    //修改跨表数据
                                    this.changeCrossData(objcross)
                                }
                                this.$message.success('操作成功')
                                this.formVisible = false
                                this.$emit('change')
                            })
                        }
                    })
                }else{
                    http.post(`jiuwuxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
                        if(this.type == 'cross'){
                            //修改跨表数据
                            this.changeCrossData(objcross)
                        }
                        this.$message.success('操作成功')
                        this.formVisible = false
                        this.$emit('change')
                    })
                }
            })
        },
        changeCrossData(data){
            http.post(`${this.crossTable}/update`,data)
        },
    }
})
document.write(`<script src="../../components/FileUpload.js"></script>`)
document.write(`<script src="${baseUrl}client/static/modules/wangeditor/index.min.js"></script>`)
document.write(`<script src="../../components/myEditor.js"></script>`)
document.write(`<link rel="stylesheet" href="${baseUrl}client/static/modules/wangeditor/style.css"></link>`)
