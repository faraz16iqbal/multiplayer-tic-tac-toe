import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";

function Wait({ room, display }) {
  const textArea = useRef(null);
  const onClick = () => {
    textArea.current.select();
    document.execCommand("copy");
    alert("Code copied successfully");
  };

  const onHide = () => {
    //do nothing
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={display}
      className="text-center"
      onHide={onHide}
    >
      <Modal.Body style={{ margin: "0 auto" }}>
        <h4>Custom Room ID</h4>
        <h5>Give your friend the following room id to connect</h5>

        <input
          ref={textArea}
          readOnly={true}
          value={room}
          style={{ color: "black", marginBottom: "0", width: "100%" }}
        />
      </Modal.Body>
      <Modal.Footer style={{ margin: "0 auto" }}>
        <Button
          className="px-5 py-2"
          style={{ fontSize: "1.25rem" }}
          onClick={onClick}
        >
          Copy Code
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Wait;
