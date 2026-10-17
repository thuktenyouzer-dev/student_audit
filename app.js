const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
// Static files (CSS, client-side JS) and form parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
 
// Routes
app.use('/', require('./routes/index'));
 
//tempory 
const db = require('./config/db');
app.get('/db-test', async (req, res) => {
  const result = await db.one('SELECT NOW() AS current_time');
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Audit system running at http://localhost:${PORT}`);
});
