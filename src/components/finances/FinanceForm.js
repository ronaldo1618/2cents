import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { MonthNameMaker, fixNum } from '../../modules/helpers';
import { Container, Jumbotron, Button } from 'react-bootstrap';


const FinanceForm = props => {
  const [bill, setBill] = useState(false);
  const [expenseObj, setExpenseObj] = useState({});


  const addToTotalAmount = e => {
    e.preventDefault();
    expenseObj.userId = props.userId
    expenseObj.bill = bill
    if(bill === true) expenseObj.amount *= -1
    if(bill === false) expenseObj.amount = Math.abs(expenseObj.amount)
    expenseObj.amount = fixNum(expenseObj.amount)
    let monthInput = MonthNameMaker("month", expenseObj.date)
    let yearInput = MonthNameMaker("year", expenseObj.date)
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
          apiManager.post("finances", expenseObj).then(newFinance => {
            apiManager.getByUserId("finances", props.userId).then(props.history.push('/finances'))
          })
        })
      } else {
        // Update existing totalFinance and do all the calculations
        if(expenseObj.amount < 0) existingTotalFinance.allBills += expenseObj.amount
        if(expenseObj.amount > 0) existingTotalFinance.allIncome += expenseObj.amount
        existingTotalFinance.amountLeft = existingTotalFinance.allIncome + existingTotalFinance.allBills
        delete existingTotalFinance.finances
        //  Create currency calculator so values dont go lower than two decimal places
        apiManager.put("totalFinances", existingTotalFinance).then(existingTotalFinance => {
          expenseObj.totalFinanceId = existingTotalFinance.id
          apiManager.post("finances", expenseObj).then(newFinance => {
            apiManager.getByUserId("finances", props.userId).then(props.history.push('/finances'))
          })
        })
      }
    })
  }

  // const createNewTotalFinance = (expenseObj, totalExpenseObj) => {
  //   if(expenseObj.amount < 0) {
  //     totalExpenseObj.allBills = expenseObj.amount
  //     totalExpenseObj.allIncome = 0
  //   }
  //   if(expenseObj.amount > 0) {
  //     totalExpenseObj.allIncome = expenseObj.amount
  //     totalExpenseObj.allBills = 0
  //   }
  //   totalExpenseObj.amountLeft = totalExpenseObj.allIncome + totalExpenseObj.allBills
  //   apiManager.post("totalFinances", totalExpenseObj).then(newTotalFinance => {
  //     expenseObj.totalFinanceId = newTotalFinance.id
  //     return expenseObj;
  //   })
  // }

  // const updateExistingTotalFinance = (expenseObj, existingTotalFinance) => {
  //   console.log(existingTotalFinance)
  //   if(expenseObj.amount < 0) existingTotalFinance.allBills += expenseObj.amount
  //   if(expenseObj.amount > 0) existingTotalFinance.allIncome += expenseObj.amount
  //   existingTotalFinance.amountLeft = existingTotalFinance.allIncome + existingTotalFinance.allBills
  //   delete existingTotalFinance.finances
  //   //  Create currency calculator so values dont go lower than two decimal places
  //   apiManager.put("totalFinances", existingTotalFinance).then(existingTotalFinance => {
  //     expenseObj.totalFinanceId = existingTotalFinance.id
  //     return expenseObj;
  //   })
  // }

  const handleChange = e => {
    // setDate(e.target.value)
    console.log(e.target.value)
    console.log(new Date())
    console.log(new Date().toUTCString())
    console.log(Date.now())
    const stateToChange = { ...expenseObj };
    stateToChange[e.target.id] = e.target.value;
    setExpenseObj(stateToChange)
  }



  // Updating Finance
  const [finance, setFinance] = useState({})
  const editFinance = e => {
    e.preventDefault();
    const editedFinance = {
      id: props.match.params.financeId,
      name: finance.name,
      amount: finance.amount,
      totalFinanceId: finance.totalFinanceId
    };
    console.log(editedFinance)
    apiManager.put('finances', editedFinance).then(() => {
      // fix totalFinance
      // Maybe make a helper function out of this
    })
  }

  useEffect(() => {
    if(props.match.params.financeId) {
      apiManager.getById('finances', props.match.params.financeId).then(setFinance)
    }
  }, [props.match.params.financeId])

  return (
    <Container className="d-flex justify-content-center">
        <Jumbotron className="w-50 d-flex justify-content-center">
          <fieldset>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" required onChange={handleChange} placeholder="Gas Bill" value={finance.name}/>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" required onChange={handleChange} placeholder="$" value={finance.amount}/>
            <label htmlFor="date">date</label>
            <input type="date" id="date" required onChange={handleChange} value={finance.date}/>
            <div className="checkbox">
            <label htmlFor="bill">Bill?</label>
            <input type="checkbox" id="bill" checked={finance.bill} onClick={() => setBill(!bill)}/>
            </div>
            {
              props.match.params.financeId ?
              <Button type="button" onClick={editFinance}>Submit</Button>
              : <Button type="button" onClick={addToTotalAmount}>Submit</Button>
            }
          </fieldset>
        </Jumbotron>
      </Container>
  )
}

export default FinanceForm;