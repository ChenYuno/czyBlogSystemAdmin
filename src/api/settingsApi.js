import request from '@/utils/required';
export default {
    getCaptcha(emailAddress,type){
        return request({
            url: `/user/verify_code?email=${emailAddress}&type=${type}`,
            method:'get'
        })
    },
    updateEmailAddress(newEmail, verifyCode) {
        return request({
            url: `/user/email?email=${newEmail}&verify_code=${verifyCode}`,
            method: 'put'
        })
    },
    getWebsizeInfo() {
        return request({
            url:'/admin/web_size_info/seo',
            method:'get'
        })
    },
    getWebsizeTitle() {
        return request({
            url:'/admin/web_size_info/title',
            method:'get'
        })
    },
    updateWebsizeTitle(newTitle) {
        return request({
            url: `/admin/web_size_info/title?title=${newTitle}`,
            method:'put'
        })
    },
    updateSeoInfo(description,keywords) {
        return request({
            url: `/admin/web_size_info/seo?description=${description}&keywoeds=${keywords}`,
            method:'put'
        })
    },
    listLinks() {
        return request({
            url:'/admin/friend_link/list',
            method:'get'
        })
    },
    postFriendLink(link) {
        return request({
            url: `/admin/friend_link`,
            method: 'post',
            data: link
        })
    },
    updateFriendLink(linkId, link) {
        return request({
            url:`/admin/friend_link/${linkId}`,
            method:'put',
            data:link
        })
    },
    daleteFriendLink(linkId){
      return request({
          url:`/admin/friend_link/${linkId}`,
          method:'delete'
      })
    },
    getAndFlushWebSizeViewCount() {
        return request({
            url: '/admin/web_size_info/view_count',
            method: 'get'
        })
    },
    getWebSizeAdvice() {
        return request({
            url: '/portal/web_size_info/advice',
            method:'get'
        })
    },
    postWebSizeAdvice(advice) {
        return request({
            url: '/admin/web_size_info/advice',
            method: 'post',
            data:advice
        })
    },
    success_code(){
        return 20000;

    }
}