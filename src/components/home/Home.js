import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { MonthNameMaker } from '../../modules/helpers';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './Home.css'


const Home = props => {
  const [totalFinance, setTotalFinance] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let date = new Date().toISOString()
    const monthInput = MonthNameMaker("month", date)
    const yearInput = MonthNameMaker("year", date)
    apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, props.userId).then(totalFinance => {
      if(totalFinance === '') return
      setTotalFinance(totalFinance[0])
      // setFinances(totalFinance[0].finances)
    })
    apiManager.get('projects', props.userId).then(setProjects)
  }, [props.userId]); 

  return (
    <>
      <h1>Home</h1>
      <div>
          <h3>Amount left to spend this month {totalFinance.amountLeft}</h3>
          <p>Total amount spent on bills this month {totalFinance.allBills}</p>
          <p>Total amount of income this month {totalFinance.allIncome}</p>
      </div>
      <div>
      {
        projects.map(project => 
        <div className="project-home" key={project.id}>
          <h1>{project.name}</h1>
          <CircularProgressbar 
            value={(project.amountIn/project.goalAmount * 100).toFixed(1)} 
            text={`${(project.amountIn/project.goalAmount * 100).toFixed(0)}%`}
            styles={buildStyles({
              pathColor: `#4BB187`,
              textColor: '#4BB187'
            })} />
        </div>)
      }
      </div>
    </>
  )
}

export default Home;