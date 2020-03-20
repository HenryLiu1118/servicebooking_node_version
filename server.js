const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');

// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();
connectDB();
app.use(express.json({ extend: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/users', require('./routes/api/User'));
app.use('/api/userinfo', require('./routes/api/UserInfo'));
app.use('/api/provider', require('./routes/api/Provide'));
app.use('/api/request', require('./routes/api/Request'));
app.use('/api/comment', require('./routes/api/Comment'));
app.use('/api/admin', require('./routes/api/Admin'));

console.log('test from version 2');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
