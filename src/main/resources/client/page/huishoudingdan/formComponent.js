Vue.component('huishoudingdan-form',{
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
                <el-form-item label="回收单价" prop="huishoudanjia" class="input-item">
                    <el-input v-model="form.huishoudanjia" placeholder="回收单价"
                              type="text"
                        :readonly="!isAdd||disabledForm.huishoudanjia?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="回收数量" prop="huishoushuliang" class="input-item">
                    <el-input v-model="form.huishoushuliang" placeholder="回收数量"
                              type="text"
                        :readonly="!isAdd||disabledForm.huishoushuliang?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="回收总价" prop="huishouzongjia" class="input-item">
                    <el-input v-model="form.huishouzongjia" placeholder="回收总价" readonly></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="zhuangtai" class="input-item">
                    <el-input v-model="form.zhuangtai" placeholder="状态"
                              type="text"
                        :readonly="!isAdd||disabledForm.zhuangtai?true:false" ></el-input>
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
                <el-form-item label="分配状态" prop="fenpeizhuangtai" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.fenpeizhuangtai?true:false"
                            v-model="form.fenpeizhuangtai"
                            placeholder="请选择分配状态"
                    >
                    <el-option v-for="(item,index) in fenpeizhuangtaiLists" :label="item"
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
            tableName:'huishoudingdan',
            formName:'回收订单',
            formVisible:false,
            formTitle:'',
            form:{
                jiuwumingcheng: '',
                jiuwufenlei: '',
                huishoudanjia: '',
                huishoushuliang: '',
                huishouzongjia: '',
                zhuangtai: '',
                yonghuzhanghao: '',
                yonghuxingming: '',
                fenpeizhuangtai: '未分配',
            },
            id:0,
            type:'',
            disabledForm:{
                jiuwumingcheng : false,
                jiuwufenlei : false,
                huishoudanjia : false,
                huishoushuliang : false,
                huishouzongjia : false,
                zhuangtai : false,
                yonghuzhanghao : false,
                yonghuxingming : false,
                fenpeizhuangtai : false,
            },
            isAdd:false,
            rules:{
                jiuwumingcheng: [
                ],
                jiuwufenlei: [
                ],
                huishoudanjia: [
                    { validator: toolUtil.fromValidate.number, trigger: 'blur' },
                ],
                huishoushuliang: [
                    { validator: toolUtil.fromValidate.intNumber, trigger: 'blur' },
                ],
                huishouzongjia: [
                    { validator: toolUtil.fromValidate.number, trigger: 'blur' },
                ],
                zhuangtai: [
                ],
                yonghuzhanghao: [
                ],
                yonghuxingming: [
                ],
                fenpeizhuangtai: [
                ],
            },
            //分配状态列表
                fenpeizhuangtaiLists:[],
            crossRow:'',
            crossTable:'',
            crossTips:'',
            crossColumnName:'',
            crossColumnValue:'',
        }
    },
    watch:{
        "form":{
            handler:function (){
                let c = this.form
                let a0 = Number(c.huishoudanjia)*Number(c.huishoushuliang)
                this.form.huishouzongjia = a0.toFixed(2)
            },
            deep:true
        }
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
                    if(x=='huishoudanjia'){
                        this.form.huishoudanjia = row[x];
                        this.disabledForm.huishoudanjia = true;
                        continue;
                    }
                    if(x=='huishoushuliang'){
                        this.form.huishoushuliang = row[x];
                        this.disabledForm.huishoushuliang = true;
                        continue;
                    }
                    if(x=='huishouzongjia'){
                        this.form.huishouzongjia = row[x];
                        this.disabledForm.huishouzongjia = true;
                        continue;
                    }
                    if(x=='zhuangtai'){
                        this.form.zhuangtai = row[x];
                        this.disabledForm.zhuangtai = true;
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
                    if(x=='fenpeizhuangtai'){
                        this.form.fenpeizhuangtai = row[x];
                        this.disabledForm.fenpeizhuangtai = true;
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
                this.form.fenpeizhuangtai='未分配'
                this.formVisible = true
            }
            http.get(this.sessionTable+'/session').then(res=>{
                var json = res.data.data
                if((json.yonghuzhanghao || json.yonghuzhanghao==0) && toolUtil.storageGet("role")!="管理员"){
                    this.form.yonghuzhanghao = json.yonghuzhanghao
                    this.disabledForm.yonghuzhanghao = true;
                }
                if((json.yonghuxingming || json.yonghuxingming==0) && toolUtil.storageGet("role")!="管理员"){
                    this.form.yonghuxingming = json.yonghuxingming
                    this.disabledForm.yonghuxingming = true;
                }
            })
            this.fenpeizhuangtaiLists = "已分配,未分配".split(',')
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
                    http.get('huishoudingdan/page',{
                        params:params
                    }).then(res=>{
                        if(res.data.data.total>=crossOptNum){
                            return this.$message.error(this.crossTips)
                        }else{
                            http.post(`huishoudingdan/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                    http.post(`huishoudingdan/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
