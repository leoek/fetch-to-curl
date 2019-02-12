import {
  curlGenerator,
  generateMethod,
  generateHeader,
  generateUrl,
  generateBody,
  generateCompress
} from '../src/main';

describe('Generate method param', () => {
  test('No method', () => {
    expect(generateMethod({})).toEqual('');
  });
  test('POST', () => {
    const option = {
      method: 'post'
    };
    expect(generateMethod(option)).toEqual(' -X POST');
  });
  test('PUT', () => {
    const option = {
      method: 'Put'
    };
    expect(generateMethod(option)).toEqual(' -X PUT');
  });
  test('GET', () => {
    const option = {
      method: 'GET'
    };
    expect(generateMethod(option)).toEqual(' -X GET');
  });
  test('PATCH', () => {
    const option = {
      method: 'PATCH'
    };
    expect(generateMethod(option)).toEqual(' -X PATCH');
  });
  test('DELETE', () => {
    const option = {
      method: 'DELETE'
    };
    expect(generateMethod(option)).toEqual(' -X DELETE');
  });
  test('Unknown method', () => {
    const option = {
      method: 'xxxx'
    };
    expect(generateMethod(option)).toEqual('');
  });
});

describe('Generate header param', () => {
  test('No Header Option', () => {
    expect(generateHeader({})).toEqual('');
  });
  test('Has Header', () => {
    const option = {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0'
      }
    };
    const result = {
      isEncode: false,
      params:
        ' -H "Accept: application/json, text/plain, */*" -H "User-Agent: axios/0.18.0"'
    };
    expect(generateHeader(option)).toEqual(result);
  });
  test('Has Encoded Header', () => {
    const option = {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0',
        'accept-encoding': 'gzip'
      }
    };
    const result = {
      isEncode: true,
      params:
        ' -H "Accept: application/json, text/plain, */*" -H "User-Agent: axios/0.18.0" -H "accept-encoding: gzip"'
    };
    expect(generateHeader(option)).toEqual(result);
  });
});

describe('Generate body param', () => {
  test('No Body', () => {
    expect(generateBody()).toEqual('');
  });
  test('String Body', () => {
    expect(generateBody('a')).toEqual('--data-binary "a"');
  });
  test('Object Body', () => {
    const options = {
      test: 'test:',
      test2: 'lala'
    };
    expect(generateBody(options)).toEqual(
      '--data-binary {"test":"test:","test2":"lala"}'
    );
  });
});

describe('Generate Compress param', () => {
  test('No compression', () => {
    expect(generateCompress()).toEqual('');
  });
  test('Have compression', () => {
    expect(generateCompress(true)).toEqual('--compressed');
  });
});

describe('Curl generator', () => {
  test('Basic request', () => {
    const getOptions = {
      pathname: '/api/xrp_idr/ticker',
      hostname: 'vip.bitcoin.co.id',
      port: null,
      auth: undefined,
      agent: undefined,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0'
      },
      method: 'get',
      protocol: 'https:'
    };
    const result = `curl \"https://vip.bitcoin.co.id/api/xrp_idr/ticker\" -X GET -H \"Accept: application/json, text/plain, */*\" -H \"User-Agent: axios/0.18.0\"  `;
    expect(curlGenerator(getOptions)).toEqual(result);
  });

  test('single regex request', () => {
    const getOptions = {
      pathname: '/api/xrp_idr/ticker',
      hostname: 'vip.bitcoin.co.id',
      port: null,
      auth: undefined,
      agent: undefined,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0'
      },
      method: 'get',
      protocol: 'https:'
    };
    const result = `curl \"https://vip.bitcoin.co.id/api/xrp_idr/ticker\" -X GET -H \"Accept: application/json, text/plain, */*\" -H \"User-Agent: axios/0.18.0\"  `;
    expect(curlGenerator(getOptions, '', /api/)).toEqual(result);
  });

  test('array regex request', () => {
    const getOptions = {
      pathname: '/bbb/xrp_idr/ticker',
      hostname: 'vip.bitcoin.co.id',
      port: null,
      auth: undefined,
      agent: undefined,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0'
      },
      method: 'get',
      protocol: 'https:'
    };
    const result = `curl \"https://vip.bitcoin.co.id/bbb/xrp_idr/ticker\" -X GET -H \"Accept: application/json, text/plain, */*\" -H \"User-Agent: axios/0.18.0\"  `;
    expect(curlGenerator(getOptions, '', [/api/, /bbb/])).toEqual(result);
  });
  test('wrong regex', () => {
    const getOptions = {
      pathname: '/bbb/xrp_idr/ticker',
      hostname: 'vip.bitcoin.co.id',
      port: null,
      auth: undefined,
      agent: undefined,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0'
      },
      method: 'get',
      protocol: 'https:'
    };
    expect(curlGenerator(getOptions, '', /asd/)).toEqual('');
  });
  test('wrong multi regex', () => {
    const getOptions = {
      pathname: '/bbb/xrp_idr/ticker',
      hostname: 'vip.bitcoin.co.id',
      port: null,
      auth: undefined,
      agent: undefined,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/0.18.0'
      },
      method: 'get',
      protocol: 'https:'
    };
    expect(curlGenerator(getOptions, '', [/asd/, /xxx/])).toEqual('');
  });
})
