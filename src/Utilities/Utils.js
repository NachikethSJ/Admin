
 const PhoneNoValidator = (value) => {
    let error = '';
    if (value === '' || value === null) {
        error = 'Cannot be empty!'
        return error;
    }
    else if (isNaN(value)) {
        error = 'Enter numbers only';
        return error;
    }
    else if (value.length !== 10) {
        error = 'Enter 10 digits only!';
        return error;
    }
    else {
        error = ''
        return true;
    }
}
export default PhoneNoValidator;