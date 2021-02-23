import request from '@/utils/required';
export default {
    listLoop() {
        return request({
            url: '/admin/loop/list',
            method:'get'
        })
    },
    postLoop(loopInfo){
      return request({
          url: `/admin/loop`,
          method:'post',
          data: loopInfo
      })
    },
    deleteLoop(loopId){
        return request({
            url:`/admin/loop/${loopId}`,
            method: 'delete'
        })
    },
    updateLoop(loopId, loopInfo) {
        return request({
            url: `/admin/loop/${loopId}`,
            method: 'put',
            data: loopInfo
        })
    },
    success_code() {
        return 20000;
    }
}