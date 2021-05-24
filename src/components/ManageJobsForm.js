import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Service from '../services/communication';
import * as Report from './Report';

import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';


const Status = {"CANCELED": 1, "COMPLETED": 2, "FAILED": 3, "PENDING": 4, "RUNNING": 5, "TIMEOUT": 6};


class ManageJobsForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            jobs: [
                {'job_id': '001', 'start_time': '10:00', 'end_time': '11:00', 'status': 'COMPLETED', 'report': 'report object'},
                {'job_id': '102', 'start_time': '11:00', 'end_time': '12:00', 'status': 'PENDING', 'report': 'report object'},
                {'job_id': '456', 'start_time': '11:00', 'end_time': '12:00', 'status': 'RUNNING', 'report': 'report object'}
                ],
            // isJobs: false,
            job: {job_id: '002', 
                    start_time: '11:00', 
                    end_time: '12:00', 
                    status: 'PENDING', 
                    report: 'report object'},
            modalShow: false,
        };
        console.log(this.state.jobs);
        console.log(this.state.job);

    // this.fetchJobs;
    }

    fetchJobs(){
        const promise = Service.fetchJobs();
        promise.then((data) => {
        if(data !== undefined){
            if (data["data"] != null){   // if there are parameters to display
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
            const {job_id, start_time, end_time, status, report} = job; //destructuring
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
                    {/* <td disabled={isReport} onClick={()=> window.open("report"+job_id, "_blank")}>{report}</td> */}
                    <td>
                        {/* <Button disabled={!isReport} variant='outline-info' onClick={()=> window.open("report"+job_id, "_blank")}> */}
                        <Button disabled={!isReport} variant='outline-info' onClick={() => this.setState({modalShow: true})}>
                            {reportText}
                        </Button>
                        {/* <Report
                            reportData={report}
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: true})}
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

    

    cancelJob(index, job_id){
        // const promise = Service.cancelJob(job_id);
        // promise.then((data) => {
        // if(data !== undefined){
        //     if (data["msg"] != null){   // if there are parameters to display
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
