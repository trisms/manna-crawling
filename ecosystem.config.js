module.exports = {
	apps: [
		{
			name: 'manna-crawling',
			script: './apps/hdc-user-service/server/server.mjs',
			instances: 1,
			autorestart: true,
			watch: false,
			env_prod: {
				NODE_ENV: 'prod',
			},
			env_test: {
				NODE_ENV: 'test',
			},
		},
	],
};
