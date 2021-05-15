import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import GetParamsForm from './GetParamsForm'
import * as Service from '../services/communication';

import DeleteIcon from '@material-ui/icons/Delete';
    
import FolderTree, { testData } from 'react-folder-tree';




// export const RunJobForm = () => {
//   const onTreeStateChange = state => console.log('tree state: ', state);
//   console.log(testData);

//   return (
//     <FolderTree
//       data={ testData }
//       onChange={ onTreeStateChange }
//     />
//   );
// };

// export default RunJobForm;

class RunJobForm extends React.Component{
  constructor(props) {
      super(props);
      this.state={
          parameters: [],
          queryParameter: '',
          queryOperator: '=',
          queryValue: '',
          predictionVariables: [],
          queries: [],  //[["weather", "=", "summer"],[...]]
          models: [],
          selectedModel: '',
          modelParams: [],
    };

    this.fetchParameters();
    this.fetchModelNames();
    this.fetchTargetVariables();
  }

  fetchParameters(){
    const promise = Service.fetchParameters();
    promise.then((data) => {
      if(data !== undefined){
        if (data["data"] != null){   // if there are parameters to display
            this.setState({parameters: data["data"]});
        }
        else{
            // alert(data["msg"])
            this.setState({parameters: "There are no available parameters..."});   // no parameters to display
        }
      }});
  }

  fetchModelNames(){
    const promise = Service.fetchModelNames();
    promise.then((data) => {
      console.log(data)
      if(data !== undefined){
        console.log(data)
        if (data != null){   // if there are parameters to display
            this.setState({models: data});
        }
        else{
            // alert(data["msg"])
            this.setState({models: "There are no available models..."});   // no parameters to display
        }
      }});
  }

  fetchTargetVariables(){
    const promise = Service.fetchTargetVariables();
    promise.then((data) => {
      if(data !== undefined){
        if (data["data"] != null){   // if there are parameters to display
            this.setState({predictionVariables: data["data"]});
        }
        else{
            // alert(data["msg"])
            this.setState({predictionVariables: "There are no available target variables..."});   // no parameters to display
        }
      }});
  }

  isAllOperator(){
    if(this.state.queryOperator == "All"){
          return true;
    }
    return false;
  }

  addQuery(){
    var queryStr = this.state.queryParameter + this.state.queryOperator + this.state.queryValue;
    console.log(queryStr);
    this.state.queries.push([this.state.queryParameter, this.state.queryOperator, this.state.queryValue]);
    console.log(this.state.queries);

  }

  fetchModelParams(){
    const promise = Service.fetchModel();
    promise.then((data) => {
      if(data !== undefined){
        if (data["data"] != null){   // if there are parameters to display
            this.setState({modelParams: data["data"]});
        }
        else{
            // alert(data["msg"])
            this.setState({modelParams: "There are no available models..."});   // no parameters to display
        }
      }});
  }

  submitJob(){
    alert("yay");
    // const promise = Service.submitJob();
    // promise.then((data) => {
    //   alert("yay");
    //   });
  }
  

  render(){
    return(
      <div>
        <div style={{marginTop:"1%", marginLeft: "25%", marginRight: "25%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h3>Run Job:</h3>
        </div>

        <Form>
          <Form.Group as={Row}>
          <Form.Label column sm="9">Please select a subset of the flights that you would like to use:</Form.Label>
          </Form.Group>

          <Form.Group as={Row}>
              <Col>
                <Form.Control as="select" value={this.queryParameter} 
                onChange={event => this.setState({queryParameter: event.target.value})}>
                  <option>Select Parameter</option>
                    {this.state.parameters !== null ?
                        this.state.parameters.map(parameter => (
                        <option value={parameter}>{parameter}</option>
                        ))
                        : null
                    }
                </Form.Control>
                <Form.Text className="text-muted">
                  Select according to which parameter you would like to filter the flights.
                </Form.Text>
              </Col>
              <Col sm={3}>
                <Form.Control as="select" value={this.queryOperator} 
                onChange={event => this.setState({queryOperator: event.target.value})}>
                  <option value={'='}> {'='} </option>
                  <option value={'<='}> {'<='} </option>
                  <option value={'>='}> {'>='} </option>
                  <option value={'Range'}> {'Range'} </option>
                  <option value={'All'}> {'All'} </option>
                </Form.Control>
                <Form.Text className="text-muted">
                  Select the operator for your query.
                </Form.Text>
              </Col>  
              <Col>
                <Form.Control type="text" placeholder="" disabled={this.isAllOperator()} value={this.queryValue}
                onChange={event => this.setState({queryValue: event.target.value})}/>
                <Form.Text className="text-muted">
                Enter the value.
                </Form.Text>
                <Form.Text className="text-muted">
                * For Range - please enter in the following format: (lower_value, upper_value)
                </Form.Text>
              </Col>
              <Col sm={1}>
              <Button variant="info" onClick= {(() => {this.addQuery()})}>
                  Add
              </Button>
            </Col>
          </Form.Group>

          <br />
          {/* <Button variant="info" onClick= {(event => {this.addQuery()})}>
              Add
          </Button> */}

          {/* <br /> */}
          {/* <Container fluid> */}
          <Jumbotron id='jumbotron' fluid>
          <List>
            <ListItem>
              <ListItemText primary="Queries" />
            </ListItem>
          </List>
          </Jumbotron>
          {/* </Container> */}

          <br />

          <Form.Group as={Row}>
            <Form.Label column sm="4">Select the target variable:</Form.Label>
            <Col>
              {/* <Form.Control type="text" placeholder="" /> */}
              <Form.Control as="select" value={this.queryOperator} 
                onChange={event => this.setState({selectedModel: event.target.value})}>
                  <option>Select Variable</option>
                    {this.state.predictionVariables !== null ?
                        this.state.predictionVariables.map(variable => (
                        <option value={variable}>{variable}</option>
                        ))
                        : null
                    }
              </Form.Control>
              <Form.Text className="text-muted">
              Select the name of the target variable that will be used for predictions.
              </Form.Text>
            </Col> 
          </Form.Group>

          <br />

          <Form.Group as={Row}>
              <Form.Label column sm="3">Select model:</Form.Label>
              <Col column sm="6"> 
                <Form.Control as="select" value={this.queryOperator} 
                onChange={event => this.setState({selectedModel: event.target.value})}>
                  <option>Select Model</option>
                    {this.state.models !== null ?
                        this.state.models.map(model => (
                        <option value={model}>{model}</option>
                        ))
                        : null
                    }
                </Form.Control>
                <Form.Text className="text-muted">
                Select the name of the model you would like to use.
                </Form.Text>
              </Col> 
              
              <Col column sm="3">
                <Button variant="info" size="md" onClick= {() => {this.fetchModelParams()}}> 
                  Fetch Model 
                </Button>
              </Col> 
          </Form.Group>

          

          <br />

          <Form.Group as={Row}>
            <GetParamsForm parameters={this.state.modelParams} />
          </Form.Group>

          <Button variant="info" size="md" onClick={() => {this.submitJob()}}> 
            Submit Job 
          </Button>

        </Form>
      </div>

    );
  }

}

export default RunJobForm;