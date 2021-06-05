import axios from "axios";

//------------------------------- REGISTER & LOGIN --------------------------------------//

// maybe no need
// export async function register(){

// }


// LOGIN - validate user vs bgu organization
export async function validateUser(user_email, password){
    var formData = new FormData();
    formData.append("user_email", user_email);
    formData.append("password", password);


    return axios.post('http://localhost:5000/fetch_jobs', formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
            },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
    
}


//------------------------------- RUN JOBS FORM --------------------------------------//

export async function fetchParameters(){
    return axios.get('http://localhost:5000/fetch_parameters')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchModelNames(){
    return axios.get('http://localhost:5000/get_models_types')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchModelParams(modelType){
    var formData = new FormData();
    formData.append("model_type", modelType);

    return axios.post('http://localhost:5000/fetch_model_parameters', formData,
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

    return axios.post('http://localhost:5000/run_new_job', formData, 
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

    return axios.post('http://localhost:5000/fetch_researcher_jobs', formData,
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

    return axios.post('http://localhost:5000/cancel_job', formData, 
    {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}



