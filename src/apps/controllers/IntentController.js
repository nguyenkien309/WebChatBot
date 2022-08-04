const jwtHelper = require("../helper/jwtHelper");
const intentModel = require("../models/intentModel");
const dataIntentModel = require("../models/dataIntentModel");
const slug = require("slug");
const paginate = require("../../common/paginate");
class IntentController {
    // [GET] /intent
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
            const total = await intentModel.countDocuments();
            const totalPage = Math.ceil(total / limit);

            let intents = await intentModel.find({}).populate([{ path: 'user_id', select: 'first_name last_name' }]).skip(skip).limit(limit);
            // console.log(intents);
            return res.render('admin/intent/index', {
                title: 'Danh Sách Câu Hỏi',
                intents: intents,
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
    // [GET] /user/create
    async create(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            return res.render("admin/intent/create", {
                title: 'Thêm Mới Câu Hỏi',
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
    // [POST] /intent/create
    async store(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode?.data?._id;
            let body = req.body;
            if (!idUser) {
                return res.redirect('/admin/login');
            }
            let intent = {
                name: body.name,
                slug: slug(body.name),
                description: body.description,
                user_id: idUser
            }
            // console.log(intent);
            new intentModel(intent).save().then(async (rs) => {
                let dataintent = body.dataintent || null;
                if (dataintent) {
                    dataintent = [...dataintent.split("\n")].map(item => item.trim()).filter(value => value);
                    dataintent = [...dataintent].map(item => {
                        return {
                            'content': item,
                            'intent_id': rs._id,
                            'user_id': idUser
                        }
                    })
                    // console.log(dataintent);
                    await dataIntentModel.insertMany(dataintent);
                }
                return res.redirect('/admin/intent');
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
    // [GET] /intent/edit/:id
    async edit(req, res) {
        try {

            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            const { id } = req.params
            // console.log(id);
            const prIntent = intentModel.findById(id);
            const prdataIntent = dataIntentModel.find({ intent_id: id })

            Promise.all([prIntent, prdataIntent]).then((value) => {
                // console.log('dataIntent :',value[1]);
                const dataIntent = [...value[1]].map(item => item.content).join('\n');
                return res.render("admin/intent/edit", {
                    title: 'Sửa Thông Tin Câu Hỏi',
                    Login: {
                        role,
                        fullname,
                        avatar
                    },
                    intent: value[0],
                    dataIntent: dataIntent,
                })
            })
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /intent/edit/:id
    async update(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode?.data?._id;
            let body = req.body;
            const { id } = req.params;
            if (!id) {
                return res.redirect('/admin/intent');
            }
            let updateIntent = {
                name: body.name,
                slug: slug(body?.name),
                description: body.description,
            }
            // console.log(intent);
            intentModel.findOneAndUpdate({ _id: id }, { $set: updateIntent })
                .then(async (rs) => {
                    let dataintent = body.dataintent || null;
                    if (dataintent) {
                        dataintent = [...dataintent.split("\n")].map(item => item.trim()).filter(value => value);
                        dataintent = [...dataintent].map(item => {
                            return {
                                'content': item,
                                'intent_id': rs._id,
                                'user_id': idUser
                            }
                        })
                        // console.log(dataintent);
                        let prDeleteDataIntent = dataIntentModel.deleteMany({ intent_id: id })
                        let prInsertDataIntent = dataIntentModel.insertMany(dataintent);

                        Promise.all([prDeleteDataIntent, prInsertDataIntent])
                    }
                    return res.redirect('/admin/intent');
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
            let prDeleteDataIntent = dataIntentModel.deleteMany({ intent_id: id })
            let prDeleteIntent = intentModel.findOneAndDelete({ _id: id })

            Promise.all([prDeleteDataIntent, prDeleteIntent])
            res.redirect("/admin/intent");

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /intent/getData/:id
    getData(req, res) {
        try {
            const { id } = req.params;
            dataIntentModel.find({ intent_id: id }).then((data) => {
                return res.status(200).json(data);
            })
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new IntentController();