import React, { useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Icon } from "semantic-ui-react";
// import * as Zoom from 'chartjs-plugin-zoom';
import apiManager from "../../modules/apiManager";
import "./Stocks&Cryptos.css";
// import { Redirect } from "react-router-dom";

const CryptoCard = ({
  cryptoObj,
  isHomePage,
  deleteCrypto,
  homePage,
  saveToHomePage,
  unSaveFromHomePage,
  history,
}) => {
  const [chartData, setChartData] = useState({});
  const [showOneDayGraph, setShowOneDayGraph] = useState(false);
  const [showOneWeekGraph, setShowOneWeekGraph] = useState(false);
  const [showOneMonthGraph, setShowOneMonthGraph] = useState(false);
  const toggle = (graphType) => {
    if (graphType === "oneDay") setShowOneDayGraph(!showOneDayGraph);
    if (graphType === "oneWeek") setShowOneWeekGraph(!showOneWeekGraph);
    if (graphType === "oneMonth") setShowOneMonthGraph(!showOneMonthGraph);
  };

  // Move this to a new file and call on it for cryptos and stocks after demo
  const graphMaker = (isCrypto, graphType, id) => {
    let today = parseInt(Date.now() / 1000);
    let data = [];
    let labels = [];
    let date = "";
    const settingGraphData = (func, id, date, today) => {
      return func(id, date, today)
              .then((graphData) => {
                if(graphData.c === undefined) {
                  console.log(graphData)
                  return settingGraphData(func, id, date, today)
                }
                data = graphData;
                data.c.forEach((data) => {
                  labels.push("");
                });
              })
              .then(() => chartDataNow(graphType, labels, data));
    }
    if (graphType === "One Day Graph") {
      date = parseInt(today - 86400);
      if (isCrypto) {
        settingGraphData(apiManager.get1DGraphForCrypto, id, date, today)
      } else {
        settingGraphData(apiManager.get1DGraphForStock, id, date, today)
      }
    }
    if (graphType === "One Week Graph") {
      date = parseInt(today - 432000);
      if (isCrypto) {
        settingGraphData(apiManager.get1WGraphForCrypto, id, date, today)
      } else {
        settingGraphData(apiManager.get1WGraphForStock, id, date, today)
      }
    }
    if (graphType === "One Month Graph") {
      date = parseInt(today - 2678400);
      if (isCrypto) {
        settingGraphData(apiManager.get1MGraphForCrypto, id, date, today)
      } else {
        settingGraphData(apiManager.get1MGraphForStock, id, date, today)
      }
    }
  };

  const chartDataNow = (graphType, labels, data) => {
    setChartData({
      labels: labels,
      datasets: [
        {
          label: `${graphType}`,
          fill: false,
          data: data.c,
          backgroundColor: "#4BB187",
        },
      ],
    });
  };

  return (
    <Card
      onClick={() => (isHomePage ? history.push("/cryptos") : null)}
      className={`${isHomePage ? "stock-card clickable" : "stock-card-inverted"}`}
    >
      <Card.Body className="stock-crypto-card">
        <Card.Title>
          {cryptoObj.name} / {cryptoObj.id}
        </Card.Title>
        <Card.Text>
          Market Cap:{" "}
          {new Intl.NumberFormat("eng", {
            style: "currency",
            currency: "USd",
          }).format(cryptoObj.market_cap)}
          <Icon
            name={`${
              cryptoObj["1d"].market_cap_change_pct * 100 > 0
                ? "arrow up"
                : "arrow down"
            }`}
            className={`${
              cryptoObj["1d"].market_cap_change_pct * 100 > 0
                ? "arrow-up"
                : "arrow-down"
            }`}
          />
          <span
            className={`number-is-${
              cryptoObj["1d"].market_cap_change_pct * 100 > 0
                ? "positive"
                : "negative"
            }`}
          >
            {(cryptoObj["1d"].market_cap_change_pct * 100).toFixed(2)}
          </span>
          %
        </Card.Text>
        <Card.Text>
          Volume:{" "}
          {new Intl.NumberFormat("eng", {
            style: "currency",
            currency: "USd",
          }).format(cryptoObj["1d"].volume)}
          <Icon
            name={`${
              cryptoObj["1d"].volume_change_pct * 100 > 0
                ? "arrow up"
                : "arrow down"
            }`}
            className={`${
              cryptoObj["1d"].volume_change_pct * 100 > 0
                ? "arrow-up"
                : "arrow-down"
            }`}
          />
          <span
            className={`number-is-${
              cryptoObj["1d"].volume_change_pct * 100 > 0
                ? "positive"
                : "negative"
            }`}
          >
            {(cryptoObj["1d"].volume_change_pct * 100).toFixed(2)}
          </span>
          %
        </Card.Text>
        <Card.Text>
          Price:{" "}
          {new Intl.NumberFormat("eng", {
            style: "currency",
            currency: "USd",
          }).format(cryptoObj.price)}
          <Icon
            name={`${
              cryptoObj["1d"].price_change_pct * 100 > 0
                ? "arrow up"
                : "arrow down"
            }`}
            className={`${
              cryptoObj["1d"].price_change_pct * 100 > 0
                ? "arrow-up"
                : "arrow-down"
            }`}
          />
          <span
            className={`number-is-${
              cryptoObj["1d"].price_change_pct * 100 > 0
                ? "positive"
                : "negative"
            }`}
          ></span>
          <span
            className={`number-is-${
              cryptoObj["1d"].price_change_pct * 100 > 0
                ? "positive"
                : "negative"
            }`}
          >
            {(cryptoObj["1d"].price_change_pct * 100).toFixed(2)}
          </span>
          %
        </Card.Text>
        {isHomePage === true ? null : (
          <>
            <Button
              variant="danger"
              type="button"
              onClick={() => deleteCrypto(cryptoObj.id)}
            >
              Delete
            </Button>
            {homePage !== true ? (
              <Button
                className="m-2"
                variant="outline-primary"
                type="button"
                onClick={() => saveToHomePage(cryptoObj.id)}
              >
                Save To Home
              </Button>
            ) : (
              <Button
                className="m-2"
                variant="outline-danger"
                type="button"
                onClick={() => unSaveFromHomePage(cryptoObj.id)}
              >
                Remove From Home
              </Button>
            )}
            <ButtonGroup>
              <Button
                type="button"
                onClick={() => {
                  toggle("oneDay");
                  graphMaker(true, "One Day Graph", cryptoObj.id);
                }}
              >
                Day Graph
              </Button>
              <Button
                type="button"
                onClick={() => {
                  toggle("oneWeek");
                  graphMaker(true, "One Week Graph", cryptoObj.id);
                }}
              >
                Week Graph
              </Button>
              <Button
                type="button"
                onClick={() => {
                  toggle("oneMonth");
                  graphMaker(true, "One Month Graph", cryptoObj.id);
                }}
              >
                Month Graph
              </Button>
            </ButtonGroup>
            {showOneDayGraph || showOneMonthGraph || showOneWeekGraph ? (
              <>
                <Button
                  variant="outline-danger"
                  type="button"
                  onClick={() => {
                    setShowOneDayGraph(false);
                    setShowOneWeekGraph(false);
                    setShowOneMonthGraph(false);
                  }}
                >
                  Cancel
                </Button>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    scales: {
                      xAxes: [
                        {
                          ticks: {
                            display: false,
                          },
                          gridLines: {
                            display: false,
                          },
                        },
                      ],
                    },
                    pan: {
                      enabled: true,
                      mode: "xy",
                      speed: 10,
                    },
                    zoom: {
                      enabled: true,
                      drag: false,
                      mode: "xy",
                      rangeMin: {
                        x: 0,
                        y: 0,
                      },
                      rangeMax: {
                        x: 1500,
                        y: 1500,
                      },
                    },
                  }}
                />
              </>
            ) : null}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default CryptoCard;
