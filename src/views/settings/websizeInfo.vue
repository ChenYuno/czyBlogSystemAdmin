<template>
    <div>
        <div class="web-size-info-box">
            <div class="web-size-info-lk"></div>
            <transition appear
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter">
            <div class="web-size-info-content">

                <el-form label-width="100px">
                    <el-form-item label="网站名称">
                        <el-input v-model="websizeTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="网站关键字">
                        <el-tooltip content="关键字请用','隔开" placement="top" effect="light">
                        <el-input v-model="keyword" placeholder="关键字请用','隔开"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="网站描述">
                        <el-input
                                :rows="3"
                                type="textarea"
                                v-model="description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                                @click="updateSeoInfo"
                                style="background-color: #ff4e6a;color: #FFFFFF">
                            更 新
                        </el-button>
                    </el-form-item>
                </el-form>

            </div>
            </transition>
            <div class="web-size-info-rk"></div>
        </div>
    </div>
</template>

<script>
    import Velocity from '@/assets/js/animation/Velocity'
    import settingsApi from "../../api/settingsApi";
    export default{
        name: "websizeInfo",
        data(){
            return{
                websizeTitle: '',
                keyword: '',
                description: '',
                oldInfo:{
                    websizeTitle: '',
                    keyword: '',
                    description: '',
                }
            }
        },
        methods:{
            updateSeoInfo() {
                if (this.websizeTitle === '') {
                    this.$message.error('网站标题不可以为空');
                    return;
                }
                if (this.keyword === '') {
                    this.$message.error('关键字不可以为空');
                    return;
                }
                if (this.description === '') {
                    this.$message.error('网站描述不可以为空');
                    return;
                }
                let updateWebInfo = false;
                if (this.websizeTitle !== this.oldInfo.websizeTitle) {
                    settingsApi.updateWebsizeTitle(this.websizeTitle)
                    .then(res=>{
                        if (res.data.code === settingsApi.success_code()) {
                            this.getWebsizeTitle();
                        }
                    })
                }
                if (this.description !== this.oldInfo.description ||
                    this.keyword !== this.oldInfo.keyword) {
                    settingsApi.updateSeoInfo(this.description, this.keyword)
                    .then(res=>{
                        if (res.data.code === settingsApi.success_code()) {
                            this.getWebsizeInfo();
                        }
                    })
                    updateWebInfo = true;
                }
                if (updateWebInfo) {
                    this.$message.success('网站seo更新成功ヽ(￣ω￣(￣ω￣〃)ゝ');
                } else {
                    this.$message.success('网站标题更新成功O(∩_∩)O哈哈~');
                }
            },
            getWebsizeInfo() {
                settingsApi.getWebsizeInfo()
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.keyword = res.data.data.web_size_keywords;
                        this.description = res.data.data.web_size_description;
                        this.oldInfo.keyword = this.keyword;
                        this.oldInfo.description = this.description;
                    }
                })
            },
            getWebsizeTitle() {
                settingsApi.getWebsizeTitle()
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.websizeTitle = res.data.data.web_size_title;
                        this.oldInfo.websizeTitle = this.websizeTitle;
                    }
                })
            },
            beforeEnter: function (el) {
                el.style.opacity = 0
                el.style.transformOrigin = 'left'
            },
            enter: function (el, done) {
                Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
                Velocity(el, { fontSize: '1em' }, { complete: done })
            },
        },
        mounted() {
            this.getWebsizeTitle();
            this.getWebsizeInfo();
            console.log(this.description)
        }
    }
</script>

<style scoped lang="less">
    .web-size-info-box{
        display: flex;
        justify-content: center;
        .web-size-info-lk,.web-size-info-rk{
            flex: 1;
        }
        .web-size-info-content{

            border-radius: 45px;
            /*height: calc(100vh - 175px);*/
            box-shadow: 0px 0px 40px #ffc0cb,
            0px 0px 45px cyan,
            0px 0px 50px cyan,
            0px 0px 55px cyan;

            background-color: #FFFFFF;
            flex: 5;
            display: flex;
            justify-content: center;

            .el-input,.el-textarea{
                width: 500px;
            }
            .el-form{
                box-shadow: 0px 0px 19px #ff4e6a;
                margin: 10px;
                padding: 10px;
            }
        }
    }

</style>