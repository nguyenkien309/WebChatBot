const fs = require('fs');
const path = require('path');
const jwtHelper = require("../helper/jwtHelper");
const userModel = require("../models/userModel");

class UserController {
    // [GET] /user
    async index(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            let users = await userModel.find({});
            users.forEach(user => {
                delete user.password;
            })
            // console.log(users);
            return res.render('admin/user/index', {
                title: 'Danh Sách Người Dùng',
                users: users,
                Login: {
                    role,
                    fullname,
                    avatar
                }
            })
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /user/create
    async create(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            return res.render("admin/user/create", {
                title: 'Thêm Mới Người Dùng',
                Login: {
                    role,
                    fullname,
                    avatar
                }
            })
        } catch (error) {
            return res.redirect('/admin');
        }
    }
    // [POST] /user/store
    store(req, res) {
        try {
            let body = req.body;

            let user = {
                email: body.email,
                first_name: body.first_name,
                last_name: body.last_name,
                password: body.password,
                gender: body.gender,
                address: body.address,
                phone_number: body.phone_number,
                role: body.role
            }
            // console.log(user);
            const file = req.file;

            if (file) {
                const thumbnail = "users/" + file.filename;
                // console.log(file);
                fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
                user["avatar"] = thumbnail;
            }
            new userModel(user).save().then(() => {
                res.redirect('/admin/user');
            });

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /user/edit
    async edit(req, res) {
        try {

            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            const { id } = req.params
            console.log(id);
            const user = await userModel.findById(id);

            return res.render("admin/user/edit", {
                title: 'Sửa Thông Tin Người Dùng',
                Login: {
                    role,
                    fullname,
                    avatar
                },
                user: user,
            })

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /user/update
    async update(req, res) {
        try {
            let body = req.body;
            const { id } = req.params;
            let updateUser = {
                email: body.email,
                first_name: body.first_name,
                last_name: body.last_name,
                password: body.password,
                gender: body.gender,
                address: body.address,
                phone_number: body.phone_number,
                role: body.role
            }
            console.log(updateUser);
            const file = req.file;

            if (file) {
                const thumbnail = "users/" + file.filename;
                // console.log(file);
                fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
                updateUser["avatar"] = thumbnail;
            }
            await userModel.findOneAndUpdate({ _id: id }, { $set: updateUser })
            res.redirect("/admin/user");

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /user/delete
    async delete(req, res) {
        try {
            const { id } = req.params;
            const updateUser = {
                is_deleted: true
            }
            await userModel.findOneAndUpdate({ _id: id }, { $set: updateUser })
            res.redirect("/admin/user");

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new UserController();