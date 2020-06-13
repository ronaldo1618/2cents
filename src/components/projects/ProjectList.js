import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import ProjectCard from './ProjectCard';
import { Button } from 'react-bootstrap';
// import { MonthNameMaker } from '../../modules/helpers';

const ProjectList = props => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    apiManager.get('projects', props.userId).then(setProjects)
  },[props.userId])

  const deleteProject = obj => {
    apiManager.delete('projects', obj.id).then(() => {
      apiManager.get('projects', props.userId).then(projects => setProjects(projects))
    })
  }

  const addAmountIn = (cont, obj) => {
    obj.amountIn += cont.amountIn

    // Come back to this if I want to add more complexity

    // let date = new Date().toISOString()
    // const monthInput = MonthNameMaker("month", date)
    // const yearInput = MonthNameMaker("year", date)
    // apiManager.getTotalFinancesWithAllFinances(yearInput, monthInput, obj.userId).then(results => {
    //   // will need to check if this actually exists
    //   results[0].allBills -= cont.amountIn
    //   results[0].amountLeft = results[0].allIncome + results[0].allBills
    //   delete results[0].finances
    //   apiManager.put('totalFinances', results[0]).then(totalFinance => {
    //     const contribution = {
    //       name: obj.name + " Contribution",
    //       amount: -cont.amountIn,
    //       date: date.split('T')[0],
    //       bill: true,
    //       userId: obj.userId,
    //       totalFinanceId: totalFinance.id
    //     }
    //     apiManager.post('finances', contribution)
        apiManager.put('projects', obj).then(() => {
          apiManager.get('projects', obj.userId).then(projects => setProjects(projects))
        })
    //   })
    // })
  }

  return (
    <>
      <Button type="button" className="btn" onClick={() => {props.history.push("./projects/form")}}>New Project</Button>
      <div>
      {
        projects.map(project => <ProjectCard key={project.id} projectObj={project} deleteProject={deleteProject} addAmountIn={addAmountIn} {...props}/>)
      }
      </div>
    </>
  )
}

export default ProjectList;