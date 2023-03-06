export const ParseTelToString = (val : string) : string => {
    return ('0' + val?.substring(3))
}

export const ParseStringToTel = (val : string) : string => {
    return ('+66' + val.substring(1))
}

export const ValidateEmail = (val : string) : boolean => {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(val);
    return result;
}