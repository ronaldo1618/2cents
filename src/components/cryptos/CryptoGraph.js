import React, { useState, useEffect } from 'react';
// import ExpenseManager from './ExpenseManager';
import key from '../../modules/APIkeys';
import { Line } from 'react-chartjs-2';

// const url = `https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=`
// const qString = `${key.coinKey}`
// let fullURL = `${url}{qString}`

const url = `https://api.nomics.com/v1/currencies/sparkline?key=`
const qString = `${key.nomicsKey}`
let fullURL = `${url}${qString}&ids=BTC&start=2020-05-25T00%3A00%3A00Z&convert=USD`

// const url = `https://finnhub.io/api/v1/quote?symbol=TSLA&token=`
// const qString = `${key.finnhubKey}`
// let fullURL = `${url}${qString}`
const CryptoGraph = props => {
  const [chartData, setChartData] = useState({});

  const chart = () => {
    fetch(`${fullURL}`)
      .then(data => data.json())
      .then(data => {
        console.log(data)
        setChartData({
          labels: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          datasets: [
            {
              label: 'BitCoin throughout the week',
              data: data[0].prices,
              backgroundColor: [
                'rgba(195, 255, 240, 2)'
              ],
              borderWidth: 4
            }
          ]
        })
      })
  }

  useEffect(() => {
    chart()
  }, [])

  return (
    <>
      <div>
        <div><Line data={chartData}/></div>
      </div>  
    </>
  );
}

export default CryptoGraph;