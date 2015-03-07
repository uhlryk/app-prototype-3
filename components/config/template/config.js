module.exports = {
	app : {
		port : 3001
	},
	db : {
		normal : {
			type : 'mysql',
			host : 'localhost',
			dbname : 'loyteam',
			user : 'root',
			pass : 'root',
			port : '8889'
		},
		session : {
			type : 'redis',
			host : '',
			user : '',
			pass : ''
		}
	},
	cors : {
		origin : "http://127.0.0.1:3000"
	},
	logType : "dev",
	appPercentage : 1,
	adminAuth : {
		login : "admin@loyteam.pl",
		pass : "aaaaaa6"
	}
};