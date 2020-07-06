import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import FinanceCard from './FinanceCard';
import moment from 'moment';
import { fixNum, MonthNameMaker } from '../../modules/helpers';
import { Doughnut, Line } from 'react-chartjs-2'
import { Modal, Button, InputGroup, Form } from 'react-bootstrap'
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
      setFinances(totalFinance[0].finances.sort(function (x, y) {
        return Date.parse(x.date) - Date.parse(y.date);
      }))
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

  const budgetRule = () => {
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance.length === 0) return
      setBudget({
        expenses: (totalFinance[0].allIncome * .50).toFixed(2),
        wants: (totalFinance[0].allIncome * .30).toFixed(2),
        savings: (totalFinance[0].allIncome * .20).toFixed(2)
      })
    })
  }

  const [show, setShow] = useState(false);
  const [str, setStr] = useState('');
  const [expenseGraph, setExpenseGraph] = useState({});
  const [showExpenseGraph, setShowExpenseGraph] = useState(false);
  const [showGraphButton, setShowGraphButton] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const search = e => {
    e.preventDefault();
    if(str === 'all') return viewAllEntries(e)
    if(str === 'bill' || str === 'bills') {
      return apiManager.getExpensesOnly(props.userId).then(result => {
        if(result.length === 0) return alert('nothing was found')
        setFinances(result.sort(function (x, y) {
          return Date.parse(x.date) - Date.parse(y.date);
        }));
        setShowGraphButton(true);
        setStr('')
      })
    }
    if(str === 'income') {
      return apiManager.getIncomeOnly(props.userId).then(result => {
        if(result.length === 0) return alert('nothing was found')
        setFinances(result.sort(function (x, y) {
          return Date.parse(x.date) - Date.parse(y.date);
        }));
        setShowGraphButton(true);
        setStr('')
      })
    }
    if(str === '') {
      return apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
        if(totalFinance.length === 0) return setNewUser(!newUser)
        setTotalFinance(totalFinance[0])
        setIsLoading(!isLoading)
        setFinances(totalFinance[0].finances.sort(function (x, y) {
          return Date.parse(x.date) - Date.parse(y.date);
        }))
        combineAllFinances(totalFinance[0].finances)
        setShowGraphButton(false);
        setShowExpenseGraph(false);
        setStr('')
      })
    } else {
      apiManager.getByUserIdAndSearchTerm('finances', props.userId, str).then(result => {
        if(result.length === 0) return alert('nothing was found')
        setFinances(result.sort(function (x, y) {
          return Date.parse(x.date) - Date.parse(y.date);
        }));
        setShowGraphButton(true);
        setStr('')
      })
    }
  }

  const graphExpense = e => {
    e.preventDefault();
    let labels = []
    let data = []
    finances.forEach(finance => {
      data.push(Math.abs(finance.amount))
      labels.push(moment(finance.date, "YYYY-MM-DD").format("MMM Do YYYY"))
    })
    setExpenseGraph({
      labels: labels,
      datasets: [
        {
          label: ``,
          data: data,
          backgroundColor: "#4BB187",
        }
      ]
    })
    setShowExpenseGraph(!showExpenseGraph)
  }

  const viewAllEntries = e => {
    e.preventDefault();
    apiManager.getByUserId('finances', props.userId).then(result => {
      setFinances(result.sort(function (x, y) {
        return Date.parse(x.date) - Date.parse(y.date);
      }));
    })
    setStr('')
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
              <p className="display-4">Amount to spend for {totalFinance.month} <span className={`number-is-${totalFinance.amountLeft > 0 ? 'positive' : 'negative'}`}>${Math.abs(totalFinance.amountLeft.toFixed(2))}</span></p>
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
            handleShow()
            budgetRule()
            }}/>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>50/30/20 Budget Rule for {totalFinance.month}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Based on your income, you should be putting:</h4>
              <ul>
                <li>${budget.expenses} towards necessities</li>
                <li>${budget.wants} towards things you want</li>
                <li>${budget.savings} towards savings</li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <hr/>
        <div className="budget-container">
          <input type="button" value="New Entry" className="btn-new" onClick={() => {props.history.push("./finances/form")}}/>
        </div>
        <div className="d-flex justify-content-center">
          <div className="search-jumbotron">
            <InputGroup className="mb-3">
              <Form.Control type="text" id="name" required onChange={e => {
                setStr(e.target.value)}} value={str} placeholder='Search'/>
              <InputGroup.Append>
                <Button variant="outline-primary" type="button" onClick={search}>Search</Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
      {
        showGraphButton ?
        <div className="budget-container">
          <input type="button" value="Graph It!" className="btn-new" onClick={graphExpense}/>
        </div>
        :
        null
      }
      {
        showExpenseGraph ?
        <Line data={expenseGraph}/>
        :
        null
      }
      </section>
      <div className="finance-cards">
        {finances.map(finance => <FinanceCard key={finance.id} financeObj={finance} deleteFinance={deleteFinance} objURL="finances" {...props}/>)}
      </div>
    </>
  );
}

export default FinanceList;