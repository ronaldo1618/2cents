import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import StockCard from './StockCard';
import CryptoCard from './CryptoCard';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react'

const ObjList = props => {
  const [str, setStr] = useState('');
  const [arr, setArr] = useState([]);
  const [searchedObj, setSearchedObj] = useState({})
  const [isSearched, setIsSearched] = useState(false);
  const [isDone, setIsDone] = useState(false);
  let namesArr = []
  let objData = []
  let homePageValue = []

  const search = e => {
    e.preventDefault();
    // setStr('')
    setValue('')
    if(str === '') return alert('no input was found')
    if(props.objURL === 'stocks') {
      apiManager.searchForStock(str).then(stockData => {
        if(!stockData.c) return alert('nothing was found for stocks')
        const newSearchedStock = {
          name: str,
          price: stockData.c,
          high: stockData.h,
          low: stockData.l,
          previousClose: stockData.pc,
          difference: (stockData.c - stockData.pc).toFixed(2),
          percentDifference: ((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)
        }
        setSearchedObj(newSearchedStock)
        setIsSearched(!isSearched)
      })
    } else {
      apiManager.searchForCrypto(str).then(cryptoData => {
        if(!cryptoData[0]) return alert('nothing was found for cryptos')
        setSearchedObj(cryptoData[0])
        setIsSearched(!isSearched)
      })
    }
  }

  const saveObj = objId => {
    console.log(str, objId, value)
    const savedObj = {
      name: objId,
      userId: props.userId,
      homePage: false
    }
    apiManager.post(props.objURL, savedObj).then(() => {
        setIsSearched(!isSearched)
      }).then(() => {
        apiManager.getByUserId(props.objURL, props.userId).then(userObjs => {
          settingStrArr(userObjs)
          setStr('')
        })
      })
  }

  const [nothingToShow, setNothingToShow] = useState(false);

  const settingStrArr = (userObjs) => {
    if(userObjs.length === 0) return setNothingToShow(!nothingToShow)
    let sorted = userObjs.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    for (let i = 0; i < userObjs.length; i++) {
      const trueOrFalse = userObjs[i].homePage
      const name = userObjs[i].name;
      namesArr.push(name)
      homePageValue.push(trueOrFalse)
    }
    let nameString = namesArr.join(',')
    if(props.objURL === 'stocks') {
      getStocks(namesArr).then(() => {
        setArr(objData)
        setNothingToShow(false)
      })
    } else {
      getCryptos(nameString).then(() => {
        setArr(cryptoObjData.sort((a, b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0)))
        setNothingToShow(false)
      })
    }
  }

  let cryptoObjData = []

  async function getCryptos(nameString) {
    const result = await apiManager.searchForCrypto(nameString).then(arrOfCryptos => {
      let arr = arrOfCryptos.sort()
      for (let i = 0; i < arrOfCryptos.length; i++) {
        const crypto = arrOfCryptos[i];
        crypto.homePage = homePageValue[i]
        cryptoObjData.push(crypto)
      }
    })
  }

  async function getStocks(namesArr) {
    for (let i = 0; i < namesArr.length; i++) {
      const name = namesArr[i];
      try {
        await apiManager.searchForStock(name).then(stockData => {
          const stockObj = {
            name: name,
            homePage: homePageValue[i],
            price: stockData.c,
            high: stockData.h,
            low: stockData.l,
            previousClose: stockData.pc,
            difference: (stockData.c - stockData.pc).toFixed(2),
            percentDifference: ((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)
          }
          objData.push(stockObj)
        })
      }
      catch (e) {
        console.error(e.message);
      }
    }
  }

  useEffect(() => {
    apiManager.getByUserId(props.objURL, props.userId).then(userObjs => settingStrArr(userObjs))
  }, [props.userId])

  const deleteObj = id  => {
    apiManager.getByUserIdAndName(props.objURL, id, props.userId).then(obj => {
      apiManager.delete(props.objURL, obj[0].id).then(() => {
        apiManager.getByUserId(props.objURL, props.userId).then(userObjs => settingStrArr(userObjs))
      })
    })
  }

  const saveToHomePage = id => {
    apiManager.getByUserId(props.objURL, props.userId).then(arrOfObjs => {
      let trueArr = []
      arrOfObjs.forEach(obj => {
      if(obj.homePage === true) trueArr.push(obj.homePage)
      });
      apiManager.getByUserIdAndName(props.objURL, id, props.userId).then(obj => {
        obj[0].homePage = true
        apiManager.put(props.objURL, obj[0]).then(() => {
          apiManager.getByUserId(props.objURL, props.userId).then(userObjs => settingStrArr(userObjs))
        })
      })
      }
    )
  }

  const unSaveFromHomePage = id => {
    apiManager.getByUserIdAndName(props.objURL, id, props.userId).then(obj => {
      obj[0].homePage = false
      apiManager.put(props.objURL, obj[0]).then(obj => {
        apiManager.getByUserId(props.objURL, props.userId).then(userObjs => settingStrArr(userObjs))
      })
    })
  }

  const [value, setValue] = useState('')

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <div className="search-jumbotron">
          <InputGroup className="mb-3">
            <Form.Control type="text" id="name" required onChange={e => {
              setIsSearched(false)
              setValue(e.target.value)
              setStr(e.target.value)}} value={value} placeholder={`Search for ${props.objURL}`}/>
            <InputGroup.Append>
              <Button type="button" onClick={search}>Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
      {
        isSearched && props.objURL === 'stocks' ?
        <Container className="search-result-container">
          <Card className="search-result-card">
          <Card.Body className="stock-crypto-card">
            <Card.Title>{searchedObj.name}</Card.Title>
            <Card.Text>
              Price:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj.price)}
              <Icon name={`${searchedObj.difference > 0 ? "arrow up" : "arrow down"}`} className={`${searchedObj.difference > 0 ? "arrow-up" : "arrow-down"}`}/>
              <span className={`number-is-${searchedObj.difference > 0 ? "positive" : "negative"}`}>{searchedObj.difference}</span>
              (<span className={`number-is-${searchedObj.percentDifference > 0 ? "positive" : "negative"}`}>{searchedObj.percentDifference}</span>%)
            </Card.Text>
            <Card.Text>
              High:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj.high)}
            </Card.Text>
            <Card.Text>
              Low:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj.low)}
            </Card.Text>
            <Card.Text>
              Previous Closing Price:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj.previousClose)}
            </Card.Text>
            </Card.Body>
            <div>
              <Button type="button" onClick={() => saveObj(str)}>Save Stock</Button>
              <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
            </div>
          </Card>
        </Container> 
        : null
      }
      {
        isSearched && props.objURL === 'cryptos' ?
        <Container className="search-result-container">
          <Card className="search-result-card">
          <Card.Body className="stock-crypto-card">
            <Card.Title>
              {searchedObj.name} / {searchedObj.id}
            </Card.Title>
            <Card.Text>
              Market Cap:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj.market_cap)}
              <Icon name={`${searchedObj["1d"].market_cap_change_pct * 100 > 0 ? "arrow up" : "arrow down"}`} className={`${searchedObj["1d"].market_cap_change_pct * 100 > 0 ? "arrow-up" : "arrow-down"}`}/>
              <span className={`number-is-${searchedObj["1d"].market_cap_change_pct * 100 > 0 ? "positive" : "negative"}`}>{(searchedObj["1d"].market_cap_change_pct * 100).toFixed(2)}</span>%
            </Card.Text>
            <Card.Text>
              Volume:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj["1d"].volume)}
              <Icon name={`${searchedObj["1d"].volume_change_pct * 100 > 0 ? "arrow up" : "arrow down"}`} className={`${searchedObj["1d"].volume_change_pct * 100 > 0 ? "arrow-up" : "arrow-down"}`}/>
              <span className={`number-is-${searchedObj["1d"].volume_change_pct * 100 > 0 ? "positive" : "negative"}`}>{(searchedObj["1d"].volume_change_pct * 100).toFixed(2)}</span>%
            </Card.Text>
            <Card.Text>
              Price:{" "} {new Intl.NumberFormat("eng", {style: "currency", currency: "USd"}).format(searchedObj.price)}
              <Icon name={`${searchedObj["1d"].price_change_pct * 100 > 0 ? "arrow up" : "arrow down"}`} className={`${searchedObj["1d"].price_change_pct * 100 > 0 ? "arrow-up" : "arrow-down"}`}/>
              <span className={`number-is-${searchedObj["1d"].price_change_pct * 100 > 0 ? "positive" : "negative"}`}></span>
              <span className={`number-is-${searchedObj["1d"].price_change_pct * 100 > 0 ? "positive" : "negative"}`}>{(searchedObj["1d"].price_change_pct * 100).toFixed(2)}</span>%
              </Card.Text>
              <div>
                <Button type="button" onClick={() => saveObj(str)}>Save Crypto</Button>
                <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
              </div>
            </Card.Body>
          </Card>
        </Container> : null
      }
      {
        !nothingToShow ?
        <>
        {
          props.objURL === 'cryptos' ?
          <div className="">
          {arr.map(crypto => <CryptoCard key={crypto.id} cryptoObj={crypto} homePage={crypto.homePage} deleteCrypto={deleteObj} saveToHomePage={saveToHomePage} unSaveFromHomePage={unSaveFromHomePage} {...props}/>)}
          </div>
          : null
        }
        {
          props.objURL === 'stocks' ?
          <div className="">
          {arr.map(stock => <StockCard key={stock.name} searchedObj={stock} deleteObj={deleteObj} 
          saveToHomePage={saveToHomePage} unSaveFromHomePage={unSaveFromHomePage} {...props}/>)}
          </div>
          : null
        }
        </> : null
      }
    </Container>
  )
}

export default ObjList;