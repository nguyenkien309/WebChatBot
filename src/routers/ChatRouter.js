const express = require('express');
const router = express.Router();
const ChatController = require('../apps/controllers/ChatController');
const activeMiddleware = require('../apps/middlewares/activeMiddleware');

class ChatRouter {
    init() {
        router.get("/", activeMiddleware.countActive, ChatController.index)
        return router;
    }
}

module.exports = new ChatRouter();