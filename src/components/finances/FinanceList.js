import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import FinanceCard from './FinanceCard';
import { fixNum, MonthNameMaker } from '../../modules/helpers';
import { Doughnut } from 'react-chartjs-2'
import './FinanceList.css'

const FinanceList = props => {
  const [finances, setFinances] = useState([]);
  const [totalFinance, setTotalFinance] = useState({});
  const [chartData, setChartData] = useState({})
  const [newUser, setNewUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  let date = new Date().toISOString()
  const monthInput = MonthNameMaker("month", date)
  const yearInput = MonthNameMaker("year", date)

  useEffect(() => {
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance.length === 0) return setNewUser(!newUser)
      setTotalFinance(totalFinance[0])
      setIsLoading(!isLoading)
      setFinances(totalFinance[0].finances)
      combineAllFinances(totalFinance[0].finances)
    })
  }, [props.userId]);

  const deleteFinance = obj => {
    apiManager.getTotalFinances(obj.totalFinanceId).then(totalFinance => {
      if(obj.bill) {
        totalFinance.allBills = Number(fixNum(totalFinance.allBills -= obj.amount))
      } else {
        totalFinance.allIncome = Number(fixNum(totalFinance.allIncome -= obj.amount))
      }
      totalFinance.amountLeft = totalFinance.amountLeft - obj.amount
      totalFinance.amountLeft = Number(fixNum(totalFinance.amountLeft))
      delete totalFinance.finances
      setTotalFinance(totalFinance)
      apiManager.put("totalFinances", totalFinance)
    }).then(() => apiManager.delete("finances", obj.id)).then(() => {
      apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
        if(totalFinance.length === 0) return
        setTotalFinance(totalFinance[0])
        setIsLoading(true)
        setFinances(totalFinance[0].finances)
        combineAllFinances(totalFinance[0].finances)
      })
    })
  }

  const combineAllFinances = (finances) => {
    if(finances.length === 0) return
    let names = finances.map(finance => finance.name);
    let values = finances.map(finance => finance.amount);
    let colors = []
    for (let i = 0; i < values.length; i++) {
      // maybe do a specific color for expense and income
      let aValue = Math.floor(Math.random() * 256)        
      let bValue = Math.floor(Math.random() * 256)        
      let cValue = Math.floor(Math.random() * 256)
      let dValue = Math.floor(Math.random() * 256)
      let color = `rgba(${aValue}, ${bValue}, ${cValue}, ${dValue})`
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
  }

  const [budget, setBudget] = useState({})
  const [checkBudgetRule, setCheckBudgetRule] = useState(false)

  const budgetRule = () => {
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance.length === 0) return
      setBudget({
        expenses: totalFinance[0].allIncome * .50,
        wants: totalFinance[0].allIncome * .30,
        savings: totalFinance[0].allIncome * .20
      })
    })
  }

  return (
    <>
      <section className="section-content">
        {
          newUser ?
          <div className="ta-container">
            <h1>Get Started Tracking Your Expenses Today!</h1>
          </div>
          :
          <div className="ta-container">
          {
            isLoading ?
            <div className="ta-jumbotron-homepage">
              <p className="display-4">Amount to spend this month <span className={`number-is-${totalFinance.amountLeft > 0 ? 'positive' : 'negative'}`}>${Math.abs(totalFinance.amountLeft)}</span></p>
              <hr/>
              <p>Total amount spent on bills this month <span className={`number-is-${totalFinance.allBills > 0 ? 'positive' : 'negative'}`}>${Math.abs(totalFinance.allBills)}</span></p>
              <p>Total amount of income this month <span className={`number-is-${totalFinance.allIncome > 0 ? 'positive' : 'negative'}`}>${Math.abs(totalFinance.allIncome)}</span></p>
            </div>
            : null
          }
          </div>
        }
        <div className="chart-container">
          <div className="w-50 ta-card ta-jumbotron">
            <Doughnut className="doughnut-data" data={chartData}/>
          </div>
        </div>
        <hr/>
        <div className="budget-container">
          <h4>Are you following the 50/30/20 budget rule?</h4>
          <input type="button" value="Check" className="btn-new" onClick={() => {
            let result = budgetRule()
            setCheckBudgetRule(!checkBudgetRule)
            }}/>
          {
            checkBudgetRule ?
            <div>
              <h4>Based on your income, you should be putting:</h4>
              <ul>
                <li>${budget.expenses} towards your needs</li>
                <li>${budget.wants} towards things you want</li>
                <li>${budget.savings} towards savings</li>
              </ul>
            </div>
            : null
          }
        </div>
        <hr/>
        <div className="budget-container">
          <input type="button" value="New Entry" className="btn-new" onClick={() => {props.history.push("./finances/form")}}/>
        </div>
      </section>
      <div className="finance-cards">
        {finances.map(finance => <FinanceCard key={finance.id} financeObj={finance} deleteFinance={deleteFinance} objURL="finances" {...props}/>)}
      </div>
    </>
  );
}

export default FinanceList;