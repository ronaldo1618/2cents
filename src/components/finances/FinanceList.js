import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import './FinanceList.css'
import FinanceCard from './FinanceCard';
import { fixNum } from '../../modules/helpers';

// const [totalAmount, setTotalAmount] = useState(Number);
// const [amount, setAmount] = useState(Number);
// const [date, setDate] = useState("");
// const [expenses, setExpenses] = useState([])

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

const FinanceList = props => {
  const [finances, setFinances] = useState([]);

  const getFinances = () => {
    return apiManager.getByUserId("finances", props.userId).then(setFinances);
  };

  useEffect(() => {
    getFinances()
  }, []);

  const deleteFinance = obj => {
    console.log(obj)
    apiManager.get('totalFinances', obj.totalFinanceId).then(totalFinance => {
      if(obj.bill) {
        console.log(totalFinance)
        totalFinance[0].allBills = fixNum(totalFinance[0].allBills -= obj.amount)
      } else {
        totalFinance[0].allIncome = fixNum(totalFinance[0].allIncome -= obj.amount)
      }
      totalFinance[0].amountLeft = fixNum(totalFinance[0].amountLeft -= obj.amount)
      apiManager.put("totalFinances", totalFinance[0])
    }).then(() => {
      apiManager.delete("finances", obj.id).then(getFinances)
    })
  }

  return (
    <>
      <section className="section-content">
        <button type="button" className="btn" onClick={() => {props.history.push("./finances/form")}}>New Entry</button>
      </section>
      <div>
        {finances.map(finance => <FinanceCard key={finance.id} financeObj={finance} deleteFinance={deleteFinance} objURL="finances" {...props}/>)}
      </div>
      {/* <h2>
        {expenses.map(expense => <p key={expense.id}>{expense.name}: {expense.amount.toFixed(2)} on {expense.date}</p>)}
      </h2>
      <h2>{totalAmount}</h2>
      <h2>{date}</h2> */}
    </>
  );
}

export default FinanceList;