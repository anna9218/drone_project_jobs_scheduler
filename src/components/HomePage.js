import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import RunJobForm from './RunJobForm'
import ManageJobsForm from './ManageJobsForm'
import Readme from './Readme'

import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'


const MenuEnum = { "run_job": 1, "manage_jobs": 2, "readme": 3 }


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuToShow: MenuEnum.readme,
        };
    }


    render() {
        const isMenu = this.state.menuToShow;
        let menu;
        if (isMenu === 1) {
            menu = <RunJobForm />;
        }
        if (isMenu === 2) {
            menu = <ManageJobsForm />;
        }
        if (isMenu === 3) {
            menu = <Readme />;
        }

        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand onClick={() => this.setState({ menuToShow: MenuEnum.readme })}>Scheduler</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => this.setState({ menuToShow: MenuEnum.run_job })}>Run Job</Nav.Link>
                        <Nav.Link onClick={() => this.setState({ menuToShow: MenuEnum.manage_jobs })}>Manage Jobs</Nav.Link>
                    </Nav>
                </Navbar>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Row>{menu}</Row>
                </div>

            </div>
        );
    }
}

export default HomePage;
