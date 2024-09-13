Vue.component('discussjiuwuxinxi-form', {
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
                <el-form-item label="评论内容" prop="content" class="textarea-item">
                    <el-input v-model="form.content" placeholder="评论内容"
                              type="textarea"
                              readonly
                    />
                </el-form-item>
                <el-form-item label="回复内容" prop="reply" class="textarea-item">
                    <el-input v-model="form.reply" placeholder="回复内容"
                              type="textarea"
                              :readonly="!isAdd||disabledForm.reply?true:false"
                    />
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
        formName:'旧物信息评论表',
        rules:{
            refid: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            userid: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            avatarurl: [
            ],
            nickname: [
            ],
            content: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            reply: [
            ],
        },
        isAdd:false,
        disabledForm:{
            refid : false,
            userid : false,
            avatarurl : false,
            nickname : false,
            content : false,
            reply : false,
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
                if(x=='avatarurl'){
                    this.form.avatarurl = row[x];
                    this.disabledForm.avatarurl = true;
                    continue;
                }
                if(x=='nickname'){
                    this.form.nickname = row[x];
                    this.disabledForm.nickname = true;
                    continue;
                }
                if(x=='content'){
                    this.form.content = row[x];
                    this.disabledForm.content = true;
                    continue;
                }
                if(x=='reply'){
                    this.form.reply = row[x];
                    this.disabledForm.reply = true;
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
    },
    getInfo(){
        http.get(`discussjiuwuxinxi/info/${this.id}`).then(res=>{
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
            userid: '',
            avatarurl: '',
            nickname: '',
            content: '',
            reply: '',
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
    //提交
    save(){
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
                http.get('discussjiuwuxinxi/page',{
                    params:params
                }).then(res=>{
                    if(res.data.data.total>=crossOptNum){
                        return this.$message.error(this.crossTips)
                    }else{
                        http.post(`discussjiuwuxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                http.post(`discussjiuwuxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
