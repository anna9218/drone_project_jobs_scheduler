import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Service from '../services/communication';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';


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


}

function renderModelData(modelDetails){
  console.log(modelDetails);
  if (Object.keys(modelDetails).length === 0) { return; }

  // constructing metrics string 
  const metrics = modelDetails['metrics'];
  var metricsString = '';
  metrics.map((metric) => metricsString = metricsString + metric + ', ');
  metricsString = metricsString.slice(0, -2);

  // constructing target_values string
  const targetValues = modelDetails['target_values'];
  var targetValuesString = '';
  targetValues.map((targetValue) => targetValuesString = targetValuesString + targetValue + ', ');
  targetValuesString = targetValuesString.slice(0, -2);


  var keys = Object.keys(modelDetails);
  var modelDetailsNew = {}
  keys.map((key, index) => {
    switch (key) {
      case "metrics":
        modelDetailsNew[key] = metricsString;
        break;
      case "target_values":
        modelDetailsNew[key] = targetValuesString;
        break;
      default:
        modelDetailsNew[key] = modelDetails[key];
    }
  })

  var ModelData = keys.map((key, index) =>
    <div>
    <Form>
      <Form.Group as={Row}>
        <Form.Label column sm="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{key}: {modelDetailsNew[key]}</Form.Label>
      </Form.Group>
    </Form>
  </div>
  );

  return ModelData;
}

function Report(props) {

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
          <b>Model parameters:</b>
          
          {renderModelData(props.modelDetails)}
         
          <b>Model evaluation:</b>
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