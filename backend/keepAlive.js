require('dotenv').config();
const cron = require('cron');
const https = require('https');

// TODO: Replace with your actual Render backend URL
const backendUrl = process.env.BACKEND_URL;

const job = new cron.CronJob('*/14 * * * *', function () {
  console.log('Pinging server to keep alive...');
  https.get(backendUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('Server is alive!');
    } else {
      console.error(`Failed to ping server: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('Error during ping:', err.message);
  });
});

module.exports = { job }; 