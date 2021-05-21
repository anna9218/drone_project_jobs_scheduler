import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';


class Readme extends React.Component{
    // constructor(props) {
    //     super(props);
    // }

    render(){
        return(
        <div>
            <br />
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h3>How To Use The System</h3>
            </div>

            <br />

            <Form>
                <Form.Group as={Row}>
                <Form.Label>You may select 'Run Job' or 'Manage Jobs' from the navigation bar above.</Form.Label>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label>In the 'Run Job' menu you may select a flights subset and create a new model.</Form.Label>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label>In the 'Manage Jobs' menu you may view all your jobs, review reports, or cancel a running job.</Form.Label>
                </Form.Group>
            </Form>
        </div>
        );
    }
}

export default Readme;