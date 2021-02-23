<template>
    <div class="article-list-box">
        <div class="article-action-bar">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="搜索文章标题">
                    <el-input @keypress.enter.native="onSearch" v-model="keyword" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="categoryToSearch" placeholder="选择分类查询">
                        <el-option v-for="(item,index) in categories" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="查询状态">
                    <el-select v-model="stateToSearch" placeholder="请选择文章状态查询">
                        <el-option v-for="(item,index) in state" :key="index" :label="item.name" :value="item.val"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button style="background-color: #ff4e6a;border-color: #ff4e6a;color: white"
                            @click="onSearch" >查询</el-button>
                    <el-button style="background-color: cyan;border-color: cyan;color: white"
                            @click="onSearchAll">查询全部</el-button>
                </el-form-item>
            </el-form>

            <div class="article-page-navigation">

                <el-pagination
                        style="margin-left: 10px;margin-bottom: 7px"
                        background
                        @size-change="articleshandleSizeChange"
                        @current-change="articleshandlePageChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="[10, 15, 20]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.totalCount">
                </el-pagination>
            </div>
        </div>

        <transition name="slide-fade" appear mode="out-in">

        <div class="article-list-part">
            <el-table
                    v-loading="loading"
                    :data="articles"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="标题"
                        width="160">
                    <template slot-scope="scope">
                        <el-popover trigger="click" placement="top">
                            <p v-if="scope.row.summary">摘要: {{'\n'+ scope.row.summary }}</p>
                            <p v-if="scope.row.summary === ''">应该是草稿吧。。。某得摘要</p>
                            <p><el-link :href="`http://localhost:3000/article/${scope.row.id}`" target="_blank" style="color: orange">点击查看详情Σ(⊙▽⊙"a</el-link></p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.title }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="文章归属用户"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="文章归属用户头像"
                        width="100">
                    <template slot-scope="scope">
                        <el-avatar size="medium" :src="scope.row.userAvatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                        label="封面"
                        width="150">
                    <template slot-scope="scope">
                        <div :id="scope.row.id+'_p'" class="photo" @mouseout="mouseleave(scope.row.id+'_p')"
                             @mouseover="mouseon(scope.row.id+'_p')">
                            <img class="pi" :src="blog_constants.baseUrl+'/admin/image/'+scope.row.cover">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="阅读数量and标签"
                        width="160">
                    <template slot-scope="scope">
                        <el-popover trigger="click" placement="top">
                            <p>阅读数量: {{scope.row.viewCount }}</p>
                            <p v-if="scope.row.labels!==''">标签:</p>
                            <el-tag size="small" v-if="scope.row.labels!==''" v-for="(item,index) in scope.row.labels.split('-')" :key="index">{{item}}</el-tag>
                            <p v-if="scope.row.labels === ''">应该是草稿吧。。。某得标签</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">阅读数量and标签</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        label="分类"
                        width="120">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            {{getCatagoryNameById(scope.row.categoryId)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium" type="success" v-if="scope.row.state =='1'">发 布</el-tag>
                        <el-tag size="medium" type="info" v-if="scope.row.state =='2'">草 稿</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.state =='0'">删 除</el-tag>
                        <el-tag size="medium" type="warning" v-if="scope.row.state =='3'">置 顶</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="文章类型"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium" type="info" v-if="scope.row.type =='0'">富文本</el-tag>
                        <el-tag size="medium" type="warning" v-if="scope.row.type =='1'">markdown</el-tag>
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
                            <el-button style="background-color: #ff4e6a;
                                border-color: #ff4e6a;color: white" size="small" @click="viewArticle(scope.row.content)">预览文章</el-button>


                            <el-button type="primary" size="small" @click="editArticle(scope.row)">编辑</el-button>

                            <el-button type="danger" size="small" @click="showArticleDeleteDialog(scope.row)">删除</el-button>
                            <el-button type="warning" size="small" @click="topArticle(scope.row)" v-if="scope.row.state!=='3'">置顶</el-button>
                            <el-button type="warning" size="small" @click="topArticle(scope.row)" v-else>取消置顶</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        </transition>

        <div class="article-dialog-part"></div>
        <div class="view-content" style="position: absolute;z-index: -900;top:-99999999999999999px">
            <mavon-editor ref=mdEditor
                          v-model="viewContent"/>
        </div>
        <transition name="el-zoom-in-center">

        <el-dialog v-show="deleteArticleDialogShow"
                title="删除提示:"
                :visible.sync="deleteArticleDialogShow"
                width="30%">
            <span>{{deleteArticleDialogContent}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteArticleDialogShow = false">取 消</el-button>
                <el-button style="background-color: #ff4e6a;color: #FFFFFF"
                           @click="logicDeleteArticle"
                            :disabled="targetDeleteArticle.state === '0'">假装删除</el-button>
                <el-button class="postBtn" @click="absoluteDeleteArticle">绝对删除</el-button>
                </span>
        </el-dialog>
        </transition>
    </div>
</template>

<script>
    import articleApi from "../../api/articleApi";
    import categoryApi from "../../api/categoryApi";
    export default {
        name: "mangeArticle",
        data(){
            return{
                loading:false,
                articles: [],
                pagination:{
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 10,
                    totalPage: 1,
                    hasPrevious: false,
                    hasNext: false,
                },
                categories: [],
                viewContent:'',
                keyword: '',
                categoryToSearch: '',
                stateToSearch: '',
                state:[
                    {name:'发 布',val:'1'},
                    {name:'草 稿',val:'2'},
                    {name:'置 顶',val:'3'},
                    {name:'已删除',val:'0'},
                    {name:'全部',val:''}
                ],
                deleteArticleDialogShow: false,
                deleteArticleDialogContent: '',
                targetDeleteArticle: ''
            }
        },
        methods:{
            editArticle(item) {
                this.$router.push({
                    path:'/content/postArticle',
                    query: {
                        articleId:item.id
                    }
                })
            },
            logicDeleteArticle() {
                articleApi.logicDeleteArticle(this.targetDeleteArticle.id)
                .then(res=>{
                    if (res.data.code === articleApi.success_code()) {
                        this.$notify({
                            type: 'success',
                            title: '系统消息提示',
                            message: res.data.message
                        })
                        this.listArticles(this.pagination.currentPage, this.pagination.pageSize,
                            this.stateToSearch, this.keyword, this.categoryToSearch);
                        this.deleteArticleDialogShow = false;
                    }
                })
            },
            absoluteDeleteArticle() {
                articleApi.absoluteDeleteArticle(this.targetDeleteArticle.id)
                    .then(res=>{
                        if (res.data.code === articleApi.success_code()) {
                            this.$notify({
                                type: 'success',
                                title: '系统消息提示',
                                message: res.data.message
                            })
                            this.listArticles(this.pagination.currentPage, this.pagination.pageSize,
                                this.stateToSearch, this.keyword, this.categoryToSearch);
                            this.deleteArticleDialogShow = false;
                        }
                    })
            },
            showArticleDeleteDialog(item) {
                this.targetDeleteArticle = item;
                this.deleteArticleDialogShow = true;
                this.deleteArticleDialogContent = `你确定要删除(${item.title})这篇文章吗?`
            },
            topArticle(item) {
                articleApi.topArticle(item.id)
                .then(res=>{
                    if (res.data.code === articleApi.success_code()) {
                        this.$notify({
                            type: 'success',
                            title: '系统消息提示',
                            message: res.data.message
                        })
                        this.listArticles(this.pagination.currentPage,
                            this.pagination.pageSize, this.stateToSearch,
                            this.keyword, this.categoryToSearch);
                    }
                })
            },
            articleshandlePageChange(page) {
                this.listArticles(page,
                    this.pagination.pageSize, this.stateToSearch,
                    this.keyword, this.categoryToSearch);
            },
            articleshandleSizeChange(size) {
                this.listArticles(1,size, this.stateToSearch,
                    this.keyword, this.categoryToSearch);
            },
            onSearchAll() {
                this.keyword = '';
                this.categoryToSearch = '';
                this.stateToSearch = '';
                this.listArticles();
            },
            onSearch() {
                this.listArticles(this.pagination.currentPage,
                    this.pagination.pageSize, this.stateToSearch,
                    this.keyword, this.categoryToSearch);
            },
            viewArticle(content) {
                this.viewContent = content;
                this.$refs.mdEditor.toolbar_right_click('read');
            },
            listArticles(page = 1, size = 10, state = '', keyword = '', categoryId = '') {
                articleApi.listArticles(page,size,state,keyword,categoryId)
                .then(res=>{
                    console.log(res)
                    if (res.data.code === articleApi.success_code()) {
                        this.articles = res.data.data.data.records
                        this.pagination={
                            currentPage: res.data.data.data.currentPage,
                            totalCount: res.data.data.data.totalCount,
                            pageSize: res.data.data.data.pageSize,
                            totalPage: res.data.data.data.totalPage,
                            hasPrevious: res.data.data.data.hasPrevious,
                            hasNext: res.data.data.data.hasNext,
                        }
                    }
                })
            },
            listCategories() {
                categoryApi.listCategories()
                .then(res=>{
                    if (res.data.code === categoryApi.success_code()) {
                        this.categories = res.data.data.data;
                        this.categories.push({
                            id: '',
                            name: '无分类'
                        })
                    }
                })

            },
            getCatagoryNameById(categoryId) {
                let curr;
                this.categories.forEach(c=>{
                    if (c.id === categoryId) {
                        curr = c.name;
                    }
                });
                return curr;
            },
            mouseleave(id) {
                let img = document.getElementById(id);
                img.style.setProperty('transform', 'rotate(-360deg)')
                img.style.setProperty('transition', 'all 1s cubic-bezier(0.02, 0.3, 0.58, 1.82)')
                setTimeout(function () {
                    img.style.setProperty('transform', '')
                    img.style.setProperty('transition', '')
                }, 1000)
            },
            mouseon(id) {
                let img = document.getElementById(id);
                img.style.setProperty('transform', 'rotate(360deg)')
                img.style.setProperty('transition', 'all 1s cubic-bezier(0.02, 0.3, 0.58, 1.82)')
                setTimeout(function () {
                    img.style.setProperty('transform', '')
                    img.style.setProperty('transition', '')
                }, 1000)
            },

        },
        mounted() {

            this.listCategories();
            this.listArticles();
        },
    }
</script>

<style scoped lang="less">
    .article-list-box {
        height: calc(100vh - 175px);
        width: 100%;
        background-color: white;
    }
    .article-action-bar {
        padding: 10px;
        background-color: #eee;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .photo {
        width: 120px !important;
        height: 80px !important;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .pi {
            box-shadow: 0px 0px 1px #ff4e6a,
            0px 0px 2px #ff4e6a,
            0px 0px 3px #ff4e6a,
            0px 0px 4px #ff4e6a,
            0px 0px 5px #ff4e6a;
            border-radius: 12px;

            width: 120px !important;
            height: 60px !important;

        }
    }
</style>