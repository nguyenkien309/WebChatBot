const { NlpManager } = require("node-nlp");
const jwtHelper = require("../helper/jwtHelper");
const dataIntent = require("../models/dataIntentModel");
const dataUtter = require("../models/dataUtterModel");
const storyModel = require("../models/storyModel");
const path = require("path");
class nlpController {
    async index(req, res) {
        try {
            const tokenFromClient = req.cookies?.token || "";
            const decode = await jwtHelper.verifyToken(tokenFromClient);
            const role = decode?.data?.role;
            const fullname = decode?.data?.first_name + " " + decode?.data?.last_name;
            const avatar = decode?.data?.avatar;
            const stories = await storyModel.find({}).populate([{ path: "intent_id", select: "name slug description" }, { path: "utter_id", select: "name slug description" }]);
            // console.log(stories);
            return res.render('admin/nlp/index', {
                title: 'Trang Chủ Quản Trị',
                stories: stories,
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
    async train(req, res) {
        try {
            const manager = new NlpManager({ languages: ["en"] });
            let prmData = [];
            storyModel.find({}).then(stories => {
                stories.map(item => {
                    prmData.push(
                        dataIntent.find({ intent_id: item.intent_id }).populate([{ path: "intent_id", select: "slug" }])
                    )
                    prmData.push(
                        dataUtter.find({ utter_id: item.utter_id }).populate([{ path: "utter_id", select: "slug" }])
                    )
                })
                Promise.all([...prmData]).then(async function (listData) {
                    for (const data of listData) {
                        for (const itemdata of data) {
                            if(itemdata.utter_id){
                                manager.addAnswer("en", itemdata.utter_id.slug, itemdata.content);

                            }else{

                                manager.addDocument("en",itemdata.content, itemdata.intent_id.slug );
                            }
                            // console.log(itemdata);
                        }
                    }
                    await manager.train();
                    
                    manager.save(path.resolve("src/public/",'model/model.nlp'));
                    return res.redirect('/admin');
                });

            })

            // Promise.all(prm).then(function (){

            // })
        } catch (error) {
            console.log(error);
            return res.redirect('/admin');
        }
    }
}

module.exports = new nlpController();