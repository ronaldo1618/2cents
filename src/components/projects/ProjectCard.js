import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const ProjectCard = ({ projectObj, history, deleteProject, addAmountIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountIn, setAmountIn] = useState({amountIn: ''});
  const toggle = () => setIsOpen(!isOpen);
  
  return (
    <div className="finance-card ta-jumbotron">
      <h3>{projectObj.name}</h3>
      <p>Start Date: {projectObj.startDate}</p>
      <p>Completion Date: {projectObj.completionDate}</p>
      <p>Goal Amount: ${projectObj.goalAmount}</p>
      <p>Total Contributions: ${projectObj.amountIn}</p>
      <Button className="finance-btn" type="button" onClick={toggle}>
        Details
      </Button>
      {isOpen ? (
        <>
          <Button variant="outline-secondary" type="button" onClick={() => history.push(`/projects/form/${projectObj.id}/`)}>Edit</Button>
          <Button type="button" variant="danger" onClick={() => deleteProject(projectObj)}>Delete</Button>
          <Form>
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
      ) : null}
    </div>
  );
};

export default ProjectCard;