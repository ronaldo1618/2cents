// import React, { useState, useEffect } from 'react';
// import apiManager from '../../modules/apiManager';
// import StockCard from './StockCard';
// import CryptoCard from '../cryptos/CryptoCard';
// import { Container, Jumbotron, Form, Button, Card } from 'react-bootstrap';

// const ObjList = props => {
//   const [str, setStr] = useState('');
//   const [arr, setArr] = useState([]);
//   const [searchedObj, setSearchedObj] = useState({})
//   const [isSearched, setIsSearched] = useState(false);
//   const [isDone, setIsDone] = useState(false);
//   let namesArr = []
//   let objData = []

//   const search = e => {
//     e.preventDefault();
//     if(str === '') return alert('no input was found')
//     if(props.objURL === 'stocks') {
//       apiManager.searchForStock(str).then(stockData => {
//         console.log(stockData)
//         console.log((stockData.c - stockData.pc) / stockData.pc * 100)
//         const newSearchedStock = {
//           name: str,
//           price: stockData.c,
//           high: stockData.h,
//           low: stockData.l,
//           previousClose: stockData.pc,
//           difference: (stockData.c - stockData.pc).toFixed(2),
//           percentDifference: ((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)
//         }
//         setSearchedObj(newSearchedStock)
//         setIsSearched(!isSearched)
//       })
//     } else {
//       apiManager.searchForCrypto(str).then(cryptoData => {
//         if(!cryptoData[0]) return alert('nothing was found for cryptos')
//         setSearchedObj(cryptoData[0])
//         setIsSearched(!isSearched)
//       })
//     }
//   }

//   const saveObj = (e, objId) => {
//     e.preventDefault();
//     const savedObj = {
//       name: objId,
//       userId: props.userId
//     }
//     apiManager.post(props.objURL, savedObj).then(() => {
//         setIsSearched(!isSearched)
//       }).then(() => {
//         apiManager.get(props.objURL, props.userId).then(userObjs => {
//           settingStrArr(userObjs)
//         })
//       })
//   }

//   const settingStrArr = (userObjs) => {
//     for (let i = 0; i < userObjs.length; i++) {
//       const name = userObjs[i].name;
//       namesArr.push(name)
//     }
//     if(props.objURL === 'stocks') {
//       getStocks(namesArr).then(() => {
//         setArr(objData)
//         setIsDone(!isDone)
//       })
//     } else {
//       let nameString = namesArr.join(',')
//       apiManager.searchForCrypto(nameString).then(setArr)
//     }
//   }

//   async function getStocks(namesArr) {
//     for (let i = 0; i < namesArr.length; i++) {
//       const name = namesArr[i];
//       try {
//         await apiManager.searchForStock(name).then(stockData => {
          
//           const stockObj = {
//             name: name,
//             price: stockData.c,
//             high: stockData.h,
//             low: stockData.l,
//             previousClose: stockData.pc,
//             difference: (stockData.c - stockData.pc).toFixed(2),
//             percentDifference: ((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)
//           }
//           objData.push(stockObj)
//           console.log("async function", objData)
//         })
//       }
//       catch (e) {
//         console.error(e.message);
//       }
//     }
//   }

//   useEffect(() => {
//     apiManager.get(props.objURL, props.userId).then(userObjs => settingStrArr(userObjs))
//   }, [props.userId])

//   const deleteObj = id  => {
//     console.log(id)
//     apiManager.getByUserIdAndName(props.objURL, id, props.userId).then(obj => {
//       console.log(obj)
//       apiManager.delete(props.objURL, obj[0].id).then(() => {
//         apiManager.get(props.objURL, props.userId).then(userObjs => settingStrArr(userObjs))
//       })
//     })
//   }

//   return (
//     <Container>
//       <Jumbotron>
//         <Form>
//           <Form.Group>
//             <Form.Label htmlFor="search">Stock Name</Form.Label>
//             <Form.Control type="text" id="name" required onChange={e => {
//               setIsSearched(false)
//               setStr(e.target.value)}} placeholder={`Search for ${props.objURL}`}/>
//           </Form.Group>
//           <Button type="button" onClick={search}>Search</Button>
//         </Form>
//       </Jumbotron>
//       {
//         isSearched && props.objURL === 'stocks' ?
//         <Container>
//           {console.log("we made it", searchedObj)}
//           <Card>
//             <Card.Body>
//               <Card.Title>{searchedObj.name}</Card.Title>
//               <Card.Text>Price: {searchedObj.price} {searchedObj.difference}({searchedObj.percentDifference}%)</Card.Text>
//               <Card.Text>High: {searchedObj.high}</Card.Text>
//               <Card.Text>Low: {searchedObj.low}</Card.Text>
//               <Card.Text>Previous Closing Price: {searchedObj.previousClose}</Card.Text>
//             </Card.Body>
//           </Card>
//           <Button type="button" onClick={(e) => saveObj(e, str)}>Save Stock</Button>
//           <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
//         </Container> 
//         : null
//       }
//       {
//         isSearched && props.objURL === 'cryptos' ?
//         <Container>
//           <h1>Name: {searchedObj.name} / {searchedObj.id}</h1>
//           <p>Market Cap:{searchedObj.market_cap}</p>
//           <p>Market Cap Change:{(searchedObj["1d"].market_cap_change_pct * 100).toFixed(2)}%</p>
//           <p>Volume: {searchedObj["1d"].volume}</p>
//           <p>Volume Change: {(searchedObj["1d"].volume_change_pct*100).toFixed(2)}%</p>
//           <p>Price: {searchedObj.price}</p>
//           <p>Price Change: {(searchedObj["1d"].price_change_pct * 100).toFixed(2)}%</p>
//           <Button type="button" onClick={() => saveObj(searchedObj.id)}>Save Crypto</Button>
//           <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
//         </Container> : null
//       }
//       {
//         isSearched && props.objURL === 'cryptos' ?
//         <Container>
//           <h1>Name: {searchedObj.name} / {searchedObj.id}</h1>
//           <p>Market Cap:{searchedObj.market_cap}</p>
//           <p>Market Cap Change:{(searchedObj["1d"].market_cap_change_pct * 100).toFixed(2)}%</p>
//           <p>Volume: {searchedObj["1d"].volume}</p>
//           <p>Volume Change: {(searchedObj["1d"].volume_change_pct*100).toFixed(2)}%</p>
//           <p>Price: {searchedObj.price}</p>
//           <p>Price Change: {(searchedObj["1d"].price_change_pct * 100).toFixed(2)}%</p>
//           <Button type="button" onClick={() => saveObj(searchedObj.id)}>Save Crypto</Button>
//           <Button type="button" variant="danger" onClick={() => setIsSearched(false)}>Cancel</Button>
//         </Container> : null
//       }
//       {
//         props.objURL === 'cryptos' ?
//         <>
//         {arr.map(crypto => <CryptoCard key={crypto.id} cryptoObj={crypto} deleteCrypto={deleteObj} {...props}/>)
//         }
//         </>
//         : null
//       }
//       {
//         props.objURL === 'stocks' ?
//         <>
//         {arr.map(stock => <StockCard key={stock.name} searchedObj={stock} deleteObj={deleteObj} {...props}/>)}
//         </>
//         : null
//       }
//     </Container>
//   )
// }

// export default ObjList;