Vue.component('storeup-form', {
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
                <el-form-item  label="名称" prop="name" class="input-item">
                    <el-input v-model="form.name"
                       placeholder="名称"
                       type="text"
                       :readonly="!isAdd||disabledForm.name?true:false" ></el-input>
                </el-form-item>
                <el-form-item prop="picture"
                              label="图片"
                              v-if="formVisible" class="imgUpload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.picture?true:false"
                            tip="点击上传图片"
                            :limit="3"
                            action="file/upload"
                            :multiple="true"
                            :file-urls="form.picture?form.picture:''"
                            @change="pictureUploadSuccess"
                    ></file-upload>
                </el-form-item>
                <el-form-item  label="推荐类型" prop="inteltype" class="input-item">
                    <el-input v-model="form.inteltype"
                       placeholder="推荐类型"
                       type="text"
                       :readonly="!isAdd||disabledForm.inteltype?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="备注" prop="remark" class="input-item">
                    <el-input v-model="form.remark"
                       placeholder="备注"
                       type="text"
                       :readonly="!isAdd||disabledForm.remark?true:false" ></el-input>
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
        formName:'我的收藏',
        rules:{
            refid: [
            ],
            tablename: [
            ],
            name: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            picture: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            type: [
            ],
            inteltype: [
            ],
            remark: [
            ],
            userid: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
        },
        isAdd:false,
        disabledForm:{
            refid : false,
            tablename : false,
            name : false,
            picture : false,
            type : false,
            inteltype : false,
            remark : false,
            userid : false,
        },
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
                if(x=='refid'){
                    this.form.refid = row[x];
                    this.disabledForm.refid = true;
                    continue;
                }
                if(x=='tablename'){
                    this.form.tablename = row[x];
                    this.disabledForm.tablename = true;
                    continue;
                }
                if(x=='name'){
                    this.form.name = row[x];
                    this.disabledForm.name = true;
                    continue;
                }
                if(x=='picture'){
                    this.form.picture = row[x];
                    this.disabledForm.picture = true;
                    continue;
                }
                if(x=='type'){
                    this.form.type = row[x];
                    this.disabledForm.type = true;
                    continue;
                }
                if(x=='inteltype'){
                    this.form.inteltype = row[x];
                    this.disabledForm.inteltype = true;
                    continue;
                }
                if(x=='remark'){
                    this.form.remark = row[x];
                    this.disabledForm.remark = true;
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
            this.form.type='1'
            this.formVisible = true
        }
    },
    getInfo(){
        http.get(`storeup/info/${this.id}`).then(res=>{
            let reg=new RegExp('../../../upload','g')
            this.form = res.data.data
            this.formVisible = true
        })
    },
    //重置表单
    resetForm(){
        Object.assign(this.$data,this.$options.data())
        this.form = {
            refid: '',
            tablename: '',
            name: '',
            picture: '',
            type: '1',
            inteltype: '',
            remark: '',
            userid: '',
        }
    },




        //图片上传回调
    pictureUploadSuccess(e){
        this.form.picture = e
    },




    //关闭
    closeClick(){
        this.formVisible = false
    },
    //提交
    save(){
        if(this.form.picture!=null) {
            this.form.picture = this.form.picture.replace(new RegExp(baseUrl,"g"),"");
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
                http.get('storeup/page',{
                    params:params
                }).then(res=>{
                    if(res.data.data.total>=crossOptNum){
                        return this.$message.error(this.crossTips)
                    }else{
                        http.post(`storeup/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                http.post(`storeup/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
