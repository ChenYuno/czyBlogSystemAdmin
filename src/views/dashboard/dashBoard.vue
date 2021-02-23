<template>
    <div class="dashboard-part-box">
        <el-row :gutter="20">
            <el-col :span="6"><div class="web-size-content">
                <div class="web-size-title">
                    <el-divider content-position="left">网站浏览量:</el-divider>
                    <div class="web-size-info-number">{{viewCount}}</div>
                </div>
            </div></el-col>
            <el-col :span="6"><div class="web-size-content">
                <div class="web-size-title">
                    <el-divider content-position="left">评论总数:</el-divider>
                    <div class="web-size-info-number">{{commentCount}}</div>
                </div>
            </div></el-col>
            <el-col :span="6"><div class="web-size-content">
                <div class="web-size-title">
                    <el-divider content-position="left">文章总数:</el-divider>
                    <div class="web-size-info-number">{{articleCount}}</div>
                </div>
            </div></el-col>
            <el-col :span="6"><div class="web-size-content">
                <div class="web-size-title">
                    <el-divider content-position="left">用户数量:</el-divider>
                    <div class="web-size-info-number">{{userCount}}</div>
                </div>
            </div></el-col>
        </el-row>

        <el-row :gutter="20" class="dashboard-layout-padding">

            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="dashboard-card-title">快速操作</span>
                    </div>
                    <div class="fast-way-list">
                        <div>
                            <router-link class="el-icon-edit" to="/content/postArticle">
                                写文章
                            </router-link>
                        </div>
                        <div>
                            <router-link class="el-icon-info" to="/settings/websizeInfo">
                                修改网站信息
                            </router-link>
                        </div>
                        <div>
                            <router-link class="el-icon-connection" to="/settings/friendLink">
                                编辑友情链接
                            </router-link>
                        </div>
                        <div>
                            <router-link class="el-icon-picture-outline" to="/content/managerImage">
                                图片管理
                            </router-link>
                        </div>
                        <div>
                            <router-link class="el-icon-picture-outline-round" to="/operation/loop">
                                添加轮播图
                            </router-link>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="dashboard-card-title">最新评论</span>
                        <el-button style="float: right; padding: 3px 0" type="text"
                        @click="toCommentMore">更多 >>></el-button>
                    </div>
                    <div class="list-last-new-comments">
                        <el-table
                                v-loading="loading"
                                :data="comments"
                                style="width: 100%">

                            <el-table-column
                                    width="600"
                                    label="评论内容">
                                <template slot-scope="scope">
                                    <el-popover trigger="click" placement="top">
                                        <p v-if="scope.row.parentContent">评论的是评论: {{'\n'+ scope.row.parentContent }}</p>
                                        <p v-else>评论的是文章</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag type="warning">{{ scope.row.content }}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>


                            <el-table-column
                                    fixed="right"
                                    label="评论归属用户"
                                    width="160">
                                <template slot-scope="scope">
                                    <div style="display: flex">
                                        <el-avatar size="medium" :src="scope.row.userAvatar"></el-avatar>
                                        <el-popover type="black" trigger="click" placement="top">
                                            <p>该用户id: <el-link type="primary">{{'\n'+ scope.row.userId }}</el-link></p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag type="primary">{{ scope.row.userName }}</el-tag>
                                            </div>
                                        </el-popover>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>

        </el-row>
    </div>
</template>

<script>
    import userApi from "../../api/userApi";
    import commentApi from "../../api/commentApi";
    import articleApi from "../../api/articleApi";
    import settingsApi from "../../api/settingsApi";
    export default {
        name: "DashBoard",
        data(){
            return{
                loading:false,
                viewCount: 0,
                commentCount: 0,
                articleCount: 0,
                userCount: 0,
                comments: []
            }
        },
        methods:{
            listLastComment(page = 1, size = 10, commendId = '') {
                commentApi.listAllComment(page, size, commendId)
                .then(res=>{
                    if (res.data.code === commentApi.success_code()) {
                        this.comments = res.data.data.data.records;
                    }
                })
            },
            toCommentMore() {
                this.$router.push('/content/manageComment');
            },
            listCount() {
                settingsApi.getAndFlushWebSizeViewCount()
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.viewCount = res.data.data.data;
                    }
                })
                commentApi.getCommentTotalCount()
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.commentCount = res.data.data.data;
                    }
                })
                articleApi.getArticleTotalCount()
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.articleCount = res.data.data.data;
                    }
                })
                userApi.getRegisterUserCount()
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        this.userCount = res.data.data.data;
                    }
                })
            }
        },
        mounted() {
            this.listCount();
            this.listLastComment();
        }
    }
</script>

<style scoped lang="less">
    .fast-way-list {
        a{
            color: #00aeff;
            text-decoration: none;
        }

        font-size:17px;
        :nth-child(1){
            margin-bottom: 10px;
        }
        padding: 10px;
        > div + div{
            margin-bottom: 10px;
        }
    }
    .dashboard-card-title{
        font-size: 20px;
        font-weight: 600;
    }

    .dashboard-layout-padding{
        padding-top: 2rem;
    }
    .dashboard-part-box{
        padding: 2rem;
    }

    .web-size-title {
        height: 50px;
        line-height: 50px;
        padding: 20px;
    }
    .web-size-content {
        background-color: #ffffff;
        box-shadow: 0 4px 10px #d4d4d4;
        border-radius: 4px;
        height: 140px;
    }
    .web-size-info-number {
        font-size: 40px;
        font-weight: 800;
        text-align: center;
        color: #ff4e6a;
    }

</style>