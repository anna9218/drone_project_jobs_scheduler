import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import RunJobForm from './RunJobForm'
import ManageJobsForm from './ManageJobsForm'

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
// import Router from 'react-bootstrap/Router';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'



import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const MenuEnum = {"run_job": 1, "manage_jobs": 2}
    

class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            menuToShow: MenuEnum.run_job,
        };
      }

    render(){
        const isMenu = this.state.menuToShow;
        let menu;
        if (isMenu === 1){
            menu = <RunJobForm />;
        }
        else {
            menu = <ManageJobsForm />;
        }

        return (
            <div>
            <Router>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Scheduler</Navbar.Brand>
                <Nav className="mr-auto">
                <Nav.Link href="#runjob">Run Job</Nav.Link>
                <Nav.Link href="#managejobs">Manage Jobs</Nav.Link>
                </Nav>
                <Form inline>
                <Button variant="outline-info">Logout</Button>
                </Form>
            </Navbar>
            {/* <div style={{marginTop:"1%", marginLeft: "25%", marginRight: "25%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h1>Scheduler</h1>
            </div> */}
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Row>
                {/* <Col xs="3">
                <Button variant="info" size="lg" onClick={() => this.setState({menuToShow: MenuEnum.run_job})}> Run Job </Button>
                <br />
                <Button variant="info" size="lg" onClick={() => this.setState({menuToShow: MenuEnum.manage_jobs})}> Manage Jobs </Button>
                </Col> */}
                {menu}
            </Row>
            </div>
            </Router>
            </div>
            );
    }


}

export default HomePage;
