<template>
  <div class="upload">

    <div class="upload-box" v-if="!disabled">
      <label class="upload-label">
        <input class="file" type="file" @change="fileData" />
      </label>
      <div class="img-box" v-if="url != ''">
          <img class="auto-img" :src="url" alt="">
      </div>
      <div class="icon-box" v-if="url == '' || id == 2">
          <img class="auto-img" src="../assets/image/add.png" alt="">
      </div>

       <!-- 使用组件 -->
      <msg-box></msg-box>
    </div>

    <div class="upload-slot" v-if="id == 1 || id == 3">
      <slot></slot>
    </div>
     
  </div>
</template>

<script>
// 引入消息提示组件
import MsgBox from "../components/MsgBox";
export default {
    props: {
      disabled:{
        type:Boolean,
        default:false
      },
      id:{
        type:[Number,String],
        default:2
      },
      size: {
        //属性值为数值类型
        type: Number,

        //默认为1MB
        default: 1
      }
    },
    data() {
        return {
            url:''
        }
    },
    methods: {
        fileData(e){
            let self = this
            let file = e.target.files[0];
            // 

            //控制上传图片大小
            //file.size: 单位为B(字节)
            let fileSize = file.size / 1024 / 1024;
            // 
            if (fileSize > this.size) {

                // self.$emit('file-upload', {fileSize});

                // 调用子组件的方法
                this.$children[0].a('上传图片不能超过' + this.size + 'MB');

                return;
            }

            //将文件信息转换成base64

            //创建文件读取对象
            let fileReader = new FileReader();

            //监听文件读取对象是否读取完毕文件
            fileReader.onload = function (e){
                // 
                self.url = this.result;

                //触发上传组件自定义事件
                self.$emit('file-upload', {base64: this.result, type: file.type.split('/')[1]});
            }

            //读取
            fileReader.readAsDataURL(file);
        }
    },
    components: {
        MsgBox,
    },
};
</script>

<style lang="less" scoped>
.upload {
  position: relative;
  width: 160px;
  height: 160px;
  background-color: #f2f2f2;
}
.upload-slot {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #fff;
  border: 2px dashed #ddd;
  // pointer-events: none;
}
.upload-box {
  width: 100%;
  height: 100%;
  border: 2px dashed #ddd;
  position: relative;
  z-index:2;
}

.upload-label {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.file {
  display: none;
}

.img-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 3;
  background: #fff;
}

.icon-box {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  z-index: 1;
}
</style>