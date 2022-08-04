/* eslint-disable no-undef */
require('dotenv').config();
module.exports = {

    app: {
        port: process.env.PORT || 3000,
        views_folder: __dirname + "/../src/apps/views",
        view_engine: "ejs",
        static_folder: __dirname + "/../src/public",
        session_key: "ccccc",
        session_secure: true,
        tmp: __dirname + "/../temp",
        MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/",
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "JWT_SECRET_ccccc@@",
        JWT_ACCESS_TOKEN_LIFE: process.env.JWT_ACCESS_TOKEN_LIFE || "10m",
    },
    mail: {
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
            user: "bakasll910@gmail.com",
            pass: "kkcmpqtvdflxhnzn"
        }
    },
    paypal: {
        mode: 'sandbox', //sandbox or live
        client_id: 'Afy7mC80g3jd0Ory9vVR7HQDufoJYAmPpHBn2__nQveYVDCFm3Wd_AQfnxZutunsp1r--UjVUdN3BDIR#',
        client_secret: 'EGJXTlndiOPw25aCJwvbPUZOiiPnjq2pvxx1o8pJj_Ycx792GMYv8woyQSuHvA7VWZo3fJzHaqOiqlt6'
    }

}