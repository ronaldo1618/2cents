import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { MonthNameMaker } from '../../modules/helpers';

const Home = props => {
  // const [finances, setFinances] = useState([]);
  const [totalFinance, setTotalFinance] = useState({});

  const getTotalFinance = (monthInput, yearInput) => {
    return apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance === '') return
      setTotalFinance(totalFinance[0])
      // setFinances(totalFinance[0].finances)
    })
  }

  useEffect(() => {
    let date = new Date().toISOString()
    const monthInput = MonthNameMaker("month", date)
    const yearInput = MonthNameMaker("year", date)
    getTotalFinance(monthInput, yearInput)
  }, []);  

  return (
    <>
      <h1>Home</h1>
      <div>
          <h3>Amount left to spend this month {totalFinance.amountLeft}</h3>
          <p>Total amount spent on bills this month {totalFinance.allBills}</p>
          <p>Total amount of income this month {totalFinance.allIncome}</p>
      </div>
    </>
  )
}

export default Home;