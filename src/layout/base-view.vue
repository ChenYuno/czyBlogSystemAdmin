<template>
    <div class="global-box-setting">
        <el-container>
            <el-header>


                <top-menu></top-menu>


            </el-header>

            <div id="breadcrumb-content" class="breadcrumb-content">
                <div class="breadcrumb-lk"></div>
                <div class="breadcrumb-mid icon">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">&#xe609;首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="item in breadcrumbShow" :key="item.path" :to="item.path">
                            <i :class="item.icon"></i>{{item.name}}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="breadcrumb-rk"></div>
            </div>
            <hr>

            <el-main>
<!--                <div id="main" class="content">-->


                    <router-view></router-view>

<!--                </div>-->

            </el-main>
            <el-footer class="blog-admin-footer">
                <div class="typed-content">
                    <vue-typed-js
                            :showCursor="true"
                            :backDelay="2000"
                            :backSpeed="60"
                            :typeSpeed="100"
                            :loop="true"
                            :startDelay="1000"
                            :strings="['Live a good life, write some good code !!!',
                            '愿自己的努力终将获得回报','花开不是为了花落，而是为了开的更加灿烂。',
                            '没有伞的孩子必须努力奔跑！','欲望以提升热忱，毅力以磨平高山。',
                            '如果放弃太早，你永远都不知道自己会错过什么。',
                            '没有礁石，就没有美丽的浪花；没有挫折，就没有壮丽的人生。']">
                        <span class="typing"></span>
                    </vue-typed-js>
                </div>
            </el-footer>

        </el-container>
    </div>
</template>

<script>
    import {routes} from '../router';
    import Vue from 'vue'
    import VueTypedJs from 'vue-typed-js'

    Vue.use(VueTypedJs)

    export default {
        name: "base-view",
        data() {
            return {
                breadcrumbShow: [],
                routes: routes[0].children,
                dy: '',
            }
        },
        mounted() {

            this.maintainBreadCrumb();


        },
        watch: {
            $route(newR, oldR) {
                let tempBreadcrumbData = [];
                if (newR.name === '仪表盘') {
                    tempBreadcrumbData.push(newR);
                }
                for (let i = 0; i < this.routes.length; i++) {
                    let b = false;
                    if (this.routes[i].children) {
                        let childrens = this.routes[i].children;
                        for (let j = 0; j < childrens.length; j++) {
                            if (newR.name === childrens[j].name) {
                                tempBreadcrumbData.push(this.routes[i]);
                                tempBreadcrumbData.push(childrens[j]);
                                b = true;
                                break;
                            }
                        }
                    }
                    if (b) {
                        break;
                    }
                }
                this.breadcrumbShow = tempBreadcrumbData;
            },

        },
        methods: {
            maintainBreadCrumb() {
                let tempBreadcrumbData = [];
                if (this.$route.name === '仪表盘') {
                    tempBreadcrumbData.push(this.$route);
                }
                for (let i = 0; i < this.routes.length; i++) {
                    let b = false;
                    if (this.routes[i].children) {
                        let childrens = this.routes[i].children;
                        for (let j = 0; j < childrens.length; j++) {
                            if (this.$route.name === childrens[j].name) {
                                tempBreadcrumbData.push(this.routes[i]);
                                tempBreadcrumbData.push(childrens[j]);
                                b = true;
                                break;
                            }
                        }
                    }
                    if (b) {
                        break;
                    }
                }
                this.breadcrumbShow = tempBreadcrumbData;
            }

        }
    }
</script>

<style lang="less">
    .global-box-setting {
        a{
            text-decoration: none;
        }
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        box-sizing: border-box;
        padding: 0 !important;
    }

    .el-main {
        background: url("../assets/otherBg.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #333;
        margin: 0;
        padding: 0 !important;
        height: calc(100vh - 175px);
    }


    [elcustom] {
        display: flex;
    }

    @font-face {
        font-family: 'iconfont';
        src: url('../assets/iconfont/iconfont.eot');
        src: url('../assets/iconfont/iconfont.eot?#iefix') format('embedded-opentype'),
        url('../assets/iconfont/iconfont.woff') format('woff'),
        url('../assets/iconfont/iconfont.ttf') format('truetype'),
        url('../assets/iconfont/iconfont.svg#iconfont') format('svg');
    }

    .icon {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }

    .breadcrumb-content {
        display: flex;
        align-items: center;
        height: 53px;
        width: 100%;
        background: #fff;
        z-index: 900;

        .breadcrumb-mid {
            flex: 4;
        }

        .breadcrumb-lk, .breadcrumb-rk {
            flex: 2;
        }
    }
    .content{
        height: 100%;
        width: 100%;
    }

    .blog-admin-footer {
        font-family: Menlo, "Ubuntu Mono", Consolas, "Courier New", "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
        text-align: center;
        line-height: 60px;
        display: flex;
        justify-content: center;
        background-color: #1e1e1b;
        text-shadow: 0 0 10px #d9d9d9;
        color: white;
    }
</style>