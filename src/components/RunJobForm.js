import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import IconButton from '@material-ui/core/IconButton';

import GetParamsForm from './GetParamsForm'
import * as Service from '../services/communication';

import DeleteIcon from '@material-ui/icons/Delete';
    

class RunJobForm extends React.Component{
  constructor(props) {
      super(props);
    //   this.state={
    //       parameters: [],
    //       queryParameter: '',
    //       queryOperator: '=',
    //       queryValue: '',
    //       predictionVariables: ["Location"],
    //       selectedPredictionVariable: '',
    //       queriesForDisplay: [],
    //       queries: {},  //{'age': ['RangeType', min_value, max_value],
    //                     //'age': ['MinType', min_value],
    //                     //'hour': ['MaxType', max_value],...
    //                     // 'age': ['SpecificValuesType', value1, value2, ...]
    //                     // 'age': ['SpecificValuesType', value1]
    //                     // 'age': ['AllValuesType'] }
    //       models: [],
    //       selectedModel: '',
    //       modelParams: [],
    //       modelParamsToSend: {},
    // };
        this.state={
          parameters: ["age", "weather"],
          queryParameter: '',
          queryOperator: '=',
          queryValue: '',
          predictionVariables: ["Location"],
          selectedPredictionVariable: '',
          queriesForDisplay: [],
          queries: {},  //{'age': ['RangeType', min_value, max_value],
                        //'age': ['MinType', min_value],
                        //'hour': ['MaxType', max_value],...
                        // 'age': ['SpecificValuesType', value1, value2, ...]
                        // 'age': ['SpecificValuesType', value1]
                        // 'age': ['AllValuesType'] }
          models: ["LSTM", "GRU"],
          selectedModel: '',
          modelParams: [],
          modelParamsToSend: {},
    };

    
    this.fetchParameters();
    this.fetchModelNames();
    // this.fetchTargetVariables();
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
        console.log(data["data"])
        if (data["data"] != null){   // if there are models to display
            this.setState({models: data["data"]});
        }
        else{
            this.setState({models: "There are no available models..."});   // no parameters to display
        }
      }});
  }

  // fetchTargetVariables(){
  //   const promise = Service.fetchTargetVariables();
  //   promise.then((data) => {
  //     if(data !== undefined){
  //       if (data["data"] != null){   // if there are parameters to display
  //           this.setState({predictionVariables: data["data"]});
  //       }
  //       else{
  //           // alert(data["msg"])
  //           this.setState({predictionVariables: "There are no available target variables..."});   // no parameters to display
  //       }
  //     }});
  // }

  isAllOperator(){
    if(this.state.queryOperator == "All"){
          return true;
    }
    return false;
  }

  addQuery(){
    var queryStr = this.state.queryParameter + this.state.queryOperator + this.state.queryValue;
    this.setState({queriesForDisplay: [...this.state.queriesForDisplay, queryStr]})
    console.log(this.state.queriesForDisplay);

    if (this.state.queryOperator === 'Range') {
      this.state.queries[this.state.queryParameter] = ['RangeType', this.state.queryValue];
    }
    if (this.state.queryOperator === '>=') {
      this.state.queries[this.state.queryParameter] = ['MinType', this.state.queryValue];
    }
    if (this.state.queryOperator === '<=') {
      this.state.queries[this.state.queryParameter] = ['MaxType', this.state.queryValue];
    }
    if (this.state.queryOperator === 'All') {
      this.state.queries[this.state.queryParameter] = ['AllValuesType'];
    }
    if (this.state.queryOperator === '=') {
      var values = this.state.queryValue.split(",")
      this.state.queries[this.state.queryParameter] = ['SpecificValuesType', values];
    }

    // console.log(this.state.queries);
  }

  removeQuery(query){
    var queries = this.state.queriesForDisplay;
    const index = queries.indexOf(query);
    queries.splice(index, 1);
    this.setState({queriesForDisplay: queries});
  }

  fetchModelParams(){
    // const promise = Service.fetchModelParams();
    // promise.then((data) => {
    //   if(data !== undefined){
    //     if (data["data"] != null){   // if there are model parameters to display
    //         this.setState({modelParams: data["data"]});
    //     }
    //     else{
    //         this.setState({modelParams: "There are no available params for the selected model..."});   // no parameters to display
    //     }
    //   }});
    this.setState({modelParams: ["epochs", "batch_size"]});
  }

  submitJob(){
    alert("yay");
    console.log(this.state.modelParamsToSend);
    const promise = Service.submitJob(this.queries, this.selectedPredictionVariable, this.selectedModel, this.modelParamsToSend);
    promise.then((data) => {
      if(data !== undefined){
        if (data["msg"] != null){
            console.log(data["msg"]);
        }
      }});
  }
  

  render(){
    
    var ModelParamFields = this.state.modelParams.map((param) =>
    <div>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="4">{param}</Form.Label>
          <Col>
          <Form.Control id={param} 
                    onChange={event => {
                    this.state.modelParamsToSend[param] = event.target.value;
                }}
                type="text" placeholder="" />
          </Col>
        </Form.Group>
      </Form>
    </div>
    );

    var QueriesList = this.state.queriesForDisplay.map((queryString) =>
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Form inline>
        <Form.Group as={Row}>
          <Form.Label sm="4">{queryString}</Form.Label>
          <Col>
            <Button variant="outline-info" size="sm" onClick={()=>{this.removeQuery(queryString)}}>
              Remove
              </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
    );


    return(
      <div>
        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h2>Run Job</h2>
        </div>

        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="9">Please select a subset of the flights that you would like to use during training:</Form.Label>
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
                * For Range please enter the values in the following format: (lower_value, upper_value)
                </Form.Text>
                <Form.Text className="text-muted">
                * For equals sign (i.e. =) please enter the value\s in the following format: value1 or value1,value2,...
                </Form.Text>
              </Col>

              <Col sm={1}>
                <Button variant="info" onClick= {(() => {this.addQuery()})}>
                    Add
                </Button>
              </Col>
          </Form.Group>

          <br />

          <Form.Group as={Row}>
          <Form.Label column sm="9">The added queries are shown below:</Form.Label>
          </Form.Group>

          <Jumbotron id='jumbotron' fluid>
            {QueriesList}
          </Jumbotron>

          <br />

          <Form.Group as={Row}>
            <Form.Label column sm="3">Select the target variable:</Form.Label>
            <Col column sm="6">
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
            {ModelParamFields}
          </Form.Group>

          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Button variant="info" size="md" onClick={() => {this.submitJob()}}> 
              Submit Job 
            </Button>
          </div>

        </Form>
      </div>

    );
  }
}

export default RunJobForm;