const { check } = require('express-validator');


class validatorMiddleware {
    loginValidator = () => {
        return [
            check('password')
                .isLength({ min: 5 })
                .withMessage('password phải hơn 5 kí tự')
                .matches(/\W+/g)
                .withMessage('gồm kí tự đặc biệt'),
            check('email')
                .isEmail()
                .withMessage('email không hợp lệ')
        ]
    }
}
module.exports = new validatorMiddleware();