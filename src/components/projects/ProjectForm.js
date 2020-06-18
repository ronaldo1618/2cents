import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { Container, Jumbotron, Form, InputGroup, Button } from 'react-bootstrap'

const ProjectForm = props => {
  const [project, setProject] = useState({name: "", startDate: "", completionDate: "", goalAmount: 0, amountIn: 0})

  const handleChange = e => {
    const stateToChange = { ...project };
    stateToChange[e.target.id] = e.target.value;
    setProject(stateToChange);
  }

  useEffect(() => {
    if(props.match.params.projectId) {
      apiManager.getById('projects', props.match.params.projectId).then(obj => {
        setProject(obj)
      })
    }
  },[props.match.params.projectId])

  const editProject = e => {
    e.preventDefault();
    const editedProject = {
      id: props.match.params.projectId,
      name: project.name,
      startDate: project.startDate,
      completionDate: project.completionDate,
      goalAmount: parseFloat(project.goalAmount).toFixed(2),
      amountIn: parseFloat(project.amountIn).toFixed(2),
      userId: props.userId
    }
    apiManager.put('projects', editedProject).then(() => props.history.push("/projects"))
  }

  const createNewProject = e => {
    e.preventDefault();
    // add catch clauses
    project.goalAmount = parseFloat(project.goalAmount).toFixed(2)
    project.amountIn = parseFloat(project.amountIn).toFixed(2)
    project.userId = props.userId
    apiManager.post('projects', project).then(() => props.history.push("/projects"))
  }

  return (
    <Container>
      <Jumbotron>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control type="text" id="name" required onChange={handleChange} placeholder="College Fund" value={project.name}/>
          </Form.Group>
          <Form.Group>
              <Form.Label htmlFor="startDate">Start Date</Form.Label>
              <input type="date" id="startDate" required onChange={handleChange} value={project.startDate}/>
          </Form.Group>
          <Form.Group>
              <Form.Label htmlFor="completionDate">Complete Date</Form.Label>
              <input type="date" id="completionDate" required onChange={handleChange} value={project.completionDate}/>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="goalAmount">Goal Amount</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
            <Form.Control type="number" id="goalAmount" required onChange={handleChange} placeholder="350" value={Math.abs(project.goalAmount).toString()}/>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="amountIn">Amount In</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
            <Form.Control type="number" id="amountIn" required onChange={handleChange} placeholder="350" value={Math.abs(project.amountIn).toString()}/>
            </InputGroup>
          </Form.Group>
          {
          props.match.params.projectId ?
          <Button type="button" onClick={editProject}>Submit</Button>
          :
          <Button type="button" onClick={createNewProject}>Submit</Button>
          }
        </Form>
      </Jumbotron>
    </Container>
  )
}

export default ProjectForm;