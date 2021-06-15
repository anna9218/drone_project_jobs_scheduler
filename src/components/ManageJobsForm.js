import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Service from '../services/communication';
import Report from './Report';

import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
// import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';
// import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';


// HOW THE JOB SUPPOSED TO LOOK LIKE
// {'job_id': '001', 
//      'job_name_by_user': myFirstJob
//      'start_time': '10:00', 
//      'end_time': '11:00', 
//      'status': 'COMPLETED', 
//      'model_details': {'optimizer': value,
//                        'metrics': value,
//                        'iterations': value,
//                        'batch_size': value,
//                        'epochs': value,
//                        'neurons_in_layer': value}}
//      'report': {accuracy: 80, loss: 0.43}}
// 


const Status = {"CANCELED": 1, "COMPLETED": 2, "FAILED": 3, "PENDING": 4, "RUNNING": 5, "TIMEOUT": 6};


class ManageJobsForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            jobs: [
                {'job_id': '001', 'job_name': "jobA", 'start_time': '10:00', 'end_time': '11:00', 'status': 'COMPLETED', 
                'model_details': {'optimizer': "adagrad",
                           'metrics': ["accuracy"],
                           'iterations': 10,
                           'batch_size': 32,
                           'epochs': 100,
                           'neurons_in_layer': 100},
                'report': {accuracy: 10, loss: 0.43}},
                {'job_id': '102', 'job_name': "jobB", 'start_time': '11:00', 'end_time': '12:00', 'status': 'COMPLETED', 
                'model_details': {'optimizer': "adam",
                           'metrics': ["accuracy", "recall", "precision"],
                           'iterations': 30,
                           'batch_size': 64,
                           'epochs': 500,
                           'neurons_in_layer': 200},
                'report': {accuracy: 20, loss: 1.28}},
                {'job_id': '456', 'job_name': "jobC", 'start_time': '11:00', 'end_time': '12:00', 'status': 'COMPLETED', 
                'model_details': {'optimizer': "adagrad",
                           'metrics': ["accuracy", "precision"],
                           'iterations': 20,
                           'batch_size': 128,
                           'epochs': 300,
                           'neurons_in_layer': 150},
                'report': {accuracy: 80, loss: 0.973}}
                ],
            isJobs: false,
            modalShow: false,
            userEmail: '',
            activeModelDetails: {},
            activeReport: {},
        };
    }


    /**
     * Function to fetch jobs info from the server.
     */
    fetchJobs(){
        if (!this.handleEmailInput()) {
            alert("Oops, the email is invalid! Please re-enter");
            return;
        }

        const promise = Service.fetchJobs(this.state.userEmail);
        promise.then((data) => {

        if(data !== undefined){
            if (data["data"] != null && Array.isArray(data["data"]) && data["data"].length > 0){   // if there are jobs to display
                this.setState({jobs: data["data"]});
                this.setState({isJobs: true});
            }
            else{
                alert(data["msg"]);
                this.setState({isJobs: false});  // no jobs to display
            }
        }
        else {
            alert("Connection error with the server, response is undefined");
        }});
    }


    handleEmailInput() {
        const email = this.state.userEmail;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(email);
        if (re.test(email)) {
            // this is a valid email address
            return true; 
        }
        else {
            // invalid email, show an error to the user.
            return false;
        }
    }


    renderTableHeader(){
        return (            
            <tr>
                <th>#</th>
                <th>Job ID</th>
                <th>Job Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Report</th>
                <th>Cancel</th>
            </tr>
        );
    }


    renderTableData(){
        var tableIdx = 0;
        return this.state.jobs.map((job, index) => {
            const {job_id, job_name_by_user, start_time, end_time, status, model_details, report} = job; //destructuring
            tableIdx +=1;
            var isCancelable = (status === "PENDING" || status === "RUNNING") ? true : false;
            // TODO - check how slurm types "CANCELED"
            var isReport = (status === "PENDING" || status === "CANCELED" || status === "CANCELLED" || status === "CANCELED+"|| status === "RUNNING") ? false : true;
            var reportText = (isReport) ? "Click for Report" : "No Report";
            

            return (
                <tr key={job_id}>
                    <td>{tableIdx}</td>
                    <td>{job_id}</td>
                    <td>{job_name_by_user}</td>
                    <td>{start_time}</td>
                    <td>{end_time}</td>
                    <td>{status}</td>
                    <td>
                        <Button disabled={!isReport} variant='outline-info' 
                        onClick={() => this.handleShow(model_details, report)}>
                            {reportText}
                        </Button>
                        {/* <Report
                            modelDetails={model_details}
                            reportData={report}
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                        /> */}
                    </td>
                    <td>
                        <Button disabled={!isCancelable} variant='outline-info' onClick={()=>{this.cancelJob(index, job_id)}}>
                            Cancel
                        </Button>
                    </td>
                </tr>
            );
        });
    }


    handleShow(model_details, report) {
        console.log(report);
        this.setState({activeReport: report});
        this.setState({activeModelDetails: model_details} );
        this.setState({modalShow: true});
    }

    
    /**
     * Function to cancel a selected job. Only "RUNNING", "PENDING" jobs can be cancelled.
     * @param {Int} index 
     * @param {Int} job_id 
     */
    cancelJob(index, job_id){
        const promise = Service.cancelJob(job_id, this.state.userEmail);
        promise.then((data) => {
        if(data !== undefined){
            if (data["msg"] != null){
                alert(data["msg"]);
                this.removeJobFromTable(index, job_id);
            }
        }});
        
        this.removeJobFromTable(index, job_id);
    }


    removeJobFromTable(index, job_id){
        var jobs_1 = this.state.jobs;
        var job = jobs_1[index];
        if (job.job_id === job_id){
            jobs_1.splice(index, 1);
            this.setState({jobs: jobs_1});
        }
    }






    render(){
        return(
        <div>
        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h2>Manage Jobs</h2>
        </div>
        <br />

        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Form>
            <Form.Group>
                <Row>
                    <Col column sm="12">
                    <Form.Label>Please enter your email address in order to fetch your jobs:</Form.Label>
                    </Col>
                </Row>
                <Row>
                <Form.Label column sm="2">Email:</Form.Label>
                <Col column sm="10">
                    <Form.Control onChange={event => {this.setState({userEmail: event.target.value})}} type="text" placeholder="Email"/>
                </Col>
                </Row>
                <br />

                <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Button variant="info" onClick={() => {this.fetchJobs()}}>Display Jobs</Button>
                </div>

            </Form.Group>
        </Form>
        </div>
        <br />
        <br />


        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Table striped bordered hover>
            <thead>
                {this.state.isJobs ? this.renderTableHeader() : null}
            </thead>
            <tbody>
                {this.state.isJobs ? this.renderTableData() : null}
            </tbody>
            </Table>

            <Report
                modelDetails={this.state.activeModelDetails}
                reportData={this.state.activeReport}
                show={this.state.modalShow}
                onHide={() => this.setState({modalShow: false})}
            />
        </div>

        </div>
        );
    }
}


export default ManageJobsForm;
