const express = require('express');
const app = express();
const config = require('config');
const cors = require('cors');
const express_session = require('express-session');
// const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { connectDB } = require('../common/database');

// dev 
// const morgan = require('morgan');
// app.use(morgan('dev'));

app.set("views", config.get("app").views_folder);
app.set("view engine", config.get("app").view_engine);

app.use("/static", express.static(config.get("app").static_folder));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());


// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

connectDB();

app.set('trust proxy', 1) // trust first proxy
const sessionDriver = express_session({
    secret: config.get("app").session_key,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: config.get("app").session_secure
    }
});
app.use(sessionDriver);

// router
app.use(require("../routers/web"));


// catch 404 err
app.use((req, res, next) => {
    const err = new Error("Not Found!");
    err.status = 404;
    next(err);

})


// err handler function
// app.use((err, req, res, next) => {
//     const error = app.get('env') === "development" ? err : {};
//     const status = err.status || 500;
//     // return res.status(status).json({
//     //     error: {
//     //         message: error.message
//     //     }
//     // })
//     return res.render("site/404")
// })

module.exports = app;