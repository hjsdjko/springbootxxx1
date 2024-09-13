Vue.component('zixunxinxi-form',{
    template: `
    <div>
        <el-dialog :fullscreen="false" width="80%" 
                   :visible.sync="formVisible"
                   :title="formTitle"
                   v-if="formVisible"
                   custom-class="formModel">
            <el-form ref="formRef" :model="form" class="formModel_form" :rules="rules" label-width="120px" >
                <el-form-item label="资讯标题" prop="zixunbiaoti" class="input-item">
                    <el-input v-model="form.zixunbiaoti" placeholder="资讯标题"
                              type="text"
                        :readonly="!isAdd||disabledForm.zixunbiaoti?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="资讯分类" prop="zixunfenlei" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.zixunfenlei?true:false"
                            v-model="form.zixunfenlei"
                            placeholder="请选择资讯分类"
                    >
                    <el-option v-for="(item,index) in zixunfenleiLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="封面" prop="fengmian" class="upload-item img-upload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.fengmian?true:false"
                            action="file/upload"
                            tip="请上传封面"
                            :limit="3"
                            :fileUrls="form.fengmian?form.fengmian:''"
                            @change="fengmianUploadSuccess">
                    </file-upload>
                </el-form-item>
                <el-form-item label="发布日期" prop="faburiqi" class="date-item">
                    <el-date-picker
                            v-model="form.faburiqi"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            type="datetime"
                            :readonly="!isAdd||disabledForm.faburiqi?true:false"
                            placeholder="请选择发布日期"
                            ></el-date-picker>
                </el-form-item>
                <el-form-item label="简介" prop="jianjie" class="textarea-item">
                    <el-input v-model="form.jianjie"
                              placeholder="简介"
                              type="textarea"
                              :autosize="{ minRows: 5}"
                              :readonly="!isAdd||disabledForm.jianjie?true:false"
                    ></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="neirong" class="rich-item">
                    <my-editor :value="form.neirong" placeholder="请输入内容" :readonly="!isAdd||disabledForm.neirong?true:false"
                            class="editor" @change="(e)=>editorChange(e,'neirong')"></my-editor>
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
            tableName:'zixunxinxi',
            formName:'资讯信息',
            formVisible:false,
            formTitle:'',
            form:{
                zixunbiaoti: '',
                zixunfenlei: '',
                fengmian: '',
                jianjie: '',
                neirong: '',
                faburiqi: '',
                storeupnum: '0',
            },
            id:0,
            type:'',
            disabledForm:{
                zixunbiaoti : false,
                zixunfenlei : false,
                fengmian : false,
                jianjie : false,
                neirong : false,
                faburiqi : false,
                storeupnum : false,
            },
            isAdd:false,
            rules:{
                zixunbiaoti: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                zixunfenlei: [
                ],
                fengmian: [
                ],
                jianjie: [
                ],
                neirong: [
                ],
                faburiqi: [
                ],
                storeupnum: [
                    { validator: toolUtil.fromValidate.intNumber, trigger: 'blur' },
                ],
            },
            //资讯分类列表
                zixunfenleiLists:[],
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
        //封面上传回调
        fengmianUploadSuccess(e){
        this.form.fengmian = e
        },
        getInfo(){
            http.get(`${this.tableName}/info/${this.id}`).then(res=>{
                res.data.data.neirong = res.data.data.neirong.replace(new RegExp('../../../upload','g'),'../../../cl19196363/upload');
                this.form = res.data.data
                this.formVisible = true
            })
        },
        init(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null){
            this.form.faburiqi = toolUtil.getCurDate()
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
                    if(x=='zixunbiaoti'){
                        this.form.zixunbiaoti = row[x];
                        this.disabledForm.zixunbiaoti = true;
                        continue;
                    }
                    if(x=='zixunfenlei'){
                        this.form.zixunfenlei = row[x];
                        this.disabledForm.zixunfenlei = true;
                        continue;
                    }
                    if(x=='fengmian'){
                        this.form.fengmian = row[x];
                        this.disabledForm.fengmian = true;
                        continue;
                    }
                    if(x=='jianjie'){
                        this.form.jianjie = row[x];
                        this.disabledForm.jianjie = true;
                        continue;
                    }
                    if(x=='neirong'){
                        this.form.neirong = row[x];
                        this.disabledForm.neirong = true;
                        continue;
                    }
                    if(x=='faburiqi'){
                        this.form.faburiqi = row[x];
                        this.disabledForm.faburiqi = true;
                        continue;
                    }
                    if(x=='storeupnum'){
                        this.form.storeupnum = row[x];
                        this.disabledForm.storeupnum = true;
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
                this.formVisible = true
            }
            http.get(this.sessionTable+'/session').then(res=>{
                var json = res.data.data
            })
            http.get(`option/zixunfenlei/zixunfenlei`).then(res=>{
                this.zixunfenleiLists = res.data.data
            })
        },
        //关闭
        closeClick(){
            this.formVisible = false
        },
        //富文本
        editorChange(e,name){
            this.form[name] = e
        },
        //提交
        save(){
            if(this.form.fengmian!=null) {
                this.form.fengmian = this.form.fengmian.replace(new RegExp(baseUrl,"g"),"");
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
                    http.get('zixunxinxi/page',{
                        params:params
                    }).then(res=>{
                        if(res.data.data.total>=crossOptNum){
                            return this.$message.error(this.crossTips)
                        }else{
                            http.post(`zixunxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                    http.post(`zixunxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
