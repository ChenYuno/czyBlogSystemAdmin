import request from "../utils/required";
export default {
    listCategories(){
        return request({
            url:'/admin/category/list',
            method:'get'
        })
    },
    deleteCategoryById(categoryId){
        return request({
            url:`/admin/category/${categoryId}`,
            method:'delete'
        })
    },
    postCategory(category){
        return request({
            url:`/admin/category`,
            method:'post',
            data:category
        })
    },
    updateCategory(categoryId, category) {
        return request({
            url: `/admin/category/${categoryId}`,
            method: 'put',
            data: category
        })
    },
    success_code(){
        return 20000;
    }
}
