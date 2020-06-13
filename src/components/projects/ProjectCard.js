import React from 'react';
import { Button } from 'react-bootstrap'

const ProjectCard = ({projectObj, history, deleteProject}) => {
  return (
    <>
      <h3>{projectObj.name}</h3>
      <p>Start Date: {projectObj.startDate}</p>
      <p>Completion Date: {projectObj.completionDate}</p>
      <p>Goal Amount: ${projectObj.goalAmount}</p>
      <p>Total Contributions: ${projectObj.amountIn}</p>
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