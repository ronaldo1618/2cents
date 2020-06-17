import React from 'react';
import { Button, Card } from 'react-bootstrap';

const CryptoCard = ({cryptoObj, isHomePage, deleteCrypto, homePage, saveToHomePage,unSaveFromHomePage, history}) => {
  return (
    <Card onClick={() => isHomePage ? history.push("/cryptos") : null} className={`${isHomePage ? "stock-card clickable" : "finance-card"}`}>
      <Card.Body>
        <Card.Title>{cryptoObj.name} / {cryptoObj.id}</Card.Title>
          <Card.Text>Market Cap:{cryptoObj.market_cap}</Card.Text>
          <Card.Text>Market Cap Change:{(cryptoObj["1d"].market_cap_change_pct * 100).toFixed(2)}%</Card.Text>
          <Card.Text>Volume: {cryptoObj["1d"].volume}</Card.Text>
          <Card.Text>Volume Change: {(cryptoObj["1d"].volume_change_pct*100).toFixed(2)}%</Card.Text>
          <Card.Text>Price: {cryptoObj.price}</Card.Text>
          <Card.Text>Price Change: {(cryptoObj["1d"].price_change_pct * 100).toFixed(2)}%</Card.Text>
          {
            isHomePage === true ?
            null
            :
            <>
              <Button variant="danger" type="button" onClick={() => deleteCrypto(cryptoObj.id)}>Delete</Button>
              {
                homePage !== true ?
                <Button className="m-2" variant="outline-primary" type="button" onClick={() => saveToHomePage(cryptoObj.id)}>Save To Home</Button>
                :
                <Button className="m-2" variant="outline-danger" type="button" onClick={() => unSaveFromHomePage(cryptoObj.id)}>Remove From Home</Button>
              }
            </>
          }
      </Card.Body>
    </Card>
  )
}

export default CryptoCard;