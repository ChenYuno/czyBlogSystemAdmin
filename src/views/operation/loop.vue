<template>
    <div>
        <div class="loopArea">
            <transition appear
                        v-on:before-enter="beforeEnter"
                        v-on:enter="enter">
            <div class="loop-content">
                <div class="loop-action">
                    <el-button type="primary" size="medium" @click="showAddLoop">添加轮播图</el-button>
                </div>
                <div class="loopControl">
                    <el-table
                            v-loading="loading"
                            :data="loopData"
                            style="width: 100%">
                        <el-table-column
                                prop="id"
                                label="ID"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                label="轮播图标题"
                                width="300">
                            <template slot-scope="scope">
                                <el-link type="primary" :underline="false" :href="scope.row.targetUrl" target="_blank">
                                    {{scope.row.title}}
                                </el-link>

                            </template>
                        </el-table-column>

                        <el-table-column
                                label="轮播图"
                                width="150">
                            <template slot-scope="scope">
                                <div :id="scope.row.id+'_p'" class="photo" @mouseout="mouseleave(scope.row.id+'_p')"
                                     @mouseover="mouseon(scope.row.id+'_p')">
                                    <img class="pi" :src="scope.row.imageUrl">
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

                                    <el-button :disabled="scope.row.status === '0'" type="danger"
                                               size="small" @click="deleteDialogAlert(scope.row)">删除
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            </transition>
        </div>
        <div class="loop-dialog">
            <el-dialog
                    :close-on-click-modal="false"
                    :title="loopEditorTitle"
                    :visible.sync="loopDialogShow"
                    width="500px">
                <div>
                    <el-form label-width="100px" size="medium">
                        <el-form-item label="轮播图标题">
                            <el-input v-model="loopInfo.title"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转连接">
                            <el-input v-model="loopInfo.targetUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="loopInfo.order" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="loopInfo.state" placeholder="请选择状态">
                                <el-option label="不可用" value="0"></el-option>
                                <el-option label="正常" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="封面">
                            <el-upload
                                    class="avatar-uploader"
                                    action="/admin/image/loop"
                                    :show-file-list="false"
                                    :on-success="uploadSccess"
                                    :before-upload="beforeUpload">
                                <el-image fit="cover" v-if="loopInfo.imageUrl!==''" :src="loopInfo.imageUrl"
                                          class="avatar"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="loopDialogShow = false" type="danger" size="medium">取 消</el-button>
                    <el-button type="primary" @click="handleLoopEditorCommit" size="medium">{{loopEditorDialogCommitText}}</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                    title="删除提示:"
                    :visible.sync="deleteDialogShow"
                    width="30%">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogShow = false">取 消</el-button>
                <el-button style="background-color: #ff4e6a;color: #FFFFFF" @click="deleteLoop">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import loopApi from "../../api/loopApi";

    export default {
        name: "loop",
        data() {
            return {
                deleteDialogShow: false,
                loopEditorDialogCommitText: '添 加',
                loopEditorTitle: '添加轮播图',
                loopDialogShow: false,
                loading: false,
                loopData: [],
                loopInfo: {
                    id: '',
                    title: '',
                    state: '1',
                    order: 1,
                    targetUrl: '',
                    imageUrl: '',
                },
                targetDeleteId:''
            }
        },
        methods: {
            deleteDialogAlert(item){
                this.targetDeleteId = item.id;
                this.deleteDialogShow = true;
            },
            handleLoopEditorCommit() {

                if (this.loopInfo.title === '') {
                    this.$message.error('标题不可以为空');
                    return;
                }
                if (this.loopInfo.targetUrl === '') {
                    this.$message.error('跳转连接不可以为空');
                    return;
                }
                if (!this.loopInfo.targetUrl.startsWith('http://') &&
                    !this.loopInfo.targetUrl.startsWith('https://')) {
                    this.$message.error('跳转连接格式错误');
                    return;
                }
                if (this.loopInfo.imageUrl === '') {
                    this.$message.error('轮播图不可以为空');
                    return;
                }

                if (this.loopInfo.id === '') {
                    loopApi.postLoop(this.loopInfo)
                        .then(res => {
                            if (res.data.code === loopApi.success_code()) {
                                this.$notify({
                                    type: 'success',
                                    message: res.data.message,
                                    title: '新消息提示：'
                                });
                                this.resetLoop();
                                this.loopDialogShow = false;
                                this.listLoop();
                            } else {
                                this.$notify({
                                    type: 'success',
                                    message: res.data.message,
                                    title: '新消息提示：'
                                });
                                this.resetLoop();
                                this.loopDialogShow = false;
                            }
                        });
                } else {
                    //更新
                    loopApi.updateLoop(this.loopInfo.id, this.loopInfo)
                        .then(res => {
                            this.loopDialogShow = false;
                            this.listLoop();
                            this.$notify({
                                title: '新消息提示:',
                                type: 'success',
                                message: res.data.message
                            })
                        })
                }

            },
            resetLoop() {
                this.loopInfo = {
                    id: '',
                    title: '',
                    state: '1',
                    order: 1,
                    targetUrl: '',
                    imageUrl: '',
                }
            },
            uploadSccess(response) {
                console.log(response)
                if (response.code === loopApi.success_code()) {
                    //todo:上线的时候记得改造
                    //看来得走oss
                    this.loopInfo.imageUrl = this.blog_constants.baseUrl + '/portal/image/' + response.data.id;
                    this.$message.success(response.message);
                } else {
                    this.$message.success(response.message);
                }
            },
            beforeUpload() {

            },
            showAddLoop() {
                this.resetLoop();
                this.loopEditorDialogCommitText = '添 加'
                this.loopDialogShow = true;
            },
            deleteLoop() {
                console.log(this.targetDeleteId);
                loopApi.deleteLoop(this.targetDeleteId)
                    .then(res => {
                        if (res.data.code === loopApi.success_code()) {
                            this.$message({
                                type: 'success',
                                message: res.data.message,
                                center: true
                            })
                            this.listLoop();
                            this.deleteDialogShow = false;
                        }
                    })
            },
            edit(item) {
                this.loopEditorDialogCommitText = '修改轮播图';
                this.loopDialogShow = true;
                this.loopEditorDialogCommitText = '修改';
                this.loopInfo = {
                    id: item.id,
                    title: item.title,
                    state: item.state,
                    order: item.order,
                    targetUrl: item.targetUrl,
                    imageUrl: item.imageUrl,
                }
            },
            listLoop() {
                this.loading = true;
                loopApi.listLoop()
                    .then(res => {
                        this.loading = false;
                        if (res.data.code === loopApi.success_code()) {
                            this.loopData = res.data.data.data
                        }
                    });
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
            beforeEnter: function (el) {
                el.style.opacity = 0
                el.style.transformOrigin = 'right'
            },
            enter: function (el, done) {
                Velocity(el, { opacity: 3, fontSize: '1.4em' }, { duration: 800 })
                Velocity(el, { fontSize: '0em' }, { complete: done })
            },
        },
        mounted() {
            this.listLoop();
        }
    }
</script>

<style scoped lang="less">

    .loopArea {
        display: flex;
        justify-content: center;
        height: calc(100vh - 175px);


        .loop-content {
            background: #fff;
            width: 100%;
            height: 100%;

            .loop-action{
                padding: 10px;
                background-color: #eee;
            }
        }
    }

    .loop-title {
        text-decoration: none;
    }

    .loop-image {
        width: 100px;
        height: 100px;
    }

    .photo {
        width: 120px !important;
        height: 80px !important;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .pi {
            box-shadow: 0px 0px 4px pink,
            0px 0px 5px pink,
            0px 0px 6px pink,
            0px 0px 7px pink;
            border-radius: 12px;

            width: 120px !important;
            height: 60px !important;

        }

    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border: #8c939d dashed 1px;
        border-radius: 15px;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>