<template>
    <div>
        <transition appear
                    name="custom-classes-transition"
                    enter-active-class="animated tada"
        >
         <div class="user-info-box">
             <div class="info-lk"></div>

             <div class="info-content">

                 <el-form label-width="100px" v-if="userInfo">
                     <el-form-item label="用户ID">
                         <el-input type="text" v-model="userInfo.id" disabled></el-input>
                     </el-form-item>
                     <el-form-item label="邮箱地址">
                         <div style="display: flex">
                             <el-input type="text" v-model="userInfo.email" disabled autocomplete="off"></el-input>
                             <el-button @click="toUpdateEmailPage" style=";height: 40px;margin-left: 15px;background-color: #ff4e6a;color: #FFFFFF;border-color: #ff4e6a">
                                 修改邮箱
                             </el-button>
                         </div>
                     </el-form-item>
                     <el-form-item label="用户名">
                         <el-input type="text" v-model="userInfo.userName" autocomplete="off"></el-input>
                     </el-form-item>


                     <el-form-item label="签名">
                         <el-input v-model="userInfo.sign"></el-input>
                     </el-form-item>


                     <el-form-item label="头像">
                         <!-- 头衔缩略图 -->
                         <pan-thumb :image="userInfo.avatar"/>
                         <!-- 文件上传按钮 -->
                         <el-button type="warning" icon="el-icon-upload" @click="changeUserAvatar">更换头像</el-button>
                     </el-form-item>
                     <el-form-item>
                         <el-button type="primary" @click="updateUserInfo">修改账户消息</el-button>
                     </el-form-item>
                 </el-form>

             </div>
             <div class="info-rk"></div>
         </div>

        </transition>





        <el-dialog
                :visible.sync="isImageSelectorShow"
                width="810">
            <div class="image-selector-box">
                <div class="image-action-bar">
                    <el-upload
                            class="article-image-selectoe-uploader"
                            action="/admin/image/avatar"
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

                                <el-image fit="cover" v-if="isImageSelectorShow"
                                          :src="blog_constants.baseUrl+'/admin/image/'+item.url"></el-image>
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


    </div>
</template>

<script>
    import userApi from "../../api/userApi";
    import PanThumb from '@/components/PanThumb'
    import categoryApi from "../../api/categoryApi";
    import imageApi from "../../api/imageApi";
    export default {
        name: "info",
        data(){
            return{
                lastUserName: '',

                userInfo: null,



                isImageSelectorShow:false,
                images: {},
                pageNavigation: {
                    totalCount: 1,
                    currentPage: 1,
                    pageSize: 15,
                    totalPage: '',
                    hasNext: false,
                    hasPrevious: false
                },
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
                selectedImageIndex:0,
            }
        },
        components:{
             PanThumb
        },
        methods:{
            getUserInfo(){
                userApi.checkToken()
                .then(res=>{
                    if (res.data.code === userApi.success_code()) {
                        this.userInfo = res.data.data.data;
                        this.lastUserName = this.userInfo.userName;
                    }
                })
            },
            updateUserInfo(){
                if (this.userInfo.userName === '') {
                    this.$message.error('用户名不可以为空');
                    return;
                }

                if (this.lastUserName === this.userInfo.userName) {
                    this.doUpdate();
                } else {
                    userApi.checkUserName(this.userInfo.userName)
                        .then(res=>{
                            if (res.data.code === userApi.success_code()) {
                                console.log('user == null后端'+res)
                                this.doUpdate();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                }
            },
            doUpdate() {
                if (this.userInfo.avatar === '') {
                    this.$message.error('头像不可以为空');
                    return;
                }
                userApi.updateUserInfo(this.userInfo.id, this.userInfo)
                .then(res=>{
                    if (res.data.code === userApi.success_code()) {
                        this.$notify({
                            title: '新消息提示：',
                            type: 'success',
                            message: res.data.message
                        })
                        this.$store.state.loginUser.avatar = this.userInfo.avatar
                        this.$store.state.loginUser.userName = this.userInfo.userName
                    }
                })
            },
            toUpdateEmailPage(){
                this.$router.push('/settings/email')
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
                    this.imageOriginal = 'avatar';
                    this.listImages(1,15,'avatar');
                }

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
                        }
                    })
            },
            onImageSelected() {
                let avatar = this.images.records[this.selectedImageIndex];
                this.userInfo.avatar = this.blog_constants.baseUrl+'/admin/image/'+avatar.url;
                this.isImageSelectorShow = false;
            },
            onSizeChange(size) {
                this.listImages(1, size, this.imageOriginal);
            },
            onPageChange(page) {
                this.listImages(page, this.pageNavigation.pageSize, this.imageOriginal);
            },
            changeImageQueryOriginal(original) {
                this.listImages(this.pageNavigation.currentPage,
                    this.pageNavigation.pageSize, original);
            },
            changeUserAvatar() {
                this.isImageSelectorShow = true;
                this.imageOriginal = 'avatar'
                this.listImages(1,15,'avatar');
            }

        },
        mounted() {
            this.getUserInfo();
        }
    }
</script>

<style scoped lang="less">

    .user-info-box{
        display: flex;
        justify-content: center;
        .info-lk,.info-rk{
            flex: 1;
        }
        .info-content {
            flex: 5;
            display: flex;
            justify-content: center;
            background-color: #fff;
            width: 100%;
            box-shadow: 0px 0px 40px pink,
            0px 0px 45px pink,
            0px 0px 50px pink,
            0px 0px 55px pink;
            border-bottom-right-radius: 22px;
            border-bottom-left-radius: 22px;
        }
    }
</style>