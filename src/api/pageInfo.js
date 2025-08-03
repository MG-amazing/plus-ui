import request from '@/utils/request';

function getInfoByPath(params) {
  return request({
    url: '/system/menu/getInfoByPath',
    method: 'post',
    params
  });
}
function getButtons(params) {
  return request({
    url: '/system/menu/getButtons',
    method: 'post',
    params
  });
}

export { getInfoByPath, getButtons };
