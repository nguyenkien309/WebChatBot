const jwtHelper = require("../helper/jwtHelper");
const utterModel = require("../models/utterModel");
const dataUtterModel = require("../models/dataUtterModel");
const slug = require("slug");
const paginate = require("../../common/paginate");
class UtterController {
    // [GET] /utter
    async index(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            
            let limit = parseInt(req.query.limit) || 3;
            let page = parseInt(req.query.page) || 1;
            let skip = limit * (page - 1);
            const total = await utterModel.countDocuments();
            const totalPage = Math.ceil(total / limit);

            let utters = await utterModel.find({}).populate([{ path: 'user_id', select: 'first_name last_name' }]).skip(skip).limit(limit);
            // console.log(utters);
            return res.render('admin/utter/index', {
                title: 'Danh Sách Câu Trả Lời',
                utters: utters,
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
            console.log({ "err index :": error });
            return res.redirect('/admin');
        }
    }
    // [GET] /utter/create
    async create(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            return res.render("admin/utter/create", {
                title: 'Thêm Mới Câu Trả Lời',
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
    // [POST] /utter/create
    async store(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode?.data?._id;
            let body = req.body;
            if (!idUser) {
                return res.redirect('/admin/login');
            }
            let utter = {
                name: body.name,
                slug: slug(body.name),
                description: body.description,
                user_id: idUser
            }
            // console.log(utter);
            new utterModel(utter).save().then(async (rs) => {
                let datautter = body.datautter || null;
                console.log(datautter);
                if (datautter) {
                    datautter = [...datautter.split("\n")].map(item => item.trim()).filter(value => value);
                    datautter = [...datautter].map(item => {
                        return {
                            'content': item,
                            'utter_id': rs._id,
                            'user_id': idUser
                        }
                    })
                    // console.log(datautter);
                    await dataUtterModel.insertMany(datautter);
                }
                return res.redirect('/admin/utter');
            }).catch((err) => {
                console.log(err);
                return res.redirect('/admin');
            });
        } catch (error) {
            console.log(`err2`);
            console.log({ 'err2': error });
            return res.redirect('/admin');
        }
    }
    // [GET] /utter/edit/:id
    async edit(req, res) {
        try {

            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            const { id } = req.params
            // console.log(id);
            const prutter = utterModel.findById(id);
            const prdatautter = dataUtterModel.find({ utter_id: id })

            Promise.all([prutter, prdatautter]).then((value) => {
                // console.log('datautter :',value[1]);
                const datautter = [...value[1]].map(item => item.content).join('\n');
                return res.render("admin/utter/edit", {
                    title: 'Sửa Thông Tin Câu Trả Lời',
                    Login: {
                        role,
                        fullname,
                        avatar
                    },
                    utter: value[0],
                    datautter: datautter,
                })
            })
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /utter/edit/:id
    async update(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode?.data?._id;
            let body = req.body;
            const { id } = req.params;
            if (!id) {
                return res.redirect('/admin/utter');
            }
            let updateutter = {
                name: body.name,
                slug: slug(body?.name),
                description: body.description,
            }
            // console.log(utter);
            utterModel.findOneAndUpdate({ _id: id }, { $set: updateutter })
                .then(async (rs) => {
                    let datautter = body.datautter || null;
                    if (datautter) {
                        datautter = [...datautter.split("\n")].map(item => item.trim()).filter(value => value);
                        datautter = [...datautter].map(item => {
                            return {
                                'content': item,
                                'utter_id': rs._id,
                                'user_id': idUser
                            }
                        })
                        // console.log(datautter);
                        let prDeleteDatautter = dataUtterModel.deleteMany({ utter_id: id })
                        let prInsertDatautter = dataUtterModel.insertMany(datautter);

                        Promise.all([prDeleteDatautter, prInsertDatautter]).catch(err => {
                            console.log(err);
                        })
                    }
                    return res.redirect('/admin/utter');
                }).catch((err) => {
                    console.log(err);
                    return res.redirect('/admin');
                });
        } catch (error) {
            console.log(`err2`);
            console.log({ 'err2': error });
            return res.redirect('/admin');
        }
    }
    // [GET] /user/delete/:id
    async delete(req, res) {
        try {
            const { id } = req.params;
            let prDeleteDatautter = dataUtterModel.deleteMany({ utter_id: id })
            let prDeleteutter = utterModel.findOneAndDelete({ _id: id })

            Promise.all([prDeleteDatautter, prDeleteutter])
            res.redirect("/admin/utter");

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /utter/getData/:id
    getData(req, res) {
        try {
            const { id } = req.params;
            dataUtterModel.find({utter_id: id}).then((data) => {
                return res.status(200).json(data);
            })
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new UtterController();