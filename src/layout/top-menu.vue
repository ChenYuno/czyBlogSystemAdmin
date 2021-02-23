<template>
    <div class="header">
        <div id="nav-content" class="top-nav-content">

            <div class="nav-content-l">
                <div class="nav-shadow">Czy</div>
                <div style="width: 10px"></div>
                <a href="#/dashBoard">blog</a>
            </div>
            <div class="nav-content-m">

                <el-menu elcustom
                         :default-active="$route.path"
                         class="el-menu-horizontal"
                         mode="horizontal"
                         background-color="#001528"
                         text-color="#fff"
                         active-text-color="#1890ff">
                    <template v-for="(item,index) in menuList">
                        <router-link :to="item.path" v-if="!item.children&&!item.hidden" :key="index">
                        <el-menu-item :index="item.path">
                            <i :class="item.icon" :key="index"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                        </router-link>
                        <el-submenu v-if="item.children&&!item.hidden" :key="index" :index="item.path">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <router-link :to="item.path+'/'+subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex">
                            <el-menu-item :index="item.path+'/'+subItem.path" v-if="!subItem.hidden">
                                <i :class="subItem.icon"></i>
                                <span slot="title" v-text="subItem.name"></span>
                            </el-menu-item>
                            </router-link>
                        </el-submenu>
                    </template>
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

                <div style="height: 60px">
                    <el-dropdown style="height: 60px" @command="handleCommand">
                                        <img class="top-bar-userAvatar" :src="circleUrl">
                        <span class="top-bar-userName">{{$store.state.loginUser.userName}}</span>
                        <el-dropdown-menu slot="dropdown" class="icon">
                            <el-dropdown-item
                            command="toUserInfo">&#xe603; 用户信息</el-dropdown-item>
                            <el-dropdown-item
                                    command="logout"
                                    divided>&#xe614; 退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </div>
            </div>



        </div>

    </div>
</template>

<script>
    import {routes} from '../router';
    import userApi from "../api/userApi";
    export default {
        name: "top-menu",
        data() {
            return {
                circleUrl: require("@/assets/avatar.gif"),
                menuList:[]
            }
        },
        methods:{
            handleCommand(command) {
                if (command === 'toUserInfo') {
                    this.$router.push({
                        path:'/settings/info'
                    });
                }else if (command === 'logout') {
                    userApi.doLogout()
                        .then(res => {
                            this.$notify({
                                title: '系统消息提示',
                                type: 'success',
                                message: res.data.message
                            })
                            this.$router.push('/login');
                        });
                }
            }
        }
        ,
        mounted() {
            let route = routes[0];
            console.log(route)
            this.menuList = route.children
            this.circleUrl = this.$store.state.loginUser.avatar
        }
    }
</script>

<style scoped lang="less">
    .top-bar-userName {
        margin-left: 5px;
        color: white;
        font-weight: 600;
    }
    .top-bar-userAvatar {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        vertical-align: middle;
        box-shadow: 0 0 8px #d4d4d4;
    }
    .header {
        display: flex;
        width: 100%;
        height: 60px;
        justify-content: space-between;
        align-items: center;
        background: #001528;

        .top-nav-content {
            order: 2;
            justify-content: space-around;
            width: 100%;
            display: flex;
            height: 60px;
            color: white;

            .nav-content-m {
                display: flex;
                align-items: center;
                justify-content: space-around;
                overflow: hidden;

                .el-menu-item, .el-submenu-title {
                    height: 60px;
                    line-height: 60px;
                    text-decoration: none;
                }
            }

            .nav-content-l {
                order: 0;
                display: flex;
                height: 60px;
                align-items: center;
                font-weight: 900;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

                .nav-shadow {
                    height: 60px;
                    font-size: 24px;
                    color: white;
                    line-height: 60px;
                    text-shadow: 2px 2px 0px gray,
                    3px 3px 0px gray,
                    4px 4px 0px gray;
                }

                a {
                    height: 60px;
                    font-size: 24px;
                    color: white;
                    text-decoration: none;
                    text-align: center;
                    line-height: 60px;
                    background: #001528;

                }
            }

            .nav-content-r {
                order: 3;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
        }


    }

</style>