import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import StockCard from '../stocks&cryptos/StockCard';
import CryptoCard from '../stocks&cryptos/CryptoCard';
import { MonthNameMaker } from '../../modules/helpers';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './Home.css'


const Home = props => {
  const [totalFinance, setTotalFinance] = useState({});
  const [projects, setProjects] = useState([]);
  const [cryptoArr, setCryptoArr] = useState([]);
  const [stockArr, setStockArr] = useState([]);
  const [stockNews, setStockNews] = useState([]);
  let cryptoNamesArr = []
  let stockNamesArr = []
  let objData = []

  let date = new Date().toISOString()
  const monthInput = MonthNameMaker("month", date)
  const yearInput = MonthNameMaker("year", date)

  useEffect(() => {
    getTotalFinance(props.userId)
  }, [props.userId]);

  const getTotalFinance = (userId) => {
    return apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, userId).then(totalFinance => {
      if(totalFinance.length === 0) return
      setTotalFinance(totalFinance[0])
    }).then(() => {
      apiManager.getByUserId('projects', userId).then(setProjects)
      settingStockArr()
      settingCryptoArr()
      getStockNews()
    })
  }

  const getStockNews = () => {
    apiManager.getByHomePage('stocks', props.userId).then(userObjs => {
    let endDate = new Date().toISOString().split('T')[0]
    console.log(endDate, endDate)
    if(userObjs.length === 0) {
      apiManager.getStockNews().then(setStockNews)
    } else {
      let name = userObjs[Math.floor(Math.random() * userObjs.length)].name
      apiManager.getStockCompanyNews(name, endDate, endDate).then(news => {
        let companyNewsSorted = news.filter(news => news.category === "company news")
        let newsSortedByTime = companyNewsSorted.sort(function(x, y){
          return x.datetime - y.datetime;
        })
        let newsNow = newsSortedByTime.slice(0, 5)
        // newsNow.forEach(news => {
        //   news.datetime = new Date(news.datetime*1000)
        //   console.log(news.datetime)
        // });
        setStockNews(newsNow)
      })
    }})
  }

  const settingStockArr = () => {
    apiManager.getByHomePage('stocks', props.userId).then(userObjs => {
      if(userObjs.length === 0) return
      for (let i = 0; i < userObjs.length; i++) {
        const name = userObjs[i].name;
        stockNamesArr.push(name)
      }
      getStocks(stockNamesArr).then(() => {
        setStockArr(objData)
      })
    })
  }

  const settingCryptoArr = () => {
    apiManager.getByHomePage('cryptos', props.userId).then(userObjs => {
      if(userObjs.length === 0) return
      for (let i = 0; i < userObjs.length; i++) {
        const name = userObjs[i].name;
        cryptoNamesArr.push(name)
      }
      let nameString = cryptoNamesArr.join(',')
      apiManager.searchForCrypto(nameString).then(arrOfCryptos => {
        getStocks(arrOfCryptos)
        // for (let i = 0; i < arrOfCryptos.length; i++) {
        //   const crypto = arrOfCryptos[i];
        // }
        setCryptoArr(arrOfCryptos)
      })
    }
    )}

  async function getStocks(namesArr) {
    for (let i = 0; i < namesArr.length; i++) {
      const name = namesArr[i];
      try {
        await apiManager.searchForStock(name).then(stockData => {
          const stockObj = {
            name: name,
            price: stockData.c,
            high: stockData.h,
            low: stockData.l,
            previousClose: stockData.pc,
            difference: (stockData.c - stockData.pc).toFixed(2),
            percentDifference: ((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)
          }
          objData.push(stockObj)
        })
      }
      catch (e) {
        console.error(e.message);
      }
    }
  }

  return (
    <>
      <h1>Home</h1>
      <div>
        <h3>Amount left to spend this month {totalFinance.amountLeft}</h3>
        <p>Total amount spent on bills this month {totalFinance.allBills}</p>
        <p>Total amount of income this month {totalFinance.allIncome}</p>
      </div>
      <div>
      {
        projects.map(project => 
        <div className="project-home" key={project.id}>
          <h1>{project.name}</h1>
          <CircularProgressbar 
            value={(project.amountIn/project.goalAmount * 100).toFixed(1)} 
            text={`${(project.amountIn/project.goalAmount * 100).toFixed(0)}%`}
            styles={buildStyles({
              pathColor: `#4BB187`,
              textColor: '#4BB187'
            })} />
        </div>)
      }
      </div>
      {
        stockArr.length > 0 ?
        (  
        <div>
          <h2>Stocks</h2>
          {stockArr.map(stock => <StockCard key={stock.name} searchedObj={stock} isHomePage={true} {...props}/>)}
        </div>
        ) : null
      }
      {stockNews.map(news => 
      <div key={news.id}>
        <h3>{news.headline}</h3>
        <p>{news.datetime}</p>
        <p>{news.summary}</p>
      </div>)}
      {
        cryptoArr.length > 0 ?
        (
        <div>
          <h2>Cryptos</h2>
          {cryptoArr.map(crypto => <CryptoCard key={crypto.id} cryptoObj={crypto} isHomePage={true} homePage={crypto.homePage} {...props}/>)}
        </div>
        ) : null
      }
    </>
  )
}

export default Home;