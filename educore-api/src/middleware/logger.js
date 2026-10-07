const mysql = require('mysql2/promise');
const createApiLogger = require('./middleware/apiMonitorLogger'); // wherever you put it

const pool = mysql.createPool({
  host: 'nozomi.proxy.rlwy.net',
  port: 53835,
  user: 'root',
  password: 'password123',
  database: 'railway',
});

app.use(createApiLogger(pool)); // before your routes, e.g. before app.use('/api/v1/auth', authRoutes)