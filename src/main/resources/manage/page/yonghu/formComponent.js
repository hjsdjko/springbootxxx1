Vue.component('yonghu-form', {
template:`
<template>
    <div>
        <el-dialog
                :visible.sync="formVisible"
                :title="formTitle"
                v-if="formVisible"
                custom-class="formModel"
                >
            <el-form class="formModel_form" ref="formRef" :model="form" :rules="rules" >
                <el-form-item label="用户账号" prop="yonghuzhanghao" class="input-item">
                    <el-input v-model="form.yonghuzhanghao"
                           placeholder="用户账号"
                           type="text"
                           :readonly="!isAdd||disabledForm.yonghuzhanghao?true:false"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="yonghumima" class="input-item">
                    <el-input v-model="form.yonghumima"
                           placeholder="用户密码"
                           type="password"
                           :readonly="!isAdd||disabledForm.yonghumima?true:false"></el-input>
                </el-form-item>
                <el-form-item  label="用户姓名" prop="yonghuxingming" class="input-item">
                    <el-input v-model="form.yonghuxingming"
                       placeholder="用户姓名"
                       type="text"
                       :readonly="!isAdd||disabledForm.yonghuxingming?true:false" ></el-input>
                </el-form-item>
                <el-form-item prop="touxiang"
                              label="头像"
                              v-if="formVisible" class="imgUpload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.touxiang?true:false"
                            tip="点击上传头像"
                            :limit="3"
                            action="file/upload"
                            :multiple="true"
                            :file-urls="form.touxiang?form.touxiang:''"
                            @change="touxiangUploadSuccess"
                    ></file-upload>
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
                <el-form-item  label="手机号码" prop="shoujihaoma" class="input-item">
                    <el-input v-model="form.shoujihaoma"
                       placeholder="手机号码"
                       type="text"
                       :readonly="!isAdd||disabledForm.shoujihaoma?true:false" ></el-input>
                </el-form-item>
            </el-form>
            <div class="formModel-btns" v-if="isAdd||type=='reply'">
                <el-button class="formModel_cancel" @click="closeClick">取消</el-button>
                <el-button class="formModel_confirm" type="primary" @click="save"
                    >
                    提交
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
`,
data() {
    return {
        formVisible:false,
        formTitle:'',
        id:0,
        form:{},
        type:'',
        formName:'用户',
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
        isAdd:false,
        disabledForm:{
            yonghuzhanghao : false,
            yonghumima : false,
            yonghuxingming : false,
            touxiang : false,
            xingbie : false,
            shoujihaoma : false,
        },
        //性别列表
        xingbieLists:[],
        crossRow:'',
        crossTips:'',
        crossColumnName:'',
        crossColumnValue:'',
        userInfo:{},
        sessionTable:localStorage.getItem('admin_sessionTable'),
    }
},
watch:{
},
methods: {
    init(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null){
        this.resetForm()
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
    getInfo(){
        http.get(`yonghu/info/${this.id}`).then(res=>{
            let reg=new RegExp('../../../upload','g')
            this.form = res.data.data
            this.formVisible = true
        })
    },
    //重置表单
    resetForm(){
        Object.assign(this.$data,this.$options.data())
        this.form = {
            yonghuzhanghao: '',
            yonghumima: '',
            yonghuxingming: '',
            touxiang: '',
            xingbie: '',
            shoujihaoma: '',
        }
    },




        //头像上传回调
    touxiangUploadSuccess(e){
        this.form.touxiang = e
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
},
})
document.write(`<script src="../../components/FileUpload.js"></script>`)
