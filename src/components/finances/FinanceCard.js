import React from 'react';
import { Button, Card } from 'react-bootstrap';

const FinanceCard = ({financeObj, history, deleteFinance, toggleTrueFalse, isToggled, toggleId}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{financeObj.name}</Card.Title>
        <Card.Text>${financeObj.amount}</Card.Text>
        <Card.Text>{financeObj.date}</Card.Text>
        <hr/>
        <Button variant="outline-info" type="button" onClick={() => {
          history.push(`/finances/${financeObj.id}/details`)
        }}>Details</Button>
        <Button variant="outline-secondary" type="button" onClick={() => {
          history.push(`/finances/form/${financeObj.id}/`)
        }}>Edit</Button>
        <Button type="button" variant="danger" onClick={() => {
          deleteFinance(financeObj)
        }}>Delete</Button>
      </Card.Body>
    </Card>
  )
}

export default FinanceCard;