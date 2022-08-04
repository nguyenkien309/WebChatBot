const jwtHelper = require("../helper/jwtHelper");
const dataUtterModel = require("../models/dataUtterModel");
const paginate = require("../../common/paginate");
class DatautterController {
    // [GET] /datautter
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
            const total = await dataUtterModel.countDocuments();
            const totalPage = Math.ceil(total / limit);


            let utters = await dataUtterModel.find({}).populate([{ path: 'user_id', select: 'first_name last_name' }, { path: 'utter_id', select: 'name slug' }]).skip(skip).limit(limit);
            // console.log(utters);
            return res.render('admin/datautter/index', {
                title: 'Danh Sách Dữ Liệu Câu Hỏi',
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

    // [GET] /datautter/edit/:id
    async edit(req, res) {
        try {

            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            const { id } = req.params
            // console.log(id);
            let utter = await dataUtterModel.findById(id);
            console.log(utter);
            return res.render('admin/datautter/edit', {
                title: 'Dữ Liệu Câu Hỏi',
                utter: utter,
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
    // [POST] /datautter/edit/:id
    async update(req, res) {
        try {

            const { id } = req.params
            const updateutter = {
                content: req.body.content
            }
            console.log(id);
            console.log(updateutter);
            let utter = await dataUtterModel.findOneAndUpdate({ id: id }, { $set: updateutter });
            console.log(utter);
            return res.redirect('/admin/datautter');

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /user/delete/:id
    delete(req, res) {
        try {
            const { id } = req.params;
            dataUtterModel.findByIdAndDelete(id).then(() => {
                res.redirect("/admin/datautter");
            })

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new DatautterController();