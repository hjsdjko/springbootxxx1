Vue.component('forum-form', {
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
                <el-form-item  label="帖子标题" prop="title" class="input-item">
                    <el-input v-model="form.title"
                       placeholder="帖子标题"
                       type="text"
                       :readonly="!isAdd||disabledForm.title?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="父节点id" prop="parentid" class="input-item">
                    <el-input v-model="form.parentid"
                       placeholder="父节点id"
                       type="text"
                       :readonly="!isAdd||disabledForm.parentid?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="用户名" prop="username" class="input-item">
                    <el-input v-model="form.username"
                       placeholder="用户名"
                       type="text"
                       :readonly="!isAdd||disabledForm.username?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="isdone" class="select-item">
                    <el-select
                        :disabled="!isAdd||disabledForm.isdone?true:false"
                        v-model="form.isdone"
                        placeholder="请选择状态"
                    >
                        <el-option v-for="(item,index) in isdoneLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="帖子内容" prop="content" v-if="formVisible" class="rich-item">
                     <my-editor
                             :value="form.content" placeholder="请输入帖子内容"
                             :readonly="!isAdd||disabledForm.content?true:false"
                             @change="(e)=>editorChange(e,'content')"></my-editor  >
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
        formName:'论坛交流',
        rules:{
            title: [
            ],
            content: [
                {required: true,validator:toolUtil.fromValidate.richText,trigger: 'blur'},

            ],
            parentid: [
            ],
            username: [
            ],
            avatarurl: [
            ],
            isdone: [
            ],
            userid: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
        },
        isAdd:false,
        disabledForm:{
            title : false,
            content : false,
            parentid : false,
            username : false,
            avatarurl : false,
            isdone : false,
            userid : false,
        },
        //状态列表
        isdoneLists:[],
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
                if(x=='title'){
                    this.form.title = row[x];
                    this.disabledForm.title = true;
                    continue;
                }
                if(x=='content'){
                    this.form.content = row[x];
                    this.disabledForm.content = true;
                    continue;
                }
                if(x=='parentid'){
                    this.form.parentid = row[x];
                    this.disabledForm.parentid = true;
                    continue;
                }
                if(x=='username'){
                    this.form.username = row[x];
                    this.disabledForm.username = true;
                    continue;
                }
                if(x=='avatarurl'){
                    this.form.avatarurl = row[x];
                    this.disabledForm.avatarurl = true;
                    continue;
                }
                if(x=='isdone'){
                    this.form.isdone = row[x];
                    this.disabledForm.isdone = true;
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
            this.form.isdone='开放'
            this.formVisible = true
        }
        this.isdoneLists = "开放,关闭".split(',')
    },
    getInfo(){
        http.get(`forum/info/${this.id}`).then(res=>{
            let reg=new RegExp('../../../upload','g')
            res.data.data.content = res.data.data.content?(res.data.data.content.replace(reg,'../../../cl19196363/upload')):'';
            this.form = res.data.data
            this.formVisible = true
        })
    },
    //重置表单
    resetForm(){
        Object.assign(this.$data,this.$options.data())
        this.form = {
            title: '',
            content: '',
            parentid: '',
            username: '',
            avatarurl: '',
            isdone: '开放',
            userid: '',
        }
    },





        //头像上传回调
    avatarurlUploadSuccess(e){
        this.form.avatarurl = e
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
        this.form.userid = toolUtil.storageGet('userid')
        if(this.form.avatarurl!=null) {
            this.form.avatarurl = this.form.avatarurl.replace(new RegExp(baseUrl,"g"),"");
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
                http.get('forum/page',{
                    params:params
                }).then(res=>{
                    if(res.data.data.total>=crossOptNum){
                        return this.$message.error(this.crossTips)
                    }else{
                        http.post(`forum/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                http.post(`forum/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
document.write(`<script src="${baseUrl}manage/static/modules/wangeditor/index.min.js"></script>`)
document.write(`<script src="../../components/myEditor.js"></script>`)
document.write(`<link rel="stylesheet" href="${baseUrl}manage/static/modules/wangeditor/style.css"></link>`)
