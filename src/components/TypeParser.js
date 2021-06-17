// Type Parser:
// Parses the value according to the given type.
// If the value is of different type, other than the given one - returns false and displays an error.
// Adding New Types:
// You can add your own parsing option by adding an if statement.


export function parser(type, value){  
    console.log(type);
    console.log(value);

    if (type === "int"){
        if (value.length === 0) { return value;}
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
        var result = value.split(',');
        var resultTrimmed = result.map((metric) => metric.trim());
        return resultTrimmed;
    }

    ////////////////////////////////////////////////////////////
    // ---------can add here more parsing options------------ //
    ////////////////////////////////////////////////////////////


    // if non of the above types
    return false;
};
