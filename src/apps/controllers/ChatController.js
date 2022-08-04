
class ChatController {
    // [GET] /chat
    index(req, res) {
        return res.render('chat/index', { title: 'Chat' })
    }
   
}

module.exports = new ChatController();