import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import ProjectCard from './ProjectCard';
import { Container } from 'react-bootstrap';
import { Bar, Radar } from 'react-chartjs-2';

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
    obj.amountIn = Number(obj.amountIn.toFixed(2))
    apiManager.put('projects', obj).then(() => {
      apiManager.getByUserId('projects', obj.userId).then(projects => {
        if(projects.length === 0) return
        combineAllProjects()
        setProjects(projects)})
    })
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
    <Container>
      <hr className="pb-2"/>
      <div className="ta-container">
        <input type="button" className="m-3 btn-new" onClick={() => {props.history.push("./projects/form")}} value="New Project"/>
      </div>
      <hr className="pb-2"/>
      <div className="ta-container">
        <div className="w-50 p-5 ta-card ta-jumbotron">
        {
          !isOpen ?
          <>
          <div className="ta-container">
            <input className="m-2 btn-new" value="Show Bar Graph" type="button" onClick={toggle}/>
          </div>
          <Radar data={chartData}/>
          </>
        :
        <>
          <div className="ta-container">
            <input className="m-2 btn-new" value="Show Line Graph" type="button" onClick={toggle}/>
          </div>
          <Bar data={chartData}/>
        </>
        }
        </div>
      </div>
      <div className="finance-cards">
        {projects.map(project => <ProjectCard key={project.id} projectObj={project} deleteProject={deleteProject} addAmountIn={addAmountIn} {...props}/>)}
      </div>
    </Container>
  )
}

export default ProjectList;