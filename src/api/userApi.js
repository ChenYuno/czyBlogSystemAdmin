import request from '../utils/required';
export default {
    checkToken(){
        return request({
            url: '/user/check-token',
            method: 'get'
        })
    },
    doLogin(captcha,captcha_key,from,blogUser){
        return request({
            url: `/user/login/${captcha}/${captcha_key}?from=${from}`,
            method:'post',
            data:blogUser
        })
    },
    listUsers(page,size,userName,email) {
      return request({
          url: `/user/list?page=${page}&size=${size}&userName=${userName}&email=${email}`,
          method: 'get',
      })
    },
    deleteUserById(userId){
      return request({
          url:`/user/${userId}`,
          method:'delete'
      })
    },
    reserPassword(userId,password){
      return request({
          url: `/user/reset-password/${userId}?password=${password}`,
          method: 'put'
      })
    },
    getUserInfo(userId) {
        return request({
            url:`/user/user_info/${userId}`,
            method:'get'
        })
    },
    checkUserName(userName) {
        return request({
            url: `/user/user_name?userName=${userName}`,
            method: 'get'
        })
    },
    updateUserInfo(userId,userInfo) {
        return request({
            url:`/user/user_info/${userId}`,
            method:'put',
            data: userInfo
        })
    },
    getRegisterUserCount() {
        return request({
            url: '/user/register_count',
            method: 'get'
        })
    },
    doLogout() {
        return request({
            url: '/user/logout',
            method: 'get'
        })
    },
    getSystemMonitorData() {
        return request({
            url: '/user/sysInfo',
            method:'get'
        })
    },
    success_code(){
        return 20000;
    },
    faild_code(){
        return 40000;
    }
}