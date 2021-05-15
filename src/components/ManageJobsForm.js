import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";




class ManageJobsForm extends React.Component{
    constructor(props) {
        super(props);
    }


    render(){
        return(
            <div style={{marginTop:"1%", marginLeft: "25%", marginRight: "25%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h3>Manage Jobs:</h3>
            </div>
        );
    }
}


export default ManageJobsForm;
