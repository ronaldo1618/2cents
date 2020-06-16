import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import ProjectCard from './ProjectCard';
import { Button } from 'react-bootstrap';
import { Bar, Radar } from 'react-chartjs-2';
// import { MonthNameMaker } from '../../modules/helpers';

const ProjectList = props => {
  const [projects, setProjects] = useState([]);
  const toggle = () => setIsOpen(!isOpen);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    apiManager.getByUserId('projects', props.userId).then(projects => {
      if(projects.length === 0) return
      setProjects(projects)
      combineAllProjects()
    })
  },[props.userId])

  const deleteProject = obj => {
    apiManager.delete('projects', obj.id).then(() => {
      apiManager.getByUserId('projects', props.userId).then(projects => {
        if(projects.length === 0) return
        combineAllProjects()
        setProjects(projects)
      })
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
          apiManager.getByUserId('projects', obj.userId).then(projects => {
            if(projects.length === 0) return
            combineAllProjects()
            setProjects(projects)})
        })
    //   })
    // })
  }

  const [chartData, setChartData] = useState({})

  const combineAllProjects = () => {
    apiManager.getByUserId('projects', props.userId).then(projects => {
      if(projects.length === 0) return
      let names = projects.map(project => project.name)
      let values = projects.map(project => project.amountIn)
      setChartData({
        labels: names,
        datasets: [
          {
            label: 'Project Contributions',
            data: values,
            backgroundColor: [
              'rgba(195, 255, 240, 2)'
            ],
            borderWidth: 4
          }
        ]
      })
    })
  }

  return (
    <>
      <Button type="button" className="btn" onClick={() => {props.history.push("./projects/form")}}>New Project</Button>
      {
        !isOpen ?
      <div>
        <Button type="button" className="btn" onClick={toggle}>Show Bar Graph</Button>
        <Radar data={chartData}/>
      </div>
      :
      <div>
        <Button type="button" className="btn" onClick={toggle}>Show Line Graph</Button>
        <Bar data={chartData}/>
      </div>
      }
      <div>
      {
        projects.map(project => <ProjectCard key={project.id} projectObj={project} deleteProject={deleteProject} addAmountIn={addAmountIn} {...props}/>)
      }
      </div>
    </>
  )
}

export default ProjectList;