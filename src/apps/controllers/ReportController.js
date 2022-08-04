const jwtHelper = require("../helper/jwtHelper");
const reportModel = require("../models/reportModel");
const paginate = require("../../common/paginate");

class ReportController {
    // [GET] /report
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
            const total = await reportModel.countDocuments();
            const totalPage = Math.ceil(total / limit);


            const reports = await reportModel.find().skip(skip).limit(limit);
            return res.render('admin/report', {
                title: 'Phản Hồi',
                reports: reports,
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
    async edit(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            const { id } = req.params;
            const report = await reportModel.findById(id);
            return res.render('admin/report/edit', {
                title: 'Phản Hồi',
                report: report,
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
    async update(req, res) {
        try {
            
            const { id } = req.params;
            let updateReport = {
                name: req.body.name,
                email: req.body.email,
                content: req.body.content
            }
            await reportModel.findByIdAndUpdate(id, {$set : updateReport});
            return res.redirect('/admin/report');
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    delete(req, res) {
        try {
            const { id } = req.params;
            reportModel.findByIdAndDelete(id).then(() => {
                res.redirect('/admin/report')
            })

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}
module.exports = new ReportController();