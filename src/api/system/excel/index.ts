import request from '@/utils/request';

function exportCommonExcel(params, data) {
  return request({
    url: '/system/excel/export',
    method: 'post',
    responseType: 'blob',
    params,
    data
  });
}

export { exportCommonExcel };
