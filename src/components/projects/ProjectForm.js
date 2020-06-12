import React, { useState, useEffect } from 'react';
import apiManager from '../../modules/apiManager';
import { Container, Jumbotron, Form, InputGroup, Button } from 'react-bootstrap'

const ProjectForm = props => {
  const [project, setProject] = useState({name: "", startDate: "", completionDate: "", goalAmount: 0, amountIn: 0})

  const handleChange = e => {
    const stateToChange = {...project};
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

  const editProject = () => {

  }

  const addToTotalAmount = () => {

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
              <Form.Label htmlFor="start-date">Start Date</Form.Label>
              <input type="date" id="start-date" required onChange={handleChange} value={project.startDate}/>
          </Form.Group>
          <Form.Group>
              <Form.Label htmlFor="completion-date">Complete Date</Form.Label>
              <input type="date" id="complete-date" required onChange={handleChange} value={project.completionDate}/>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="goal-amount">Goal Amount</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
            <Form.Control type="number" id="goal-amount" required onChange={handleChange} placeholder="350" value={Math.abs(project.goalAmount).toString()}/>
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
          <Button type="button" onClick={e => addToTotalAmount(e, project)}>Submit</Button>
          }
        </Form>
      </Jumbotron>
    </Container>
  )
}

export default ProjectForm;