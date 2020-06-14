import key from './APIkeys';
const remoteURL = 'http://localhost:5002'
const nomicsKey = key.nomicsKey

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
  getTotalFinancesWithAllFinances(year, month, userId) {
    return fetch(`${remoteURL}/totalFinances/?userId=${userId}&month=${month}&year=${year}&_embed=finances`).then(result => result.json())
  },
  getTotalFinances(id) {
    return fetch(`${remoteURL}/totalFinances/${id}?_embed=finances`).then(result => result.json())
  },
  searchForCrypto(name) {
    return fetch(`https://api.nomics.com/v1/currencies/ticker?key=${nomicsKey}&ids=${name}&interval=1h,1d&convert=USD`).then(result => result.json())
  }
}