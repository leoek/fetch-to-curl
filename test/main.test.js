import {
  isInstanceOfHeaders,
  generateMethod,
  generateHeader,
  generateBody,
  generateCompress,
  fetchToCurl
} from '../src/main';

const checkGeneratedHeadersResult = (generated, expectedHeaders, expectedEncoding) => {
  expect(generated).toHaveProperty("isEncode");
  expect(generated).toHaveProperty("params");
  expect(generated.isEncode).toBe(expectedEncoding);
  expect(generated.params).toMatch(new RegExp('( -H ".*?: .*?")+'))
  Object.entries(expectedHeaders).forEach(([name, value]) => {
    expect(generated.params.includes(`-H "${name}: ${value}"`) || generated.params.includes(`-H "${name.toLowerCase()}: ${value}"`)).toBeTruthy();
  })
}

describe('Environment wich supports Headers', () => {
  test('isInstanceOfHeaders detects Headers object correctly', () => {
    expect(isInstanceOfHeaders(new Headers())).toBeTruthy();
  });
  test('isInstanceOfHeaders detects plain js object correctly', () => {
    expect(isInstanceOfHeaders({})).toBeFalsy();
  });
  test('isInstanceOfHeaders detects falsy values correctly', () => {
    expect(isInstanceOfHeaders(null)).toBeFalsy();
    expect(isInstanceOfHeaders()).toBeFalsy();
  });
})


describe('Environment wich does not support Headers', () => {
  const originalHeaders = Headers;
  beforeEach(() => {
    delete global.Headers
  })
  afterEach(() => {
    global.Headers = originalHeaders;
  })
  test('isInstanceOfHeaders returns false if Headers constructor is not available', () => {
    expect(isInstanceOfHeaders({})).toBeFalsy()
  });
})

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
  test('HEAD', () => {
    const option = {
      method: 'HEAD'
    };
    expect(generateMethod(option)).toEqual(' -X HEAD');
  });
  test('OPTIONS', () => {
    const option = {
      method: 'OPTIONS'
    };
    expect(generateMethod(option)).toEqual(' -X OPTIONS');
  });
  test('Unknown method', () => {
    const option = {
      method: 'xxxx'
    };
    expect(generateMethod(option)).toEqual('');
  });
});

describe('Generate header param', () => {
  test('No Header Options', () => {
    expect(generateHeader()).toEqual({
      isEncode: false,
      params: ""
    });
  });

  test('Empty Header Options', () => {
    expect(generateHeader({})).toEqual({
      isEncode: false,
      params: ""
    });
  });

  const testHeaders = {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'axios/0.18.0',
    'X-Test': "TestVal"
  }

  const testHeadersWithEncoding = {
    ...testHeaders,
    'accept-encoding': 'gzip',
  }

  const testHeadersWithContentLength = {
    ...testHeaders,
    'content-length': "12345"
  }

  test('correctly parses Headers from object without encoding', () => {
    checkGeneratedHeadersResult(generateHeader({
      headers: testHeaders
    }), testHeaders, false)
  });

  test('correctly parses Headers from object with encoding', () => {
    checkGeneratedHeadersResult(generateHeader({
      headers: testHeadersWithEncoding
    }), testHeadersWithEncoding, true)
  });

  test('omits content-length Header when parsing headers from object', () => {
    checkGeneratedHeadersResult(generateHeader({
      headers: testHeadersWithContentLength
    }), testHeaders, false)
  });

  test('correctly parses Headers without encoding', () => {
    checkGeneratedHeadersResult(generateHeader({
      headers: new Headers(testHeaders)
    }), testHeaders, false)
  });

  test('correctly parses Headers with encoding', () => {
    checkGeneratedHeadersResult(generateHeader({
      headers: new Headers(testHeadersWithEncoding)
    }), testHeadersWithEncoding, true)
  });

  test('omits content-length Header when parsing headers from Headers object', () => {
    checkGeneratedHeadersResult(generateHeader({
      headers: new Headers(testHeadersWithContentLength)
    }), testHeaders, false)
  });
});

describe('Generate body param', () => {
  test('No Body', () => {
    expect(generateBody()).toEqual('');
  });
  test('String Body', () => {
    expect(generateBody('a')).toEqual(" --data-binary 'a'");
  });
  test('Number Body', () => {
    expect(generateBody(12345)).toEqual(" --data-binary '12345'");
  });
  test('Object Body', () => {
    const options = {
      test: 'test:',
      testNumber: 12345,
      testDate: new Date(1609251707077),
      testQuotes: `'test'`
    };
    expect(generateBody(options)).toEqual(
      ` --data-binary '{"test":"test:","testNumber":12345,"testDate":"2020-12-29T14:21:47.077Z","testQuotes":"'\\''test'\\''"}'`
    );
  });
});

describe('Generate Compress param', () => {
  test('No compression', () => {
    expect(generateCompress()).toEqual('');
  });
  test('Have compression', () => {
    expect(generateCompress(true)).toEqual(' --compressed');
  });
});

describe('fetchToCurl', () => {
  test('url string and empty options', () => {
    expect(
      fetchToCurl('google.com', {})
    ).toEqual("curl 'google.com'");
  });

  test('url object and empty options', () => {
    expect(
      fetchToCurl(new URL('https://google.com/'), {})
    ).toEqual("curl 'https://google.com/'");
  });

  test('url string and no options', () => {
    expect(
      fetchToCurl('google.com')
    ).toEqual("curl 'google.com'");
  });

  test('url string and Request Object', () => {
    expect(
      fetchToCurl('google.com', { method: "POST" })
    ).toEqual("curl 'google.com' -X POST");
  });

  test('Request Object only', () => {
    expect(
      fetchToCurl({ url: "google.com", method: "POST" })
    ).toEqual("curl 'google.com' -X POST");
  });

  test('No Parameters', () => {
    expect(
      fetchToCurl()
    ).toEqual("curl 'undefined'");
  });
});
