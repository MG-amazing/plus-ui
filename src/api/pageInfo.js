import request from '@/utils/request';

function getButtonByPath(params) {
  return request({
    url: '/system/menu/getbuttonbypath',
    method: 'post',
    params
  });
}

export { getButtonByPath };
