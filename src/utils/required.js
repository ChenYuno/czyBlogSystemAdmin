import axios from 'axios'
import { MessageBox, Message } from "element-ui"
// 创建一个axios实例
const service = axios.create({
    // headers: {
    //   'content-type': 'application/json;charset=UTF-8',
    //   'token': 'one'
    // },
    //baseURL: 'http://dianphp.fyz.com',
    withCredentials: true,
    timeout: 5000
})

// 添加请求拦截器
service.interceptors.request.use(config => {
    // 在发送请求之前做某事，比如说 设置token
    // config.headers['token'] = 'token';
    //config.headers['X-Token'] = 'xxxxxxxxxxxxxxxxxxx';
    return config;
}, error => {
    // 请求错误时做些事
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(response => {
    const res = response.data;
    // 如果返回的状态不是20000 就主动报错
    if(res.code === 20000){

        /*Message({
            message: res.message || "Error",
            type: "error",
            center:true
        });*/

        // Message({
        //     message: res.message || "success",
        //     type: "success",
        //     center:true
        // });
    }
    else if (res.code===20020) {

    }else{

        Message({
            message: res.message || "Error",
            type: "error",
            center:true
        });

        /*Message({
            message: res.message || "success",
            type: "success",
            center:true
        });*/
    }
    return response;
}, error => {

    return Promise.reject(error); // 返回接口返回的错误信息
})

export default service