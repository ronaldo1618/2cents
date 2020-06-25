import React, { useState, useEffect } from "react";
import apiManager from "../../modules/apiManager";
import StockCard from "../stocks&cryptos/StockCard";
import CryptoCard from "../stocks&cryptos/CryptoCard";
import { MonthNameMaker } from "../../modules/helpers";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "./Home.css";

const Home = (props) => {
  const [totalFinance, setTotalFinance] = useState({});
  const [projects, setProjects] = useState([]);
  const [cryptoArr, setCryptoArr] = useState([]);
  const [stockArr, setStockArr] = useState([]);
  const [stockNews, setStockNews] = useState([]);
  const [cryptoNews, setCryptoNews] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let cryptoNamesArr = [];
  let stockNamesArr = [];
  let objData = [];
  let cryptoArray = "";

  let date = new Date().toISOString();
  const monthInput = MonthNameMaker("month", date);
  const yearInput = MonthNameMaker("year", date);

  useEffect(() => {
    getTotalFinance(props.userId);
  }, [props.userId]);

  const getTotalFinance = (userId) => {
    return apiManager
      .getTotalFinancesWithAllFinances(yearInput, monthInput, userId)
      .then((totalFinance) => {
        if (totalFinance.length === 0) return setNewUser(!newUser);
        setTotalFinance(totalFinance[0]);
        setIsLoading(!isLoading);
      })
      .then(() => {
        apiManager.getByUserId("projects", userId).then(setProjects);
        settingStockArr();
        settingCryptoArr();
        getStockNews();
        getCryptoNews();
      });
  };

  const getStockNews = () => {
    apiManager.getByHomePage("stocks", props.userId).then((userObjs) => {
      let endDate = new Date().toISOString().split("T")[0];
      if (userObjs.length === 0) {
        apiManager.getStockNews().then(setStockNews);
      } else {
        let name = userObjs[Math.floor(Math.random() * userObjs.length)].name;
        apiManager.getStockCompanyNews(name, endDate, endDate).then((news) => {
          if (news.length === 0) {
            apiManager.getStockNews().then((news) => {
              let newsSortedByTime = news.sort(function (x, y) {
                return x.datetime - y.datetime;
              });
              let newsNow = newsSortedByTime.slice(0, 5);
              for (let i = 0; i < newsNow.length; i++) {
                const news = new Date(newsNow[i].datetime * 1000);
                let year = news.getFullYear();
                let month = news.getMonth() + 1;
                let day = news.getDate();
                let date = month + "-" + day + "-" + year;
                newsNow[i].datetime = date;
              }
              setStockNews(newsNow);
            });
          }
          let companyNewsSorted = news.filter(
            (news) => news.category === "company news"
          );
          let newsSortedByTime = companyNewsSorted.sort(function (x, y) {
            return x.datetime - y.datetime;
          });
          let newsNow = newsSortedByTime.slice(0, 5);
          for (let i = 0; i < newsNow.length; i++) {
            const news = new Date(newsNow[i].datetime * 1000);
            let year = news.getFullYear();
            let month = news.getMonth() + 1;
            let day = news.getDate();
            let date = month + "-" + day + "-" + year;
            newsNow[i].datetime = date;
          }
          setStockNews(newsNow);
        });
      }
    });
  };

  const getCryptoNews = () => {
    apiManager.getCryptoNews().then((news) => {
      let cryptoNewsSorted = news.sort(function (x, y) {
        return x.datetime - y.datetime;
      });
      let cryptoNewsNow = cryptoNewsSorted.slice(0, 5);
      for (let i = 0; i < cryptoNewsNow.length; i++) {
        const cryptoNews = new Date(cryptoNewsNow[i].datetime * 1000);
        let year = cryptoNews.getFullYear();
        let month = cryptoNews.getMonth() + 1;
        let day = cryptoNews.getDate();
        let date = month + "-" + day + "-" + year;
        cryptoNewsNow[i].datetime = date;
      }
      setCryptoNews(cryptoNewsNow);
    });
  };

  const settingStockArr = () => {
    apiManager.getByHomePage("stocks", props.userId).then((userObjs) => {
      if (userObjs.length === 0) return;
      for (let i = 0; i < userObjs.length; i++) {
        const name = userObjs[i].name;
        stockNamesArr.push(name);
      }
      getStocks(stockNamesArr).then(() => {
        setStockArr(objData);
      });
    });
  };

  const settingCryptoArr = () => {
    apiManager.getByHomePage("cryptos", props.userId).then((userObjs) => {
      if (userObjs.length === 0) return;
      for (let i = 0; i < userObjs.length; i++) {
        const name = userObjs[i].name;
        cryptoNamesArr.push(name);
      }
      let nameString = cryptoNamesArr.join(",");
      getCryptos(nameString).then(() => {
        setCryptoArr(cryptoArray);
      });
    });
  };

  async function getCryptos(nameString) {
    try {
      await apiManager.searchForCrypto(nameString).then((arrOfCryptos) => {
        cryptoArray = arrOfCryptos;
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getStocks(namesArr) {
    for (let i = 0; i < namesArr.length; i++) {
      const name = namesArr[i];
      try {
        await apiManager.searchForStock(name).then((stockData) => {
          const stockObj = {
            name: name,
            price: stockData.c,
            high: stockData.h,
            low: stockData.l,
            previousClose: stockData.pc,
            difference: (stockData.c - stockData.pc).toFixed(2),
            percentDifference: (
              ((stockData.c - stockData.pc) / stockData.pc) *
              100
            ).toFixed(2),
          };
          objData.push(stockObj);
        });
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  return (
    <>
      {newUser ? (
        <div className="ta-container">
          <h1>Get Started Tracking Your Expenses Today!</h1>
        </div>
      ) : (
        <div className="ta-container">
          {isLoading ? (
            <div
              onClick={() => props.history.push("/finances")}
              className="ta-jumbotron-homepage clickable"
            >
              <p className="display-4">
                Amount to spend this month:{" "}
                <span
                  className={`number-is-${
                    totalFinance.amountLeft > 0 ? "positive" : "negative"
                  }`}
                >
                  ${Math.abs(totalFinance.amountLeft)}
                </span>
              </p>
              <hr />
              <p>
                Total amount spent on expenses this month:{" "}
                <span
                  className={`number-is-${
                    totalFinance.allBills > 0 ? "positive" : "negative"
                  }`}
                >
                  ${Math.abs(totalFinance.allBills)}
                </span>
              </p>
              <p>
                Total amount of income this month:{" "}
                <span
                  className={`number-is-${
                    totalFinance.allIncome > 0 ? "positive" : "negative"
                  }`}
                >
                  ${totalFinance.allIncome}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      )}
      <div>
        <div className="progress-containers">
          {projects.map((project) => (
            <div
              onClick={() => props.history.push("/projects")}
              className="progress-card clickable"
              key={project.id}
            >
              <h1>{project.name}</h1>
              <CircularProgressbar
              className="progress-bar-container"
                value={((project.amountIn / project.goalAmount) * 100).toFixed(
                  1
                )}
                text={`${(
                  (project.amountIn / project.goalAmount) *
                  100
                ).toFixed(0)}%`}
                styles={buildStyles({
                  pathColor: `#4BB187`,
                  textColor: "#4BB187",
                })}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="stocks-and-cryptos">
        <div className="stocks-container">
          {stockArr.length > 0 ? (
            <>
              <h2>Stocks</h2>
              <div className="stock-and-crypto-card">
                {stockArr.map((stock) => (
                  <StockCard
                    key={stock.name}
                    searchedObj={stock}
                    isHomePage={true}
                    {...props}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
        <div className="news-container">
          <div>
            <h2>Crypto News</h2>
            <hr className="hr-title" />
            {cryptoNews.map((news) => (
              <div className="news-div" key={news.id}>
                <h3>{news.headline}</h3>
                {/* <img src={news.image}/> */}
                <p className="date">{news.datetime}</p>
                <p className="summary">{news.summary}</p>
                <a className="link" href={news.url} rel="noopener noreferrer" target="_blank">Click To Read More</a>
                <hr />
              </div>
            ))}
          </div>
          <div>
            <h2>Stock News</h2>
            <hr className="hr-title" />
            {stockNews.map((news) => (
              <div className="news-div" key={news.id}>
                <h3>{news.headline}</h3>
                <p className="date">{news.datetime}</p>
                <p className="summary" maxLength="20">{news.summary}</p>
                <a className="link" href={news.url} rel="noopener noreferrer" target="_blank">Click To Read More</a>
                <hr />
              </div>
            ))}
          </div>
        </div>
        <div className="cryptos-container">
          {cryptoArr.length > 0 ? (
            <>
              <h2>Cryptos</h2>
              <div className="stock-and-crypto-card">
                {cryptoArr.map((crypto) => (
                  <CryptoCard
                    key={crypto.id}
                    cryptoObj={crypto}
                    isHomePage={true}
                    homePage={crypto.homePage}
                    {...props}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Home;
