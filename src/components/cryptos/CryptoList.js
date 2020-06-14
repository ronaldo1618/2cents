import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import CryptoCard from './CryptoCard';
import { Container, Jumbotron, Form, Button } from 'react-bootstrap';

const CryptoList = props => {
  const [crypto, setCrypto] = useState('');
  const [cryptosArr, setCryptosArr] = useState([]);
  const [searchedCrypto, setSearchedCrypto] = useState({});
  const [isSearched, setIsSearched] = useState(false);
  
  useEffect(() => {
    apiManager.get('cryptos', props.userId).then(userCryptos => {
      if(!userCryptos) return alert('nothing was found')
      // may not need the code above or below this
      // getCryptos(userCryptos)
      let cryptos = []
      console.log("hello", userCryptos)
      for (let i = 0; i < userCryptos.length; i++) {
        const crypto = userCryptos[i];
        console.log(crypto)
        cryptos.push(crypto)
        console.log(cryptos)
      }
      console.log(cryptos)
      console.log(cryptosArr)
      return setCryptosArr(cryptos)
    })
  }, [props.userId])

  const getCryptos = (userCryptos) => {
    
  }

  const search = e => {
    e.preventDefault();
    if(crypto === '') return alert('no input was found');
    apiManager.searchForCrypto(crypto).then(cryptoData => {
      console.log(cryptoData[0])
      if(!cryptoData[0]) return alert('nothing was found')
      setSearchedCrypto(cryptoData[0])
      setIsSearched(!isSearched)
    })
  }

  const saveCrypto = cryptoId => {
    const savedCrpyto = {
      name: cryptoId,
      userId: props.userId,
    }
    apiManager.post('cryptos', savedCrpyto).then(() => {
      apiManager.get('cryptos', props.userId).then(getCryptos)
    })
  }

  const deleteCrypto = id => {

  }

  return (
    <Container>
      <Jumbotron>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="search">Crypto Name</Form.Label>
            <Form.Control type="text" id="name" required onChange={e => setCrypto(e.target.value)} placeholder="BTC"/>
          </Form.Group>
          <Button type="button" onClick={search}>Search</Button>
        </Form>
      </Jumbotron>
      {
        isSearched ?
        <Container>
          <h1>Name: {searchedCrypto.name} / {searchedCrypto.id}</h1>
          <p>Market Cap:{searchedCrypto.market_cap}</p>
          <p>Market Cap Change:{(searchedCrypto["1d"].market_cap_change_pct * 100).toFixed(2)}%</p>
          <p>Volume: {searchedCrypto["1d"].volume}</p>
          <p>Volume Change: {(searchedCrypto["1d"].volume_change_pct*100).toFixed(2)}%</p>
          <p>Price: {searchedCrypto.price}</p>
          <p>Price Change: {(searchedCrypto["1d"].price_change_pct * 100).toFixed(2)}%</p>
          <Button type="button" onClick={() => saveCrypto(searchedCrypto.id)}>Save Crypto</Button>
          <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
        </Container> : null
      }
      <div>
        {cryptosArr.map(crypto => <CryptoCard key={crypto.id} cryptoObj={crypto} deleteCrypto={deleteCrypto} {...props}/>)
        }
      </div>
    </Container>
  )
}

export default CryptoList;