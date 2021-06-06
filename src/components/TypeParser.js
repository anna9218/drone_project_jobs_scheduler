export function parser(type, value){  
    console.log(type);
    console.log(value);

    if (type === "int"){
        value = parseInt(value);
        if (value===NaN) {
            alert("Incorrect value type entered! Expected type: int"); 
            return;
        }
        return value;     
    }

    if (type === "str"){
        return value;
    }
    if (type === "list"){
        //value='accuracy,precision'
        return value.split(',');
    }

    // ---------can add here more parsing options------------ //

    return false;
};
