const jwtHelper = require("../helper/jwtHelper");
const userModel = require("../models/userModel");
const utterModel = require("../models/utterModel");
const intentModel = require("../models/intentModel");
const dataUtterModel = require("../models/dataUtterModel");
const dataIntentModel = require("../models/dataIntentModel");
const storyModel = require("../models/storyModel");
const activeModel = require("../models/activeModel");
const fs = require('fs');
const path = require('path');
/**
* @param {*} req : Request
* @param {*} res : Response
*/
class AdminController {
    // [GET] /admin
    async index(req, res) {
        // throw new Error('Not implemented');
        const tokenFromClient = req.cookies?.token || "";
        const decode = await jwtHelper.verifyToken(tokenFromClient);
        const role = decode?.data?.role;
        const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
        const avatar = decode?.data?.avatar;

        const prmUtter = utterModel.find().countDocuments();
        const prmdataUtter = dataUtterModel.find().countDocuments();
        const prmIntent = intentModel.find().countDocuments();
        const prmdataIntent = dataIntentModel.find().countDocuments();
        const prmStory = storyModel.find().countDocuments();
        const prmUser = userModel.find().countDocuments();
        const prmActive = activeModel.find().sort({time : 1}).limit(14);
        Promise.all([prmUtter, prmdataUtter, prmIntent, prmdataIntent, prmStory, prmUser, prmActive])
            .then(([countUtter, countdataUtter, countIntent, countdataIntent, countStory, countUser, actives]) => {
                return res.render('admin/index', {
                    title: 'Trang Chủ Quản Trị',
                    Login: {
                        role,
                        fullname,
                        avatar
                    },
                    countUtter,
                    countIntent,
                    countdataUtter,
                    countdataIntent,
                    countStory,
                    countUser,
                    actives
                })
            })
    }
    // [GET] /admin/profile
    async profile(req, res) {
        const tokenFromClient = req.cookies?.token || "";
        if (tokenFromClient) {
            try {
                const decoded = await jwtHelper.verifyToken(tokenFromClient);
                if (decoded) {
                    const role = decoded?.data?.role;
                    const fullname = decoded?.data?.first_name + " " + decoded?.data?.last_name;
                    const avatar = decoded?.data?.avatar;
                    const user = await userModel.findById(decoded.data._id);
                    if (user) {
                        return res.render("admin/profile", {
                            title: "Thông Tin Tài Khoản",
                            user: user,
                            Login: {
                                role,
                                fullname,
                                avatar
                            }
                        })
                    }

                } else {
                    return res.redirect("/admin/login");
                }
            } catch (error) {
                console.log(error);
                res.cookie("token", "", {
                    maxAge: 1
                })
                return res.redirect("/admin/login");
            }
        }
    }
    // [POST] /admin/profile
    async postProfile(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode.data._id;
            const updateUser = {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                gender: req.body.gender,
                address: req.body.address,
                phone_number: req.body.phone_number,
                role: req.body.role
            }
            // console.log(updateUser);
            await userModel.findOneAndUpdate({ _id: idUser }, { $set: updateUser })

            return res.redirect('/admin/profile');
        } catch (error) {
            return res.redirect('/admin/profile');
        }
    }
    // [POST] /admin/UpdateAvatar
    async updateAvatar(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode.data._id;
            const file = req.file;

            if (file) {
                const thumbnail = "users/" + file.filename;
                console.log(file);
                fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
                await userModel.findOneAndUpdate({ _id: idUser }, { $set: { "avatar": thumbnail } });
            }
            return res.redirect('/admin/profile');
        } catch (error) {
            return res.redirect('/admin/profile');
        }
    }



}

module.exports = new AdminController();