import React, {useState} from 'react';
import apiManager from '../../modules/apiManager';
import { Button, Card, ButtonGroup } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import * as Zoom from 'chartjs-plugin-zoom';

const StockCard = ({searchedObj, history, isHomePage, deleteObj, saveToHomePage, unSaveFromHomePage}) => {
  const [chartData, setChartData] = useState({})
  const [showOneDayGraph, setShowOneDayGraph] = useState(false)
  const [showOneWeekGraph, setShowOneWeekGraph] = useState(false)
  const [showOneMonthGraph, setShowOneMonthGraph] = useState(false)
  const toggle = graphType => {
    if(graphType === 'oneDay') setShowOneDayGraph(!showOneDayGraph)
    if(graphType === 'oneWeek') setShowOneWeekGraph(!showOneWeekGraph)
    if(graphType === 'oneMonth') setShowOneMonthGraph(!showOneMonthGraph)
  }

  const stockGraphMaker = (graphType, id) => {
    // Come back and make this more accurate
    let today = parseInt(Date.now() / 1000)
    let data = []
    let labels = []
    let date = ''
    if(graphType === 'One Day Graph') {
      date = parseInt(today - 86400)
      apiManager.get1DGraphForStock(id, date, today).then(graphData => {
      data = graphData
      data.c.forEach(data => {
        labels.push('')
      });
      }).then(() => chartDataNow(graphType, labels, data))
    }
    if(graphType === 'One Week Graph') {
      date = parseInt(today - 432000)
      apiManager.get1WGraphForStock(id, date, today).then(graphData => {
        data = graphData
        data.c.forEach(data => {
          labels.push('')
        });
      }).then(() => chartDataNow(graphType, labels, data))
    }
    if(graphType === 'One Month Graph') {
      date = parseInt(today - 2678400)
      apiManager.get1MGraphForStock(id, date, today).then(graphData => {
        data = graphData
        data.c.forEach(data => {
          labels.push('')
        });
      }).then(() => chartDataNow(graphType, labels, data))
    }
  }
  
  const chartDataNow = (graphType, labels, data) => {
    setChartData({
      labels: labels,
      datasets: [
        {
          label: `${graphType}`,
          fill: false,
          data: data.c
        }
      ],
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
          <ButtonGroup>
            <Button type="button" onClick={() => {
              toggle('oneDay')
              stockGraphMaker('One Day Graph', searchedObj.name)
            }}>Day Graph</Button>
            <Button type="button" onClick={() => {
              toggle('oneWeek')
              stockGraphMaker('One Week Graph', searchedObj.name)
            }}>Week Graph</Button>
            <Button type="button" onClick={() => {
              toggle('oneMonth')
              stockGraphMaker('One Month Graph', searchedObj.name)
            }}>Month Graph</Button>
          </ButtonGroup>
          {showOneDayGraph || showOneMonthGraph || showOneWeekGraph ? 
          <>
          <Button variant="outline-danger" type="button" onClick={() => {
            setShowOneDayGraph(false)
            setShowOneWeekGraph(false)
            setShowOneMonthGraph(false)
          }}>Cancel</Button>
          <Bar data={chartData} options={{
            responsive: true,
            scales: {
              xAxes: [{
                ticks: {
                  display: false
                },
                gridLines: {
                  display: false
                }
              }]
            },
            pan: {
              enabled: true,
              mode: 'xy',
              speed: 10
            },
            zoom: {
              enabled: true,
              drag: false,
              mode: "xy",
              rangeMin: {
                x: 0,
                y: 0
              },
              rangeMax: {
                x: 1500,
                y: 1500
              }
            }
          }}/> 
          </>
          : null
          }
          </>
        }
      </Card.Body>
    </Card>
  )
}

export default StockCard;