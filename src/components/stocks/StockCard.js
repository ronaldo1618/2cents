import React from 'react';
import { Button, Card } from 'react-bootstrap';

const StockCard = ({searchedObj, history, deleteObj}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{searchedObj["01. symbol"]}</Card.Title>
        <Card.Text>Price: ${searchedObj["05. price"]} {searchedObj["09. change"]}({searchedObj["10. change percent"]}%)</Card.Text>
        <Card.Text>Open Price: ${searchedObj["02. open"]}</Card.Text>
        <Card.Text>High: ${searchedObj["03. high"]}</Card.Text>
        <Card.Text>Low: ${searchedObj["04. low"]}</Card.Text>
        <Card.Text>Volume: ${searchedObj["06. volume"]}</Card.Text>
        <Card.Text>Prvious Close: ${searchedObj["08. previous close"]}</Card.Text>
        <Button onClick={() => deleteObj(searchedObj["01. symbol"])}>Delete</Button>
      </Card.Body>
    </Card>
  )
}

export default StockCard;