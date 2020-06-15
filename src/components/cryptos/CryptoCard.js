// import React from 'react';
// import { Button, Card } from 'react-bootstrap';

// const CryptoCard = ({cryptoObj, history, deleteCrypto, savedCryptoId}) => {
//   return (
//     <Card>
//       <Card.Body>
//         <Card.Title>{cryptoObj.name} / {cryptoObj.id}</Card.Title>
//           <Card.Text>Market Cap:{cryptoObj.market_cap}</Card.Text>
//           <Card.Text>Market Cap Change:{(cryptoObj["1d"].market_cap_change_pct * 100).toFixed(2)}%</Card.Text>
//           <Card.Text>Volume: {cryptoObj["1d"].volume}</Card.Text>
//           <Card.Text>Volume Change: {(cryptoObj["1d"].volume_change_pct*100).toFixed(2)}%</Card.Text>
//           <Card.Text>Price: {cryptoObj.price}</Card.Text>
//           <Card.Text>Price Change: {(cryptoObj["1d"].price_change_pct * 100).toFixed(2)}%</Card.Text>
//           <Button onClick={() => deleteCrypto(cryptoObj.id)}>Delete</Button>
//       </Card.Body>
//     </Card>
//   )
// }

// export default CryptoCard;