<template>
    <div>
        <div class="email-box">
            <div class="email-lk"></div>
            <div class="email-content">


                        <transition appear name="slide-fade" mode="in-out">

                        <el-form label-width="100px" style="width: 400px;padding: 15px">
                            <transition name="slide-fade" appear mode="out-in">
                            <div style="text-align: center;margin: 30px">修改邮箱</div>
                            </transition>

                            <el-form-item required
                                    prop="email"
                                    label="新邮箱地址">
                                <div style="display: flex;">
                                <el-input v-model="newEmail"></el-input>
                                    <el-button style="margin-left: 15px" v-if="!isCountDowning" type="primary" @click="getCaptcha">获取验证码</el-button>
                                    <el-button style="margin-left: 15px" v-else type="primary" disabled>
                                        {{countDown}}
                                    </el-button>
                                </div>
                            </el-form-item>
                            <el-form-item required
                                    prop="captcha"
                                    label="验证码">
                                <el-input style="width: 173px" v-model="verityCode"></el-input>
                            </el-form-item>

                            <el-form-item style="margin-left: 30px">
                                <el-button class="czyButton" @click="updateEmailAddress">修改邮箱</el-button>
                            </el-form-item>
                        </el-form>
                        </transition>

            </div>
            <div class="email-rk"></div>
        </div>
    </div>
</template>

<script>
    import settingsApi from "../../api/settingsApi";
    export default {
        name: "email",
        data(){
            return{
                // show:false,
                newEmail:'',
                verityCode:'',
                countDown:'重新发送(60)',
                isCountDowning:false
            }
        },
        methods:{
            updateEmailAddress(){
                if (this.newEmail === '') {
                    this.$message.error('邮箱地址不可以为空');
                    return;
                }
                if (this.verityCode === '') {
                    this.$message.error('验证码不可以为空');
                    return;
                }
                settingsApi.updateEmailAddress(this.newEmail, this.verityCode)
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.$message.success(res.data.message);
                        this.newEmail = '';
                        this.verityCode = '';
                    }
                })
            },
            getCaptcha(){
                let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
                if (!reg.test(this.newEmail)) {
                    this.$message.error('邮箱格式错误');
                    return;
                }

                settingsApi.getCaptcha(this.newEmail, 'update')
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.$notify({
                            title: '新消息提示：',
                            type:res.data.success,
                            message: res.data.message
                        })
                        this.startCountDown();
                    }
                })
            },
            startCountDown(){
                this.isCountDowning = true
                let that = this;
                let time = 60;
                let interval = setInterval(function () {
                    that.countDown = '重新发送(' + time + ')';
                    time--;
                    if (time <= 0) {
                        that.isCountDowning = false
                        clearInterval(interval);
                    }
                },1000);
            }
        },
        mounted() {
            // this.show = true
        }
    }
</script>

<style scoped lang="less">
    .email-lk,.email-rk{
        flex: 1;
    }
    .email-box{
        display: flex;
        justify-content: center;
        .email-content{
            flex: 5;
            width: 100%;
            background-color: #fff;
            display: flex;
            justify-content: center;
            box-shadow: 0px 0px 40px pink,
            0px 0px 45px pink,
            0px 0px 50px pink,
            0px 0px 55px pink;
            border-bottom-right-radius: 22px;
            border-bottom-left-radius: 22px;
        }
    }
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all 2s ease;
    }
    .slide-fade-leave-active {
        transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }

    .czyButton {
        color: #FFF;
        background-color: #ff4e6a;
        border-color: #ff4e6a;
    }



</style>