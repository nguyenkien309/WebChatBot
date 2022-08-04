const { validationResult } = require("express-validator");


module.exports.validateHelper = (req) => {
    const validatorErr = validationResult(req);
    if (!validatorErr.isEmpty()) {
        const extractedErrors = {}
        validatorErr.array().map(err => extractedErrors[err.param] = err.msg)
        return extractedErrors;
    }
    return null;
}