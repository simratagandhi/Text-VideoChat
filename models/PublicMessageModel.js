var Sequelize = require('sequelize');
var sequelize = new Sequelize('mayday2.db', null, null,{
    dialect: 'sqlite',
    port: '5000'
});

module.exports = function(sequelize, DataTypes){
	return sequelize.define('MESSAGES', {
		msg_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		msg: Sequelize.TEXT,
		user_id: {
			type: Sequelize.TEXT,
			//waiting for USERS table to be created
			// references: USERS,
			// referencesKey: user_id
		},
		time_id:{
			type: Sequelize.DATE,
			defaultValue: DataTypes.NOW()
		}
	});
}

    //db.run("CREATE TABLE ANNOUNCEMENTS (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, annon TEXT, user_id TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
