const paypal = require('paypal-rest-sdk');
const config = require('config')
paypal.configure(config.get("paypal"));

module.exports = paypal;