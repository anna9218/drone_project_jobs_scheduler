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
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Card from 'react-bootstrap/Card';

import * as Service from '../services/communication';


class RunJobForm extends React.Component{
  constructor(props) {
      super(props);
      this.state={
          jobName: '',
          userEmail: '',
          parameters: [],
          queryParameter: '',
          queryOperator: '=',
          queryValue: '',
          queriesForDisplay: [],
          queries: {},  //{'age': ['RangeType', min_value, max_value],
                        //'age': ['MinType', min_value],
                        //'hour': ['MaxType', max_value],...
                        // 'age': ['SpecificValuesType', value1, value2, ...]
                        // 'age': ['SpecificValuesType', value1]
                        // 'age': ['AllValuesType'] }
          predictionVariables: ["Location"],
          selectedPredictionVariable: '',
          models: [],
          selectedModel: '',
          modelParams: [],
          modelParamsToSend: {},
    };

    //     this.state={
    //       parameters: ["age", "weather"],
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
    //       models: ["LSTM", "GRU"],
    //       selectedModel: '',
    //       modelParams: [],
    //       modelParamsToSend: {},
    //       jobName: '',
    //       userEmail: '',
    // };

    this.fetchParameters(); // parameters for building quiries
    this.fetchModelNames();
  }

  fetchParameters(){
    const promise = Service.fetchParameters();
    promise.then((data) => {
      if(data !== undefined){
        if (data["data"] != null){   // if there are parameters to display
            this.setState({parameters: data["data"]});
        }
        else{
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


  isAllOperator(){
    if(this.state.queryOperator == "All"){
          return true;
    }
    return false;
  }

  addQuery(){
    var queryStr = this.state.queryParameter + this.state.queryOperator + this.state.queryValue;
  
    if (this.state.queryOperator === 'Range') {
      this.state.queries[this.state.queryParameter] = ['RangeType', this.state.queryValue];
      queryStr = this.state.queryParameter + ": " + this.state.queryOperator + this.state.queryValue;
    }
    if (this.state.queryOperator === '>=') {
      this.state.queries[this.state.queryParameter] = ['MinType', this.state.queryValue];
    }
    if (this.state.queryOperator === '<=') {
      this.state.queries[this.state.queryParameter] = ['MaxType', this.state.queryValue];
    }
    if (this.state.queryOperator === 'All') {
      this.state.queries[this.state.queryParameter] = ['AllValuesType'];
      queryStr = this.state.queryParameter + ": " + this.state.queryOperator;
    }
    if (this.state.queryOperator === '=') {
      var values = this.state.queryValue.split(",")
      this.state.queries[this.state.queryParameter] = ['SpecificValuesType', values];
    }

    this.setState({queriesForDisplay: [...this.state.queriesForDisplay, queryStr]})
    this.setState({predictionVariables: [...this.state.predictionVariables, this.state.queryParameter]});
    // console.log(this.state.predictionVariables);
    // console.log(this.state.queriesForDisplay);
    // console.log(this.state.queries);
  }

  removeQuery(query){
    // remove query from display
    var queries = this.state.queriesForDisplay;
    const index = queries.indexOf(query);
    queries.splice(index, 1);
    this.setState({queriesForDisplay: queries});

    // console.log(query);
    // console.log(this.state.predictionVariables);

    // remove target variable
    var predictionVars = this.state.predictionVariables;
    var parameter = query.split(/:|=/)[0];
    const indexPar = predictionVars.indexOf(parameter);
    predictionVars.splice(indexPar, 1);
    this.setState({predictionVariables: predictionVars});

    // console.log(parameter);

    // remove query from queries to send 
    var queriesDict = this.state.queries
    // console.log(queriesDict);
    delete queriesDict[parameter]
    // console.log(queriesDict);
    this.setState({queries: queriesDict});

    // console.log(this.state.predictionVariables);
    // console.log(this.state.queries);
  }

  fetchModelParams(){
    // const promise = Service.fetchModelParams(this.state.selectedModel);
    // promise.then((data) => {
    //   if(data !== undefined){
    //     if (data["data"] != null){   // if there are model parameters to display
    //         this.setState({modelParams: data["data"]});
    //     }
    //     else{
    //         this.setState({modelParams: "There are no available params for the selected model..."});   // no parameters to display
    //     }
    //   }});

    this.setState({modelParams: [["optimizer", "str"], ["metrics", "list(str)"], ["epochs", "int"]]});
  }

  submitJob(){
    // console.log(this.state.jobName);
    // console.log(this.state.queries);
    // console.log(this.state.selectedPredictionVariable);
    // console.log(this.state.selectedModel);
    // console.log(this.state.modelParamsToSend);

    const promise = Service.submitJob(this.state.jobName,
                                      this.state.userEmail,
                                      this.state.queries, 
                                      this.state.selectedPredictionVariable, 
                                      this.state.selectedModel, 
                                      this.state.modelParamsToSend);
    promise.then((data) => {
      if(data !== undefined){
        if (data["msg"] != null){
            console.log(data["msg"]);
            this.resetForm();
            alert(data["msg"]);
        }
      }});
  }

  resetForm(){
    // reset all collected fields' values
    this.setState({queryParameter: ''});
    this.setState({queryOperator: '='});
    this.setState({queryValue: ''});
    this.setState({queriesForDisplay: []});
    this.setState({queries: {}});

    this.setState({predictionVariables: ["Location"]});
    this.setState({selectedPredictionVariable: ''});
    this.setState({selectedModel: ''});
    this.setState({modelParams: []});
    this.setState({modelParamsToSend: {}});

    this.setState({jobName: {}});
    this.setState({userEmail: {}});
  }
  

  render(){
    // the fields relevant to a specific model
    var ModelParamFields = this.state.modelParams.map(([param, paramType]) =>
    <div>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="3">{param}:</Form.Label>
          <Col column sm="6">
            <Form.Control id={param} 
                      onChange={event => {
                      this.state.modelParamsToSend[param] = event.target.value;
                  }}
                  type="text" placeholder="" />
            <Form.Text className="text-muted">
                  Please enter a {paramType} type.
            </Form.Text>
          </Col>
        </Form.Group>
      </Form>
      <br />
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
              <DeleteIcon />
          </Col>
        </Form.Group>
      </Form>
    </div>
    );


    return(
      <div style={{marginRight:"5%", marginLeft:"5%", marginBottom:"3%"}}>
        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h2>Run Job</h2>
        </div>
        <br />

        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h6>Here you may create a new job which will be sent to Slurm. 
              The proccess consists of two parts: selecting the data for training, and defining a deep learning model that will be using the selected data.</h6>
        </div>

        <Form>
          <Form.Group>
            <Row>
              <Form.Label column sm="9">First of all, please select a unique name for your new job, and enter your email address:</Form.Label>
            </Row>
            <Row>
              <Form.Label column sm="3">Job name:</Form.Label>
              <Col column sm="6">
                <Form.Control onChange={event => {this.setState({jobName: event.target.value})}} type="text" placeholder="Job name" />
              </Col>
            </Row>
            <br />
            <Row>
              <Form.Label column sm="3">Email:</Form.Label>
              <Col column sm="6">
                <Form.Control onChange={event => {this.setState({userEmail: event.target.value})}} type="text" placeholder="Email" />
              </Col>
            </Row>
          </Form.Group>

          <br />
          <br />

          <Form.Group>
            <Row>
              <Form.Label column sm="9">Please select a subset of the flights that you would like to use during training:</Form.Label>
            </Row>
            <Row>
              <Form.Label column sm="9">Here you may construct queries (much like SQL queries) in order to select the exact data.</Form.Label>
            </Row>
            <Row>
            <Form.Label column sm="9">1. Select the parameter. </Form.Label>
            </Row>
            <Row>
            <Form.Label column sm="9">2. Select the operator. </Form.Label>
            </Row>
            <Row>
            <Form.Label column sm="9">3. Enter the desired value according to the listed format: </Form.Label>
            </Row>
            <Container>
            <Row>
              <Col md={{span: 4}}>
                <Form.Label>{'\u25CF'} Chosen operator: [=]</Form.Label>
              </Col>
              <Col md={{span: 5}}>
                <Form.Label>Format: [value] or [value1,value2,...] without spaces.</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col md={{span: 4}}>
                <Form.Label>{'\u25CF'} Chosen operator: [&lt;=] or [&gt;=]</Form.Label>
              </Col>
              <Col md={{span: 4}}>
                <Form.Label>Format: [value]</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col md={{span: 4}}>
                <Form.Label>{'\u25CF'} Chosen operator: [Range]</Form.Label>
              </Col>
              <Col md={{span: 4}}>
                <Form.Label>Format: (min_value,max_value) without spaces.</Form.Label>
              </Col>
            </Row>
            </Container>
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
              <Form.Control type="text" placeholder="" disabled={this.isAllOperator()} value={this.isAllOperator() ? "" : this.state.queryValue}
              onChange={event => this.setState({queryValue: event.target.value})}/>
              <Form.Text className="text-muted">
              Enter the value.
              </Form.Text>
              {/* <Form.Text className="text-muted">
              * For Range please enter the values in the following format: (lower_value, upper_value)
              </Form.Text>
              <Form.Text className="text-muted">
              * For equals sign (i.e. =) please enter the value\s in the following format: value1 or value1,value2,...
              </Form.Text> */}
            </Col>

            <Col sm={1}>
              <Button variant="info" onClick= {(() => {this.addQuery()})}>
                  Add
              </Button>
            </Col>
          </Form.Group>

          <br />

          <Card border="info" bg="light">
            <Card.Body>
            <Card.Title>Selected Queries</Card.Title>
            <Card.Text>
              The added queries are shown below for your convenience. You may remove queries as you need.
            </Card.Text>
              {QueriesList}
            </Card.Body>
          </Card>
          
          <br />
          <br />

          
          <Form.Group>
            <Row>
              <Form.Label column sm="9">Now it is time to define the model and its parameters:</Form.Label>
            </Row>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="3">Select the target variable:</Form.Label>
            <Col column sm="6">
              <Form.Control as="select" value={this.queryOperator} 
                onChange={event => this.setState({selectedPredictionVariable: event.target.value})}>
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

          <Form.Group>
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