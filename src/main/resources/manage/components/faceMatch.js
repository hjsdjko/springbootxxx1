Vue.component('face-match',{
    data(){
        return{
            visible:false,   //弹窗
            os:false,   //控制摄像头开关
            thisVideo:null,
            thisContext:null,
            thisCancas:null,
            videoWidth:500,
            videoHeight:400,
            imgSrc:'',
        }
    },
    watch:{
        visible(n){
            if(!n){
                this.stopNavigator()
                this.resetData()
            }
        }
    },
    methods:{
        resetData(){
            this.visible = false
            this.os = false
            this.thisVideo = null
            this.thisContext = null
            this.thisCancas = null
        },
        uploadSuccess(e){
            this.visible = false
            this.$emit('change', e.file)
        },
        getCompetence(){
            this.$nextTick(()=>{
                this.os = false; //切换成关闭摄像头
                this.thisCancas = document.getElementById('canvasCamera');
                this.thisContext = this.thisCancas.getContext('2d');
                this.thisVideo = document.getElementById('videoCamera');
                // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {}
                }
                // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                // 使用getUserMedia，因为它会覆盖现有的属性。
                // 这里，如果缺少getUserMedia属性，就添加它。
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function(constraints) {
                        // 首先获取现存的getUserMedia(如果存在)
                        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
                        // 有些浏览器不支持，会返回错误信息
                        // 保持接口一致
                        if (!getUserMedia) {
                            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
                        }
                        // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                        return new Promise(function(resolve, reject) {
                            getUserMedia.call(navigator, constraints, resolve, reject)
                        })
                    }
                }
                const constraints = {
                    audio: false,
                    video: {
                        width: this.videoWidth,
                        height: this.videoHeight,
                        transform: 'scaleX(-1)'
                    }
                };
                navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
                    // 旧的浏览器可能没有srcObject
                    if ('srcObject' in this.thisVideo) {
                        this.thisVideo.srcObject = stream
                    } else {
                        // 避免在新的浏览器中使用它，因为它正在被弃用。
                        this.thisVideo.src = window.URL.createObjectURL(stream)
                    }
                    this.thisVideo.onloadedmetadata = (e) => {
                        this.thisVideo.play()
                    }
                }).catch(err => {
                    this.$message("没有开启摄像头权限或浏览器版本不兼容.","warning")
                });
            })
        },
        onTake(){
            this.visible = true
            this.getCompetence()
        },
        base64toFile(dataurl, filename = 'file'){
            let arr = dataurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let suffix = mime.split('/')[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            let file = new File([u8arr], `${filename}.${suffix}`, {
                type: mime
            })
            return file
        },
        uploadImg(){
            let data = {
                file:this.base64toFile(this.imgSrc)
            }
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"   //以form表单形式提交
                }
            }
            http.post(`file/upload`,data,config).then(res => {
                this.$emit('change', res.data.file)
            })
        },
        onCancel(){
            this.uploadImg()
            this.visible = false
        },
        drawImage(){
            // 点击，canvas画图
            this.thisContext.drawImage(this.thisVideo, 0, 0, this.videoWidth, this.videoHeight);
            // 获取图片base64链接
            this.imgSrc = this.thisCancas.toDataURL('image/png');
            /*const imgSrc=this.imgSrc;*/
        },
        clearCanvas(id){
            let c = document.getElementById(id);
            let cxt = c.getContext("2d");
            cxt.clearRect(0, 0, c.width, c.height);
        },
        resetCanvas(){
            this.imgSrc = "";
            this.clearCanvas('canvasCamera');
        },
        stopNavigator(){
            if (this.thisVideo && this.thisVideo !== null) {
                this.thisVideo.srcObject.getTracks()[0].stop();
                this.os = true; //切换成打开摄像头
            }
        },
    },
    template:`
<template>
    <el-dialog title="拍照上传" :visible.sync="visible" width="1065px" destroy-on-close>
        <div class="box">
          <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay style="background-color: #ccc"></video>
          <canvas id="canvasCamera" class="canvas" :width="videoWidth" :height="videoHeight" style="background-color: #ccc"></canvas>
        </div>
        <template #footer>
          <div style="display: flex;justify-content: flex-end;">
            <el-upload :action="baseUrl+'file/upload'" :on-success="uploadSuccess" :show-file-list="false"
                accept=".jpg,.png,.jpge" style="margin-right:10px">
              <el-button size="small">
                  上传图片
              </el-button>
            </el-upload>
            <el-button @click="drawImage" size="small">
                拍照
            </el-button>
            <el-button v-if="os" @click="getCompetence" size="small">
                打开摄像头
            </el-button>
            <el-button v-else @click="stopNavigator" size="small">
                关闭摄像头
            </el-button>
            <el-button @click="resetCanvas" size="small">
                重置
            </el-button>
            <el-button @click="onCancel" size="small">
                完成
            </el-button>
          </div>
        
        </template>
    </el-dialog>
</template>
    `
})