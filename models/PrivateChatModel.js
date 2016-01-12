var Sequelize = require('sequelize');
var sequelize = new Sequelize('mayday2.db', null, null,{
    dialect: 'sqlite',
    port: '5000'
});

module.exports = function(sequelize, DataTypes){
	return sequelize.define('PRIVATE_MESSAGES', {
		msg_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		msg: Sequelize.TEXT,
		sender: {
			type: Sequelize.TEXT,
			// references: USERS,
			// referencesKey: user_id
		},
		receiver: {
			type: Sequelize.TEXT,
			// references: USERS,
			// referencesKey: user_id
		},
		time_id:{
			type: Sequelize.DATE,
			defaultValue: DataTypes.NOW()
		},
		msg_type:{
			type: Sequelize.TEXT,
		}
	});
}

   
/*var pc = function (db){
	this.db =db;
}

	pc.prototype.getPrivateChat = function(callback){
		this.db.all("select * FROM PRIVATE_MESSAGES", function(err,rows){
			 if (err){ 
    			throw err;
  			} 
  			callback(rows);
		});
	}*/