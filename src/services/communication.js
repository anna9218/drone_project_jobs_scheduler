import axios from "axios";
var ip = "132.72.67.188";   // IP of the university's server 
// var ip = "localhost"
var port = "8022";  // Application port


//------------------------------- RUN JOBS FORM --------------------------------------//

export async function fetchParameters(){
    return axios.get('http://' + ip + ':' + port + '/fetch_parameters')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchModelNames(){
    return axios.get('http://' + ip + ':' + port + '/get_models_types')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchModelParams(modelType){
    var formData = new FormData();
    formData.append("model_type", modelType);

    return axios.post('http://' + ip + ':' + port + '/fetch_model_parameters', formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
            },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchFlightParamValues(parameter){
    var formData = new FormData();
    formData.append("parameter", parameter);

    return axios.post('http://' + ip + ':' + port + '/fetch_flight_param_values', formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
            },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}

// export async function fetchTargetVariables(){
//     return axios.get('http://localhost:5000/fetch_target_variables')
//     .then((response) => (response.data), (error) => {console.log(error)});
// }

export async function submitJob(jobName, userEmail, queries, targetVariable,  modelType, modelParams){
    var formData = new FormData();
    formData.append("job_name_by_user", jobName);
    formData.append("user_email", userEmail);
    formData.append("logs_queries", JSON.stringify(queries));
    formData.append("target_variable", targetVariable);
    formData.append("model_type", modelType);
    formData.append("model_details", JSON.stringify(modelParams));

    return axios.post('http://' + ip + ':' + port + '/run_new_job', formData, 
    {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}




//------------------------------- MANAGE JOBS FORM --------------------------------------//

export async function fetchJobs(userEmail){
    var formData = new FormData();
    formData.append("user_email", userEmail);

    return axios.post('http://' + ip + ':' + port + '/fetch_researcher_jobs', formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
            },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function cancelJob(job_id, userEmail){
    var formData = new FormData();
    formData.append("job_id", job_id);
    formData.append("user_email", userEmail);

    return axios.post('http://' + ip + ':' + port + '/cancel_job', formData, 
    {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}



