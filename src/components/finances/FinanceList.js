import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import './FinanceList.css'
import FinanceCard from './FinanceCard';
import { fixNum, MonthNameMaker } from '../../modules/helpers';
import { Button } from 'react-bootstrap'
import { Doughnut } from 'react-chartjs-2'

const FinanceList = props => {
  const [finances, setFinances] = useState([]);
  const [totalFinance, setTotalFinance] = useState({});
  const [chartData, setChartData] = useState({})

  let date = new Date().toISOString()
  const monthInput = MonthNameMaker("month", date)
  const yearInput = MonthNameMaker("year", date)

  useEffect(() => {
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance.length === 0) return
      setTotalFinance(totalFinance[0])
      setFinances(totalFinance[0].finances)
      combineAllFinances()
    })
  }, [props.userId]);

  const deleteFinance = obj => {
    apiManager.getTotalFinances(obj.totalFinanceId).then(totalFinance => {
      if(obj.bill) {
        totalFinance.allBills = fixNum(totalFinance.allBills -= obj.amount)
      } else {
        totalFinance.allIncome = fixNum(totalFinance.allIncome -= obj.amount)
      }
      totalFinance.amountLeft = totalFinance.amountLeft - obj.amount
      delete totalFinance.finances
      setTotalFinance(totalFinance)
      apiManager.put("totalFinances", totalFinance)
    }).then(() => apiManager.delete("finances", obj.id)).then(() => {
      apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
        console.log(totalFinance)
        if(totalFinance.length === 0) return
        setTotalFinance(totalFinance[0])
        setFinances(totalFinance[0].finances)
        combineAllFinances()
      })
    })
  }

  const combineAllFinances = () => {
    apiManager.getByUserId('finances', props.userId).then(finances => {
      if(finances.length === 0) return
      let names = finances.map(finance => finance.name);
      let values = finances.map(finance => finance.amount);
      let colors = []
      for (let i = 0; i < values.length; i++) {
        // maybe do a specific color for expense and income
        // so a user can see money coming in and out
        // const value = values[i];
        let color = ''
        // if(value < 0) color = `#4BB187`
        // if(value > 0) color = `#EF3B3B`
        let aValue = Math.floor(Math.random() * 256)        
        let bValue = Math.floor(Math.random() * 256)        
        let cValue = Math.floor(Math.random() * 256)
        let dValue = Math.floor(Math.random() * 256)
        color = `rgba(${aValue}, ${bValue}, ${cValue}, ${dValue})`
        colors.push(color)     
      }
      setChartData({
        labels: names,
        datasets: [
          {
            label: `all expenses and income for the month of ${monthInput}`,
            data: values,
            backgroundColor : colors,
            borderWidth: 4
          }
        ]
      })
    })
  }

  return (
    <>
      <section className="section-content">
        <div>
          <h3>Amount left to spend this month {totalFinance.amountLeft}</h3>
          <p>Total amount spent on bills this month {totalFinance.allBills}</p>
          <p>Total amount of income this month {totalFinance.allIncome}</p>
        </div>
        <div>
          <Doughnut data={chartData}/>
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