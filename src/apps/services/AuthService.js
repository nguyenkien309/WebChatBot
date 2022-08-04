const { validationResult } = require('express-validator');
const userModel = require('./../models/userModel');
const jwtHelper = require('./../helper/jwtHelper');
const { validateHelper } = require('./../helper/validatorHelper')
class AuthService{
    // 
    async postLoginService(req, res) {

        try {
            const { email, password } = req.body;
            console.log(req.body);


            const validatorErr = validateHelper(req);
            if (validatorErr) {
                return res.render("admin/login", {
                    title: "Đăng Nhập",
                    error: validatorErr
                });
            }else{
                const user = await userModel.login(email, password);
                // console.log(user);
                if(user){
                    // console.log("user ok ");
                    const token = await jwtHelper.generateToken(user);
                    // console.log(token);
                    if(token){
                        res.cookie("token", token,{
                            httpOnly: true
                        });
                        return res.redirect("/admin");
                    }
                    
                }
            }
        } catch (error) {
            return res.render("admin/login", {
                title: "Đăng Nhập",
                error : null,
            });
        }

        return res.render('admin/login', {
            title: 'Đăng Nhập',
            error : null,
        })
    }
}

module.exports = new AuthService();