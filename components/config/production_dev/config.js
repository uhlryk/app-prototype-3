module.exports = {
	app : {
		port : 3001
	},
	db : {
		normal : {
			type : 'mysql',
			host : '127.0.0.1',
			dbname : 'loyteam',
			user : 'root',
			pass : 'kjsa73^hw',
			port : '3306'
		},
		session : {
			type : 'redis',
			host : '',
			user : '',
			pass : ''
		}
	},
	cors : {
		origin : "http://oculusriftsoftware.com"
	},
	logType : "dev",
	appPercentage : 1,
	adminAuth : {
		login : "admin@loyteam.pl",
		pass : "aaaaaa6"
	}
};