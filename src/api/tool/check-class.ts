import request from '@/utils/request';

function checkClass(params) {
  return request({
    url: '/demo/checkLeg/nameCheck',
    method: 'post',
    params
  });
}

export { checkClass };
