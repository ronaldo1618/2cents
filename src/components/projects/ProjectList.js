import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import ProjectCard from './ProjectCard';

const ProjectList = props => {
  const [projects, setProjects] = useState([]);

  const getProjects = () => {
    return apiManager.get('projects', props.userId).then(setProjects)
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <>
      <div>
      {
        projects.map(project => <ProjectCard key={project.id} projectObj={project} {...props}/>)
      }
      </div>
    </>
  )
}

export default ProjectList;