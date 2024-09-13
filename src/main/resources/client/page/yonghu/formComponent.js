Vue.component('yonghu-form',{
    template: `
    <div>
        <el-dialog :fullscreen="false" width="80%" 
                   :visible.sync="formVisible"
                   :title="formTitle"
                   v-if="formVisible"
                   custom-class="formModel">
            <el-form ref="formRef" :model="form" class="formModel_form" :rules="rules" label-width="120px" >
                <el-form-item label="用户账号" prop="yonghuzhanghao" class="input-item">
                    <el-input v-model="form.yonghuzhanghao" placeholder="用户账号"
                              type="text" :readonly="!isAdd||disabledForm.yonghuzhanghao?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="yonghumima" class="input-item">
                    <el-input v-model="form.yonghumima" placeholder="用户密码"
                              type="password" :readonly="!isAdd||disabledForm.yonghumima?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="yonghuxingming" class="input-item">
                    <el-input v-model="form.yonghuxingming" placeholder="用户姓名"
                              type="text"
                        :readonly="!isAdd||disabledForm.yonghuxingming?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="touxiang" class="upload-item img-upload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.touxiang?true:false"
                            action="file/upload"
                            tip="请上传头像"
                            :limit="3"
                            :fileUrls="form.touxiang?form.touxiang:''"
                            @change="touxiangUploadSuccess">
                    </file-upload>
                </el-form-item>
                <el-form-item label="性别" prop="xingbie" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.xingbie?true:false"
                            v-model="form.xingbie"
                            placeholder="请选择性别"
                    >
                    <el-option v-for="(item,index) in xingbieLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="shoujihaoma" class="input-item">
                    <el-input v-model="form.shoujihaoma" placeholder="手机号码"
                              type="text"
                        :readonly="!isAdd||disabledForm.shoujihaoma?true:false" ></el-input>
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
            tableName:'yonghu',
            formName:'用户',
            formVisible:false,
            formTitle:'',
            form:{
                yonghuzhanghao: '',
                yonghumima: '',
                yonghuxingming: '',
                touxiang: '',
                xingbie: '',
                shoujihaoma: '',
            },
            id:0,
            type:'',
            disabledForm:{
                yonghuzhanghao : false,
                yonghumima : false,
                yonghuxingming : false,
                touxiang : false,
                xingbie : false,
                shoujihaoma : false,
            },
            isAdd:false,
            rules:{
                yonghuzhanghao: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                yonghumima: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                yonghuxingming: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                touxiang: [
                ],
                xingbie: [
                ],
                shoujihaoma: [
                    { validator: toolUtil.fromValidate.mobile, trigger: 'blur' },
                ],
            },
            //性别列表
                xingbieLists:[],
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
        //头像上传回调
        touxiangUploadSuccess(e){
        this.form.touxiang = e
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
                    if(x=='yonghuzhanghao'){
                        this.form.yonghuzhanghao = row[x];
                        this.disabledForm.yonghuzhanghao = true;
                        continue;
                    }
                    if(x=='yonghumima'){
                        this.form.yonghumima = row[x];
                        this.disabledForm.yonghumima = true;
                        continue;
                    }
                    if(x=='yonghuxingming'){
                        this.form.yonghuxingming = row[x];
                        this.disabledForm.yonghuxingming = true;
                        continue;
                    }
                    if(x=='touxiang'){
                        this.form.touxiang = row[x];
                        this.disabledForm.touxiang = true;
                        continue;
                    }
                    if(x=='xingbie'){
                        this.form.xingbie = row[x];
                        this.disabledForm.xingbie = true;
                        continue;
                    }
                    if(x=='shoujihaoma'){
                        this.form.shoujihaoma = row[x];
                        this.disabledForm.shoujihaoma = true;
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
                this.formVisible = true
            }
            http.get(this.sessionTable+'/session').then(res=>{
                var json = res.data.data
            })
            this.xingbieLists = "男,女".split(',')
        },
        //关闭
        closeClick(){
            this.formVisible = false
        },
        //提交
        save(){
            if(this.form.touxiang!=null) {
                this.form.touxiang = this.form.touxiang.replace(new RegExp(baseUrl,"g"),"");
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
                    http.get('yonghu/page',{
                        params:params
                    }).then(res=>{
                        if(res.data.data.total>=crossOptNum){
                            return this.$message.error(this.crossTips)
                        }else{
                            http.post(`yonghu/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                    http.post(`yonghu/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
