/**
 * create model for users via Sequelize
 */

//connect to sqlite
var Sequelize = require('sequelize')
    , sequelize = new Sequelize('mayday2.db',null, null, {
        dialect: 'sqlite',
        storage: 'mayday.db'
        port:5000
    });
//authenticate to log in
module.exports = function(sequelize, DataTypes){
    return sequelize.define('USER', {
        user_id: Sequelize.STRING,
        password: Sequelize.STRING,
        time_id:{
            type: Sequelize.DATE,
            defaultValue: DataTypes.NOW()
        },
        location: Sequelize.STRING,
        status_id: Sequelize.STRING

    });

}
//sequelize
//.authenticate()
//.complete(function(err) {
//    if (!!err) {
//        console.log('Unable to connect to the database:', err)
//    } else {
//        console.log('Connection has been established successfully.')
//    }
//});
//define model
//var Users = sequelize.define('USER', {
//    user_id: Sequelize.STRING,
//    password: Sequelize.STRING,
//    status_id: Sequelize.STRING,
//    time_id: Sequelize.STRING,
//    location: Sequelize.STRING
//});

// sync for 1st time using
//sequelize
//    .sync({ force: true })
//    .complete(function(err) {
//        if (!!err) {
//            console.log('An error occurred while creating the table:', err)
//        } else {
//            console.log('It worked!')
//        }
//    })