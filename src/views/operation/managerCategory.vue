<template>
    <div>
    <div class="categoryArea">
        <transition appear
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter">
        <div class="categoty-content">
            <div class="category-action">
                <el-button type="primary" size="medium" @click="showAddCategory">添加分类</el-button>
            </div>
            <div class="category-list">
                <el-table
                        v-loading="loading"
                        :data="categories"
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="ID"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="分类名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="pinyin"
                            label="拼音"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="描述"
                            width="300">
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
                                <el-tag size="medium" type="danger" v-if="scope.row.status =='0'">已删除</el-tag>
                                <el-tag size="medium" type="success" v-if="scope.row.status =='1'">正&emsp;常</el-tag>
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

                                <el-button type="danger" size="small" @click="showDeleteDialog(scope.row)"
                                           >删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        </transition>
    </div>
        <div class="category-dialog-box">

            <el-dialog :close-on-click-modal="false"
                    :title="editTitle"
                    :visible.sync="editDialogShow"
                    width="500px">
                <div class="edit-category-box">
                    <el-form label-width="80px" size="medium">
                        <el-form-item label="分类名称">
                            <el-input v-model="category.name"></el-input>
                        </el-form-item>
                        <el-form-item label="分类拼音">
                            <el-input v-model="category.pinyin"></el-input>
                        </el-form-item>
                        <el-form-item label="分类描述">
                            <el-input type="textarea" resize="none" :rows="3" maxlength="128" show-word-limit
                                      v-model="category.description"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="category.order" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="category.status" placeholder="请选择状态">
                                <el-option label="已删除" size="medium" value="0" key="0"></el-option>
                                <el-option label="正常" size="medium" value="1" key="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogShow = false" size="mini" type="warning">取 消</el-button>
                <el-button type="primary"
                           @click="postCategory" size="mini">{{editorCommitText}}</el-button>
              </span>
            </el-dialog>


            <el-dialog
                    title="删除提示:"
                    :visible.sync="deleteDialogShow"
                    width="30%">
                <span>确定要使得这个分类不可用吗</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogShow = false">取 消</el-button>
                <el-button style="background-color: #ff4e6a;color: #FFFFFF" @click="deleteCategory">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import CategoryHttp from "../../api/categoryApi"
    export default {
        name: "managerCategory",
        data(){
            return{
                deleteDialogShow: false,
                targetDeleteId: '',
                loading: false,
                editorCommitText:'修改分类',
                editDialogShow:false,
                categories:[],
                editTitle:'添加分类',
                category:{
                    id:'',
                    name: '',
                    description: '',
                    order: 1,
                    pinyin: '',
                    status: '1'
                }
            }
        },
        methods:{
            showDeleteDialog(item) {
                this.targetDeleteId = item.id;
                this.deleteDialogShow = true;
            },
            postCategory(){
                if (this.category.name === '') {
                    this.showWarning('分类名称不能为空');
                    return;
                }
                if (this.category.pinyin === '') {
                    this.showWarning('分类名称拼音不能为空');
                    return;
                }
                if (this.category.description === '') {
                    this.showWarning('分类描述不能为空');
                    return;
                }

                if (this.category.id === '') {
                    CategoryHttp.postCategory(this.category)
                        .then(res => {
                            console.log(res)
                            if (res.data.code === CategoryHttp.success_code()) {
                                this.$notify({
                                    title: '提示消息',
                                    message: '分类添加成功！',
                                    type: 'success'
                                });
                                this.resetCategory();
                                this.editDialogShow = false;
                                this.listCategories();
                            } else {
                                this.showWarning(res.data.message);
                            }
                        });
                } else {
                    console.log(this.category)
                    CategoryHttp.updateCategory(this.category.id, this.category)
                    .then(res=>{
                        if (res.data.code === CategoryHttp.success_code()) {
                            this.$notify({
                                title: '提示消息',
                                message: res.data.message,
                                type: 'success'
                            });
                            this.resetCategory();
                            this.editDialogShow = false;
                            this.listCategories();
                        }else {
                            this.showWarning(res.data.message);
                        }
                    })
                }


            },
            edit(item) {
                console.log(item)
                this.category = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    order: item.order,
                    pinyin: item.pinyin,
                    status: item.status
                };
                this.editorCommitText = '修改分类';
                this.editTitle = '编辑分类';
                this.editDialogShow = true;
            },
            resetCategory() {
                this.category = {
                    id: '',
                    name: '',
                    description: '',
                    order: 1,
                    pinyin: '',
                    status: '1'
                };
            },
            deleteCategory() {
                CategoryHttp.deleteCategoryById(this.targetDeleteId)
                .then(res=>{
                    if (res.data.code === CategoryHttp.success_code()) {
                        this.$notify({
                            title: '成功',
                            message: res.data.message,
                            type: 'success'
                        });
                        this.listCategories();
                        this.deleteDialogShow = false;
                    }
                })
            },
            listCategories(){
                this.loading = true;
                CategoryHttp.listCategories()
                    .then(res=>{
                        this.loading = false;
                        if (res.data.code === CategoryHttp.success_code()) {
                            this.categories = res.data.data.data

                        }
                    })
            },
            showAddCategory(){
                this.resetCategory()
                this.editTitle = '添加分类';
                this.editorCommitText = '添 加';
                this.editDialogShow = true

            },
            showWarning(msg){
                this.$message({
                    message:msg,
                    type:'warning',
                    center:true
                })
            },
            beforeEnter: function (el) {
                el.style.opacity = 0
                el.style.transformOrigin = 'left'
            },
            enter: function (el, done) {
                Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
                Velocity(el, { fontSize: '1em' }, { complete: done })
            },
        },
        mounted() {
            this.listCategories()
        }
    }
</script>

<style scoped lang="less">

    .categoryArea {
        display: flex;
        height: calc(100vh - 175px);
        .categoty-content {
            background: white;
            height: 100%;
            width: 100%;
        }
        .category-action{
            padding: 10px;
            background-color: #eee;
        }
    }
    .category-list{



        .el-table{
            min-height: 300px;

        }
    }
</style>