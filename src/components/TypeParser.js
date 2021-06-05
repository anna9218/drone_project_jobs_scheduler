export function parser(type, value){  
    console.log(type);
    if (type === "int"){
        value = parseInt(value);
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
