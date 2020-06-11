import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { MonthNameMaker } from '../../modules/helpers';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './FinanceList.css'

//                        TODO
// xx Make Month Name Maker so I can call on it when needed
//          Post finances into finance object
// xx Make if statement to check for userId and monthName object in totalFinances collection
// if exists, grab that id and post finance object
// else, make new totalFinance object and grab that id and post finance object

const FinanceList = props => {
  // const [totalAmount, setTotalAmount] = useState(Number);
  // const [amount, setAmount] = useState(Number);
  // const [date, setDate] = useState("");
  // const [expenses, setExpenses] = useState([])
  const [billOrNot, setBillOrNot] = useState(false);
  const [expenseObj, setExpenseObj] = useState({});


  const addToTotalAmount = e => {
    e.preventDefault();
    expenseObj.userId = props.userId
    expenseObj.billOrNot = billOrNot
    if(billOrNot === true) expenseObj.amount *= -1
    if(billOrNot === false) expenseObj.amount = Math.abs(expenseObj.amount)
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
        createNewTotalFinance(expenseObj, totalExpenseObj)
      } else {
        // Update existing totalFinance and do all the calculations
        updateExistingTotalFinance(expenseObj, existingTotalFinance)
      }
      apiManager.post("finances", expenseObj).then(newFinance => {
        console.log(newFinance)
        apiManager.getByUserId("finances", props.userId).then(expenses => {
          console.log("expenses for this user", expenses)
        })
      })
    })
    // ExpenseManager.get("finances")
    //   .then(expenses => {
    //     const n = expenses.length - 1
    //     let month = expenses[n].date.split("-")[1]
    //     const year = expenses[n].date.split("-")[0]
    //     if(month < 10) month = month.split("0")[1]
    //     // if (date === "" || amount === 0 || name === "") return console.log("all fields must be filled out")
    //     // if (year < date.split("-")[0]) return console.log("this is a new year")
    //     // if (month !== monthInput) return console.log("this is a new month")
    //     setTotalAmount(totalAmount + amount)
    //     setExpenses(expenses)
    //     expenseObj.billOrNot = billOrNot;
    //     expenseObj.userId = props.userId
    //     // expenseObj.amount = totalAmount;
    //     console.log(expenseObj)
    //   })
  }

  const createNewTotalFinance = (expenseObj, totalExpenseObj) => {
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
      return expenseObj;
    })
  }

  const updateExistingTotalFinance = (expenseObj, existingTotalFinance) => {
    console.log(existingTotalFinance)
    if(expenseObj.amount < 0) existingTotalFinance.allBills += expenseObj.amount
        if(expenseObj.amount > 0) existingTotalFinance.allIncome += expenseObj.amount
        existingTotalFinance.amountLeft = existingTotalFinance.allIncome + existingTotalFinance.allBills
        delete existingTotalFinance.finances
        //  Create currency calculator so values dont go lower than two decimal places
        apiManager.put("totalFinances", existingTotalFinance).then(existingTotalFinance => {
          expenseObj.totalFinanceId = existingTotalFinance.id
          return expenseObj;
        })
  }
  
  const handleAmountChange = e => {
    // setAmount(+e.target.value)
    const stateToChange = { ...expenseObj };
    stateToChange[e.target.id] = e.target.value;
    setExpenseObj(stateToChange)
  }

  const handleDateChange = e => {
    // setDate(e.target.value)
    console.log(e.target.value)
    console.log(new Date())
    console.log(new Date().toUTCString())
    console.log(Date.now())
    const stateToChange = { ...expenseObj };
    stateToChange[e.target.id] = e.target.value;
    setExpenseObj(stateToChange)
  }

  // To make image appear and disappear
  const [isToggled, setToggled] = useState(false);
  const toggleTrueFalse = () => {
    setToggled(!isToggled);
  }

  // const [time, setTime] = useState(new Date().toLocaleTimeString())

  // const updateTime = () => {
  //   if (time !== new Date().toLocaleTimeString()) {
  //     setTime(new Date().toLocaleTimeString())
  //   }
  //   return time;
  // }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateTime()
  //   }, 1000)
  //   return () => clearInterval(interval)
  // }, [])

  return (
    <>
      <Container className="d-flex justify-content-center">
        <Jumbotron className="w-50 d-flex justify-content-center">
          <fieldset>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" required onChange={handleAmountChange} placeholder="Gas Bill"/>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" required onChange={handleAmountChange} placeholder="$"/>
            <label htmlFor="date">date</label>
            <input type="date" id="date" required onChange={handleDateChange}/>
            <div className="checkbox">
            <label htmlFor="billOrNot">Bill?</label>
            <input type="checkbox" id="billOrNot" onClick={() => setBillOrNot(!billOrNot)}/>
            </div>
            <Button type="button" onClick={addToTotalAmount}>Submit</Button>
          </fieldset>
        </Jumbotron>
      </Container>
      <div id="idk">
        <div id="checkbox" onClick={toggleTrueFalse}>
        {isToggled ? <img id="clicked" className="isk" src={require('./cb-click.svg')} alt="My Dog" /> : <img src={require('./cb-unclick.svg')} alt="clicked?" />}
        </div>
      </div>
      {/* <h2>{time}</h2> */}
      {/* <h2>
        {expenses.map(expense => <p key={expense.id}>{expense.name}: {expense.amount.toFixed(2)} on {expense.date}</p>)}
      </h2>
      <h2>{totalAmount}</h2>
      <h2>{date}</h2> */}
    </>
  );
}

export default FinanceList;