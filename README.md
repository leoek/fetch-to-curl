[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
![Tests & Build](https://github.com/leoek/fetch-to-curl/workflows/Test%20&%20Build/badge.svg)

# fetch request to curl

This module was inspired by [http-to-curl](https://github.com/drgx/http-to-curl). Use it to generate curl requests with the inputs you would usually use for javascripts fetch. However it does not patch any modules like http-to-curl. It is just a wrapper to generate the curl string. This ensures that there are no side effects with your actual usage of fetch.

Also note that the goal of this library is to be as simple and minimal as possible. This also means that there are zero dependencies :tada:

## Installation

```sh
yarn add fetch-to-curl
```

or

```sh
npm install fetch-to-curl
```

## Usage

```js
import fetchToCurl from 'fetch-to-curl';
// or In case there is no support for Es Modules in your environment:
// const { fetchToCurl } = require("fetch-to-curl")

const url = 'https://jsonplaceholder.typicode.com/posts/1';
const options = {
  headers: {
    Authorization: "BASIC SOMEBASE64STRING"
  },
  method: 'get'
};
// Log yopur request
console.log(fetchToCurl(url, options));
// Do your request
fetch(url, options);

// Output
curl "https://jsonplaceholder.typicode.com/posts/1" -X GET -H "Authorization: BASIC SOMEBASE64STRING"

// You can also pass a single Request object 
console.log(fetchToCurl({
  url: "https://jsonplaceholder.typicode.com/posts/1"
  headers: {
    Authorization: "BASIC SOMEBASE64STRING"
  },
  method: 'get'
}));

// and/or a Headers object as you would to with fetch
console.log(fetchToCurl({
  url: "https://jsonplaceholder.typicode.com/posts/1"
  headers: new Headers({
    Authorization: "BASIC SOMEBASE64STRING"
  }),
  method: 'get'
}))

```

## Playgorund and usage without package manager

There is a minimal example of usage without package manager available which allows to [directly test this in the browser console](https://leoek.github.io/fetch-to-curl/playground.html). [(view source - playground.html)](https://github.com/leoek/fetch-to-curl/blob/master/playground.html)
