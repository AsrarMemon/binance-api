require('isomorphic-fetch');

const BASE = 'https://api.binance.com';
const FUTURES = 'https://fapi.binance.com';
const crypto = require('crypto');

const sendResult = (call) =>{
    return call.then((res) => {
      console.log(res)
      // If response is ok, we can safely assume it is valid JSON
      if (res.ok) {
        return res.json();
      }
    });
}

const  makeQueryString = (q) => {
    return q ? "?".concat(Object.keys(q).map(function (k) {
      return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(q[k]));
    }).join('&')) : '';
};

/**
 * Make public calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */

const publicCall = (info, path, data) => {
    const method = info.method;
    const headers = info.headers;
    return sendResult(fetch("".concat(!path.includes('/fapi') ? BASE : FUTURES).concat(path).concat(makeQueryString(data)), {
        method: method,
        json: true,
        headers: headers
    }));
};

  /**
   * Factory method for private calls against the api
   *
   * @param {string} path Endpoint path
   * @param {object} data The payload to be sent
   * @param {string} method HTTB VERB, GET by default
   * @param {object} headers
   * @returns {object} The api response
   */
  
const privateCall = (ref, data, method, noData, noExtra) => {
  const apiKey = ref.apiKey,
        apiSecret = ref.apiSecret,
        ref$getTime = ref.getTime,
        path = ref.path,
        getTime = ref$getTime === void 0 ? defaultGetTime : ref$getTime,
        pubCall = ref.pubCall;
      if (!apiKey || !apiSecret) {
        throw new Error('You need to pass an API key and secret to make authenticated calls.');
      }
      return (data && data.useServerTime ? publicCall({method: 'GET'}, '/api/v3/time').then(function (r) {
        return r.serverTime;
      }) : Promise.resolve(12345)).then(function (timestamp) {
        if (data) {
          delete data.useServerTime;
        }
  
        const timestamp1 = {
          timestamp: timestamp
        };
        const merged = {...data, ...timestamp1}
        console.log(merged)
        console.log(makeQueryString(merged).substr(1))
        const signature = crypto.createHmac('sha256', apiSecret).update(makeQueryString(merged).substr(1)).digest('hex');
  
        const stimestamp = {
          timestamp: timestamp,
          signature: signature
        };

        const merged1 = {...data, ...stimestamp}
        const newData = noExtra ? data : merged1;
        return sendResult(fetch("".concat(!path.includes('/fapi') ? BASE : FUTURES)
        .concat(path).concat(noData ? '' : makeQueryString(newData)), {
          method: method,
          headers: {
            'X-MBX-APIKEY': apiKey
          },
          json: true
        }));
      });
  };


const ping =  () => {
    return publicCall({ method: 'GET'}, '/fapi/v1/time', {});
}

const positionRisk = () => {
  return privateCall({ 
    apiKey: 'EgkbhO9iCwd5X4Vx3VBe7gBFLPQG8Tterp7Y2ZjYpEcE0BfmD9WwLJSbTvtKpIDV', 
    apiSecret: 'MpoNa8XpVKDty88wfoAxkRZFxP36MgSAtJDQPuOzmeLLt65zfr3phWuCg1Gr14M6',
    path: '/fapi/v2/positionRisk',
    getTime: Date.now()
 }, {useServerTime: true}, 'GET')
}

module.exports = {
    ping,
    positionRisk
}