import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { MonthNameMaker, fixNum } from '../../modules/helpers';
import { Container, Jumbotron, Button, Form, InputGroup } from 'react-bootstrap';

const FinanceForm = props => {
  const [bill, setBill] = useState(false);
  const [expenseObj, setExpenseObj] = useState({name: "", amount: "", totalFinanceId: 0, date: "", bill: false});
  const [oldExpenseObj, setOldExpenseObj] = useState({});

  const addToTotalAmount = (e, expenseObj) => {    
    e.preventDefault();
    if(!expenseObj.amount || !expenseObj.name || !expenseObj.date) return alert('must fill out all fields')
    expenseObj.amount = Math.abs(parseFloat(expenseObj.amount).toFixed(2))
    expenseObj.userId = props.userId
    expenseObj.bill = bill
    if(bill === true) expenseObj.amount *= -1
    if(bill === false) expenseObj.amount = Math.abs(expenseObj.amount)
    let oldMonthInput = ''
    let oldYearInput = ''
    if(props.match.params.financeId) {
      oldMonthInput = MonthNameMaker("month", oldExpenseObj.date)
      oldYearInput = MonthNameMaker("year", oldExpenseObj.date)
    }
    let monthInput = MonthNameMaker("month", expenseObj.date)
    let yearInput = MonthNameMaker("year", expenseObj.date)
    if(props.match.params.financeId) {
      if(oldMonthInput !== monthInput || oldYearInput !== yearInput) {
        apiManager.getTotalFinancesWithAllFinances(oldYearInput, oldMonthInput, props.userId).then(results => {
          let oldTotalFinance = results[0];
          if(oldExpenseObj.bill === true) {
            oldTotalFinance.allBills -= oldExpenseObj.amount;
            oldTotalFinance.allBills = fixNum(oldTotalFinance.allBills)
          } else {
            oldTotalFinance.allIncome -= oldExpenseObj.amount;
            oldTotalFinance.allIncome = fixNum(oldTotalFinance.allIncome)
          }
          oldTotalFinance.amountLeft = oldTotalFinance.allIncome + oldTotalFinance.allBills
          oldTotalFinance.amountLeft = fixNum(oldTotalFinance.amountLeft)
          delete oldTotalFinance.finances
          apiManager.put("totalFinances", oldTotalFinance).then(() => {
          })
        })
      }
    }
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(results => {
      const existingTotalFinance = results.find(result => result.year === yearInput && result.month === monthInput && result.userId === props.userId)
      if(!existingTotalFinance) {
        // Create a new totalFinance and do all the calculations 
        const totalExpenseObj = {
          month: monthInput,
          year: yearInput,
          userId: props.userId,
        }
        if(expenseObj.amount < 0) {
          totalExpenseObj.allBills = expenseObj.amount
          totalExpenseObj.allIncome = 0
        }
        if(expenseObj.amount > 0) {
          totalExpenseObj.allIncome = expenseObj.amount
          totalExpenseObj.allBills = 0
        }
        totalExpenseObj.amountLeft = totalExpenseObj.allIncome + totalExpenseObj.allBills
        apiManager.post("totalFinances", totalExpenseObj).then(newTotalFinance => {
          expenseObj.totalFinanceId = newTotalFinance.id
          if(props.match.params.financeId) {
            apiManager.put('finances', expenseObj).then(() => props.history.push('/finances'))
          } else {
            apiManager.post("finances", expenseObj).then(() => props.history.push('/finances'))
          }
        })
      } else {
        // Update existing totalFinance and do all the calculations
        if(props.match.params.financeId && monthInput === oldMonthInput && yearInput === oldYearInput) {
          oldExpenseObj.amount = fixNum(oldExpenseObj.amount)
          if(oldExpenseObj.bill === true) {
            if(expenseObj.bill === true && oldExpenseObj.amount !== expenseObj.amount) {
              existingTotalFinance.allBills -= oldExpenseObj.amount
              existingTotalFinance.allBills += expenseObj.amount
            }
            if(expenseObj.bill === false && oldExpenseObj.amount !== expenseObj.amount) {
              existingTotalFinance.allBills -= oldExpenseObj.amount
              existingTotalFinance.allIncome += expenseObj.amount
            }
          }
          if(oldExpenseObj.bill === false) {
            if(expenseObj.bill === false && oldExpenseObj.amount !== expenseObj.amount) {
              existingTotalFinance.allIncome -= oldExpenseObj.amount 
              existingTotalFinance.allIncome += expenseObj.amount
            }
            if(expenseObj.bill === true) {
              existingTotalFinance.allIncome -= oldExpenseObj.amount
              existingTotalFinance.allBills += expenseObj.amount
            }
          }
        }
        if(expenseObj.amount < 0 && monthInput !== oldMonthInput) {
          existingTotalFinance.allBills += expenseObj.amount
        } 
        if(expenseObj.amount > 0 && monthInput !== oldMonthInput) {
          existingTotalFinance.allIncome += expenseObj.amount
        } 
        if(oldExpenseObj.amount !== expenseObj.amount || monthInput !== oldMonthInput) existingTotalFinance.amountLeft = existingTotalFinance.allIncome + existingTotalFinance.allBills
        existingTotalFinance.allBills = fixNum(existingTotalFinance.allBills)
        existingTotalFinance.allIncome = fixNum(existingTotalFinance.allIncome)
        delete existingTotalFinance.finances
        apiManager.put("totalFinances", existingTotalFinance).then(existingTotalFinance => {
          expenseObj.totalFinanceId = existingTotalFinance.id
          if(props.match.params.financeId) {
            apiManager.put('finances', expenseObj).then(() => props.history.push('/finances'))
          } else {
            apiManager.post("finances", expenseObj).then(() => props.history.push('/finances'))
          }
        })
      }
    })
  }

  const handleChange = e => {
    const stateToChange = { ...expenseObj };
    stateToChange[e.target.id] = e.target.value;
    setExpenseObj(stateToChange)
  }

  // Updating Finance
  const editFinance = e => {
    e.preventDefault();
    const editedFinance = {
      id: props.match.params.financeId,
      name: expenseObj.name,
      amount: expenseObj.amount,
      date: expenseObj.date,
      totalFinanceId: expenseObj.totalFinanceId,
      bill: expenseObj.bill
    };
    addToTotalAmount(e, editedFinance)
  }

  useEffect(() => {
    if(props.match.params.financeId) {
      apiManager.getById('finances', props.match.params.financeId).then(obj => {
        setOldExpenseObj(obj)
        setExpenseObj(obj)
      })
  }},[props.match.params.financeId])

  return (
    <Container className="d-flex justify-content-center">
        <Jumbotron className="w-50 d-flex justify-content-center ta-jumbotron">
          <Form>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control type="text" id="name" required onChange={handleChange} placeholder="Gas Bill" value={expenseObj.name}/>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="amount">Amount</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control type="number" id="amount" required onChange={handleChange} placeholder="350" value={Math.abs(expenseObj.amount).toString()}/>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="date">Date</Form.Label>
              <input type="date" id="date" required onChange={handleChange} value={expenseObj.date}/>
            </Form.Group>
            <div>
                <label htmlFor="bill">Bill?</label>
                <input type="checkbox" id="bill" onClick={() => setBill(!bill)}/>
            </div>
            {
            props.match.params.financeId ?
            <Button type="button" onClick={editFinance}>Submit</Button>
            :
            <Button type="button" onClick={e => addToTotalAmount(e, expenseObj)}>Submit</Button>
            }
          </Form>
        </Jumbotron>
      </Container>
  )
}

export default FinanceForm;