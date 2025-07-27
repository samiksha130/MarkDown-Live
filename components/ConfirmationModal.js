import { Modal, Button } from "react-bootstrap";
import React from "react";

const ConfirmationModal = ({ show, onConfirm, onCancel, title, message, children }) => {
  return (
    <Modal show={show} onHide={onCancel} centered >
      <Modal.Body className="text-center">
        <h5>{title}</h5>
        <p>{message}</p>
         {/* ✅ Agar koi extra content hai toh yaha dikhayenge (like format buttons) */}
         {children && <div>{children}</div>}
        <div className="d-flex justify-content-center gap-3 mt-3">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          {/* <Button variant="danger" onClick={onConfirm}>Ok</Button> */}
          {onConfirm && <Button variant="danger" onClick={onConfirm}>Ok</Button>}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;


