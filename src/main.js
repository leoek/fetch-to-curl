/**
 * see https://fetch.spec.whatwg.org/#methods
 *
 * @export
 * @param {any} options
 * @returns {string}
 */
export const generateMethod = (options) => {
  const method = options.method;
  if (!method) return '';
  const type = {
    GET: ' -X GET',
    POST: ' -X POST',
    PUT: ' -X PUT',
    PATCH: ' -X PATCH',
    DELETE: ' -X DELETE',
    HEAD: ' -X HEAD',
    OPTIONS: ' -X OPTIONS'
  };
  return type[method.toUpperCase()] || '';
}

/**
 * @typedef {Object} Headers
 * @property {Boolean} isEncode - A flag which is set to true if the request should set the --compressed flag
 * @property {String} params - The header params as string
 */

/**
 *
 *
 * @export
 * @param {any} options
 * @returns {Headers} An Object with the header info
 */
export const generateHeader = (options = {}) => {
  const { headers = {} } = options;
  let isEncode = false;
  let headerParam = '';
  Object.keys(headers).map(val => {
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
export const fetchToCurl = (url, options = {}) => {
  const { body } = options;
  const headers = generateHeader(options);
  return `curl "${url}"${generateMethod(options)}${headers.params || ''}${generateBody(body)}${generateCompress(headers.isEncode)}`;
}

export default fetchToCurl;
