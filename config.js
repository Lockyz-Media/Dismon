require('dotenv-flow').config();

module.exports = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    owner: process.env.OWNER,
    embedColor: process.env.DEFAULT_COLOR,
    ownerID: process.env.OWNERID,
    dbl: process.env.DBL
};