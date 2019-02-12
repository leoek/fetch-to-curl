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
export function generateHeader(options) {
  const headers = options.headers;
  let isEncode = false;
  if (!headers) return '';
  let headerParam = '';
  Object.keys(headers).map((val, key) => {
    if (val.toLocaleLowerCase() !== 'content-length') {
      headerParam += ` -H "${val}: ${headers[val].replace(/(\\|")/g, '\\$1')}"`;
    }
    if (val.toLocaleLowerCase() === 'accept-encoding') {
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
export const fetchToCurl = (url, options) => {
  const { body } = options;
  const headers = generateHeader(options);
  return `curl ${url}${generateMethod(options)}${headers.params}${generateBody(body)}${generateCompress(headers.isEncode)}`;
}

export default fetchToCurl;
