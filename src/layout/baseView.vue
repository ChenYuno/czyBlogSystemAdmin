<template>

    <div class="around">
        <div class="top-nav-header">
            <div class="top-nav-kl"></div>
            <div class="top-nav-content">
                <div class="nav-content-l">
                    <div class="nav-shadow">Czy</div>
                    <div style="width: 10px"></div>
                    <a href="">blog</a>
                    <!--                    <a href="">&nbsp;&emsp;</a>-->
                    <!--                    <a href="">Blog</a>-->

                </div>

                <div class="nav-content-m">

                    <el-menu elcustom router="true"
                             style="height: 65px;line-height: 66px;position: relative;bottom: 0"
                             default-active="dashBoard"
                             class="el-menu-demo"
                             mode="horizontal"
                             @select="handleSelect"
                             background-color="#001528"
                             text-color="#fff"
                             active-text-color="#1890ff">
                        <el-menu-item index="dashBoard" class="icon">&#xeab4; 仪表盘</el-menu-item>
                        <el-submenu index="content">
                            <template slot="title">我的工作台</template>
                            <el-menu-item index="postArticle">发布文章</el-menu-item>
                            <el-menu-item index="manageArticle">文章管理</el-menu-item>
                            <el-menu-item index="manageComment">评论管理</el-menu-item>
                            <el-menu-item index="managerImage">图片管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="user">
                            <template slot="title">用户中心</template>
                            <el-menu-item index="userList">用户列表</el-menu-item>
                            <el-menu-item index="info">个人信息</el-menu-item>
                            <el-menu-item index="email">邮箱管理</el-menu-item>
                            <el-menu-item index="resetPassword">重设密码</el-menu-item>
                        </el-submenu>
                        <el-submenu index="operation">
                            <template slot="title">运维中心</template>
                            <el-menu-item index="loop">轮播图管理</el-menu-item>
                            <el-menu-item index="managerCategory">分类管理</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="login" class="icon">&#xeab4; 登录</el-menu-item>
                    </el-menu>

                </div>
                <div class="nav-content-r icon">
                    <div style="margin-right: 20px;">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                           &#xe60e;
                          </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                                <el-dropdown-item command="b">狮子头</el-dropdown-item>
                                <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                                <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                                <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div style="margin-right: 20px;">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            &#xe60f;
                          </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                                <el-dropdown-item command="b">狮子头</el-dropdown-item>
                                <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                                <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                                <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div style="margin-right: 20px;">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            &#xe60b;
                          </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                                <el-dropdown-item command="b">狮子头</el-dropdown-item>
                                <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                                <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                                <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
            <div class="top-nav-kr">
                <div>
                    <el-dropdown @command="handleCommand">
                    <el-row class="demo-avatar demo-basic el-dropdown-link">
                        <el-col :span="12">
                            <div class="demo-basic--circle">
                                <div class="block">
                                    <el-avatar :size="24" :src="circleUrl"></el-avatar>
                                </div>

                            </div>
                        </el-col>

                    </el-row>

                        <el-dropdown-menu slot="dropdown" class="icon">
                            <el-dropdown-item command="c">&#xe603;用户信息</el-dropdown-item>
                            <el-dropdown-item command="e" divided>&#xe614;退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>


        <div class="breadcrumb-content">
            <div class="breadcrumb-lk"></div>
            <div class="breadcrumb-mid icon">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">&#xe609;首页</el-breadcrumb-item>
                    <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">{{item.meta.title}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="breadcrumb-rk"></div>

        </div>


        <div style="position: fixed;top: 119px;width: 100%">
            <hr>
        </div>


        <div style="top: 120px;width: 100%;height:88vh;position: fixed">

            <div style="display: flex;justify-content: space-around;width: 100%;height: 100%;background: cyan;position: relative;overflow: scroll">
                <router-view/>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "baseView",
        data() {
            return {
                circleUrl: require("@/assets/avatar.gif"),
                levelList: []
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        },
        created() {
            this.getBreadcrumb()
        },
        methods: {
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name)
                const first = matched[0];
                if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
                    matched = [{path: '/dashboard', meta: {title: 'dashboard'}}].concat(matched)
                }
                this.levelList = matched
                console.log(matched)
            },
            handleSelect() {
            }
        },
    }
</script>

<style lang="less" scoped>

    .around {
        min-height: 100vh;
    }

    * {
        margin: 0;
        padding: 0;
    }

    .top-nav-header {
        display: flex;
        height: 65px;
        justify-content: space-between;
        align-items: center;
        background: #001528;
        position: fixed;
        width: 100%;
        /*overflow: visible;*/

        .top-nav-content {
            display: flex;
            flex: 4;
            color: white;

            .nav-content-m {
                flex: 4;
                display: flex;
                align-items: center;
                justify-content: space-around;

                .el-menu-item, .el-submenu__title {
                    height: 65px;
                    line-height: 65px;
                }


            }

            .nav-content-l {
                position: relative;
                display: flex;
                height: 65px;
                align-items: center;
                font-weight: 900;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

                .nav-shadow {
                    height: 65px;
                    font-size: 24px;
                    color: white;
                    line-height: 65px;
                    text-shadow: 2px 2px 0px gray,
                    3px 3px 0px gray,
                    4px 4px 0px gray;
                }

                a {
                    height: 65px;
                    font-size: 24px;
                    color: white;
                    text-decoration: none;
                    text-align: center;
                    line-height: 65px;
                    background: #001528;

                }
            }

            .nav-content-l, .nav-content-r {
                flex: 1;
            }

            .nav-content-r {
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
        }

        .top-nav-kl, .top-nav-kr {
            flex: 1;
        }
    }

    [elcustom] {
        display: flex;
    }

    .breadcrumb-content {
        display: flex;
        align-items: center;
        height: 54px;
        width: 100%;
        background: #fff;
        top: 65px;
        position: fixed;

        .breadcrumb-mid {
            flex: 4;
        }

        .breadcrumb-lk, .breadcrumb-rk {
            flex: 1;
        }
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

</style>