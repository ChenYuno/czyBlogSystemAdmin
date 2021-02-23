<template>
    <div class="images-main-box">
        <div class="carousel-box">

            <carousel-3d v-if="loops.length>0"
                         :autoplay="true"
                         :perspective="55"
                         :display="loops.length"
                         :animationSpeed="1500"
                         :loop="true"
                         :height="300"
                         :width="500"
                         :border="0"
            >
                <slide :index="index" v-for="(item,index) in loops" :key="index">
                    <img style="height: 300px;width: 500px" :src="item.imageUrl">
                </slide>
            </carousel-3d>
        </div>


        <div class="imagePartition">
            <h2 class="division-image-control">
                managerImage...
            </h2>
        </div>

        <div class="loop-images-control-part" v-for="(controlItem,index) in imageOriginal" :key="index">
            <div class="loop-images-inner-box">

                <div class="imagePartition">
                    <h2 class="division-image-control">
                        {{controlItem.title}}
                    </h2>
                </div>

                <div class="loop-images-list">

                    <el-upload
                            :on-success="flushImgages"
                            :auto-upload="true"
                            class="upload-loop"
                            drag
                            :action="'/admin/image/'+controlItem.original"
                            multiple>
                        <div>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">随便传传Σ(⊙▽⊙"a</div>
                        </div>
                    </el-upload>
                </div>

                <div class="czy-custom-pagniation">
                    <div class="total-count">
                        （°▽°）つ 总共{{controlItem.pageNavigation.totalCount}}张
                    </div>
                    <div class="pre">
                        <el-link disabled v-if="!controlItem.pageNavigation.hasPrevious"><</el-link>
                        <el-link v-else
                                 @click="getImages(controlItem.pageNavigation.currentPage-1,10,controlItem.original)"><
                        </el-link>
                    </div>

                    <div class="num-list" v-if="controlItem.pageNavigation.currentPage-1>0"
                         @click="getImages(controlItem.pageNavigation.currentPage-1,10,controlItem.original)">
                        {{controlItem.pageNavigation.currentPage-1}}
                    </div>
                    <div class="num-list czy-custom-active">{{controlItem.pageNavigation.currentPage}}</div>
                    <div class="num-list"
                         v-if="controlItem.pageNavigation.currentPage+1<=controlItem.pageNavigation.totalPage"
                         @click="getImages(controlItem.pageNavigation.currentPage+1,10,controlItem.original)">
                        {{controlItem.pageNavigation.currentPage+1}}
                    </div>

                    <div class="next">
                        <el-link disabled v-if="!controlItem.pageNavigation.hasNext">></el-link>
                        <el-link v-else
                                 @click="getImages(controlItem.pageNavigation.currentPage+1,10,controlItem.original)">>
                        </el-link>
                    </div>

                    <div class="pagniation-goto">
                        前往
                        <el-input style="width: 45px;" size="mini" v-model="controlItem.pageNavigation.jumpPage"
                                  @keydown.enter.native="jumpPage(controlItem.pageNavigation.jumpPage,controlItem.pageNavigation.currentPage,
                        controlItem.pageNavigation.totalPage,
                        controlItem.original)"></el-input>

                    </div>
                </div>

                <div class="loops">

                    <div style="position:relative;" v-for="(item,index) in imageOriginal[index].images" :key="index">
                        <img
                                style="height: 290px;width: 310px"
                                class="el-upload-list__item-thumbnail"
                                :src="baseUrl+item.url" alt=""
                        >
                        <span class="el-upload-list__item-actions">
                            <span
                                    class="el-upload-list__item-preview"
                                    @click="showPictureDrawerInfo(item)"
                            >
                               <i class="el-icon-zoom-in"></i>
                            </span>

                            <span
                                    class="el-upload-list__item-delete"
                                    @click="absoluteRemoveForever(item)"
                            >
                            <i class="el-icon-delete"></i>
                            </span>
                          </span>
                    </div>

                </div>
            </div>


        </div>
        <el-drawer
                class="infinite-list"
                style="overflow: scroll"
                size="500px"
                title="我是标题"
                :visible.sync="imageDataDrawerShow"
                :with-header="false">
            <img :src="drawerImageUrl" class="image-drawer-view-part">
            <div class="image-drawer-info-part">
                <span style="font-size: 24px">
                    <el-link type="primary" @click="imageDataDrawerShow = false"><i class="el-icon-circle-close"></i></el-link>
                    (゜-゜)つ图片信息
                </span>
                <div>url:{{drawerImageInfo.url}}</div>
                <el-divider content-position="left">imageID:</el-divider>
                <span>{{drawerImageInfo.id}}</span>
                <el-divider content-position="left">image原名:</el-divider>
                <span>{{drawerImageInfo.name}}</span>
                <el-divider content-position="left">image类型:</el-divider>
                <span>{{drawerImageInfo.contentType}}</span>
                <el-divider content-position="left">image归属:</el-divider>
                <span>{{drawerImageInfo.original}}</span>
                <el-divider content-position="left">存储地址:</el-divider>
                <div style="overflow: scroll">{{drawerImageInfo.path}}</div>
                <el-divider>otherMessage:</el-divider>
                状态:<el-tag size="medium" :type="drawerImageInfo.state==='1'?'success':'danger'">{{drawerImageInfo.state==='1'?'正常':'禁用'}}</el-tag>
                <div>上传日期:{{drawerImageInfo.createTime}}</div>
                <div>更新日期:{{drawerImageInfo.updateTime}}</div>
                <el-divider content-position="right">归属用户id:{{drawerImageInfo.userId}}</el-divider>
            </div>
        </el-drawer>

        <el-dialog
                title="提示"
                :visible.sync="absoluteRemoveForeverDialog"
                width="400px">
            <span>你确定要从服务器上移除此图片吗￣□￣｜｜</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="absoluteRemoveForeverDialog = false">取 消</el-button>
                <el-button type="danger" @click="absoluteRemoveImage">确 定</el-button>
              </span>
        </el-dialog>

    </div>
</template>

<script>
    import {Carousel3d, Slide} from 'vue-carousel-3d';


    import loopApi from "../../api/loopApi";
    import imageApi from "../../api/imageApi";

    export default {
        name: "managerImage",
        components: {
            Carousel3d,
            Slide
        },
        data() {
            return {
                loops: [],
                baseUrl: this.blog_constants.baseUrl + '/admin/image/',
                imageOriginal: [
                    {
                        title: '轮播图管理',
                        original: 'loop',
                        images: [],
                        pageNavigation: {
                            totalCount: 1,
                            currentPage: 1,
                            pageSize: 10,
                            totalPage: '',
                            hasNext: false,
                            hasPrevious: false,
                            jumpPage: 1
                        },
                    },
                    {
                        title: '文章图片管理',
                        original: 'article',
                        images: [],
                        pageNavigation: {
                            totalCount: 1,
                            currentPage: 1,
                            pageSize: 10,
                            totalPage: '',
                            hasNext: false,
                            hasPrevious: false,
                            jumpPage: 1
                        },
                    },
                    {
                        title: '头像图片管理',
                        original: 'avatar',
                        images: [],
                        pageNavigation: {
                            totalCount: 1,
                            currentPage: 1,
                            pageSize: 10,
                            totalPage: '',
                            hasNext: false,
                            hasPrevious: false,
                            jumpPage: 1
                        },
                    },
                    {
                        title: '友情链接图片管理',
                        original: 'link',
                        images: [],
                        pageNavigation: {
                            totalCount: 1,
                            currentPage: 1,
                            pageSize: 10,
                            totalPage: '',
                            hasNext: false,
                            hasPrevious: false,
                            jumpPage: 1
                        },
                    },
                ],
                imageDataDrawerShow: false,
                drawerImageUrl: '',
                drawerImageInfo: {
                    contentType: '',
                    createTime: '',
                    id: '',
                    name: '',
                    original: '',
                    path: '',
                    state: '',
                    updateTime: '',
                    url: '',
                    userId: ''
                },
                absoluteRemoveForeverDialog: false,
                targetRemoveImageOriginal: '',
                targetRemoveImageItem: {}
            }
        },
        mounted() {
            loopApi.listLoop()
                .then(res => {
                    if (res.data.code === loopApi.success_code()) {
                        this.loops = res.data.data.data;
                        console.log(this.loops)
                    }
                })
            this.getImages(1, 10, 'loop');
            this.getImages(1, 10, 'article');
            this.getImages(1, 10, 'avatar');
            this.getImages(1, 10, 'link');
            console.log(this.imageOriginal)
        },
        methods: {
            jumpPage(wantPage, currPage, totalPage, original) {
                if (wantPage < 1) {
                    wantPage = 1;
                } else if (wantPage > totalPage) {
                    wantPage = totalPage;
                } else if (wantPage === currPage) {
                    return;
                }
                this.getImages(wantPage, 10, original)
            },
            getImages(page = 1, size = 10, original = '') {
                imageApi.listImages(page, size, original)
                    .then(res => {
                        if (res.data.code === imageApi.success_code()) {
                            if (original === 'loop') {
                                this.imageOriginal[0].images = res.data.data.data.records;
                                this.imageOriginal[0].pageNavigation = {
                                    totalCount: res.data.data.data.totalCount,
                                    currentPage: res.data.data.data.currentPage,
                                    pageSize: res.data.data.data.pageSize,
                                    totalPage: res.data.data.data.totalPage,
                                    hasNext: res.data.data.data.hasNext,
                                    hasPrevious: res.data.data.data.hasPrevious,
                                }
                            } else if (original === 'article') {
                                this.imageOriginal[1].images = res.data.data.data.records;
                                this.imageOriginal[1].pageNavigation = {
                                    totalCount: res.data.data.data.totalCount,
                                    currentPage: res.data.data.data.currentPage,
                                    pageSize: res.data.data.data.pageSize,
                                    totalPage: res.data.data.data.totalPage,
                                    hasNext: res.data.data.data.hasNext,
                                    hasPrevious: res.data.data.data.hasPrevious,
                                }
                            } else if (original === 'avatar') {
                                this.imageOriginal[2].images = res.data.data.data.records;
                                this.imageOriginal[2].pageNavigation = {
                                    totalCount: res.data.data.data.totalCount,
                                    currentPage: res.data.data.data.currentPage,
                                    pageSize: res.data.data.data.pageSize,
                                    totalPage: res.data.data.data.totalPage,
                                    hasNext: res.data.data.data.hasNext,
                                    hasPrevious: res.data.data.data.hasPrevious,
                                }
                            }else if (original === 'link') {
                                this.imageOriginal[3].images = res.data.data.data.records;
                                this.imageOriginal[3].pageNavigation = {
                                    totalCount: res.data.data.data.totalCount,
                                    currentPage: res.data.data.data.currentPage,
                                    pageSize: res.data.data.data.pageSize,
                                    totalPage: res.data.data.data.totalPage,
                                    hasNext: res.data.data.data.hasNext,
                                    hasPrevious: res.data.data.data.hasPrevious,
                                }
                            }
                        }
                    })
            },
            absoluteRemoveForever(image) {
                let original = image.original
                this.absoluteRemoveForeverDialog = true;
                this.targetRemoveImageOriginal = original;
                this.targetRemoveImageItem = image;
            },
            absoluteRemoveImage() {
                imageApi.absoluteRemoveForever(this.targetRemoveImageItem)
                .then(res=>{
                    if (res.data.code === imageApi.success_code()) {
                        this.$notify({
                            type: 'success',
                            title: '系统消息提示:',
                            message: res.data.message
                        })

                        let flushPart ;
                        if (this.targetRemoveImageOriginal === 'loop') {
                            flushPart = 0;
                        }else if (this.targetRemoveImageOriginal === 'article') {
                            flushPart = 1;
                        }else if (this.targetRemoveImageOriginal === 'avatar') {
                            flushPart = 2;
                        }else if (this.targetRemoveImageOriginal === 'link') {
                            flushPart = 3;
                        } else {
                            flushPart = '';
                        }
                        this.getImages(this.imageOriginal[flushPart].pageNavigation.currentPage,
                            10,this.targetRemoveImageOriginal)
                        this.absoluteRemoveForeverDialog = false;

                    }
                })
            },
            showPictureDrawerInfo(image) {
                console.log(image);
                this.imageDataDrawerShow = true;
                this.drawerImageUrl = this.baseUrl + image.url;
                this.drawerImageInfo={
                    contentType: image.contentType,
                        createTime: image.createTime,
                        id: image.id,
                        name: image.name,
                        original: image.original,
                        path: image.path,
                        state: image.state,
                        updateTime: image.updateTime,
                        url: image.url,
                        userId: image.userId
                }
            },
            flushImgages(r, f, l) {
                if (r.code === imageApi.success_code()) {
                    let uploadImageoriginal = r.data.original
                    if (uploadImageoriginal === 'loop') {
                        this.getImages(1, 10, 'loop');
                    } else if (uploadImageoriginal === 'article') {
                        this.getImages(1, 10, 'article');
                    } else if (uploadImageoriginal === 'avatar') {
                        this.getImages(1, 10, 'avatar');
                    }else if (uploadImageoriginal === 'link') {
                        this.getImages(1, 10, 'link');
                    }
                }

            }
        },
    }
</script>

<style scoped lang="less">

    @inner-box-width-cal: calc(100% - 60px);

    @inner-box-height: 990px;



    .image-drawer-view-part {
        width: 100%;
        height: 400px;
    }

    .image-drawer-info-part {
        border-radius: 15px;
        box-shadow: 0 0 12px #001528;
        margin: 20px;
        padding: 10px;
    }

    .pagination-item-box() {
        color: white;
        box-sizing: border-box;
        height: 35px;
        width: 35px;
        text-align: center;
        line-height: 35px;
        a {
            text-decoration: none;

        }
        background-color: #ff4e6a;
        margin-top: 2px;
        border-radius: 7px;
        cursor: pointer;
    }

    .pagination-item-hover() {
        box-shadow: 3px 3px 2px #001528;
        transition: .5s all;
    }

    .czy-custom-pagniation {
        background-color: #C0C4CC;
        border-radius: 15px;
        text-align: center;
        line-height: 40px;
        width: 440px;
        height: 40px;
        margin: 5px auto;
        display: flex;
        justify-content: center;

        div + div {
            margin-left: 5px;
        }

        .pagniation-goto {
            height: 30px;
        }

        .pre, .num-list, .next {
            .pagination-item-box;
        }

        .pre:hover {
            .pagination-item-hover;
        }

        .num-list:hover {
            .pagination-item-hover;
        }

        .next:hover {
            .pagination-item-hover;
        }
    }

    .loops {
        width: 100%;
        height: 620px;
        display: flex;
        flex-wrap: wrap;
        overflow: scroll;

        :nth-child(1) {
            margin-left: 5px;
            margin-top: 5px;
            margin-right: 5px;
        }

        img {
            border-radius: 12px;
            box-shadow: 0 0 3px #ff4e6a;
        }

        div + div {
            margin: 5px;
        }
    }

    .images-inner-box() {
        padding-top: 20px;
        width: @inner-box-width-cal;
        margin: 30px;
        margin-bottom: 0;
        height: @inner-box-height;
        border-radius: 25px;
        box-shadow: 0 0 10px #7d7777;
    }

    .images-control-part() {
        width: 100%;
    }

    .loop-images-control-part {
        .images-control-part;

        .loop-images-inner-box {
            .images-inner-box;
        }
    }

    .loop-images-list .upload-loop {
        width: 360px;
        margin: 0 auto;
        height: 180px;
        text-align: center;
    }

    .loop-images-list {
        padding: 20px;
        padding-bottom: 40px;
        border-bottom: #eee solid 2px;
        margin-bottom: 5px;
    }


    // 覆盖轮播样式
    .carousel-3d-slide {
        border: 0;
        border-radius: 15px;
    }

    .images-main-box {
        width: 100%;
        background-color: white;

        .carousel-box {
            padding-top: 20px;
            width: 100%;
            background-color: white;
        }
    }


    .division-image-control {
        color: rgba(255, 78, 106, 0.85);
        font-size: 1.5em;
        position: relative;
        padding-bottom: 10px;
    }

    .imagePartition h2:hover:after {
        width: 2em;
    }

    .imagePartition h2:after {
        transition: all 0.35s;
        content: "";
        position: absolute;
        background: rgba(255, 78, 106, 0.85);
        width: 1em;
        height: 5px;
        bottom: -3px;
        left: 0;
        border-radius: 6px;
        box-shadow: 0 2px 12px rgba(255, 78, 106, 0.85);

    }

    .imagePartition {
        width: 100%;
        background-color: white;
        box-sizing: border-box;

        h2 {
            font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", FontAwesome, sans-serif;
            font-size: 2em;
            position: relative;
            padding-bottom: 10px;
            color: rgba(255, 78, 106, 0.85);
            padding-top: 10px;
            margin-left: 10px;
        }


    }

    .imagePartition h2:before {
        content: "";
        width: calc(100% - 40px);
        border-bottom: 1px solid #eee;
        position: absolute;
        bottom: -1px;
        left: -20px;
    }


    .el-upload-list__item-actions {
        position: absolute;
        width: 310px;
        height: 290px;
        left: 5px;
        top: 5px;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        border-radius: 12px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;

        &::after {
            display: inline-block;
            content: "";
            height: 100%;
            vertical-align: middle
        }

        span {
            display: none;
            cursor: pointer;
        }

        span + span {
            margin-left: 15px;
        }

        .el-upload-list__item-delete {
            position: static;
            font-size: inherit;
            color: inherit;
        }

        &:hover {
            opacity: 1;

            span {
                display: inline-block;
            }
        }
    }

    .czy-custom-active {
        animation: pagniation-active 1s alternate infinite;
    }

    @keyframes pagniation-active {
        from {
            border-radius: 17.5px;
            background-color: white;
            color: #eee;
            box-shadow: 0 0 4px cyan,
            0 0 1px #0048ff,
            0 0 2px #005eff,
            0 0 3px #00ccff;
        }
        to {
            border-radius: 5px;
            color: #3f3f3f;
            background-color: white;
            box-shadow: 0 0 1px red,
            0 0 2px #ff634e,
            0 0 3px #f5894a,
            0 0 4px #fde485;
        }
    }
    .el-drawer__body{
        overflow-y: scroll!important;
    }
</style>