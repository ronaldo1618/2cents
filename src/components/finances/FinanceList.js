import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import './FinanceList.css'
import FinanceCard from './FinanceCard';
import { fixNum, MonthNameMaker } from '../../modules/helpers';
import { Button } from 'react-bootstrap'

const FinanceList = props => {
  const [finances, setFinances] = useState([]);
  const [totalFinance, setTotalFinance] = useState({});

  useEffect(() => {
    let date = new Date().toISOString()
    const monthInput = MonthNameMaker("month", date)
    const yearInput = MonthNameMaker("year", date)
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance === '') return
      setTotalFinance(totalFinance[0])
      setFinances(totalFinance[0].finances)
    })
  }, [props.userId]);

  const deleteFinance = obj => {
    apiManager.getTotalFinances(obj.totalFinanceId).then(totalFinance => {
      console.log(totalFinance)
      if(obj.bill) {
        console.log(totalFinance)
        totalFinance.allBills = fixNum(totalFinance.allBills -= obj.amount)
      } else {
        totalFinance.allIncome = fixNum(totalFinance.allIncome -= obj.amount)
      }
      totalFinance.amountLeft = totalFinance.amountLeft - obj.amount
      setFinances(totalFinance.finances)
      delete totalFinance.finances
      setTotalFinance(totalFinance)
      apiManager.put("totalFinances", totalFinance)
    }).then(() => apiManager.delete("finances", obj.id))
  }

  return (
    <>
      <section className="section-content">
        <div>
          <h3>Amount left to spend this month {totalFinance.amountLeft}</h3>
          <p>Total amount spent on bills this month {totalFinance.allBills}</p>
          <p>Total amount of income this month {totalFinance.allIncome}</p>
        </div>
        <Button type="button" className="btn" onClick={() => {props.history.push("./finances/form")}}>New Entry</Button>
      </section>
      <div>
        {finances.map(finance => <FinanceCard key={finance.id} financeObj={finance} deleteFinance={deleteFinance} objURL="finances" {...props}/>)}
      </div>
    </>
  );
}

export default FinanceList;