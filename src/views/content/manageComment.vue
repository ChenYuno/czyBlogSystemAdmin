<template>
    <div style="width: 100%;height: calc(100vh - 175px);background-color: white">


    <transition name="slide-fade" appear mode="out-in">


        <div class="comment-list-part">

            <div class="comment-action-bar">
            <div class="comment-page-navigation">

                <el-pagination
                        style="margin-left: 10px;margin-bottom: 7px"
                        background
                        @size-change="commentshandleSizeChange"
                        @current-change="commentshandlePageChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.totalCount">
                </el-pagination>
            </div>

            <div class="comment-query-parentComment">
                <el-form :inline="true">
                    <el-form-item label="为了查询评论的评论😝">
                    <el-input width="200px" v-model="queryCommentId" @keydown.enter.native="queryComment"  placeholder="请输入要查询评论的ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button style="background-color: #ff4e6a;border-radius: 7px;
border-color: #ff4e6a;color: #fff" @click="queryComment">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button style="background-color: cyan;border-radius: 7px;
border-color: cyan;color: #000000" @click="queryAllComment">查询全部</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button style="background-color: pink;border-radius: 7px;
border-color:pink;color: #fff;box-shadow: 0 0 10px red" @click="updateAllUserInfo">更新用户状态信息</el-button>
                    </el-form-item>
                </el-form>
            </div>
            </div>
            <el-table
                    v-loading="loading"
                    :data="comments"
                    style="width: 100%">
                <el-table-column
                        label="ID"
                        width="200">
                    <template slot-scope="scope">
                        <el-link type="primary">{{scope.row.id}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column
                        width="600"
                        label="评论内容">
                    <template slot-scope="scope">
                        <el-popover trigger="click" placement="top">
                            <p v-if="scope.row.parentContentId">评论的是评论: {{'\n'+ scope.row.parentContentId}}</p>
                            <p v-else>评论的是文章<el-link :href="`#/content/postArticle?articleId=${scope.row.articleId}`" target="_blank">{{'\n'+ scope.row.articleId}}</el-link></p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag type="warning" v-html="scope.row.content "></el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        label="评论归属用户"
                        width="120">
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
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium" type="success" v-if="scope.row.state =='1'">正常</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.state =='0'">禁 用</el-tag>
                        <el-tag size="medium" type="warning" v-if="scope.row.state =='2'">置 顶</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建日期"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新日期"
                        width="170">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="300">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: space-around">
                            <el-button type="danger" size="small" @click="showCommentDeleteDialog(scope.row)" v-if="scope.row.state!=='0'">删除</el-button>
                            <el-button type="danger" size="small" @click="showCommentDeleteDialog(scope.row)" v-else>取消删除</el-button>
                            <el-button type="warning" size="small" @click="topComment(scope.row)" v-if="scope.row.state!=='2'">置顶</el-button>
                            <el-button type="warning" size="small" @click="topComment(scope.row)" v-else>取消置顶</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>



            <div class="comments-control-dialog">

                <el-dialog
                        title="删除提示"
                        :visible.sync="deleteCmmentDialogShow"
                        width="400px">
                    <span>请选择你的删除方式</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="deleteCmmentDialogShow = false">取 消</el-button>
                        <el-button type="danger" @click="absoluteDeleteComment">绝对删除</el-button>
                        <el-button type="success" v-if="this.targetCommentState ==='0' " @click="logicDeleteComment">恢复使用</el-button>
                        <el-button v-else style="background-color: #ff4e6a;border-color: #ff4e6a;color: white"
                                   @click="logicDeleteComment">假装删除</el-button>
                      </span>
                </el-dialog>

            </div>

        </div>
    </transition>
    </div>
</template>

<script>
    import commentApi from "../../api/commentApi";
    export default {
        name: "manageComment",
        data(){
            return{
                deleteCmmentDialogShow: false,
                comments: [],
                loading: false,
                pagination:{
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 10,
                    totalPage: 1,
                    hasPrevious: false,
                    hasNext: false,
                },
                queryCommentId: '',
                targetCommentId: '',
                targetCommentState: '1'
            }
        },
        methods:{
            updateAllUserInfo() {
                commentApi.updateCommentUserInfo();
                this.listAllComments(1,
                    10, this.queryCommentId);
            },
            topComment(item) {
                commentApi.topComment(item.id)
                .then(res=>{
                    if (res.data.code === commentApi.success_code()) {
                        this.listAllComments(1,
                            10, this.queryCommentId);
                        this.$notify({
                            type: 'success',
                            title: '系统消息提示:',
                            message: res.data.message
                        })
                    }
                })
            },
            showCommentDeleteDialog(item) {
                this.deleteCmmentDialogShow = true;
                this.targetCommentId = item.id;
                this.targetCommentState = item.state
            },
            listAllComments(page=1,size=10,commentId='') {
                commentApi.listAllComment(page,size,commentId)
                .then(res=>{
                    if (res.data.code === commentApi.success_code()) {
                        this.pagination={
                            currentPage: res.data.data.data.currentPage,
                            totalCount:  res.data.data.data.totalCount,
                            pageSize:  res.data.data.data.pageSize,
                            totalPage:  res.data.data.data.currentPage,
                            hasPrevious:  res.data.data.data.hasPrevious,
                            hasNext:  res.data.data.data.hasNext,
                        }
                        this.comments = res.data.data.data.records;
                    }
                })
            },
            absoluteDeleteComment() {
                commentApi.absoluteDeleteComment(this.targetCommentId)
                .then(res=>{
                    if (res.data.code === commentApi.success_code()) {
                        this.deleteCmmentDialogShow = false;
                        this.$message.success("该评论永久删除了o(╥﹏╥)o")
                        this.listAllComments(this.pagination.currentPage,
                            this.pagination.pageSize, this.queryCommentId);
                    }
                })

            },
            logicDeleteComment() {
                commentApi.logicDeleteComment(this.targetCommentId)
                    .then(res=>{
                        if (res.data.code === commentApi.success_code()) {
                            this.deleteCmmentDialogShow = false;
                            if (this.targetCommentState !== '0') {
                                this.$message.success("该评论假装删除了");
                            } else {

                                this.$message.success("评论恢复使用了");
                            }

                            this.listAllComments(1,10, this.queryCommentId);
                        }
                    })
            },
            commentshandlePageChange(page) {
                this.listAllComments(page,this.pagination.pageSize,this.queryCommentId)
            },
            commentshandleSizeChange(size) {
                this.listAllComments(this.pagination.currentPage,size,this.queryCommentId)
            },
            queryComment() {
                this.listAllComments(1,10,this.queryCommentId)
            },
            queryAllComment() {
                this.listAllComments();
            }
        },
        mounted() {
            this.listAllComments();
        }
    }
</script>

<style scoped lang="less">


    .comment-action-bar{
        background-color: #d9d9d9;
        padding: 7px;
    }
</style>