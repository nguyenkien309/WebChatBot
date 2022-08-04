const path = require('path');
const ejs = require('ejs');
const reportModel = require('../models/reportModel');
const reviewModel = require('../models/reviewModel');
const userModel = require('../models/userModel');
const transporter = require('../../common/transporter');
class SiteController {
    // [GET] /
    index(req, res) {
        // let Users = {
        //     email: "nkien6962@gmail.com", 
        //     password: "123456789@", 
        //     first_name: "nguyen",
        //     last_name: "kien",
        //     avatar: "xxx",
        //     gender: "male",
        //     address: "vn",
        //     phone_number: "012345678997",
        //     api_key: "xxx",
        //     is_deleted: false
        // }
        // new userModel(Users).save().then(res => {
        //     res.json({
        //         email: "nkien6962@gmail.com", 
        //         password: "123456789@", 
        //       });
        // })
        reviewModel.find({ is_hidded: "false" }).then(rs => {
            return res.render('site/index', {
                title: 'Trang Chủ',
                reviews : rs
            })
        })
    }
    // [GET] /contact
    contact(req, res) {
        return res.render('site/contact', { title: 'Liên Hệ' })
    }
    // [POST] /contact
    sendMessage(req, res) {
        try {
            const body = req.body;
            // console.log(body);
            let report = {
                name: body.name,
                email: body.email,
                content: body.message,
            }
            new reportModel(report).save().then(async () => {

                const viewPath = req.app.get("views");
                const html = await ejs.renderFile(
                    path.join(viewPath, "site/sendmail.ejs"),
                    {
                        status: "success",
                        msg1: "Cảm ơn bạn đã phản hồi!",
                        msg2: "Chúng tôi sẽ liên hệ với bạn sớm",
                    }
                );

                await transporter.sendMail({
                    to: body.email,
                    from: "ccccc_bot",
                    subject: "Email từ bot",
                    html,
                });
                return res.status(200).json({
                    type: 'success',
                    message: "Thành Công"
                })
            })
        } catch (error) {
            console.log(error);
        }

    }
    // [GET] /about
    about(req, res) {
        userModel.find({ is_deleted: "false" }).then(rs => {

            return res.render('site/about', {
                title: 'Chúng Tôi',
                users : rs
            })
        })
    }
    // [GET] /donate
    donate(req, res) {
        return res.render('site/donate', { title: 'Donate' })
    }
    // [GET] /service
    service(req, res) {
        return res.render('site/service', { title: 'Dịch Vụ' })
    }
    // [GET] /chat
    chat(req, res) {
        return res.render('site/chat')
    }
}

module.exports = new SiteController();