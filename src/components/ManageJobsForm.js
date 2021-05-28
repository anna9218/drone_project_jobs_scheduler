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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';


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
                {'job_id': '001', 'start_time': '10:00', 'end_time': '11:00', 'status': 'COMPLETED', 
                'model_details': {'optimizer': "adagrad",
                           'metrics': ["accuracy"],
                           'iterations': 10,
                           'batch_size': 32,
                           'epochs': 100,
                           'neurons_in_layer': 100},
                'report': {accuracy: 80, loss: 0.43}},
                {'job_id': '102', 'start_time': '11:00', 'end_time': '12:00', 'status': 'PENDING', 
                'model_details': {'optimizer': "adam",
                           'metrics': ["accuracy", "recall", "precision"],
                           'iterations': 30,
                           'batch_size': 64,
                           'epochs': 500,
                           'neurons_in_layer': 200},
                'report': {accuracy: 80, loss: 1.28}},
                {'job_id': '456', 'start_time': '11:00', 'end_time': '12:00', 'status': 'RUNNING', 
                'model_details': {'optimizer': "adagrad",
                           'metrics': ["accuracy", "precision"],
                           'iterations': 20,
                           'batch_size': 128,
                           'epochs': 300,
                           'neurons_in_layer': 150},
                'report': {accuracy: 80, loss: 0.973}}
                ],
            // isJobs: false,
            // job: {job_id: '002', 
            //         start_time: '11:00', 
            //         end_time: '12:00', 
            //         status: 'PENDING', 
            //         report: 'report object'},
            modalShow: false,
        };
        // console.log(this.state.jobs);
        // console.log(this.state.job);

    // this.fetchJobs;
    }

    fetchJobs(){
        //TODO - give eden "user_email" here
        const promise = Service.fetchJobs();
        promise.then((data) => {
        if(data !== undefined){
            if (data["data"] != null){   // if there are jobs to display
                this.setState({jobs: data["data"]});
                // this.setState({isJobs: true});
            }
            // else{
            //     this.setState({isJobs: false});   // no parameters to display
            // }
        }});
    }

    renderTableHeader(){
        return (            
            <tr>
                <th>#</th>
                <th>Job ID</th>
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
            const {job_id, start_time, end_time, status, model_details, report} = job; //destructuring
            tableIdx +=1;
            var isCancelable = (status === "PENDING" || status === "RUNNING") ? true : false;
            var isReport = (status === "COMPLETED") ? true : false;
            var reportText = (isReport) ? "Click for Report" : "No Report";
            return (
                <tr key={job_id}>
                    <td>{tableIdx}</td>
                    <td>{job_id}</td>
                    <td>{start_time}</td>
                    <td>{end_time}</td>
                    <td>{status}</td>
                    <td>
                        {/* <Button disabled={!isReport} variant='outline-info' onClick={()=> window.open("report"+job_id, "_blank")}> */}
                        <Button disabled={!isReport} variant='outline-info' 
                        onClick={() => this.setState({modalShow: true})}>
                            {reportText}
                        </Button>
                        <Report
                            modelDetails={model_details}
                            reportData={report}
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                        />
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

    

    cancelJob(index, job_id){
        // TODO - give eden job_id and user_email

        // const promise = Service.cancelJob(job_id);
        // promise.then((data) => {
        // if(data !== undefined){
        //     if (data["msg"] != null){
        //         alert(data["msg"]);
        //         removeJobFromTable(index, job_id);
        //     }
        // }});
        
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

        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Table striped bordered hover>
            <thead>
                {this.renderTableHeader()}
            </thead>
            <tbody>
                {this.renderTableData()}
            </tbody>
            </Table>
        </div>

        </div>
        );
    }
}


export default ManageJobsForm;
