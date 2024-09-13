Vue.component('shangmenhuishou-form',{
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
                <el-form-item label="旧物分类" prop="jiuwufenlei" class="input-item">
                    <el-input v-model="form.jiuwufenlei" placeholder="旧物分类"
                              type="text"
                        :readonly="!isAdd||disabledForm.jiuwufenlei?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="回收数量" prop="huishoushuliang" class="input-item">
                    <el-input v-model="form.huishoushuliang" placeholder="回收数量"
                              type="text"
                        :readonly="!isAdd||disabledForm.huishoushuliang?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="用户账号" prop="yonghuzhanghao" class="input-item">
                    <el-input v-model="form.yonghuzhanghao" placeholder="用户账号"
                              type="text"
                        :readonly="!isAdd||disabledForm.yonghuzhanghao?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="yonghuxingming" class="input-item">
                    <el-input v-model="form.yonghuxingming" placeholder="用户姓名"
                              type="text"
                        :readonly="!isAdd||disabledForm.yonghuxingming?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="回收时间" prop="huishoushijian" class="date-item">
                    <el-date-picker
                            v-model="form.huishoushijian"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            :readonly="!isAdd||disabledForm.huishoushijian?true:false"
                            placeholder="请选择回收时间" ></el-date-picker>
                </el-form-item>
                <el-form-item label="人员账号" prop="renyuanzhanghao" class="input-item">
                    <el-input v-model="form.renyuanzhanghao" placeholder="人员账号"
                              type="text"
                        :readonly="!isAdd||disabledForm.renyuanzhanghao?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="人员姓名" prop="renyuanxingming" class="input-item">
                    <el-input v-model="form.renyuanxingming" placeholder="人员姓名"
                              type="text"
                        :readonly="!isAdd||disabledForm.renyuanxingming?true:false" ></el-input>
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
            tableName:'shangmenhuishou',
            formName:'上门回收',
            formVisible:false,
            formTitle:'',
            form:{
                jiuwumingcheng: '',
                jiuwufenlei: '',
                huishoushuliang: '',
                yonghuzhanghao: '',
                yonghuxingming: '',
                huishoushijian: '',
                renyuanzhanghao: '',
                renyuanxingming: '',
            },
            id:0,
            type:'',
            disabledForm:{
                jiuwumingcheng : false,
                jiuwufenlei : false,
                huishoushuliang : false,
                yonghuzhanghao : false,
                yonghuxingming : false,
                huishoushijian : false,
                renyuanzhanghao : false,
                renyuanxingming : false,
            },
            isAdd:false,
            rules:{
                jiuwumingcheng: [
                ],
                jiuwufenlei: [
                ],
                huishoushuliang: [
                    { validator: toolUtil.fromValidate.intNumber, trigger: 'blur' },
                ],
                yonghuzhanghao: [
                ],
                yonghuxingming: [
                ],
                huishoushijian: [
                ],
                renyuanzhanghao: [
                ],
                renyuanxingming: [
                ],
            },
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
        getInfo(){
            http.get(`${this.tableName}/info/${this.id}`).then(res=>{
                this.form = res.data.data
                this.formVisible = true
            })
        },
        init(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null){
            this.form.huishoushijian = toolUtil.getCurDateTime()
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
                    if(x=='huishoushuliang'){
                        this.form.huishoushuliang = row[x];
                        this.disabledForm.huishoushuliang = true;
                        continue;
                    }
                    if(x=='yonghuzhanghao'){
                        this.form.yonghuzhanghao = row[x];
                        this.disabledForm.yonghuzhanghao = true;
                        continue;
                    }
                    if(x=='yonghuxingming'){
                        this.form.yonghuxingming = row[x];
                        this.disabledForm.yonghuxingming = true;
                        continue;
                    }
                    if(x=='huishoushijian'){
                        this.form.huishoushijian = row[x];
                        this.disabledForm.huishoushijian = true;
                        continue;
                    }
                    if(x=='renyuanzhanghao'){
                        this.form.renyuanzhanghao = row[x];
                        this.disabledForm.renyuanzhanghao = true;
                        continue;
                    }
                    if(x=='renyuanxingming'){
                        this.form.renyuanxingming = row[x];
                        this.disabledForm.renyuanxingming = true;
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
                if((json.renyuanzhanghao || json.renyuanzhanghao==0) && toolUtil.storageGet("role")!="管理员"){
                    this.form.renyuanzhanghao = json.renyuanzhanghao
                    this.disabledForm.renyuanzhanghao = true;
                }
                if((json.renyuanxingming || json.renyuanxingming==0) && toolUtil.storageGet("role")!="管理员"){
                    this.form.renyuanxingming = json.renyuanxingming
                    this.disabledForm.renyuanxingming = true;
                }
            })
        },
        //关闭
        closeClick(){
            this.formVisible = false
        },
        //提交
        save(){
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
                    http.get('shangmenhuishou/page',{
                        params:params
                    }).then(res=>{
                        if(res.data.data.total>=crossOptNum){
                            return this.$message.error(this.crossTips)
                        }else{
                            http.post(`shangmenhuishou/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                    http.post(`shangmenhuishou/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
document.write(`<script src="${baseUrl}client/static/modules/wangeditor/index.min.js"></script>`)
document.write(`<script src="../../components/myEditor.js"></script>`)
document.write(`<link rel="stylesheet" href="${baseUrl}client/static/modules/wangeditor/style.css"></link>`)
