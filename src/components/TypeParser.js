// Type Parser:
// Parses the value according to the given type.
// If the value is of different type, other than the given one - returns false and displays an error.
// Adding New Types:
// You can add your own parsing option by adding an if statement.

export function parser(type, value){  
    console.log(type);
    console.log(value);

    if (type === "int"){
        value = parseInt(value);
        // if was not able to parse - not int type
        if (isNaN(value)) {
            alert("Incorrect value type entered! Expected type: int"); 
            return false;
        }
        return value;     
    }

    if (type === "str"){
        return value;
    }
    if (type === "list"){
        return value.split(',');
    }

    ////////////////////////////////////////////////////////////
    // ---------can add here more parsing options------------ //
    ////////////////////////////////////////////////////////////


    // if non of the above types
    return false;
};
