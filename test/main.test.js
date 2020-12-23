import {
  curlGenerator,
  generateMethod,
  generateHeader,
  generateUrl,
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
});

describe('Generate body param', () => {
  test('No Body', () => {
    expect(generateBody()).toEqual('');
  });
  test('String Body', () => {
    expect(generateBody('a')).toEqual(' --data-binary "a"');
  });
  test('Object Body', () => {
    const options = {
      test: 'test:',
      test2: 'lala'
    };
    expect(generateBody(options)).toEqual(
      ' --data-binary {"test":"test:","test2":"lala"}'
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
  test('url and empty options', () => {
    expect(
      fetchToCurl('google.com', {})
    ).toEqual('curl "google.com"');
  });

  test('url and no options', () => {
    expect(
      fetchToCurl('google.com')
    ).toEqual('curl "google.com"');
  });

  test('url and Request Object', () => {
    expect(
      fetchToCurl('google.com', { method: "POST" })
    ).toEqual('curl "google.com" -X POST');
  });

  test('Request Object only', () => {
    expect(
      fetchToCurl({ url: "google.com", method: "POST" })
    ).toEqual('curl "google.com" -X POST');
  });
});
