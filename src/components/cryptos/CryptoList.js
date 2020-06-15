// import React, { useState, useEffect } from 'react';
// import apiManager from '../../modules/apiManager';
// import CryptoCard from './CryptoCard';
// import { Container, Jumbotron, Form, Button } from 'react-bootstrap';

// const CryptoList = props => {
//   const [crypto, setCrypto] = useState('');
//   const [cryptosArr, setCryptosArr] = useState([]);
//   const [searchedCrypto, setSearchedCrypto] = useState({});
//   const [isSearched, setIsSearched] = useState(false);
//   let cryptos = []
  
//   useEffect(() => {
//     settingCryptoArr()
//   }, [])

//   const search = e => {
//     e.preventDefault();
//     if(crypto === '') return alert('no input was found');
//     apiManager.searchForCrypto(crypto).then(cryptoData => {
//       if(!cryptoData[0]) return alert('nothing was found')
//       setSearchedCrypto(cryptoData[0])
//       setIsSearched(!isSearched)
//     })
//   }

//   const settingCryptoArr = () => {
//     console.log("accessing settingCryptoArr")
//     apiManager.get('cryptos', props.userId).then(userCryptos => {
//       for (let i = 0; i < userCryptos.length; i++) {
//         const crypto = userCryptos[i].name;
//         cryptos.push(crypto)
//       }
//       let cryptoString = cryptos.join(',')
//       apiManager.searchForCrypto(cryptoString).then(setCryptosArr)
//     })
//   }

//   const saveCrypto = cryptoId => {
//     const savedCrypto = {
//       name: cryptoId,
//       userId: props.userId,
//     }
//     apiManager.post('cryptos', savedCrypto).then(() => {
//       apiManager.get('cryptos', props.userId).then(userCryptos => {
//         setIsSearched(!isSearched)
//         settingCryptoArr()
//       })
//     })
//   }

//   const deleteCrypto = id => {
//     console.log(id)
//     apiManager.getByUserIdAndName('cryptos', id, props.userId).then(crypto => {
//       console.log(crypto)
//       apiManager.delete('cryptos', crypto[0].id).then(settingCryptoArr)
//     })
//   }

//   return (
//     <Container>
//       <Jumbotron>
//         <Form>
//           <Form.Group>
//             <Form.Label htmlFor="search">Crypto Name</Form.Label>
//             <Form.Control type="text" id="name" required onChange={e => {
//               setIsSearched(false)
//               setCrypto(e.target.value)}} placeholder="BTC"/>
//           </Form.Group>
//           <Button type="button" onClick={search}>Search</Button>
//         </Form>
//       </Jumbotron>
//       {
//         isSearched ?
//         <Container>
//           <h1>Name: {searchedCrypto.name} / {searchedCrypto.id}</h1>
//           <p>Market Cap:{searchedCrypto.market_cap}</p>
//           <p>Market Cap Change:{(searchedCrypto["1d"].market_cap_change_pct * 100).toFixed(2)}%</p>
//           <p>Volume: {searchedCrypto["1d"].volume}</p>
//           <p>Volume Change: {(searchedCrypto["1d"].volume_change_pct*100).toFixed(2)}%</p>
//           <p>Price: {searchedCrypto.price}</p>
//           <p>Price Change: {(searchedCrypto["1d"].price_change_pct * 100).toFixed(2)}%</p>
//           <Button type="button" onClick={() => saveCrypto(searchedCrypto.id)}>Save Crypto</Button>
//           <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
//         </Container> : null
//       }
//       {cryptosArr.map(crypto => <CryptoCard key={crypto.id} cryptoObj={crypto} deleteCrypto={deleteCrypto} {...props}/>)
//         }
//     </Container>
//   )
// }

// export default CryptoList;