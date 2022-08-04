const jwtHelper = require("../helper/jwtHelper");
const storyModel = require("../models/storyModel");
const utterModel = require("../models/utterModel");
const intentModel = require("../models/intentModel");
const slug = require("slug");
const paginate = require("../../common/paginate");
class StoryController {
    // [GET] /story
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
            const total = await storyModel.countDocuments();
            const totalPage = Math.ceil(total / limit);


            let stories = await storyModel.find({}).populate([{ path: 'user_id', select: 'first_name last_name' }, { path: 'intent_id', select: 'name slug' }, { path: 'utter_id', select: 'name slug' }]).skip(skip).limit(limit);
            // console.log(intents);
            return res.render('admin/story/index', {
                title: 'Danh Sách Dữ Liệu Câu Hỏi',
                stories: stories,
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
    // [GET] /story/create
    async create(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            let prmUtter = utterModel.find();
            let prmIntent = intentModel.find();
            Promise.all([prmIntent, prmUtter]).then(([intents, utters]) => {
                console.log(intents);
                console.log(utters);
                return res.render("admin/story/create", {
                    title: 'Thêm Mới Kịch Bản',
                    Login: {
                        role,
                        fullname,
                        avatar
                    },
                    intents: intents,
                    utters: utters,
                })
            })

        } catch (error) {
            return res.redirect('/admin');
        }
    }
    // [POST] /story/create
    async store(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const idUser = decode?.data?._id;
            let body = req.body;
            if (!idUser) {
                return res.redirect('/admin/login');
            }
            let story = {
                name: body.name,
                slug: slug(body.name),
                description: body.description,
                intent_id: body.intent,
                utter_id: body.utter,
                user_id: idUser
            }
            // console.log(utter);
            new storyModel(story).save().then(() => {
                return res.redirect('/admin/story');
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
    // [GET] /story/edit/:id
    async edit(req, res) {
        try {

            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;

            const { id } = req.params
            // console.log(id);
            let story = await storyModel.findById(id);
            console.log(story);
            let prmUtter = utterModel.find();
            let prmIntent = intentModel.find();
            Promise.all([prmIntent, prmUtter]).then(([intents, utters]) => {
                return res.render('admin/story/edit', {
                    title: 'Dữ Liệu Kịch Bản',
                    story: story,
                    intents: intents,
                    utters: utters,
                    Login: {
                        role,
                        fullname,
                        avatar
                    }
                })
            })

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [POST] /story/edit/:id
    async update(req, res) {
        try {

            const { id } = req.params
            let body = req.body;
            let updateStory = {
                name: body.name,
                slug: slug(body.name),
                description: body.description,
                intent_id: body.intent,
                utter_id: body.utter,
            }
            console.log(updateStory);
            let story = await storyModel.findOneAndUpdate({ id: id }, { $set: updateStory });
            console.log(story);
            return res.redirect('/admin/story');

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
    // [GET] /story/delete/:id
    delete(req, res) {
        try {
            const { id } = req.params;
            storyModel.findByIdAndDelete(id).then(() => {
                res.redirect("/admin/story");
            })

        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new StoryController();