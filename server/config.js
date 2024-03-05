const config = {
    development: {
        database: 'my_db',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: 3306,
        dialect: 'mysql',
    },
}; 

module.exports = config;