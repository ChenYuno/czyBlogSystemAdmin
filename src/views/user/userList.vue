<template>
    <div>
        <div class="user-list-box">
            <transition appear name="bounce" mode="in-out">
                <div class="user-list-box-content">
                    <div class="user-action">

                        <div class="tips">
                            <el-form style="height: 40px;display: flex" :inline="true" :model="search"
                                     class="form-inline">
                                <el-form-item label="用户名" style="display: flex">
                                    <el-input v-model="search.userName" placeholder="用户名"></el-input>
                                </el-form-item>
                                <el-form-item label="email" style="display: flex">
                                    <el-input v-model="search.email" placeholder="email"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <div style="display: flex">
                                        <el-button type="primary" @click="listUsers">查询</el-button>
                                        <el-button type="primary" @click="listAllUsers">查询全部</el-button>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <div class="pagination">

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

                            <div class="tipTosignAndEmail">
                                <el-popover
                                        placement="bottom"
                                        title="标题"
                                        width="200"
                                        trigger="click"
                                        content="用户邮箱和签名点击用户名查看ヽ(￣ω￣(￣ω￣〃)ゝ">
                                    <el-tag style="margin-right: 20px" size="medium" type="warning" slot="reference">
                                        tips
                                    </el-tag>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                    <div class="user-list">
                        <el-table
                                v-loading="loading"
                                :data="users"
                                style="width: 100%">
                            <el-table-column
                                    prop="id"
                                    label="ID"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    label="用户名"
                                    width="160">
                                <template slot-scope="scope">
                                    <el-popover trigger="click" placement="left">
                                        <p v-if="scope.row.sign">用户签名: {{ scope.row.sign }}</p>
                                        <p v-else>用户签名: 这个人很懒，什么也没有写</p>
                                        <p>用户邮箱: {{ scope.row.email }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium">{{ scope.row.userName }}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="头像"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="角色"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-tag size="medium">{{scope.row.roles}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="状态"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-tag size="medium" type="danger" v-if="scope.row.state =='0'">已禁用</el-tag>
                                    <el-tag size="medium" type="success" v-if="scope.row.state =='1'">正&emsp;常</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="regIp"
                                    label="注册ip地址"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="loginIp"
                                    label="登录ip地址"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    label="创建日期"
                                    width="190">
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="更新日期"
                                    width="190">
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="150">
                                <template slot-scope="scope">
                                    <div style="display: flex;justify-content: space-around">
                                        <el-button type="primary" size="small" @click="resetpassword(scope.row)">重置密码
                                        </el-button>

                                        <el-button type="danger" size="small" @click="showDeleteDialog(scope.row)"
                                        >删除
                                        </el-button>

                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
            </transition>
        </div>
        <div class="user-dialog-box">
            <el-dialog
                    :close-on-click-modal="false"
                    title="密码重置"
                    :visible.sync="resetPasswordShow"
                    width="400px">
                <div class="reset-password-from">
                    <div class="reset-tips-text">
                        <div style="width: 58px;text-align: right;padding-right: 12px">修 &nbsp;&nbsp;改</div>
                        "{{targetResetUserName}}"的密码
                    </div>
                    <el-form label-width="70px">
                        <el-form-item label="新密码">
                            <el-input v-model="resetPasswordValue" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetPasswordShow = false">取 消</el-button>
                    <el-button type="primary" @click="doResetPassword">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                    title="删除提示:"
                    :visible.sync="deleteDialogShow"
                    width="30%">
                <span>你确定要禁用这个用户吗吗?</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogShow = false">取 消</el-button>
                <el-button style="background-color: #ff4e6a;color: #FFFFFF" @click="deleteUser">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {hex_md5} from "../../utils/md5";
    import UserApi from "@/api/userApi";
    import userApi from "../../api/userApi";

    export default {
        name: "userList",
        data() {
            return {
                targetDeleteId: '',
                targetDeleteUsername: '',
                deleteDialogShow: false,
                resetPasswordShow: false,
                loading: false,
                pageNavigation: {
                    totalCount: 1,
                    currentPage: 1,
                    pageSize: 10,
                    totalPage: '',
                    hasNext: false,
                    hasPrevious: false
                },
                user: {
                    id: '',
                    userName: '',
                    password: '',
                    roles: '',
                    avatar: '',
                    email: '',
                    sign: '',
                    state: "1"
                },
                users: [],
                search: {
                    userName: '',
                    email: ''
                },
                resetPasswordValue: '',
                targetResetUserName: '',
                targetResetUserId: ''
            }
        },
        methods: {
            showDeleteDialog(item) {
                this.targetResetUserId = item.id
                this.targetResetUserName = item.userName;
                this.deleteDialogShow = true;
            },
            doResetPassword() {
                if (this.resetPasswordValue === '') {
                    this.$message.error('不能重设密码为空');
                    return;
                }
                userApi.reserPassword(this.targetResetUserId, hex_md5(this.resetPasswordValue))
                    .then(res => {
                        if (res.data.code === userApi.success_code()) {
                            this.$message.success(res.data.message);
                            this.targetResetUserId = '';
                            this.targetResetUserName = '';
                            this.resetPasswordShow = false
                        } else {
                            this.targetResetUserId = '';
                            this.targetResetUserName = '';
                            this.resetPasswordShow = false
                        }
                    });
            },
            listAllUsers() {
                this.search = {
                    userName: '',
                    email: ''
                };
                this.listUsers();
            },
            listUsers() {
                this.loading = true
                UserApi.listUsers(this.pageNavigation.currentPage, this.pageNavigation.pageSize,
                    this.search.userName, this.search.email)
                    .then(res => {
                        this.loading = false
                        console.log(res.data.data.data)
                        this.users = res.data.data.data.records
                        this.pageNavigation = {
                            totalCount: res.data.data.data.totalCount,
                            currentPage: res.data.data.data.currentPage,
                            pageSize: res.data.data.data.pageSize,
                            totalPage: res.data.data.data.totalPage,
                            hasNext: res.data.data.data.hasNext,
                            hasPrevious: res.data.data.data.hasPrevious
                        }
                    })
            },
            onPageChange(page) {
                console.log(page)
                this.pageNavigation.currentPage = page;
                this.listUsers();
            },
            onSizeChange(size) {
                console.log(size)
                this.pageNavigation.pageSize = size;
                this.listUsers();
            },
            resetpassword(user) {
                this.resetPasswordShow = true;
                this.targetResetUserName = user.userName;
                this.targetResetUserId = user.id
            },
            deleteUser() {
                userApi.deleteUserById(this.targetResetUserId)
                    .then(res => {
                        if (res.data.code === userApi.success_code()) {
                            this.$notify({
                                title: '新消息提示',
                                message: `${this.targetResetUserName}已经被你无情禁用...`,
                                type: 'success'
                            })
                            this.listUsers()
                            this.deleteDialogShow = false;
                        }
                    })
            }
        },
        mounted() {
            this.listUsers();
        }

    }
</script>

<style scoped lang="less">
    .user-list-box {
        display: flex;
        width: 100%;
        height: calc(100vh - 175px);
        background-color: white;

        .user-list-box-content {
            position: relative;
            flex: 5;
            background: white;
            height: 100%;
            width: 100%;

            .user-action {
                padding: 10px;
                background-color: #eee;
                display: flex;
                align-items: center;
                height: 40px;
            }
        }
    }


    .tips {
        margin-left: 20px;
        width: 100%;
        display: flex;
        align-items: center;

        .tipTosignAndEmail {
            height: 36px;
            width: 50%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            text-align: center;

        }
    }

    .pagination {
        display: flex;
        justify-content: center;
        height: 45px;
        align-items: center;
    }

    .reset-tips-text {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 400;
        height: 70px;
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
</style>