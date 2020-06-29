import key from './APIkeys';
const remoteURL = 'http://localhost:5002'
const nomicsKey = key.nomicsKey
const finnhubKey = key.finnhubKey

export default {
  get(collection) {
    return fetch(`${remoteURL}/${collection}`).then(data => data.json())
  },
  getById(collection, id) {
    return fetch(`${remoteURL}/${collection}/${id}`).then(data => data.json());
  },
  getByUserId(collection, id) {
    return fetch(`${remoteURL}/${collection}/?userId=${id}`).then(result => result.json());
  },
  getByUserIdAndName(collection, name, userId) {
    return fetch(`${remoteURL}/${collection}/?userId=${userId}&name=${name}`).then(result => result.json());
  },
  post(collection, obj) {
    return fetch(`${remoteURL}/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(data => data.json())
  },
  put(collection, obj) {
    return fetch(`${remoteURL}/${collection}/${obj.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(data => data.json())
  },
  delete(collection, id) {
    return fetch(`${remoteURL}/${collection}/${id}`, {
      method: 'DELETE'
    }).then(result => result.json())
  },
  deleteByName(collection, name, userId) {
    console.log(name, userId)
    return fetch(`${remoteURL}/${collection}/?userId=${userId}&name=${name}`, {
      method: 'DELETE'
    }).then(result => result.json())
  },
  getTotalFinancesWithAllFinances(year, month, userId) {
    return fetch(`${remoteURL}/totalFinances/?userId=${userId}&month=${month}&year=${year}&_embed=finances`).then(result => result.json())
  },
  getTotalFinances(id) {
    return fetch(`${remoteURL}/totalFinances/${id}?_embed=finances`).then(result => result.json())
  },
  searchForCrypto(name) {
    return fetch(`https://api.nomics.com/v1/currencies/ticker?key=${nomicsKey}&ids=${name}&interval=1d&convert=USD`).then(result => result.json())
  },
  searchForStockProfile(name) {
    return fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${name}&token=${finnhubKey}`).then(result => result.json())
  },
  searchForStock(name) {
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${name}&token=${finnhubKey}`).then(result => result.json())
  },
  getByHomePage(collection, userId) {
    return fetch(`${remoteURL}/${collection}/?userId=${userId}&homePage=true`).then(result => result.json());
  },
  getStockNews() {
    return fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`).then(result => result.json());
  },
  getCryptoNews() {
    return fetch(`https://finnhub.io/api/v1/news?category=crypto&token=${finnhubKey}`).then(result => result.json());
  },
  getStockCompanyNews(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/company-news?symbol=${company}&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  get1DGraphForStock(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${company}&resolution=1&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  get1WGraphForStock(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${company}&resolution=5&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  get1MGraphForStock(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${company}&resolution=30&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  get1DGraphForCrypto(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/stock/candle?symbol=BINANCE:${company}USDT&resolution=1&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  get1WGraphForCrypto(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/stock/candle?symbol=BINANCE:${company}USDT&resolution=5&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  get1MGraphForCrypto(company, startDate, endDate) {
    return fetch(`https://finnhub.io/api/v1/stock/candle?symbol=BINANCE:${company}USDT&resolution=30&from=${startDate}&to=${endDate}&token=${finnhubKey}`).then(result => result.json());
  },
  getByUserIdAndSearchTerm(collection, id, search) {
    return fetch(`${remoteURL}/${collection}/?userId=${id}&q=${search}`).then(result => result.json());
  }
}