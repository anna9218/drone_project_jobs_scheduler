import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Service from '../services/communication';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

// MODEL DETAILS LOOK LIKE THIS:
// 'model_details': {'optimizer': "adam",
// 'metrics': ["accuracy", "recall", "precision"],
// 'iterations': 30,
// 'batch_size': 64,
// 'epochs': 500,
// 'neurons_in_layer': 200},


function renderJobData(reportData){
  console.log(reportData);
  var data = 
  <div>
    <Form>
     <Form.Group as={Row}>
         <Form.Label column sm="3">{reportData}</Form.Label>
     </Form.Group>
    </Form>
  </div>

  return data;


  // var keys = Object.keys(reportData);
  // var Fields = keys.map((key, index) =>
  //   <div>
  //   <Form>
  //     <Form.Group as={Row}>
  //       <Form.Label column sm="3">{key}: {reportData[key]}</Form.Label>
  //     </Form.Group>
  //   </Form>
  // </div>
  // );

  // console.log(Fields);

  // return Fields;
}

function renderModelData(modelDetails){
  console.log(modelDetails);

  if (Object.keys(modelDetails).length === 0) {
    return;
  }

  

  const metrics = modelDetails['metrics'];
  var metricsString = '';
  metrics.map((metric) => metricsString = metricsString + metric + ', ');
  metricsString = metricsString.slice(0, -2);

  var keys = Object.keys(modelDetails);

  var modelDetailsNew = {}
  keys.map((key, index) => {
    if (key === "metrics") {
      modelDetailsNew[key] = metricsString;
    }
    else {
      modelDetailsNew[key] = modelDetails[key];
    }
  })

  // modelDetails['metrics'] = metricsString;

  var ModelData = keys.map((key, index) =>
    <div>
    <Form>
      <Form.Group as={Row}>
        <Form.Label column sm="6">{key}: {modelDetailsNew[key]}</Form.Label>
      </Form.Group>
    </Form>
  </div>
  );

  return ModelData;
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
          Model parameters:
          {renderModelData(props.modelDetails)}
          Model evaluation:
          <pre>
          {renderJobData(props.reportData)}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}


export default Report;