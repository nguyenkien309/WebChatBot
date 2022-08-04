const fs = require('fs');
const path = require('path');
const jwtHelper = require("../helper/jwtHelper");
const reviewModel = require("../models/reviewModel");
const paginate = require("../../common/paginate");
class ReviewController {
    // [GET] /review
    async index(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let skip = limit * (page - 1);
            const total = await reviewModel.countDocuments();
            const totalPage = Math.ceil(total / limit);

            let reviews = await reviewModel.find({}).skip(skip).limit(limit);
            // console.log(users);
            return res.render('admin/review/index', {
                title: 'Danh Sách Review',
                reviews: reviews,
                pages: paginate(page, totalPage),
                page: page,
                totalPage: totalPage,
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
    // [GET] /review/create
    async create(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            return res.render("admin/review/create", {
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
    // [POST] /review/store
    store(req, res) {
        try {
            let body = req.body;

            let review = {
                email: body.email,
                fullname: body.fullname,
                content: body.content,
                phone_number: body.phone_number,
                star: body.star,
                is_hidded: body.is_hidded
            }
            console.log(review);
            // console.log(user);
            const file = req.file;

            if (file) {
                const thumbnail = "reviews/" + file.filename;
                // console.log(file);
                fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
                review["avatar"] = thumbnail;
            }
            new reviewModel(review).save().then(() => {
                res.redirect('/admin/review');
            });

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /review/edit
    async edit(req, res) {
        try {

            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            const { id } = req.params
            // console.log(id);
            const review = await reviewModel.findById(id);

            return res.render("admin/review/edit", {
                title: 'Sửa Thông Tin Người Dùng',
                Login: {
                    role,
                    fullname,
                    avatar
                },
                review: review,
            })

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /review/edit/:id
    async update(req, res) {
        try {
            let body = req.body;
            const { id } = req.params;
            let updateReview = {
                email: body.email,
                fullname: body.fullname,
                content: body.content,
                phone_number: body.phone_number,
                star: body.star,
                is_hidded: body.is_hidded
            }
            console.log(updateReview);
            const file = req.file;

            if (file) {
                const thumbnail = "reviews/" + file.filename;
                // console.log(file);
                fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
                updateReview["avatar"] = thumbnail;
            }
            reviewModel.findOneAndUpdate({ _id: id }, { $set: updateReview })
                .then(() => {
                    res.redirect('/admin/review');
                });

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /review/delete
    async delete(req, res) {
        try {
            const { id } = req.params;
            const updateUser = {
                is_deleted: true
            }
            await reviewModel.findOneAndUpdate({ _id: id }, { $set: updateUser })
            res.redirect("/admin/review");

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new ReviewController();