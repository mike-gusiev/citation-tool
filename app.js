const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const knex = require('./knex');
const axios = require('axios');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}));
app.set("trust proxy", true);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', apiRouter);

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working!' });
});


const waitForDatabaseConnection = async () => {
  try {
    await knex.raw('SELECT 1');
    console.log('Database connection established');
  } catch (err) {
    throw new Error('Could not connect to the database');
  }
};

const fetchNgrokUrl = async () => {
  const NGROK_API_URL = 'http://ngrok:4040/api/tunnels';
  const envPath = path.resolve(__dirname, '.env');

  try {
    const { data } = await axios.get(NGROK_API_URL);
    const ngrokUrl = data.tunnels?.[0]?.public_url;

    if (ngrokUrl) {
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
      }

      const updatedEnvContent = envContent.includes('SERVER_URL=')
        ? envContent.replace(/SERVER_URL=.*/g, `SERVER_URL=${ngrokUrl}`)
        : `${envContent}\nSERVER_URL=${ngrokUrl}`;

      fs.writeFileSync(envPath, updatedEnvContent.trim() + '\n');

      process.env.SERVER_URL = ngrokUrl;
    } else {
      console.error('No ngrok URL found.');
    }
  } catch (error) {
    console.error('Error fetching ngrok URL:', error.message);
  }
};

const checkServerUrl = async () => {
  const serverUrl = process.env.SERVER_URL;

  if (!serverUrl) {
    console.error('SERVER_URL is not defined in the environment variables.');
    return;
  }

  try {
    const { data, status } = await axios.get(`${serverUrl}/test`);
    if (status === 200 && data.message === 'Server is working!') {
      console.log(`Server URL is correct & working: ${serverUrl}`);
    } else {
      console.error(`Server URL is not responding as expected: ${serverUrl}`);
    }
  } catch (error) {
    console.error(`Error checking SERVER_URL: ${error.message}`);
  }
};

const initializeApp = async () => {
  try {
    await waitForDatabaseConnection();
    await knex.migrate.latest();
    console.log('Migrations are up to date');
    await fetchNgrokUrl();
    await checkServerUrl();
  } catch (err) {
    console.error('Initialization error:', err);
    process.exit(1);
  }
};

initializeApp();

module.exports = app;
