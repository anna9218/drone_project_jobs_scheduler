import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Service from '../services/communication';
import { useHistory } from "react-router-dom";
import { Switch, Route } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user_email: '',
            password: '',
            hasAuthenticated: false,
        }
        // const history = useHistory();
    }
    

    handleLogin(event){
        // console.log(this.state.user_email);
        // console.log(this.state.password);

        // event.preventDefault();

        if (this.state.user_email === "" || this.state.password === "") {
            alert("Fields are required");
            return;
        }

        const promise = Service.validateUser(this.state.user_email, this.state.password);
        promise.then((data) => {
        if(data !== undefined){
            if (data["msg"] != null){   // if there are jobs to display
                alert(data["msg"]);
            }
            // history.push("/");
        }});
    }

    render(){
    return(
        <div>
        <div style={{marginTop:"1%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h1>Login</h1>
        </div>
        <br />

        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Form>
            <Form.Group as={Row}>
                <Form.Label column sm="3">Email:</Form.Label>
                <Col sm="9">
                <Form.Control type="text" placeholder="" onChange={event => this.setState({user_email: event.target.value})}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3">Password:</Form.Label>
                <Col sm="9">
                <Form.Control type="password" placeholder="" onChange={event => this.setState({password: event.target.value})}/>
                </Col>
            </Form.Group>
            <br />

            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Button variant="info" onClick={((event) => {this.handleLogin(event)})}>
                    Login
                </Button>
            </div>
        </Form>
        </div>



        </div>

    );
    }
}


export default Login;