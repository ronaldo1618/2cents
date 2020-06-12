import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import './FinanceList.css'
import FinanceCard from './FinanceCard';
import { fixNum } from '../../modules/helpers';

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
    </>
  );
}

export default FinanceList;