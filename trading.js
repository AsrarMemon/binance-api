const Binance = require('binance-api-node').default
const Sntp = require('sntp');

const binanceApi = require('./binance-api');
const fs = require('fs');
 
console.log(Binance)
const client = Binance()
 
// Authenticated client, can make signed calls

 
try {

    Sntp.time({
        host: 'pool.ntp.org',
        port: 123,
        resolveReference: true,
        timeout: 1000
      })
      .then( async (time) => {
        const offset = parseInt(time.t, 10);
        const client2 = Binance({
            apiKey: 'ICSHMZU0SRLObrijRiFjwPWyomb7BpTuRHuFeyJX1KT0YMHCowvEvpoQ8xvUxG2G',
            apiSecret: 'G7Oq0QAgonTsVhlSz6A7DttaczIAozXCxkm1MIxGqNkJ5I6SIzBKVCzPnMwy140i',
            getTime: Date.now()
        })
        // const data = await binanceApi.ping();
        const data = await binanceApi.positionRisk();

        fs.writeFileSync('./positionRisk', JSON.stringify(data))
        // {timeOffset: offset}
        // client2.accountInfo({'useServerTime': true}).then(time =>  {
        //     for(let obj of time.balances) {
        //         if(Number(obj.locked) > 0 || Number(obj.free) > 0) {
        //             console.log(obj);
        //         }
        //     }
        //   });
        // client2.exchangeInfo().then(data => {
        //     for(let s of data.symbols) {
        //         if(s.baseAsset === 'BNB' || s.quoteAsset === 'IOTA' ) {
        //             console.log(s.symbol + '...............'+ s.baseAsset + '.............' + s.quoteAsset)   
        //         }
                
        //     }
        // })
        
      });
    
} catch(e) {
    console.log(e)
}
