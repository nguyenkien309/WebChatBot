const express = require('express');
const router = express.Router();
const AdminController = require('../apps/controllers/AdminController');
const AuthController = require('../apps/controllers/AuthController');
const DataIntentController = require('../apps/controllers/DataIntentController');
const DataUtterController = require('../apps/controllers/DataUtterController');
const IntentController = require('../apps/controllers/IntentController');
const nlpController = require('../apps/controllers/nlpController');
const ReportController = require('../apps/controllers/ReportController');
const ReviewController = require('../apps/controllers/ReviewController');
const StoryController = require('../apps/controllers/StoryController');
const UserController = require('../apps/controllers/UserController');
const UtterController = require('../apps/controllers/UtterController');
const authMiddleware = require('../apps/middlewares/authMiddleware');
const uploadMiddleware = require('../apps/middlewares/uploadMiddleware')

const validatorMiddleware = require('../apps/middlewares/validatorMiddleware')
class AdminRouter {
    init() {
        router.get("/", authMiddleware.isAuth, AdminController.index);

        router.route("/login")
            .get(authMiddleware.isLogin, AuthController.login)
            .post(authMiddleware.isLogin, validatorMiddleware.loginValidator(), AuthController.postLogin);

        router.get("/logout", AuthController.logout);

        router.get("/profile", authMiddleware.isAuth, AdminController.profile);
        router.post("/profile", authMiddleware.isAuth, uploadMiddleware.single("avatar"), AdminController.postProfile);
        router.post("/UpdateAvatar", authMiddleware.isAuth, uploadMiddleware.single("avatar"), AdminController.updateAvatar);

        // --------------------- USER ----------------
        router.get("/user", authMiddleware.isAuth, authMiddleware.isAdmin, UserController.index);
        router.get("/user/create", authMiddleware.isAuth, authMiddleware.isAdmin, UserController.create);
        router.post("/user/create", authMiddleware.isAuth, authMiddleware.isAdmin, uploadMiddleware.single("avatar"), UserController.store);
        router.get("/user/edit/:id", authMiddleware.isAuth, authMiddleware.isAdmin, UserController.edit);
        router.post("/user/edit/:id", authMiddleware.isAuth, authMiddleware.isAdmin, UserController.update);
        router.get("/user/delete/:id", authMiddleware.isAuth, authMiddleware.isAdmin, UserController.delete);

        // --------------------- INTENT ----------------
        router.get("/intent", authMiddleware.isAuth, IntentController.index);
        router.get("/intent/create", authMiddleware.isAuth, IntentController.create);
        router.post("/intent/create", authMiddleware.isAuth, IntentController.store);
        router.get("/intent/edit/:id", authMiddleware.isAuth, IntentController.edit);
        router.post("/intent/edit/:id", authMiddleware.isAuth, IntentController.update);
        router.get("/intent/delete/:id", authMiddleware.isAuth, IntentController.delete);
        router.get("/intent/getData/:id", authMiddleware.isAuth, IntentController.getData);

        // --------------------- DATAINTENT -------------
        router.get("/dataintent", authMiddleware.isAuth, DataIntentController.index);
        router.get("/dataintent/edit/:id", authMiddleware.isAuth, DataIntentController.edit);
        router.post("/dataintent/edit/:id", authMiddleware.isAuth, DataIntentController.update);
        router.get("/dataintent/delete/:id", authMiddleware.isAuth, DataIntentController.delete);

        // --------------------- UTTER ----------------
        router.get("/utter", authMiddleware.isAuth, UtterController.index);
        router.get("/utter/create", authMiddleware.isAuth, UtterController.create);
        router.post("/utter/create", authMiddleware.isAuth, UtterController.store);
        router.get("/utter/edit/:id", authMiddleware.isAuth, UtterController.edit);
        router.post("/utter/edit/:id", authMiddleware.isAuth, UtterController.update);
        router.get("/utter/delete/:id", authMiddleware.isAuth, UtterController.delete);
        router.get("/utter/getData/:id", authMiddleware.isAuth, UtterController.getData);

        // --------------------- DATAUTTER -------------
        router.get("/datautter", authMiddleware.isAuth, DataUtterController.index);
        router.get("/datautter/edit/:id", authMiddleware.isAuth, DataUtterController.edit);
        router.post("/datautter/edit/:id", authMiddleware.isAuth, DataUtterController.update);
        router.get("/datautter/delete/:id", authMiddleware.isAuth, DataUtterController.delete);


        // --------------------- STORY -------------
        router.get("/story", authMiddleware.isAuth, StoryController.index);
        router.get("/story/create", authMiddleware.isAuth, StoryController.create);
        router.post("/story/create", authMiddleware.isAuth, StoryController.store);
        router.get("/story/edit/:id", authMiddleware.isAuth, StoryController.edit);
        router.post("/story/edit/:id", authMiddleware.isAuth, StoryController.update);
        router.get("/story/delete/:id", authMiddleware.isAuth, StoryController.delete);


        // --------------------- TRAINBOT -------------
        router.get("/nlp", authMiddleware.isAuth, authMiddleware.isAdmin, nlpController.index);
        router.get("/nlp/train", authMiddleware.isAuth, authMiddleware.isAdmin, nlpController.train);



        // --------------------- REVIEW -------------
        router.get("/review", authMiddleware.isAuth, ReviewController.index);
        router.get("/review/create", authMiddleware.isAuth, ReviewController.create);
        router.post("/review/create", authMiddleware.isAuth, uploadMiddleware.single("avatar"), ReviewController.store);
        router.get("/review/edit/:id", authMiddleware.isAuth, ReviewController.edit);
        router.post("/review/edit/:id", authMiddleware.isAuth, uploadMiddleware.single("avatar"), ReviewController.update);
        router.get("/review/delete/:id", authMiddleware.isAuth, ReviewController.delete);


        // --------------------- REPORT -------------
        router.get("/report", authMiddleware.isAuth, ReportController.index);
        // router.get("/report/create", authMiddleware.isAuth, ReportController.create);
        // router.post("/report/create", authMiddleware.isAuth, ReportController.store);
        router.get("/report/edit/:id", authMiddleware.isAuth, ReportController.edit);
        router.post("/report/edit/:id", authMiddleware.isAuth, ReportController.update);
        router.get("/report/delete/:id", authMiddleware.isAuth, ReportController.delete);


        router.get("*", (req, res) => {
            res.render("admin/404")
        })
        return router;
    }

}

module.exports = new AdminRouter();