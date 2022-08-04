const socketio = require('socket.io');
const { NlpManager } = require("node-nlp");
const path = require('path');
const manager = new NlpManager({ languages: ["en"] });
module.exports = async (server) => {

    const io = socketio(server, {
        cors: {
            origin: "*",
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });


    io.on("connection", async (socket) => {
        // console.log(socket.id)
        await manager.load(path.resolve("src/public/", 'model/model.nlp'));
        socket.emit("message", "Connected Successfully");

        socket.on("message", async (data) => {
            // console.log(`Message received: ${String(data)}`);
            const response = await manager.process("en", String(data));
            if (!response.answer && !response.answers.length) {
                socket.emit(
                    "message",
                    "Xin lỗi bạn, hiện tại mình chưa đủ thông minh để trả lời câu hỏi này :("
                );
            } else {
                let answer = Math.random() > 0.5 ? response.answers[Math.floor(Math.random() * response.answers.length)]["answer"] : response.answer;
                socket.emit("message", answer);
            }
            // console.log(response);
        });
    });

}