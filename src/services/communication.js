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

export async function submitJob(queries, targetVariable,  modelType, modelParams){
    var formData = new FormData();
    formData.append("queries", JSON.stringify(queries));
    formData.append("targetVariable", targetVariable);
    formData.append("modelType", modelType);
    formData.append("modelParams", JSON.stringify(modelParams));

    return axios.post('http://localhost:5000/upload_flight', formData, 
    {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
    })
    .then((response) => (response.data), (error) => {console.log(error)});
}


