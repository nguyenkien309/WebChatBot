const activeModel = require('../models/activeModel');
class activeMiddleware {
    async countActive(req, res, next) {
        let start = new Date();
        let end = new Date();
        start.setDate(start.getDate()-1)
        let a = await activeModel.findOne({
            time: {
                $lte: end,
                $gte: start,
            }
        });
        if (a) {
            let newActive = {
                count: ++a.count
            }
            await activeModel.findOneAndUpdate({ _id: a.id }, { $set: newActive })
            
        } else {
            let active = new activeModel({ count: 0 });
            await active.save();
        }
        next();
    }
}
module.exports = new activeMiddleware();