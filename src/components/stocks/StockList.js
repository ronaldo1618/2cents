import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import StockCard from './StockCard';
import CryptoCard from '../cryptos/CryptoCard';
import { Container, Jumbotron, Form, Button } from 'react-bootstrap';

const StockList = props => {
  const [str, setStr] = useState('');
  const [arr, setArr] = useState([]);
  const [searchedObj, setSearchedObj] = useState({})
  const [isSearched, setIsSearched] = useState(false);
  let namesArr = []
  let objData = []


  const search = e => {
    e.preventDefault();
    if(str === '') return alert('no input was found')
    if(props.objURL === 'stocks') {
      apiManager.searchForStock(str).then(stockData => {
        setSearchedObj(stockData["Global Quote"])
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
      userId: props.userId
    }
    apiManager.post(props.objURL, savedObj).then(() => {
      apiManager.get(props.objURL.then(() => {
          setIsSearched(!isSearched)
          settingStrArr()
      })
      )
    })
  }

  const settingStrArr = () => {
    apiManager.get(props.objURL, props.userId).then(userObjs => {
      for (let i = 0; i < userObjs.length; i++) {
        const name = userObjs[i].name;
        namesArr.push(name)
      }
      if(props.objURL === 'stocks') {
        for (let i = 0; i < namesArr.length; i++) {
          const name = namesArr[i];
          apiManager.searchForStock(name).then(data => {
            objData.push(data["Global Quote"])
            console.log("data", data["Global Quote"])
            console.log(objData, "objData now")
          })
        }
        console.log("objData", objData)
      } else {
        let nameString = namesArr.join(',')
        apiManager.searchForCrypto(nameString).then(setArr)
      }
    })
  }

  useEffect(() => {
    settingStrArr()
  }, [])

  const deleteObj = id  => {
    apiManager.getByUserIdAndName(props.objURL, id, props.userId).then(obj => {
      console.log(obj)
      // apiManager.delete(props.objURL, )
    })
  }

  return (
    <Container>
      <Jumbotron>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="search">Stock Name</Form.Label>
            <Form.Control type="text" id="name" required onChange={e => {
              setIsSearched(false)
              setStr(e.target.value)}} placeholder={`Search for ${props.objURL}`}/>
          </Form.Group>
          <Button type="button" onClick={search}>Search</Button>
        </Form>
      </Jumbotron>
      {
        isSearched && props.objURL === 'stocks' ?
        <Container>
          {console.log("we made it", searchedObj)}
          <h1>{searchedObj["01. symbol"]}</h1>
          <p>Price: ${searchedObj["05. price"]} {searchedObj["09. change"]}({searchedObj["10. change percent"]}%)</p>
          <p>Open Price: ${searchedObj["02. open"]}</p>
          <p>High: ${searchedObj["03. high"]}</p>
          <p>Low: ${searchedObj["04. low"]}</p>
          <p>Volume: ${searchedObj["06. volume"]}</p>
          <p>Prvious Close: ${searchedObj["08. previous close"]}</p>
          <Button type="button" onClick={() => saveObj(searchedObj.id)}>Save Stock</Button>
          <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
        </Container> 
        : null
      }
      {
        isSearched && props.objURL === 'cryptos' ?
        <Container>
          <h1>Name: {searchedObj.name} / {searchedObj.id}</h1>
          <p>Market Cap:{searchedObj.market_cap}</p>
          <p>Market Cap Change:{(searchedObj["1d"].market_cap_change_pct * 100).toFixed(2)}%</p>
          <p>Volume: {searchedObj["1d"].volume}</p>
          <p>Volume Change: {(searchedObj["1d"].volume_change_pct*100).toFixed(2)}%</p>
          <p>Price: {searchedObj.price}</p>
          <p>Price Change: {(searchedObj["1d"].price_change_pct * 100).toFixed(2)}%</p>
          <Button type="button" onClick={() => saveObj(searchedObj.id)}>Save Crypto</Button>
          <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
        </Container> : null
      }
      {
        props.objURL === 'cryptos' ?
        <>
        {arr.map(crypto => <CryptoCard key={crypto.id} cryptoObj={crypto} deleteCrypto={deleteObj} {...props}/>)
        }
        </>
        :
        <>
        {console.log("entered", objData)}
        {objData.map(stock => <StockCard key={stock["01. symbol"]} searchedObj={stock} deleteObj={deleteObj} {...props}/>)}
        </>
      }
    </Container>
  )
}

export default StockList;