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

            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h5>Welcome and thank you for using our system!</h5>
            </div>

            <br />

            <Form>
                <Form.Group as={Row}>
                <Form.Label>Feel free to select 'Run Job' or 'Manage Jobs' from the navigation bar above.</Form.Label>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label>{'\u25CF'} In the 'Run Job' menu you may select a flights subset, create a new model and submit a new job to Slurm.</Form.Label>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label>{'\u25CF'} In the 'Manage Jobs' menu you may view all the jobs you have created, review reports of finished jobs, or cancel a job in progress.</Form.Label>
                </Form.Group>

                <br />

                <Form.Group as={Row}>
                <Form.Label>Please note that additional advice and guidance are provided in each page.</Form.Label>
                </Form.Group>
            </Form>

        </div>
        );
    }
}

export default Readme;