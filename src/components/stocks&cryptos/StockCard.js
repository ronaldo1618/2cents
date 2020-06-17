import React from 'react';
import { Button, Card } from 'react-bootstrap';
// import { Line } from 'react-chartjs-2';

const StockCard = ({searchedObj, isHomePage, deleteObj, saveToHomePage, unSaveFromHomePage, graphMaker, chartData}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{searchedObj.name}</Card.Title>
        <Card.Text>Price: {searchedObj.price} {searchedObj.difference}({searchedObj.percentDifference}%)</Card.Text>
        <Card.Text>High: {searchedObj.high}</Card.Text>
        <Card.Text>Low: {searchedObj.low}</Card.Text>
        <Card.Text>Previous Closing Price: {searchedObj.previousClose}</Card.Text>
        <Button type="button" onClick={() => deleteObj(searchedObj.name)}>Delete</Button>
        {
          isHomePage === true ?
          null
          :
          <>
          {
            searchedObj.homePage !== true ?
            <Button type="button" onClick={() => saveToHomePage(searchedObj.name)}>Save To Home Page</Button>
            :
            <Button type="button" onClick={() => unSaveFromHomePage(searchedObj.name)}>Remove From Home Page</Button>
          }
          </>
        }
        {/* <Button type="button" onClick={() => graphMaker(searchedObj.name)}>Day Graph</Button>
        <Line data={chartData}/> */}
      </Card.Body>
    </Card>
  )
}

export default StockCard;