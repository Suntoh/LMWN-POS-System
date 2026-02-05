const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'db',
    process.env.DB_USER || 'user',
    process.env.DB_PASSWORD || 'password',
    {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'db',
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

const syncDB = async (options = {}) => {
    try {
        await sequelize.sync(options);
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing the models:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    connectDB,
    syncDB
};