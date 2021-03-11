<template>
    <div class="login-wall">
        <canvas id="content_canvas"></canvas>
        <div class="blog-sign">
            <a href="">Czy</a>
            <a href="">Blog</a>
        </div>
        <div class="binft-box">
            <div id="binft"></div>
        </div>
        <div id="photoimg" class="photo" @mouseout="mouseleave" @mouseover="mouseon">
            <img :src="photo">
        </div>
        <div class="dataToLogin">
            <div class="icon" style="position: relative">
                <el-form label-position="right" label-width="80px" style="margin-top: 50px">
                   <el-form-item label="账号：" required style="background: aliceblue;text-align: center">
                        <el-input v-model="blogUser.userName" placeholder="用户名/邮箱地址"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" required style="background: aliceblue;text-align: center">
                        <el-input v-model="blogUser.password" type="password" placeholder="请输入密码"></el-input>
                    </el-form-item>

                    <el-form-item label="验证码：" required style="background: aliceblue;text-align: center">
                        <div class="verifyCodeRow">
                        <el-input v-model="loginInfo.captcha" placeholder="请输入右侧验证码"
                                  @keydown.enter.native="doLogin"></el-input>

                        </div>
                    </el-form-item>
                    <el-form-item>
                    <img id="captchaImg" class="vv-img" :src="captchaPath" @click="updateVerifyCode">
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="margin-top: 17px"  @click="doLogin">提交</el-button>

                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {daimayu} from "../../assets/js/daimayu/daimayu";
    import {daimayuInit} from "../../assets/js/daimayu/daimayuInit";
    import {binft} from "../../assets/js/binft/binft";
    import http from "../../api/userApi";
    import {hex_md5} from "../../utils/md5";
    export default {
        name: "login",
        data() {
            return {
                photo: require("@/assets/avatar.gif"),
                fit: 'cover',
                labelPosition: 'right',
                blogUser: {
                    userName: '',
                    password: '',
                },
                loginInfo:{
                    captcha:'',
                    from:'',
                    captcha_key:''
                },
                captchaPath: '',
                random: ''
            }
        },
        mounted() {
            daimayu()
            daimayuInit()
            binft()
            let randomTimeStamp = new Date().getTime();
            this.random = randomTimeStamp;
            this.updateVerifyCode();
        },
        methods: {
            toastE(msg){
                this.$message({
                    message: msg,
                    center:true,
                    type:'error'
                })
            },
            doLogin(){
                if (this.blogUser.userName === '') {
                    this.toastE('账号不可以为空');
                }
                if (this.blogUser.password === '') {
                    this.toastE('密码不可以为空');
                }
                if (this.loginInfo.captcha === '') {
                    this.toastE('验证码不可以为空');
                }
                let md5PasswordUser = {
                    userName: '',
                    password: '',
                };
                md5PasswordUser.userName = this.blogUser.userName;
                md5PasswordUser.password = hex_md5(this.blogUser.password);
                http.doLogin(this.loginInfo.captcha,this.loginInfo.captcha_key,"p_",md5PasswordUser)
                .then(res=>{
                    console.log(res.data)
                    this.updateVerifyCode()
                    // this.$message({
                    //     message: res.data.message,
                    //     center:true,
                    //     type: res.data.success ? 'success' : 'error'
                    // })
                    if (res.data.code === http.success_code()){
                        console.log('到这里应该是要跳转页面了。。。')
                        this.$router.push({path: '/index'})

                    }
                });
            },
            updateVerifyCode(){

                let timeStamp = new Date().getTime();
                //todo:上线记得改
                this.captchaPath = this.blog_constants.baseUrl + '/user/captcha?captcha_key=' + timeStamp + '&random=' + (this.random === '' ? '' : this.random);


                this.loginInfo.captcha_key = this.captchaPath.substring(this.captchaPath.lastIndexOf('=') + 1);

                let captchaImg = document.getElementById('captchaImg');
                captchaImg.style.setProperty('box-shadow', '0 0 0 #fff');
                captchaImg.style.setProperty('transition', 'all 1s cubic-bezier(0.02, 0.3, 0.58, 1.82)')
                setTimeout(function () {
                    captchaImg.style.setProperty('box-shadow', '5px 5px 4px black');
                },1000)
            },
            mouseleave() {
                let img = document.getElementById('photoimg');
                img.style.setProperty('transform', 'rotate(-360deg)')
                img.style.setProperty('transition', 'all 1s cubic-bezier(0.02, 0.3, 0.58, 1.82)')
                setTimeout(function () {
                    img.style.setProperty('transform', '')
                    img.style.setProperty('transition', '')
                }, 1000)
            },
            mouseon() {
                let img = document.getElementById('photoimg');
                img.style.setProperty('transform', 'rotate(360deg)')
                img.style.setProperty('transition', 'all 1s cubic-bezier(0.02, 0.3, 0.58, 1.82)')
                setTimeout(function () {
                    img.style.setProperty('transform', '')
                    img.style.setProperty('transition', '')
                }, 1000)
            }
        }
    }
</script>

<style scoped lang="less">
    .verifyCodeRow{
        display: flex;

    }
    .vv-img {
        height: 40px;
        width: 120px;
        box-shadow: 5px 5px 4px #001528;
        border-top-right-radius: 9px;
        border-bottom-right-radius: 9px;
        cursor:pointer;
        margin: 0 auto;
    }
    .login-wall {
        position: relative;
        height: 100vh;
        width: 100vw;
    }

    .blog-sign {
        z-index: 900;
        transform: rotate(330deg);
        position: fixed;
        top: 10%;
        left: 20%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 120px;
        width: 300px;
        font-weight: 900;
        font-size: 60px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        text-shadow: 3px 3px 10px black;

        a {
            color: white;
            animation: binft 3s infinite alternate;

        }
    }

    .binft-box {
        height: 85px;
        left: 40%;
        z-index: 100;
        position: fixed;
        font-weight: 900;
        top: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 900;
        font-size: 30px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        text-shadow: 1px 1px 0px black,
        2px 2px 0px gray,
        3px 3px 0px gray,
        4px 4px 0px gray;
        color: white;
    }

    .photo {
        z-index: 200;
        position: fixed;
        top: 20%;
        left: 45%;
        width: 100px !important;
        height: 100px !important;

        img {
            box-shadow: 1px 1px 3px black,
            2px 2px 3px black,
            3px 3px 3px black,
            4px 4px 3px black,
            5px 5px 3px black;
            border-radius: 50px;
            width: 100px !important;
            height: 100px !important;

        }

    }

    .dataToLogin {
        position: fixed;
        left: 20vw;
        width: 60vw;
        height: 50vh;
        background: white;
        bottom: 7vh;
        padding: 0;
        border-radius: 10px;
        box-shadow: 4px 4px 4px black;
        display: flex;
        justify-content: center;
        overflow: scroll;
    }

    #content_canvas {
        z-index: -1;
        position: fixed;
    }


    * {
        margin: 0;
        padding: 0;
        text-decoration: none;
    }

    @keyframes binft {
        from {
            text-shadow: 0px 0px 20px yellow, 0px 0px 10px orange, 0px 0px 10px orangered, 0px 0px 10px red;
        }
        to {
            text-shadow: 0px 0px 0px yellow, 0px 0px 0px orange, 0px 0px 0px orangered, 1px 1px 0px #001528, 2px 2px 0px #001528, 3px 3px 0px #001528;
        }
    }

</style>