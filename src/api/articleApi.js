import request from '@/utils/required';
export default {
    postArticle(article) {
        return request({
            url: `/admin/article`,
            method: 'post',
            data: article
        })
    },
    listArticles(page,size,state,keyword,categoryId) {
        return request({
            url:`/admin/article/list/${page}/${size}?state=${state}&keyword=${keyword}&categoryId=${categoryId}`,
            method: 'get'
        })
    },
    updateArticle(articleId,article) {
        return request({
            url:`/admin/article/${articleId}`,
            method: 'put',
            data: article
        })
    },
    topArticle(articleId) {
        return request({
            url:`/admin/article/top/${articleId}`,
            method:'put'
        })
    },
    logicDeleteArticle(articleId) {
        return request({
            url:`/admin/article/state/${articleId}`,
            method:'put'
        })
    },
    absoluteDeleteArticle(articleId) {
        return request({
            url:`/admin/article/${articleId}`,
            method:'delete'
        })
    },
    getArticle(articleId) {
        return request({
            url:`/admin/article/${articleId}`,
            method:'get'
        })
    },
    getArticleTotalCount() {
        return request({
            url: '/admin/article/count',
            method: 'get'
        });
    },
    success_code() {
        return 20000;
    }
}


