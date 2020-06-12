import React from 'react';
import { Button } from 'react-bootstrap'

const ProjectCard = ({projectObj, history, deleteProject}) => {
  return (
    <>
      <h3>{projectObj.name}</h3>
      <p>{projectObj.startDate}</p>
      <p>{projectObj.completionDate}</p>
      <p>{projectObj.goalAmount}</p>
      <p>{projectObj.amountIn}</p>
      <Button variant="outline-secondary" type="button" onClick={() => {
          history.push(`/projects/form/${projectObj.id}/`)
        }}>Edit</Button>
      <Button type="button" variant="danger" onClick={() => {
          deleteProject(projectObj)
        }}>Delete</Button>
    </>
  )
}

export default ProjectCard;