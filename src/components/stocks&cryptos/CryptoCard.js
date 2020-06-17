import React, { useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import * as Zoom from 'chartjs-plugin-zoom';
import apiManager from '../../modules/apiManager';
import { graphMaker } from '../../modules/helpers';

const CryptoCard = ({cryptoObj, isHomePage, deleteCrypto, homePage, saveToHomePage,unSaveFromHomePage, history}) => {
  const [chartData, setChartData] = useState({})
  const [showOneDayGraph, setShowOneDayGraph] = useState(false)
  const [showOneWeekGraph, setShowOneWeekGraph] = useState(false)
  const [showOneMonthGraph, setShowOneMonthGraph] = useState(false)
  const toggle = graphType => {
    if(graphType === 'oneDay') setShowOneDayGraph(!showOneDayGraph)
    if(graphType === 'oneWeek') setShowOneWeekGraph(!showOneWeekGraph)
    if(graphType === 'oneMonth') setShowOneMonthGraph(!showOneMonthGraph)
  }

  const graphMaker = (isCrypto, graphType, id) => {
    // Come back and make this more accurate
    let today = parseInt(Date.now() / 1000)
    let data = []
    let labels = []
    let date = ''
    if(graphType === 'One Day Graph') {
      date = parseInt(today - 86400)
      if(isCrypto) {
        apiManager.get1DGraphForCrypto(id, date, today).then(graphData => {
        data = graphData
        data.c.forEach(data => {
        labels.push('')
        });
        }).then(() => chartDataNow(graphType, labels, data))
      } else {
        apiManager.get1DGraphForStock(id, date, today).then(graphData => {
        data = graphData
        data.c.forEach(data => {
          labels.push('')
        });
        }).then(() => chartDataNow(graphType, labels, data))
      }
    }
    if(graphType === 'One Week Graph') {
      if(isCrypto) {
        date = parseInt(today - 432000)
        apiManager.get1WGraphForCrypto(id, date, today).then(graphData => {
        data = graphData
        data.c.forEach(data => {
        labels.push('')
        });
        }).then(() => chartDataNow(graphType, labels, data))
      } else {
        date = parseInt(today - 432000)
        apiManager.get1WGraphForStock(id, date, today).then(graphData => {
          data = graphData
          data.c.forEach(data => {
            labels.push('')
          });
        }).then(() => chartDataNow(graphType, labels, data))
      }
    }
    if(graphType === 'One Month Graph') {
      if(isCrypto) {
        date = parseInt(today - 2678400)
        apiManager.get1MGraphForCrypto(id, date, today).then(graphData => {
          data = graphData
          data.c.forEach(data => {
          labels.push('')
          });
          }).then(() => chartDataNow(graphType, labels, data))
      } else {
        date = parseInt(today - 2678400)
        apiManager.get1MGraphForStock(id, date, today).then(graphData => {
          data = graphData
          data.c.forEach(data => {
            labels.push('')
          });
        }).then(() => chartDataNow(graphType, labels, data))
      }
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
    <Card onClick={() => isHomePage ? history.push("/cryptos") : null} className={`${isHomePage ? "stock-card clickable" : ""}`}>
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
              <ButtonGroup>
            <Button type="button" onClick={() => {
              toggle('oneDay')
              graphMaker(true, 'One Day Graph', cryptoObj.id)
            }}>Day Graph</Button>
            <Button type="button" onClick={() => {
              toggle('oneWeek')
              graphMaker(true, 'One Week Graph', cryptoObj.id)
            }}>Week Graph</Button>
            <Button type="button" onClick={() => {
              toggle('oneMonth')
              graphMaker(true, 'One Month Graph', cryptoObj.id)
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

export default CryptoCard;