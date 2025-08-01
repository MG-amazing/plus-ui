import request from '@/utils/request';

function getInfoByPath(params) {
  return request({
    url: '/system/menu/getInfoByPath',
    method: 'post',
    params
  });
}

export { getInfoByPath };
