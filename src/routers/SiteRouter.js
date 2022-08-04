const express = require('express');
const router = express.Router();
const SiteController = require('../apps/controllers/SiteController');
const activeMiddleware = require('../apps/middlewares/activeMiddleware');
class SiteRouter {
    init(){
        router.get("/", activeMiddleware.countActive, SiteController.index)

        router.route("/contact")
            .get(SiteController.contact)
            .post(SiteController.sendMessage)

        router.get("/about", SiteController.about)
        router.get("/donate", SiteController.donate)
        router.get("/service", SiteController.service)
        router.get("/chat", SiteController.chat)
        

        
        return router;
    }

}

module.exports = new SiteRouter();