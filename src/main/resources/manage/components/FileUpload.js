//先决：vue.js、http.js
Vue.component('file-upload', {
    data() {
        return {
            baseUrl: baseUrl,
            // 查看大图
            dialogVisible: false,
            // 查看大图
            dialogImageUrl: "",
            // 组件渲染图片的数组字段，有特殊格式要求
            fileList: [],
            fileUrlList: [],
            myHeaders:{}
        };
    },
    props: ["type","tip", "action", "limit", "multiple", "fileUrls","disabled"],
    mounted() {
        this.init();
        this.myHeaders= {
            'Token':localStorage.getItem('Token')
        }
    },
    watch: {
        fileUrls: function(val, oldVal) {
            this.init();
        }
    },
    computed: {
        getActionUrl: function() {
            return this.baseUrl +  this.action;
        }
    },
    methods: {
        // 初始化
        init() {
            if (this.fileUrls) {
                this.fileUrlList = this.fileUrls.split(",");
                let fileArray = [];
                this.fileUrlList.forEach(function(item, index) {
                    let url = item;
                    let s = url.match(/(\w*).(\w)*$/)
                    let name = s.length?s[0]:index;
                    let file = {
                        name: name,
                        url: url
                    };
                    fileArray.push(file);
                });
                this.setFileList(fileArray);
            }
        },
        handleBeforeUpload(file) {

        },
        // 上传文件成功后执行
        handleUploadSuccess(res, file, fileList) {
            if (res && res.code === 0) {
                fileList[fileList.length - 1]["url"] = "file/" + file.response.file;
                this.setFileList(fileList);
                this.$emit("change", this.fileUrlList.join(","));
            } else {
                this.$message.error(res.msg);
            }
        },
        // 图片上传失败
        handleUploadErr(err, file, fileList) {
            this.$message.error("文件上传失败");
        },
        // 移除图片
        handleRemove(file, fileList) {
            this.setFileList(fileList);
            this.$emit("change", this.fileUrlList.join(","));
        },
        // 查看大图
        handleUploadPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 限制图片数量
        handleExceed(files, fileList) {
            this.$message.warning(`最多上传${this.limit}张图片`);
        },
        // 重新对fileList进行赋值
        setFileList(fileList) {
            var fileArray = [];
            var fileUrlArray = [];
            // 有些图片不是公开的，所以需要携带token信息做权限校验
            var token = localStorage.getItem('Token');
            let _this = this;
            fileList.forEach(function(item, index) {
                var url = item.url.split("?")[0];
                if(!url.startsWith("http")) {
                    url = _this.baseUrl +  url
                }
                var name = item.name;
                var file = {
                    name: name,
                    url: url + "?token=" + token
                };
                fileArray.push(file);
                fileUrlArray.push(url);
            });
            this.fileList = fileArray;
            this.fileUrlList = fileUrlArray;
        }
    },
    template: `
<template v-if="type=='file'">
    <el-upload
      ref="upload"
      :action="getActionUrl"
      :multiple="multiple"
      :limit="limit"
      :headers="myHeaders"
      :file-list="fileList"
      :headers="myHeaders"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :on-preview="handleUploadPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadErr"
      :before-upload="handleBeforeUpload"
      :disabled="disabled">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip" style="color:#838fa1;">{{tip}}</div>
    </el-upload>
</template>
<template v-else>
  <div>
    <!-- 上传文件组件 -->
    <el-upload
      ref="upload"
      :action="getActionUrl"
      list-type="picture-card"
      :multiple="multiple"
      :limit="limit"
      :headers="myHeaders"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :on-preview="handleUploadPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadErr"
      :before-upload="handleBeforeUpload"
      :disabled="disabled"
      :class="{disabled:disabled||fileList.length==limit}"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip" style="color:#838fa1;">{{tip}}</div>
    </el-upload>
    <el-dialog class="img-preview-dialog" :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
`
})