import Vue from 'vue'
import VueRouter from 'vue-router'
import baseView from "../layout/baseView";
import baseview from "../layout/base-view";
import viewcontent from "../layout/view-content"
import index from "../views/index";
//dashBoard
import dashBoard from "../views/dashboard/dashBoard";
//content
import postArticle from "../views/content/postArticle";
import manageArticle from "../views/content/mangeArticle";
import managerImage from "../views/content/managerImage";
import manageComment from "../views/content/manageComment";
//login
import login from "../views/login/login";
//operation
import loop from "../views/operation/loop";
import managerCategory from "../views/operation/managerCategory";
//settings
import friendLink from "../views/settings/friendLink";
import websizeInfo from "../views/settings/websizeInfo";
//user
import email from "../views/settings/email";
import info from "../views/settings/info";
import userList from "../views/user/userList";

import czyp from "@/components/test-component";




Vue.use(VueRouter)

export const routes = [

    {
        path: '',
        redirect: '/index',
        component: baseview,

        children: [
            {
                path: '/index',
                name: '首页',
                hidden:false,
                icon: 'el-icon-s-home',
                meta: {title: '首页',icon: 'el-icon-s-home'},
                component: index
            },
            {path: '/dashBoard',name:'仪表盘',icon:'el-icon-data-analysis', component: dashBoard,meta:{title:'仪表盘',icon:'&#xeab4;'}},
            {
                path: "/content",
                icon:'el-icon-tickets',
                hidden:false,
                name: '内容',
                component: viewcontent,
                children:[
                    {path: 'postArticle',hidden:false,name:'发布文章',icon:'el-icon-edit-outline', component: postArticle,meta:{title:'发布文章',icon:'&#xe607;'}},
                    {path: 'manageArticle',hidden:false,name:'文章管理',icon:'el-icon-document', component: manageArticle,meta:{title:'文章管理',icon:'&#xe604;'}},
                    {path: 'managerImage',hidden:false,name:'图片管理',icon:'el-icon-picture-outline', component: managerImage,meta:{title:'图片管理',icon:'&#xe60d;'}},
                    {path: 'manageComment',hidden:false,name:'评论管理', icon:'el-icon-chat-line-round',component: manageComment,meta:{title:'评论管理',icon:'&#xe619;'}},
                ]
            },
            {
                path: "/user",
                name: '用户',
                icon: 'el-icon-user',
                hidden:false,
                component: viewcontent,
                children:[
                    {path: 'userList',hidden:false,name:'用户列表',icon:'el-icon-user', component: userList,meta:{title:'用户列表',icon:'&#xe681;'}},
                ]
            },
            {
                path: "/operation",
                name: '运营',
                icon: 'el-icon-s-opportunity',
                hidden:false,
                component: viewcontent,
                children:[
                    {path: 'managerCategory',hidden:false,name:'分类管理',icon:'el-icon-help', component: managerCategory,meta:{title:'分类管理',icon:'&#xe617;'}},
                    {path: 'loop',name:'轮播图管理',hidden:false, component: loop,icon:'el-icon-picture-outline-round',meta:{title:'轮播图管理',icon:'&#xe618;'}},
                ]
            },
            {
                path: "/settings",
                hidden:false,
                icon: 'el-icon-setting',
                name: '设置',
                component: viewcontent,
                children:[
                    {path: 'friendLink',hidden:false,name:'友链管理', icon:'el-icon-connection',component: friendLink,meta:{title:'友链管理',icon:'&#xe60e;'}},
                    {path: 'websizeInfo',hidden:false,name:'网站信息',icon:'el-icon-info', component: websizeInfo,meta:{title:'网站信息',icon:'&#xe608;'}},
                    {path: 'info',hidden:false,name:'个人信息', icon:'el-icon-warning-outline',component: info,meta:{title:'个人信息',icon:'&#xe60c;'}},
                    {path: 'email',hidden:false,name:'邮箱管理',icon:'el-icon-postcard', component: email,meta:{title:'邮箱管理',icon:'&#xe612;'}},
                ]
            }


        ],
    },
    {path: '/login',name:'登录',component: login,meta:{title:'登录',icon:'&#xe60c;'}},
    {
        path: '/p',name:'pagnition', component: czyp
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
