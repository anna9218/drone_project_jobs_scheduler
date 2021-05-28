import axios from "axios";


export async function fetchParameters(){
    return axios.get('http://localhost:5000/fetch_parameters')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchModelNames(){
    return axios.get('http://localhost:5000/get_models_types')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchModelParams(){
    return axios.get('http://localhost:5000/fetch_model_parameters')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function fetchTargetVariables(){
    return axios.get('http://localhost:5000/fetch_target_variables')
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function submitJob(job_name_by_user, queries, targetVariable,  modelType, modelParams){
    var formData = new FormData();
    formData.append("job_name_by_user", job_name_by_user);
    formData.append("user_email", "anna.9218@gmail.com");
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


export async function fetchJobs(){
    var formData = new FormData();
    formData.append("user_email", "anna.9218@gmail.com");

    return axios.post('http://localhost:5000/fetch_jobs', formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
            },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}

export async function cancelJob(job_id){
    var formData = new FormData();
    formData.append("job_id", job_id);

    return axios.post('http://localhost:5000/cancel_job', formData, 
    {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}



