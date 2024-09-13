Vue.component('huishoufenpei-form', {
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
                <el-form-item  label="旧物名称" prop="jiuwumingcheng" class="input-item">
                    <el-input v-model="form.jiuwumingcheng"
                       placeholder="旧物名称"
                       type="text"
                       :readonly="!isAdd||disabledForm.jiuwumingcheng?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="旧物分类" prop="jiuwufenlei" class="input-item">
                    <el-input v-model="form.jiuwufenlei"
                       placeholder="旧物分类"
                       type="text"
                       :readonly="!isAdd||disabledForm.jiuwufenlei?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="回收数量" prop="huishoushuliang" class="input-item">
                    <el-input v-model="form.huishoushuliang"
                       placeholder="回收数量"
                       type="text"
                       :readonly="!isAdd||disabledForm.huishoushuliang?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="用户账号" prop="yonghuzhanghao" class="input-item">
                    <el-input v-model="form.yonghuzhanghao"
                       placeholder="用户账号"
                       type="text"
                       :readonly="!isAdd||disabledForm.yonghuzhanghao?true:false" ></el-input>
                </el-form-item>
                <el-form-item  label="用户姓名" prop="yonghuxingming" class="input-item">
                    <el-input v-model="form.yonghuxingming"
                       placeholder="用户姓名"
                       type="text"
                       :readonly="!isAdd||disabledForm.yonghuxingming?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="分配时间" prop="fenpeishijian" class="date-item">
                    <el-date-picker
                            v-model="form.fenpeishijian"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            :readonly="!isAdd||disabledForm.fenpeishijian?true:false"
                            placeholder="请选择分配时间"/>
                </el-form-item>
                <el-form-item label="人员账号" prop="renyuanzhanghao" class="select-item">
                    <el-select
                            :disabled="!isAdd||disabledForm.renyuanzhanghao?true:false"
                            v-model="form.renyuanzhanghao"
                            placeholder="请选择人员账号"
                            @change="renyuanzhanghaoChange">
                        <el-option v-for="(item,index) in renyuanzhanghaoLists"
                                   :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="人员姓名" prop="renyuanxingming" class="input-item">
                    <el-input v-model="form.renyuanxingming"
                       placeholder="人员姓名"
                       type="text"
                       :readonly="!isAdd||disabledForm.renyuanxingming?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="上门状态" prop="shangmenzhuangtai" class="select-item">
                    <el-select
                        :disabled="!isAdd||disabledForm.shangmenzhuangtai?true:false"
                        v-model="form.shangmenzhuangtai"
                        placeholder="请选择上门状态"
                    >
                        <el-option v-for="(item,index) in shangmenzhuangtaiLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
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
        formName:'回收分配',
        rules:{
            jiuwumingcheng: [
            ],
            jiuwufenlei: [
            ],
            huishoushuliang: [
                { validator: toolUtil.fromValidate.number, trigger: 'blur' },
            ],
            yonghuzhanghao: [
            ],
            yonghuxingming: [
            ],
            fenpeishijian: [
            ],
            renyuanzhanghao: [
            ],
            renyuanxingming: [
            ],
            shangmenzhuangtai: [
            ],
        },
        isAdd:false,
        disabledForm:{
            jiuwumingcheng : false,
            jiuwufenlei : false,
            huishoushuliang : false,
            yonghuzhanghao : false,
            yonghuxingming : false,
            fenpeishijian : false,
            renyuanzhanghao : false,
            renyuanxingming : false,
            shangmenzhuangtai : false,
        },
        //人员账号列表
        renyuanzhanghaoLists:[],
        //上门状态列表
        shangmenzhuangtaiLists:[],
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
                this.form.fenpeishijian = toolUtil.getCurDateTime()
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
                if(x=='fenpeishijian'){
                    this.form.fenpeishijian = row[x];
                    this.disabledForm.fenpeishijian = true;
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
                if(x=='shangmenzhuangtai'){
                    this.form.shangmenzhuangtai = row[x];
                    this.disabledForm.shangmenzhuangtai = true;
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
            this.form.shangmenzhuangtai='未回收'
            this.formVisible = true
        }
        http.get(this.sessionTable+'/session').then(res=>{
            var json = res.data.data
        })
        http.get(`option/huishourenyuan/renyuanzhanghao`).then(res=>{
            this.renyuanzhanghaoLists = res.data.data
        })
        //由上级字段带出不可改
        this.disabledForm.renyuanxingming = true;
        this.shangmenzhuangtaiLists = "已回收,未回收".split(',')
    },
    getInfo(){
        http.get(`huishoufenpei/info/${this.id}`).then(res=>{
            let reg=new RegExp('../../../upload','g')
            this.form = res.data.data
            this.formVisible = true
        })
    },
    //重置表单
    resetForm(){
        Object.assign(this.$data,this.$options.data())
        this.form = {
            jiuwumingcheng: '',
            jiuwufenlei: '',
            huishoushuliang: '',
            yonghuzhanghao: '',
            yonghuxingming: '',
            fenpeishijian: '',
            renyuanzhanghao: '',
            renyuanxingming: '',
            shangmenzhuangtai: '未回收',
        }
    },









    //关闭
    closeClick(){
        this.formVisible = false
    },
    renyuanzhanghaoChange(){
        http.get(`follow/huishourenyuan/renyuanzhanghao?columnValue=` + this.form.renyuanzhanghao).then(res=>{
            if(res.data.data.renyuanxingming){
                this.form.renyuanxingming = res.data.data.renyuanxingming
            }
        })
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
                http.get('huishoufenpei/page',{
                    params:params
                }).then(res=>{
                    if(res.data.data.total>=crossOptNum){
                        return this.$message.error(this.crossTips)
                    }else{
                        http.post(`huishoufenpei/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                http.post(`huishoufenpei/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
