/**
 * 去除空参数
 * @param {pnject} obj 参数
 */
export function filterEmptyData(obj) {
  for (let prop in obj) {
    if (obj[prop] === '' || obj[prop] === null || obj[prop] === undefined) {
      delete obj[prop];
    } else {
      encodeURI(obj[prop]);
    }
  }
  return obj;
}
