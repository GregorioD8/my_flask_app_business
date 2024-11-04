import React, { useState } from "react";

const MockPaymentForm = ({ session, onPaymentSubmit, onCancel }) => {
  const [amount, setAmount] = useState("120"); 
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiration || !cvc) {
      alert("Please fill in all payment details.");
      return;
    }
    onPaymentSubmit(session.id);
  };

  return (
    <div className="payment-form">
      <h3 className="form-header">Pay for {session.client_name}'s session</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiration">Expiration Date</label>
          <input
            type="text"
            id="expiration"
            placeholder="MM/YY"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvc">CVC</label>
          <input
            type="text"
            id="cvc"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-success">Pay</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default MockPaymentForm;