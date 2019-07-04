/**
 *
 *
 * @export
 * @param {any} options
 * @returns {string}
 */
export function generateMethod(options) {
  const method = options.method;
  if (!method) return '';
  const type = {
    GET: ' -X GET',
    POST: ' -X POST',
    PUT: ' -X PUT',
    PATCH: ' -X PATCH',
    DELETE: ' -X DELETE',
  };
  const methodParam = type[method.toUpperCase()];
  return methodParam ? methodParam : '';
}

/**
 *
 *
 * @export
 * @param {any} options
 * @returns {string}
 */
export function generateHeader(headers) {
  let isEncode = false;
  if (!headers) return '';
  let headerParam = '';
  headers.forEach((val, key) => {
    console.log()
    if (key.toLocaleLowerCase() !== 'content-length') {
      headerParam += ` -H "${key}: ${val.replace(/(\\|")/g, '\\$1')}"`;
    }
    if (key.toLocaleLowerCase() === 'accept-encoding') {
      isEncode = true;
    }
  });
  return {
    params: headerParam,
    isEncode,
  };
}

/**
 *
 *
 * @export
 * @param {Object} body
 * @returns {string}
 */
export function generateBody(body) {
  if (!body) return '';
  return ` --data-binary ${JSON.stringify(body)}`;
}

/**
 *
 *
 * @export
 * @param {boolean} isEncode
 * @return {string}
 */
export function generateCompress(isEncode) {
  return isEncode ? ' --compressed' : '';
}

/**
 *
 *
 * @export
 * @param {string} url
 * @param {Object} options
 * @param {string} [options.body]
 */
const fetchToCurl = (requestInfo, requestInit) => {
  const url = typeof requestInfo === 'string' ? requestInfo : requestInfo.url;
  const options = typeof requestInfo === 'string' ? requestInit : requestInfo;
  const fetchHeaders = options.headers ?
    (typeof options.headers.forEach === 'function' ? options.headers : new Headers(options.headers)) :
    null;

  const { body } = options;
  const headers = generateHeader(fetchHeaders);
  return `curl ${url}${generateMethod(options)}${headers.params}${generateBody(body)}${generateCompress(headers.isEncode)}`;
}

export default fetchToCurl;
