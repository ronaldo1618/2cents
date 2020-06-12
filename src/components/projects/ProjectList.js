import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import ProjectCard from './ProjectCard';
import { Button } from 'react-bootstrap';

const ProjectList = props => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    apiManager.get('projects', props.userId).then(setProjects)
  },[props.userId])

  const deleteProject = id => {

  }

  return (
    <>
      <Button type="button" className="btn" onClick={() => {props.history.push("./projects/form")}}>New Project</Button>
      <div>
      {
        projects.map(project => <ProjectCard key={project.id} projectObj={project} deleteProject={deleteProject} {...props}/>)
      }
      </div>
    </>
  )
}

export default ProjectList;