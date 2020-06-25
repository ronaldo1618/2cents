import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import StockCard from './StockCard';
import CryptoCard from './CryptoCard';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';

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
        })
      })
  }

  const settingStrArr = (userObjs) => {
    if(userObjs.length === 0) return
    for (let i = 0; i < userObjs.length; i++) {
      const trueOrFalse = userObjs[i].homePage
      const name = userObjs[i].name;
      namesArr.push(name)
      homePageValue.push(trueOrFalse)
    }
    if(props.objURL === 'stocks') {
      getStocks(namesArr).then(() => {
        setArr(objData)
        setIsDone(!isDone)
      })
    } else {
      let nameString = namesArr.join(',')
      apiManager.searchForCrypto(nameString).then(arrOfCryptos => {
        getStocks(arrOfCryptos)
        for (let i = 0; i < arrOfCryptos.length; i++) {
          const crypto = arrOfCryptos[i];
          crypto.homePage = homePageValue[i]
        }
        setArr(arrOfCryptos)
      })
    }
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

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <div className="search-jumbotron">
          <InputGroup className="mb-3">
            <Form.Control type="text" id="name" required onChange={e => {
              setIsSearched(false)
              setStr(e.target.value)}} placeholder={`Search for ${props.objURL}`}/>
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
            <Card.Body>
              <Card.Title>{searchedObj.name}</Card.Title>
              <Card.Text>Price: {searchedObj.price} {searchedObj.difference}({searchedObj.percentDifference}%)</Card.Text>
              <Card.Text>High: {searchedObj.high}</Card.Text>
              <Card.Text>Low: {searchedObj.low}</Card.Text>
              <Card.Text>Previous Closing Price: {searchedObj.previousClose}</Card.Text>
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
            <Card.Body>
              <Card.Title>Name: {searchedObj.name} / {searchedObj.id}</Card.Title>
              <Card.Text>Market Cap:{searchedObj.market_cap}</Card.Text>
              <Card.Text>Market Cap Change:{(searchedObj["1d"].market_cap_change_pct * 100).toFixed(2)}%</Card.Text>
              <Card.Text>Volume: {searchedObj["1d"].volume}</Card.Text>
              <Card.Text>Volume Change: {(searchedObj["1d"].volume_change_pct*100).toFixed(2)}%</Card.Text>
              <Card.Text>Price: {searchedObj.price}</Card.Text>
              <Card.Text>Price Change: {(searchedObj["1d"].price_change_pct * 100).toFixed(2)}%</Card.Text>
              <div>
                <Button type="button" onClick={() => saveObj(searchedObj.id)}>Save Crypto</Button>
                <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
              </div>
            </Card.Body>
          </Card>
        </Container> : null
      }
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
    </Container>
  )
}

export default ObjList;