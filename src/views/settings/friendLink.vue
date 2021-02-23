<template>
    <div>
        <div class="friend-link-box">
            <transition appear name="slide-fade" mode="in-out">
                <div class="friend-link-content">
                    <div class="friend-link-action">
                        <el-button
                                style="background-color: #ff4e6a;
                                   margin:15px;color: #FFFFFF;border-color: #ff4e6a"
                                @click="showFriendsLinkDialog"
                        >添加友链
                        </el-button>
                    </div>
                    <div class="friend-link-main">


                        <el-table
                                v-loading="loading"
                                :data="links">
                            <el-table-column
                                    prop="id"
                                    label="ID"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    label="网站名称"
                                    width="150">
                                <template slot-scope="scope">
                                    <el-link type="primary" :underline="false" :href="scope.row.url"
                                             target="_blank">{{scope.row.name}}
                                    </el-link>

                                </template>
                            </el-table-column>

                            <el-table-column
                                    label="logo"
                                    width="150">
                                <template slot-scope="scope">
                                    <div :id="scope.row.id+'_p'" class="photo" @mouseout="mouseleave(scope.row.id+'_p')"
                                         @mouseover="mouseon(scope.row.id+'_p')">
                                        <img class="pi" :src="blog_constants.baseUrl+'/portal/image/'+scope.row.logo">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="顺序"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-tag size="medium">{{scope.row.order}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="状态"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-tag size="medium" type="danger" v-if="scope.row.state ==='0'">不可用</el-tag>
                                    <el-tag size="medium" type="success" v-if="scope.row.state ==='1'">正&emsp;常</el-tag>
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
                                    width="150">
                                <template slot-scope="scope">
                                    <div style="display: flex;justify-content: space-around">
                                        <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>

                                        <el-button type="danger" size="small" @click="deleteItem(scope.row)">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </transition>
        </div>

        <transition name="el-zoom-in-bottom">
            <el-dialog v-show="deleteDialogShow"
                    title="删除提示:"
                    :visible.sync="deleteDialogShow"
                    width="30%">
                <span>你确定要删除这个友情链接吗?</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogShow = false">取 消</el-button>
                <el-button style="background-color: #ff4e6a;color: #FFFFFF" @click="deleteFriendLink">确 定</el-button>
                </span>
            </el-dialog>
        </transition>

        <transition name="el-zoom-in-center">
                <el-dialog v-show="friendsLinkDialogShow"
                        :close-on-click-modal="false"
                        :title="friendsLinkTitle"
                        :visible.sync="friendsLinkDialogShow"
                        width="500px">
                    <div>
                        <el-form label-width="100px" size="medium">
                            <el-form-item label="友链网站名称">
                                <el-input v-model="link.name"></el-input>
                            </el-form-item>
                            <el-form-item label="跳转连接">
                                <el-input v-model="link.url"></el-input>
                            </el-form-item>
                            <el-form-item label="链接描述">
                                <el-input
                                        type="textarea"
                                        placeholder="请输入内容"
                                        v-model="link.description"
                                        maxlength="255"
                                        show-word-limit
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="顺序">
                                <el-input-number v-model="link.order" :min="1" :max="10"></el-input-number>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="link.state" placeholder="请选择状态">
                                    <el-option label="不可用" value="0"></el-option>
                                    <el-option label="正常" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="logo">
                                <div
                                        @mouseover="mouseon('editorLogo')"
                                        @mouseleave="mouseleave('editorLogo')">
                                <img @click="showLogoCutter = true" id="editorLogo" v-if="link.logo!==''" :src="blog_constants.baseUrl+'/portal/image/'+link.logo"
                                     class="friendsLinkLogo">

                                <i @click="showLogoCutter = true" v-else class="friendsLinkLogo el-icon-plus"></i>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="friendsLinkDialogShow = false" type="danger" size="medium">取 消</el-button>
                    <el-button type="primary" @click="handlefriendsLinkEditorCommit" size="medium">{{friendsLinkEditorDialogCommitText}}</el-button>
                  </span>
                </el-dialog>

        </transition>


        <avatar-upload field="file"
                       @crop-upload-success="cropUploadSuccess"
                       @crop-upload-fail="cropUploadFail"
                       v-model="showLogoCutter"
                       :width="120"
                       :height="60"
                       url="/admin/image/link"
                       img-format="png"></avatar-upload>

    </div>
</template>

<script>
    import settingsApi from "../../api/settingsApi";
    import Velocity from '@/assets/js/animation/Velocity'
    import avatarUpload from 'vue-image-crop-upload';
    import userApi from "../../api/userApi";

    export default {
        name: "friendLink",
        components: {
            'avatar-upload': avatarUpload
        },
        data() {
            return {
                deleteDialogShow: false,
                showLogoCutter: false,
                friendsLinkEditorDialogCommitText: '添加友链',
                friendsLinkDialogShow: false,
                friendsLinkTitle: '添加友情链接',
                loading: false,
                links: [],
                link: {
                    id: '',
                    logo: '',
                    name: '',
                    order: 0,
                    state: '1',
                    url: '',
                    description: ''
                },
                targetDeleteId: ''
            }
        },
        // watch:{
        //     link: {
        //         handler(n, o) {
        //             console.log(n.state)
        //         },
        //         immediate: true,
        //         deep :true
        //     }
        // },
        methods: {
            deleteItem(item){
                this.targetDeleteId = item.id;
                this.deleteDialogShow = true;
            },
            deleteFriendLink() {

                settingsApi.daleteFriendLink(this.targetDeleteId)
                .then(res=>{
                    console.log(res)
                    if (res.data.code === settingsApi.success_code()) {
                        this.$message.success(res.data.message);

                    }
                })
                this.deleteDialogShow = false;
                this.listLinks();
            },
            edit(link){
                this.link={
                    id: link.id,
                    logo: link.logo,
                    name: link.name,
                    order: link.order,
                    state: link.state,
                    url: link.url,
                    description: link.description

                }
                this.friendsLinkTitle = '编辑（' + this.link.name + '）友链ing...';
                this.friendsLinkEditorDialogCommitText = '更新友链';
                this.friendsLinkDialogShow = true;
            },
            cropUploadSuccess( jsonData, field ){
                this.showAvatarCutter = false;
                console.log(jsonData)
                if (jsonData.code === userApi.success_code()) {
                    //todo:走aliyunOSS
                    this.link.logo = jsonData.data.id;
                    this.$notify({
                        title: '新消息提示：',
                        type: 'success',
                        message: jsonData.message
                    })
                } else {
                    this.$message.error(jsonData.message);
                }
            },
            cropUploadFail(status, field) {
                this.$message.error('logo上传失败');
            },
            handlefriendsLinkEditorCommit() {
                if (this.link.name === '') {
                    this.$message.error('链接名称不可以为空');
                    return;
                }
                if (this.link.url === '') {
                    this.$message.error('跳转链接不可以为空')
                    return;
                }
                if (this.link.logo === '') {
                    this.$message.error('logo不可以为空')
                    return;
                }

                if (this.link.id !== '') {
                    settingsApi.updateFriendLink(this.link.id,this.link)
                        .then(res=>{
                            if (res.data.code === settingsApi.success_code()) {
                                this.$notify({
                                    type: 'success',
                                    title: '新消息提示:',
                                    message: res.data.message
                                })
                                this.friendsLinkDialogShow = false;
                                this.listLinks();
                            }
                        });
                } else {
                    settingsApi.postFriendLink(this.link)
                        .then(res=>{
                            if (res.data.code === settingsApi.success_code()) {
                                this.$notify({
                                    type: 'success',
                                    title: '新消息提示:',
                                    message: res.data.message
                                })
                                this.friendsLinkDialogShow = false;
                                this.listLinks();
                            }
                        });
                }



            },
            resetLinkInfo(){
                this.link = {
                    id: '',
                    logo: '',
                    name: '',
                    order: 0,
                    state: '1',
                    url: ''
                };
            },
            showFriendsLinkDialog() {
                this.resetLinkInfo();

                this.friendsLinkDialogShow = true;
                this.friendsLinkTitle = '添加友情链接';
                this.friendsLinkEditorDialogCommitText = '添加友链';
            },
            listLinks() {
                this.loading = true;
                let that = this;
                settingsApi.listLinks()
                    .then(res => {
                        if (res.data.code === settingsApi.success_code()) {
                            this.links = res.data.data.data
                            that.loading = false
                        }
                    })
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
            this.listLinks();
        }
    }
</script>

<style scoped lang="less">
    .friend-link-main{
        width: 100%;
    }
    .friend-link-box {
        width: 100%;
        height: calc(100vh - 175px);
        background-color: white;
        display: flex;
        justify-content: center;

        .friend-link-content {
            width: 100%;
            background-color: #fff;
        }
    }
    .friend-link-action{
        background-color: #eee;
    }


    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .7s cubic-bezier(0.5, 0.9, 0.7, 15);
    }

    .slide-fade-leave-active {
        transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
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

    .friendsLinkLogo {
        height: 60px;
        width: 120px;
        border-radius: 12px;
        border: 1px dashed #d9d9d9;
        line-height: 60px;
        text-align: center;
        box-shadow: 0px 0px 13px #409EFF;
    }

</style>