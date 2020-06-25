import React, { useState } from "react";
import moment from 'moment';
import { Button, Form, InputGroup } from "react-bootstrap";
import { Icon } from 'semantic-ui-react';

const ProjectCard = ({ projectObj, history, deleteProject, addAmountIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountIn, setAmountIn] = useState({amountIn: ''});
  const toggle = () => setIsOpen(!isOpen);
  
  return (
    <div className="project-card ta-jumbotron">
      <Icon className="icon-click" onClick={toggle} name="ellipsis horizontal"/>
      {isOpen ? (
        <>
          <h3>{projectObj.name}</h3>
          <p>Goal Amount: ${projectObj.goalAmount}</p>
          <p>Total Contributions: ${projectObj.amountIn}</p>
          <hr/>
          <Button variant="outline-secondary" type="button" onClick={() => history.push(`/projects/form/${projectObj.id}/`)}>Edit</Button>
          <Button type="button" variant="danger" onClick={() => deleteProject(projectObj)}>Delete</Button>
          <Form>
          <hr/>
          <Form.Group>
            <Form.Label htmlFor="amountIn">Amount To Contribute</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="number" id="amountIn" required onChange={e => {
                const stateToChange = { ...amountIn };
                stateToChange[e.target.id] = +e.target.value;
                setAmountIn(stateToChange);
              }} placeholder="350"/>
            </InputGroup>
          </Form.Group>
          </Form>
          <Button variant="outline-danger" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary" type="button" onClick={() => {
            setIsOpen(false)
            addAmountIn(amountIn, projectObj)}}>Add Contribution</Button>
        </>
      ) : 
      <>
        <h3>{projectObj.name}</h3>
        <p>Start Date: {moment(projectObj.startDate, "YYYY-MM-DD").format("MMM Do YYYY")}</p>
        <p>Completion Date: {moment(projectObj.completionDate, "YYYY-MM-DD").format("MMM Do YYYY")}</p>
        <p>Goal Amount: ${projectObj.goalAmount}</p>
        <p>Total Contributions: ${projectObj.amountIn}</p>
      </>}
    </div>
  );
};

export default ProjectCard;