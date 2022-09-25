<template>
    <div class="msg-box">{{message}}</div>
</template>

<script>
    export default {
        name:'MsgBox',
        data() {
            return {
                message:''
            }
        },
        methods:{
            a(value){
                this.message = value;
                // 点击设置显示隐藏
                this.$el.style.top = '0px'
                setTimeout(()=>{
                    this.$el.style.top = '-60px'
                },2000)
                // 
            }
        }
    }
</script>

<style lang="less" scoped>
.msg-box{
    width: 400px;
    height: 60px;
    background-color: #fff;
    position: fixed;
    top: -60px;
    left: 0;
    right:0;
    margin: 0 auto;
    text-align: center;
    line-height: 60px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    transition: top 1s;
    z-index: 999999;
}
</style>