const express = require("express");
const router = express.Router();

const SiteRouter = require("./SiteRouter");
const AdminRouter = require("./AdminRouter");
const ChatRouter = require("./ChatRouter");


// --------------------- SITE ----------------------------------

router.use('/', SiteRouter.init());


// --------------------- ADMIN --------------------------------

router.use('/admin', AdminRouter.init());

// --------------------- CHAT --------------------------------

router.use('/chat2', ChatRouter.init());


router.get("/404", (req, res) => {
    res.render("site/404", { title: "404 Not Found" });
})

router.get("*", (req, res) => {
    res.redirect("/404");
})

module.exports = router;