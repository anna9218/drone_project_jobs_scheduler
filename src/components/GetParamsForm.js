import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



class GetParamsForm extends React.Component{
    constructor(props) {
        super(props);
        this.displayParams = this.displayParams.bind(this);
        this.state = {
                // params_array: props.params,
                paramsArray: props.parameters,
        };
    }

    displayParams(){


        var MappingItems = this.state.paramsArray.map(param => 
        <div>
            <Form>
            <Form.Group as={Row}>
                <Form.Label column sm="4">{param}</Form.Label>
                <Col sm={8}>
                    <Form.Control id={param} 
                    // onChange={event => {
                    //     // global parameters;
                    //     parameters = parameters.push([{param}, event.target.value]);
                    //     console.log(parameters, 'params');
                    // }}
                    type="text"/>
                </Col>  
            </Form.Group>
            </Form>
        </div>
        );

        return MappingItems;
    }


    render(){
        return(
            // <div>
                this.displayParams()
            // </div>
        );
    }
}


export default GetParamsForm;
