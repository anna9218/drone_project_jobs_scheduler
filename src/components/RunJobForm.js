import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';
// import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Card from 'react-bootstrap/Card';

import * as Service from '../services/communication';
import { parser } from './TypeParser';


// POSSIBLE QUERIES - HOW THEY ARE CONSTRUCTED:
// {'age': ['RangeType', min_value, max_value],
// 'age': ['MinType', min_value],
// 'hour': ['MaxType', max_value],...
// 'age': ['SpecificValuesType', value1, value2, ...]
// 'age': ['SpecificValuesType', value1]
// 'age': ['AllValuesType'] }


// TODO - for queries, for param of type str -> disable >= <= range


class RunJobForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobName: '',
      userEmail: '',

      parameters: [],
      parameterValues: [],
      queryParameter: '',
      queryParameterType: '',
      queryOperator: '=',
      queryValue: '',

      queriesForDisplay: [],
      queries: {},  

      predictionVariables: ["location"],
      selectedPredictionVariable: '',

      models: [],
      selectedModel: '',
      modelParams: [],
      modelParamsToSend: {},
    };

    this.fetchParameters(); // fetch parameters for building queries
    this.fetchModelNames(); // fetch existing model names
  }

  /**
   * Function to fetch the parameters for building queries
   */
  fetchParameters() {
    const promise = Service.fetchParameters();
    promise.then((data) => {
      if (data !== undefined) {
        if (data["data"] != null) {   // if there are parameters to display
          console.log(data["data"]);
          this.setState({ parameters: data["data"] });
        }
        else {
          this.setState({ parameters: "There are no available parameters..." });   // no parameters to display
        }
      }

      else {
        alert("Connection error with the server, response is undefined");
      }
    });
  }


  /**
   * Function to fetch the existing model names
   */
  fetchModelNames() {
    const promise = Service.fetchModelNames();
    promise.then((data) => {
      console.log(data)
      if (data !== undefined) {
        console.log(data["data"])
        if (data["data"] != null) {   // if there are models to display
          this.setState({ models: data["data"] });
        }
        else {
          this.setState({ models: "There are no available models..." });   // no parameters to display
        }
      }
      else {
        alert("Connection error with the server, response is undefined");
      }
    });
  }


  /**
   * Function to check if 'All' operator was chosen - if it was, disable next input value field (since all values were chosen, no need to enter).
   * @returns true if 'All' operator was chosen, false otherwise
   */
  isAllOperator() {
    if (this.state.queryOperator === "All") {
      return true;
    }
    return false;
  }


  /**
   * Function to add queries constructed by the user to the component's state.
   */
  addQuery() {
    // TODO - ADD HANDLING FOR INPUT ERRORS ?
    var queryStr = this.state.queryParameter + this.state.queryOperator + this.state.queryValue;

    if (this.state.queryOperator === 'Range') {
      this.state.queries[this.state.queryParameter] = ['RangeType', parser("int", this.state.queryValue)];
      queryStr = this.state.queryParameter + ": " + this.state.queryOperator + this.state.queryValue;
    }

    if (this.state.queryOperator === '>=') {
      this.state.queries[this.state.queryParameter] = ['MinType', parser("int", this.state.queryValue)];
    }

    if (this.state.queryOperator === '<=') {
      this.state.queries[this.state.queryParameter] = ['MaxType', parser("int", this.state.queryValue)];
    }

    if (this.state.queryOperator === 'All') {
      this.state.queries[this.state.queryParameter] = ['AllValuesType'];
      queryStr = this.state.queryParameter + ": " + this.state.queryOperator;
    }

    // create array with all input value, and update their type accordingly
    if (this.state.queryOperator === '=') {
      var values = this.state.queryValue.split(",");
      const typeTemp = this.state.queryParameterType;

      var valuesTemp = [];
      values.map(value => {
        valuesTemp = [...valuesTemp, parser(typeTemp, value)];
      });

      this.state.queries[this.state.queryParameter] = ['SpecificValuesType'].concat(valuesTemp);
    }

    this.setState({ queriesForDisplay: [...this.state.queriesForDisplay, queryStr] })
    this.setState({ predictionVariables: [...this.state.predictionVariables, this.state.queryParameter] });
    // console.log(this.state.predictionVariables);
    // console.log(this.state.queriesForDisplay);
    // console.log(this.state.queries);
  }


  /**
   * Function to remove a previously added query from the queries list and from display
   * @param {String} query 
   */
  removeQuery(query) {
    // remove query from display
    var queries = this.state.queriesForDisplay;
    const index = queries.indexOf(query);
    queries.splice(index, 1);
    this.setState({ queriesForDisplay: queries });

    // remove target variable
    var predictionVars = this.state.predictionVariables;
    var parameter = query.split(/:|=/)[0];
    const indexPar = predictionVars.indexOf(parameter);
    predictionVars.splice(indexPar, 1);
    this.setState({ predictionVariables: predictionVars });

    // remove query from queries to send 
    var queriesDict = this.state.queries
    delete queriesDict[parameter]
    this.setState({ queries: queriesDict });
  }


  /**
   * Function to fetch the model specific parameters
   */
  fetchModelParams(model) {
    const promise = Service.fetchModelParams(model);
    promise.then((data) => {
      if (data !== undefined) {
        if (data["data"] != null) {   // if there are model parameters to display
          this.setState({ modelParams: data["data"] });
        }
        else {
          this.setState({ modelParams: "There are no available params for the selected model..." });   // no parameters to display
        }
      }
      else {
        alert("Connection error with the server, response is undefined");
      }
    });
  }


  /**
   * Function to submit all collected values and params to the server, in order to create and run a new job
   * Checks in the input is valid
   */
  submitJob() {
    // check input
    console.log(this.state.queries);
    if (this.state.jobName === "" || this.state.userEmail === "" || 
    this.state.queries.length === 0 || this.state.selectedPredictionVariable === "" || 
    this.state.selectedModel === "" || this.state.modelParamsToSend.length === 0) {
      alert("Oops, some values are missing! Please insert the missing values");
      return;
    }



    const promise = Service.submitJob(this.state.jobName,
      this.state.userEmail,
      this.state.queries,
      this.state.selectedPredictionVariable,
      this.state.selectedModel,
      this.state.modelParamsToSend);

    promise.then((data) => {
      if (data !== undefined) {
        if (data["msg"] != null) {
          this.resetForm();
          alert(data["msg"]);
        }
      }
      else {
        alert("Connection error with the server, response is undefined");
      }
    });
  }


  /**
   * Function to reset all collected fields' values
   */
  resetForm() {
    this.setState({ queryParameter: '' });
    this.setState({ queryOperator: '=' });
    this.setState({ queryValue: '' });
    this.setState({ queriesForDisplay: [] });
    this.setState({ queries: {} });

    this.setState({ predictionVariables: ["location"] });
    this.setState({ selectedPredictionVariable: '' });
    this.setState({ selectedModel: '' });
    this.setState({ modelParams: [] });
    this.setState({ modelParamsToSend: {} });

    this.setState({ jobName: {} });
    this.setState({ userEmail: {} });
  }

  /**
   * 1. sets the values of the selected parameter, and its type
   * 2. send request to the server, to fetch all parameter's values
   * @param {Int,String} value 
   */
  handleParam(value) {
    this.setState({ queryParameter: value });

    const parametersTemp = this.state.parameters;
    var typeTemp;

    parametersTemp.filter(val => {
      console.log(val[0]);
      if (val[0] === value) {
        console.log(val[1]);
        typeTemp = val[1];
        return val[1];
      }
    });
    this.setState({ queryParameterType: typeTemp });


    const promise = Service.fetchFlightParamValues(value);
    promise.then((data) => {
      if (data !== undefined) {
        if (data["data"] != null) {
          this.setState({parameterValues: data["data"]});
        }
        else {
          this.setState({parameterValues: "There are no available parameter values..." });
        }
      }
      else {
        alert("Connection error with the server, response is undefined");
      }
    });
  }

  handleEmailInput(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(email);
    if (re.test(email)) {
        // this is a valid email address
        return "Email is not valid"; 
    }
    else {
        // invalid email, show an error to the user.
        return false;
    }
  }




  render() {
    // the parameters fields relevant to a specific model
    var ModelParamFields = this.state.modelParams.map(([param, paramType, paramDefaultValue]) =>
      <div>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="3">{param}:</Form.Label>
            <Col column sm="6">
              <Form.Control id={param}
                onChange={event => {
                  this.state.modelParamsToSend[param] = parser(paramType, event.target.value);
                }}
                type="text" placeholder={paramDefaultValue} value={paramDefaultValue} />
              <Form.Text className="text-muted">
                Please enter a {paramType} type.
            </Form.Text>
            </Col>
          </Form.Group>
        </Form>
        <br />
      </div>
    );

    // the displayed queries defined by the user
    var QueriesList = this.state.queriesForDisplay.map((queryString) =>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Form inline>
          <Form.Group as={Row}>
            <Form.Label sm="4">{queryString}</Form.Label>
            <Col>
              <Button variant="outline-info" size="sm" onClick={() => { this.removeQuery(queryString) }}>
                Remove
              </Button>
              {/* <DeleteIcon /> */}
            </Col>
          </Form.Group>
        </Form>
      </div>
    );


    return (
      <div style={{ marginRight: "5%", marginLeft: "5%", marginBottom: "3%" }}>
        <div style={{ marginTop: "1%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h2>Run Job</h2>
        </div>
        <br />

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                <Form.Control onChange={event => { this.setState({ jobName: event.target.value }) }} type="text" placeholder="Job name" />
              </Col>
            </Row>
            <br />

            <Row>
              <Form.Label column sm="3">Email:</Form.Label>
              <Col column sm="6">
                <Form.Control onChange={event => this.setState({userEmail: event.target.value}) } type="email" placeholder="Email" 
                pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"/>
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
              <Form.Label column sm="9">3. Select the desired value from the provided list or enter your own value: </Form.Label>
            </Row>
            <Row>
              <Form.Label column sm="9">Please note:</Form.Label>
            </Row>

            <Container>
              <Row>
                <Col md={{ span: 8 }}>
                  <Form.Label>{'\u25CF'} You can only select the [&lt;=], [&gt;=] or [Range] operators for numerical values.</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8 }}>
                  <Form.Label>{'\u25CF'} You can only enter your own value for parameters which excpect a string value.</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 4 }}>
                  <Form.Label>{'\u25CF'} Chosen operator: [Range]</Form.Label>
                </Col>
                <Col md={{ span: 4 }}>
                  <Form.Label>Format: (min_value,max_value) without spaces.</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 4 }}>
                  <Form.Label>{'\u25CF'} Chosen operator: [All]</Form.Label>
                </Col>
                <Col md={{ span: 5 }}>
                  <Form.Label>All values are selected, no need to choose/enter values.</Form.Label>
                </Col>
              </Row>
            </Container>

            {/* <Container>
              <Row>
                <Col md={{ span: 4 }}>
                  <Form.Label>{'\u25CF'} Chosen operator: [=]</Form.Label>
                </Col>
                <Col md={{ span: 5 }}>
                  <Form.Label>Format: [value] or [value1,value2,...] without spaces.</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 4 }}>
                  <Form.Label>{'\u25CF'} Chosen operator: [&lt;=] or [&gt;=]</Form.Label>
                </Col>
                <Col md={{ span: 4 }}>
                  <Form.Label>Format: [value]</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 4 }}>
                  <Form.Label>{'\u25CF'} Chosen operator: [Range]</Form.Label>
                </Col>
                <Col md={{ span: 4 }}>
                  <Form.Label>Format: (min_value,max_value) without spaces.</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 4 }}>
                  <Form.Label>{'\u25CF'} Chosen operator: [All]</Form.Label>
                </Col>
                <Col md={{ span: 5 }}>
                  <Form.Label>Format: none, all values are selected.</Form.Label>
                </Col>
              </Row>
            </Container> */}
          </Form.Group>


          <Form.Group as={Row}>
            <Col>
              <Form.Control as="select" value={this.queryParameter}
                onChange={event => this.handleParam(event.target.value)}>
                <option>Select Parameter</option>
                {this.state.parameters !== null ?
                  this.state.parameters.map(([parameter, parameterType]) => (
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
                onChange={event => this.setState({ queryOperator: event.target.value })}>
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
              <Form.Control as="select" value={this.queryValue}
                onChange={event => this.setState({ queryValue: event.target.value})}>
                <option>Select Value</option>
                {this.state.parameterValues !== null ?
                  this.state.parameterValues.map((parameterValue) => (
                    <option value={parameterValue}>{parameterValue}</option>
                  ))
                  : null
                }
              </Form.Control>
              <Form.Text className="text-muted">
                Select the desired value.
              </Form.Text>
            </Col>

            <Col sm={1}>
              <Button variant="info" onClick={(() => { this.addQuery() })}>
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
                onChange={event => this.setState({ selectedPredictionVariable: event.target.value })}>
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
                onChange={event => {
                this.setState({ selectedModel: event.target.value });
                this.fetchModelParams(event.target.value);
                }
                }>
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

            {/* <Col column sm="3">
              <Button variant="info" size="md" onClick={() => { this.fetchModelParams() }}>
                Fetch Model
              </Button>
            </Col> */}
          </Form.Group>

          <br />

          <Form.Group>
            {ModelParamFields}
          </Form.Group>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button variant="info" size="md" onClick={() => { this.submitJob() }}>
              Submit Job
            </Button>
          </div>

        </Form>
      </div>

    );
  }
}

export default RunJobForm;