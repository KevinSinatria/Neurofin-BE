require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../routes/expenseRoutes');
const authRoutes = require('../routes/authRoutes');
const { sequelize } = require('../models');
const errorHandler = require('../middlewares/errorHandler');
const config = require('../config/config');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
      },
    },
  });

  server.route([...authRoutes, ...routes]);
  
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return errorHandler(response, h);
    }
    return h.continue;
  });

  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

init();