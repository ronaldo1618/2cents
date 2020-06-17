import React, {useState} from 'react';
import apiManager from '../../modules/apiManager';
import { Button, Card } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';

const StockCard = ({searchedObj, history, isHomePage, deleteObj, saveToHomePage, unSaveFromHomePage}) => {
  const [chartData, setChartData] = useState({})

  const stockGraphMaker = id => {
    // Come back and make this more accurate
    let today = parseInt(Date.now() / 1000)
    console.log(today)
    let date = ''
    date = parseInt(today - 86400)
    // console.log("today", today, "yesterday", date, "difference", date / 900 )
    apiManager.get1DGraphForStock(id, date, today).then(graphData => {
      console.log(graphData)
      let labels = []
      let count = 0
      graphData.c.forEach(data => {
        labels.push(count++)
      });
      // labels = ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM']
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'One Day Graph',
            fill: false,
            lineTension: 0.5,
            data: graphData.c
          }
        ],
        
      })
    })
  }
  return (
    <Card onClick={() => isHomePage ? history.push("/stocks") : null} className={`${isHomePage ? "stock-card clickable" : ""}`}>
      <Card.Body>
        <Card.Title>{searchedObj.name}</Card.Title>
        <Card.Text>Price: {searchedObj.price} {searchedObj.difference}({searchedObj.percentDifference}%)</Card.Text>
        <Card.Text>High: {searchedObj.high}</Card.Text>
        <Card.Text>Low: {searchedObj.low}</Card.Text>
        <Card.Text>Previous Closing Price: {searchedObj.previousClose}</Card.Text>
        {
          isHomePage === true ?
          null
          :
          <>
          <Button type="button" variant="danger" onClick={() => deleteObj(searchedObj.name)}>Delete</Button>
          {
            searchedObj.homePage !== true ?
            <Button className="m-2" variant="outline-primary" type="button" onClick={() => saveToHomePage(searchedObj.name)}>Save To Home</Button>
            :
            <Button className="m-2" variant="outline-danger" type="button" onClick={() => unSaveFromHomePage(searchedObj.name)}>Remove From Home</Button>
          }
          <Button type="button" onClick={() => stockGraphMaker(searchedObj.name)}>Day Graph</Button>
          <Line data={chartData} options={{
            scales: {
              xAxes: [{
                ticks: {
                  display: false
                },
                gridLines: {
                  display: false
                }
              }]
            }
          }}/>
          </>
        }
      </Card.Body>
    </Card>
  )
}

export default StockCard;