import request from '@/utils/required';
export default {
    listAllComment(page,size,commentId) {
        return request({
            url:`/admin/comment/list/${page}/${size}?commentId=${commentId}`,
            method:'get'
        })
    },
    logicDeleteComment(commentId) {
        return request({
            url:`/admin/comment/${commentId}`,
            method:'put'
        })
    },
    absoluteDeleteComment(commentId) {
        return request({
            url:`/portal/comment/${commentId}`,
            method:'delete'
        })
    },
    topComment(commentId) {
        return request({
            url:`/admin/comment/top/${commentId}`,
            method:'put'
        })
    },
    updateCommentUserInfo() {
        return request({
            url:`/admin/comment/updateCommentUserInfo`,
            method:'put'
        })
    },
    getCommentTotalCount() {
        return request({
            url: '/admin/comment/count',
            method: 'get'
        })
    },
    success_code() {
        return 20000;
    }
}