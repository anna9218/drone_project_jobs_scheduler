import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Service from '../services/communication';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

function renderJobData(reportData){
  console.log(reportData);

  var keys = Object.keys(reportData);
  var Fields = keys.map((key, index) =>
    <div>
    <Form>
      <Form.Group as={Row}>
        <Form.Label column sm="3">{key}: {reportData[key]}</Form.Label>
      </Form.Group>
    </Form>
  </div>
  );

  console.log(Fields);


  return Fields;
}

function Report(props) {

  
    // console.log(this.props);

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Model Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderJobData(props.reportData)}
          {/* <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </p> */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}


export default Report;