import React from 'react';
import moment from 'moment'
import { Button, Card } from 'react-bootstrap';
import './FinanceCard.css'

const FinanceCard = ({financeObj, history, deleteFinance, toggleTrueFalse, isToggled, toggleId}) => {
  return (
    <Card className="finance-card ta-jumbotron">
      <Card.Body>
        <Card.Title>{financeObj.name}</Card.Title>
        <Card.Text className={`number-is-${financeObj.amount > 0 ? 'positive' : 'negative'}`}>${Math.abs(financeObj.amount)}</Card.Text>
        <Card.Text>{moment(financeObj.date, "YYYY-MM-DD").format("MMM Do YYYY")}</Card.Text>
        <hr/>
        <Button className="finance-btn" variant="outline-primary" type="button" onClick={() => {
          history.push(`/finances/form/${financeObj.id}/`)
        }}>Edit</Button>
        <Button className="finance-btn" type="button" variant="outline-danger" onClick={() => {
          deleteFinance(financeObj)
        }}>Delete</Button>
      </Card.Body>
    </Card>
  )
}

export default FinanceCard;