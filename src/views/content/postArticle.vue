<template>
    <div>

        <div class="article-box">
            <transition name="slide-fade" appear mode="out-in">
                <div class="article-box-main">
                    <div class="article-beauty-font">
                        {{pageTitle}}
                    </div>
                    <div class="article-title-part">
                        <el-input v-model="article.title"
                                  maxlength="64"
                                  minlength="8"
                                  show-word-limit
                                  placeholder="文章标题(8-64个字符)"></el-input>
                    </div>
                    <div id="article-post-part-md" class="article-post-part markdown-body">
                        <mavon-editor ref=mdEditor
                                      @onImageClick="onEditorImageClick"
                                      @imgAdd="editorImgAdd"
                                      @fullScreen="fullscreenchange"
                                :transition="true"
                                v-model="article.content"/>
                    </div>
                    <div class="article-post-settings-part">

                        <el-form label-width="100px">
                            <el-form-item label="文章分类" required>
                                <el-select v-model="article.categoryId" placeholder="请选择分类" size="medium">
                                    <el-option
                                            v-for="item in categories"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="摘要" required>
                                <el-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="文章摘要"
                                        v-model="article.summary"
                                        maxlength="256"
                                        show-word-limit
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="封面" required>
                                <div class="article-cover-selector" @click="showImageSelector">
                                    <i class="el-icon-plus" v-if="article.cover === ''||article.cover ===null"></i>
                                    <img v-else :src="blog_constants.baseUrl+'/admin/image/'+article.cover">
                                </div>
                            </el-form-item>
                            <el-form-item label="标签" required class="label-input-box">

                                <el-tag
                                        :key="tag"
                                        v-for="tag in labels"
                                        closable
                                        :disable-transitions="false"
                                        @close="deleteLabel(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="labelInputVisible"
                                        v-model="labelNewValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleLabelInputConfirm"
                                >
                                </el-input>
                                <el-button v-if="this.labels.length < 5" class="button-new-tag" size="small"
                                           @click="showLabelInput">
                                    {{labelAddBtn}}
                                </el-button>

                            </el-form-item>

                        </el-form>

                    </div>
                    <div class="article-post-action-bar">
                        <div class="action-btn-container">
                            <el-button
                                    @click="preView"
                                    style="background-color: #ff4e6a;
                        border-color:#ff4e6a;
                        color: #FFFFFF">全局预览
                            </el-button>
                            <el-button :disabled="draftBtn"
                                    @click="saveArticleDraft"
                                    style="background-color: #409EFF;
                        border-color:#409EFF;
                        color: #FFFFFF">保存草稿
                            </el-button>
                            <el-button class="postBtn"
                                       @click="commitArticle"
                                       style="background-color: #fff;box-shadow: 0 0 20px #ff4e6a">{{updateOrPostBtn}}
                            </el-button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <div class="post-article-dialog-box">

            <el-dialog
                    class="image-picker-container"
                    :visible.sync="isImageSelectorShow"
                    width="810">
                <div class="image-selector-box">
                    <div class="image-action-bar">
                        <el-upload
                                class="article-image-selectoe-uploader"
                                action="/admin/image/article"
                                :show-file-list="false"
                                :on-success="uploadSccess"
                                :on-error="onUploadError"
                                accept="image/*">
                            <el-button style="background-color: #ff4e6a;color: white;border: #ff4e6a;margin-left: 10px">
                                上传图片
                            </el-button>
                        </el-upload>
                        <el-select
                                style="margin-left: 20px"
                                @change="changeImageQueryOriginal"
                                v-model="imageOriginal"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in imageQueryOriginal"
                                    :key="item.original"
                                    :label="item.sign"
                                    :value="item.original">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="article-picker-naviagtion">
                        <el-pagination
                                class="redBackground"
                                background
                                @size-change="onSizeChange"
                                @current-change="onPageChange"
                                :current-page="pageNavigation.currentPage"
                                :page-sizes="[10, 15, 20]"
                                :page-size="pageNavigation.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="pageNavigation.totalCount">
                        </el-pagination>

                    </div>

                    <div class="image-selector-list">

                        <el-radio-group v-model="selectedImageIndex">
                            <el-radio-button :label="index" v-for="(item,index) in images.records" :key="index">
                                <transition appear name="bounce" mode="in-out">

                                    <img fit="cover" v-if="isImageSelectorShow" style="border-radius: 7px;height: 150px;width: 150px"
                                              :src="blog_constants.baseUrl+'/admin/image/'+item.url"></img>
                                </transition>
                            </el-radio-button>
                        </el-radio-group>


                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isImageSelectorShow = false">取 消</el-button>
                    <el-button style="background-color: #ff4e6a;
                        color: white;border: #ff4e6a" @click="onImageSelected">确 定</el-button>
                  </span>
            </el-dialog>


            <el-dialog
                    title="你确定要离开吗"
                    :visible.sync="saveConfirmDialogShow"
                    width="400px"
                    center>
                <span>（°▽°）つ系统可能不会保存填写的稿件哦</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="saveConfirmDialogShow = false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="toNextPath">确 定</el-button>
                  </span>
            </el-dialog>


        </div>


    </div>
</template>

<script>

    import categoryApi from "../../api/categoryApi";
    import imageApi from "../../api/imageApi";

    import editor from '../../../lib/mavon-editor/mavon-editor'
    import '../../../lib/mavon-editor/css/index.css'
    import Vue from 'vue'
    import articleApi from "../../api/articleApi";
    Vue.use(editor)

    export default {
        name: "Article",
        data() {
            return {
                pageTitle: '文章发布ヽ(￣ω￣(￣ω￣〃)ゝ',
                imageSelectFor: 'article',
                imageOriginal: '',
                imageQueryOriginal: [
                    {
                        original: 'article',
                        sign: '文章'
                    }, {
                        original: 'loop',
                        sign: '轮播图'
                    }, {
                        original: '',
                        sign: '全部'
                    }, {
                        original: 'avatar',
                        sign: '头像'
                    }],
                isImageSelectorShow: false,
                labelNewValue: '',
                labelInputVisible: false,
                labels: [],
                categories: [],
                article: {
                    id: '',
                    title: '',
                    content: '',
                    categoryId: '',
                    summary: '',
                    cover: '',
                    labels:'',
                    state:'1',
                    type:'1'
                },
                labelAddBtn: '+ 标签',
                images: {},
                selectedImageIndex:0,
                pageNavigation: {
                    totalCount: 1,
                    currentPage: 1,
                    pageSize: 15,
                    totalPage: '',
                    hasNext: false,
                    hasPrevious: false
                },
                updateOrPostBtn:'发布文章',
                draftBtn: false,
                saveConfirmDialogShow:false,
                isContentSave: false,
                nextPath: '',
                useLocalStorage: true,
                hasContentChange: false,
                fullScreenChangeState: false

            }
        },
        watch:{
            article:{
                deep: true,
                handler(newVal, oldVal) {
                    this.hasContentChange = true;
                }
            }
        },
        methods: {
            fullscreenchange() {
                this.fullScreenChangeState = !this.fullScreenChangeState;
                console.log('fullscreenchange...');
                let toolbar = document.querySelector('.v-note-op');
                let markdownBody = document.querySelector('.markdown-body');
                if (this.fullScreenChangeState&&toolbar&&markdownBody) {


                    toolbar.style['position'] = 'static';
                    markdownBody.style['height'] = '100%';
                }
                if (!this.fullScreenChangeState&&toolbar&&markdownBody) {
                    toolbar.style['position'] = 'sticky';
                    markdownBody.style['height'] = '800px';
                }
            },
            toNextPath() {
                this.hasContentChange = true;
                this.isContentSave = true;
                this.$router.push({
                    path: this.nextPath
                })
            },
            preView() {
                this.$refs.mdEditor.toolbar_right_click('read');
            },
            saveArticleDraft() {

                if (this.article.title === '') {
                    this.$message.error('文章标题不能为空');
                }
                this.article.state='2'
                articleApi.postArticle(this.article)
                .then(res=>{
                    if (res.data.code === articleApi.success_code()) {
                        this.isContentSave = true;
                        window.onbeforeunload = null;
                        localStorage.removeItem('czy-blog-tempArticle');
                        this.useLocalStorage = false;
                        this.$notify({
                            type:'success',
                            title: '系统消息提示:',
                            message: '保存草稿成功'
                        })
                        localStorage.removeItem('czy-blog-tempArticle');
                        this.$router.push('/content/manageArticle');
                    }
                })
            },
            commitArticle() {

                if (this.article.title === '') {
                    this.$message.error('文章标题不可以为空');
                    return;
                }
                if (this.article.content === '') {
                    this.$message.error('内容不可以为空');
                    return;
                }
                if (this.article.summary === '') {
                    this.$message.error('摘要不可以为空');
                    return;
                }
                if (this.article.cover === '') {
                    this.$message.error('给你的文章一个好看的封面哦');
                    return;
                }
                if (this.article.categoryId === '') {
                    this.$message.error('分类还没选呢');
                    return;
                }
                if (this.labels.length === 0) {
                    this.$message.error('标签没搞呢');
                    return;
                }
                let labelStr = this.labels.join('-');
                this.article.labels = labelStr;

                if (this.article.id === '') {
                    articleApi.postArticle(this.article)
                        .then(res => {
                            if (res.data.code === articleApi.success_code()) {
                                window.onbeforeunload = null;
                                this.isContentSave = true;
                                this.useLocalStorage = false;
                                this.$notify({
                                    type: 'success',
                                    title: '系统消息提示：',
                                    message: '新文章发布成功！！\nφ(0￣*)啦啦啦_φ(*￣0￣)′'
                                })


                                this.$router.push('/content/manageArticle');

                            }
                        });
                } else {
                    //更新文章


                    articleApi.updateArticle(this.article.id,this.article)
                        .then(res => {
                            if (res.data.code === articleApi.success_code()) {
                                this.isContentSave = true;
                                window.onbeforeunload = null;
                                this.$notify({
                                    type: 'success',
                                    title: '系统消息提示：',
                                    message: res.data.message
                                })
                                this.$router.push('/content/manageArticle');

                            }
                        });
                }

            },
            onEditorImageClick() {
                this.imageSelectFor = 'article';
                this.isImageSelectorShow = true;
                this.listImages();
            },
            editorImgAdd(pos,$file) {
                // this.showImageSelector();
                console.log(pos)
                console.log($file)
            },
            changeImageQueryOriginal(original) {
                this.listImages(this.pageNavigation.currentPage,
                    this.pageNavigation.pageSize, original);
            },
            onSizeChange(size) {
                this.listImages(1, size, this.imageOriginal);
            },
            onPageChange(page) {
                this.listImages(page, this.pageNavigation.pageSize, this.imageOriginal);
            },
            onUploadError() {
                this.$message.error('图片上传失败');
            },
            uploadSccess(response) {
                if (response.code === categoryApi.success_code()) {
                    this.$notify({
                        type: 'success',
                        title: '新消息提示：ヽ(￣ω￣(￣ω￣〃)ゝ',
                        message: response.message
                    })
                    this.listImages();
                }

            },
            onImageSelected() {
                let cover = this.images.records[this.selectedImageIndex];
                if (this.imageSelectFor === 'article') {
                    this.$refs.mdEditor.toolbar_left_addlink('no-link',
                    cover.name, this.blog_constants.baseUrl+'/admin/image/'+cover.url
                    )
                } else if (this.imageSelectFor === 'cover'){

                    //有了图片下标之后就拿到下标到数组里取
                    //然后渲染封面

                    let coverUrl = cover.url;
                    this.article.cover = coverUrl;
                }
                this.isImageSelectorShow = false;

            },
            showImageSelector() {
                this.imageSelectFor = 'cover';
                this.isImageSelectorShow = true;
                this.listImages();
            },
            listImages(page = 1, size = 15, original = '') {
                imageApi.listImages(page, size, original)
                    .then(res => {
                        if (res.data.code === imageApi.success_code()) {
                            this.images = res.data.data.data
                            this.pageNavigation = {
                                totalCount: res.data.data.data.totalCount,
                                currentPage: res.data.data.data.currentPage,
                                pageSize: res.data.data.data.pageSize,
                                totalPage: res.data.data.data.totalPage,
                                hasNext: res.data.data.data.hasNext,
                                hasPrevious: res.data.data.data.hasPrevious
                            }
                            console.log(this.pageNavigation)
                        }
                    })
            },
            showLabelInput() {
                if (this.labels.length < 5) {
                    this.labelAddBtn = '其他操作添加';
                    this.labelInputVisible = true;
                } else {
                    this.labelInputVisible = false;
                }
                this.$nextTick(()=>{
                    this.$refs.saveTagInput.$refs.input.focus();
                })
            },
            handleLabelInputConfirm() {
                if (this.labels.length < 5) {
                    this.labelAddBtn = '+ 标签';
                    this.labels.push(this.labelNewValue);
                    this.labelInputVisible = false;
                    this.labelNewValue = '';
                }
            },
            deleteLabel(label) {
                this.labels.splice(this.labels.indexOf(label), 1)
            },
            listCategorys() {
                categoryApi.listCategories()
                    .then(res => {
                        if (res.data.code === categoryApi.success_code()) {
                            this.categories = res.data.data.data;
                        }
                    })
            }
        },
        beforeDestroy() {
            window.onbeforeunload = null;
            console.log(this.useLocalStorage)
            if (this.article.id === '' && this.useLocalStorage) {
                let tempArticle = {
                    categoryId: this.article.categoryId === '' ? '0' : this.article.categoryId,
                    title:this.article.title === ''?'0':this.article.title,
                    content: this.article.content=== ''?'0':this.article.content,
                    summary: this.article.summary=== ''?'0':this.article.summary,
                    cover: this.article.cover=== ''?'0':this.article.cover,
                    labels: this.labels=== ''?['0']:this.labels
                }
                localStorage.setItem('czy-blog-tempArticle', JSON.stringify(tempArticle));
            }
        },
        mounted() {

            this.listCategorys();
            window.onbeforeunload = function () {
                return '系统可能不会保存填写的信息哦';
            };



            let updateArticleId = this.$route.query.articleId;
            if (updateArticleId) {
                this.pageTitle = '更新文章ヽ(￣ω￣(￣ω￣〃)ゝ';

                articleApi.getArticle(updateArticleId)
                .then(res=>{
                    this.article = res.data.data.data

                    if (this.article.state === '2') {

                        this.updateOrPostBtn = '发表文章';
                    }else {
                        this.draftBtn = true;
                        this.updateOrPostBtn = '更新文章';
                    }


                    if (this.article.labels !== '') {
                        let biaoqian = this.article.labels.split('-');
                        biaoqian.forEach(b=>{
                            this.labels.push(b);
                        });
                    }

                })


            } else {
                this.pageTitle = '发布文章ヽ(￣ω￣(￣ω￣〃)ゝ';
            }


            if (this.article.id === '') {
                let lastedEditor = JSON.parse(localStorage.getItem('czy-blog-tempArticle'));
                this.article.title = lastedEditor.title === '0'?'':lastedEditor.title;
                this.article.categoryId = lastedEditor.categoryId === '0'?'':lastedEditor.categoryId;
                this.article.content = lastedEditor.content=== '0'?'':lastedEditor.content;
                this.article.summary = lastedEditor.summary=== '0'?'':lastedEditor.summary;
                this.article.cover = lastedEditor.cover=== '0'?'':lastedEditor.cover;
                this.labels = lastedEditor.labels[0] === '0'?[]:lastedEditor.labels;
            }
            localStorage.removeItem('czy-blog-tempArticle');

        },
        beforeRouteLeave(to, from, next) {

            if (this.isContentSave || !this.hasContentChange || this.article.id !== '') {
                next();
            } else {
                this.nextPath = to.path;
                this.saveConfirmDialogShow = true;
            }
        }
    }
</script>

<style lang="less">

    .image-selector-list .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        border-radius: 7px;
    }

    .image-action-bar {
        display: flex;
    }

    .article-picker-naviagtion {
        margin-left: 10px;
        margin-top: 10px;
    }

    .image-selector-list {
        .el-radio-button:first-child {
            .el-radio-button__inner {
                border: none;
                padding: 5px;
                margin: 5px;
            }
        }

        .el-image__inner {
            height: 100px;
            width: 150px;
            float: left;
        }

        .el-radio-button__inner {
            border: none;
            padding: 5px;
        }

        clear: both;
    }

    .image-picker-container .el-dialog__header {
        display: none;
    }


    .article-title-part {
        .el-input {
            input {
                border: none;
            }

            font-size: 20px;
            font-weight: 400;
        }
    }

    .article-box {
        display: flex;
        justify-content: center;


        .article-box-main {
            width: 100%;
            background-color: #d3d1db;

            .article-beauty-font {
                height: 500px;
                animation: postfont 1.5s infinite alternate;
                color: #fff;
                line-height: 500px;
                text-align: center;
                font-size: 50px;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
                font-weight: 900;

                background: url("../../assets/articlePostBg.jpg");
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 650px;
            }

            .article-post-part {
                height: 800px;
                border-radius: 40px;
                margin-bottom: 20px;

                .markdown-body {
                    height: 100%;
                    min-width: 500px;
                    max-width: 100%;
                    min-height: 800px;
                }
                .v-note-op{
                    position: sticky;
                    position: -webkit-sticky;
                    top: 0;

                }

            }

            .article-post-settings-part {

                .el-textarea {
                    width: 400px;
                }

                .article-cover-selector {
                    font-size: 20px;
                    cursor: pointer;
                    width: 200px;
                    height: 160px;
                    border: #747074 dashed 1px;
                    text-align: center;
                    line-height: 160px;
                    border-radius: 25px;
                    background-color: #eceaec;
                    color: #B3C0D1;
                    img{
                        cursor: pointer;
                        width: 200px;
                        height: 160px;
                        border: #747074 dashed 1px;
                        border-radius: 25px;
                    }
                }

                .label-input-box {
                    .el-tag {
                        margin-right: 20px;
                    }

                    .el-input {
                        width: 100px;
                    }
                }
            }

            .article-post-action-bar {
                clear: both;
                width: 100%;
                display: flex;
                background-color: #052038;
                border-top-right-radius: 15px;
                border-top-left-radius: 15px;
                justify-content: flex-end;

                .action-btn-container {
                    float: right;
                    margin-right: 20px;
                    padding: 10px;
                }
            }
        }
    }


    .postBtn {
        animation: postbtn 1.5s infinite alternate;
    }

    /*.v-note-wrapper {*/
    /*    min-width: 500px;*/
    /*    max-height: 1000px;*/
    /*    min-height: 1000px;*/
    /*}*/

    @keyframes postfont {
        from {
            text-shadow: 0px 0px 20px #00ff99, 0px 0px 10px #00ffea, 0px 0px 10px #00e1ff, 0px 0px 10px #0066ff;
        }
        to {
            text-shadow: 0 0 10px #ff4e6a, 0 0 10px #ff4e6a, 0 0 10px #ff4e6a, 0 0 10px #ff4e6a, 0 0 10px #ff4e6a, 0 0 5px #ff4e6a;
        }
    }
    @keyframes postbtn {
        from {
            box-shadow: 0px 0px 20px #ffff00, 0px 0px 10px orange, 0px 0px 10px orangered, 0px 0px 10px red;
        }
        to {
            box-shadow: 0 0 20px #ff4e6a
        }
    }


    .bounce-enter-active {
        animation: bounce-in 1.3s;
    }

    .bounce-leave-active {
        animation: bounce-in .5s reverse;
    }

    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(1);
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
</style>