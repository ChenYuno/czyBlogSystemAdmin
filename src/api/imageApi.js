import request from '@/utils/required';
export default {
    listImages(page,size,original) {
        return request({
            url: `/admin/image/list/${page}/${size}?original=${original}`,
            method: 'get'
        })
    },
    absoluteRemoveForever(image) {
        return request({
            url: '/admin/image/absoluteRemoveForever',
            method:'delete',
            data: image
        })
    },
    success_code() {
        return 20000;
    }
}