import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import StockCard from './StockCard';
import { Container, Jumbotron, Form, Button } from 'react-bootstrap';

const StockList = props => {
  const [str, setStr] = useState('');
  const [arr, setArr] = useState([]);
  const [searchedObj, setSearchedObj] = useState({})
  const [isSearched, setIsSearched] = useState(false);

  const search = e => {
    e.preventDefault();
    if(str === '') return alert('no input was found')
    if(props.objURL === 'stocks') {
      apiManager.searchForStock(str).then(stockData => {
        console.log(searchedObj)
        apiManager.searchForStockProfile(str).then(stockProfile => {
          setSearchedObj({ ...stockData, ...stockProfile})
          setIsSearched(!isSearched)
        })
      })
    } else {
      console.log("this is a crypto")
    }
  }

  return (
    <Container>
      <Jumbotron>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="search">Stock Name</Form.Label>
            <Form.Control type="text" id="name" required onChange={e => setStr(e.target.value)} placeholder={`Search for ${props.objURL}`}/>
          </Form.Group>
          <Button type="button" onClick={search}>Search</Button>
        </Form>
      </Jumbotron>
      {
        isSearched && props.objURL === 'stocks' ?
        <Container>
          <h1>{searchedObj.name} / {searchedObj.ticker}</h1>
        </Container> 
        : null
      }
    </Container>
  )
}

export default StockList;