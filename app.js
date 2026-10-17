const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
// Static files + form parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
 
// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'audit-dev-secret',
  resave: false,
  saveUninitialized: false,
}));
 
// Make the logged-in user and one-time flash messages available to every view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});
 
// Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
 
// 404 and error handling
app.use((req, res) => {
  res.status(404).render('error', { title: 'Not Found', message: 'That page does not exist.' });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Server Error', message: 'Something went wrong on our side.' });
});
 
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Audit system running at http://localhost:${PORT}`);
  });
}
 
module.exports = app;

