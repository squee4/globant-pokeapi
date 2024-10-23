const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const cors = require('cors');

const app = express();

// Configure session
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Enable CORS for the React app
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Disable caching for development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with GitHub strategy
passport.use(new GitHubStrategy({
    clientID: 'Ov23lirum0olu3nz6wIN',
    clientSecret: '204c0c723e44a71a729772cd20cc1729c4fc51a8',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: 'http://localhost:3001' }),
  (req, res) => {
    res.redirect('http://localhost:3001/main');
  });

app.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Not authenticated');
  }
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200); // Send a 200 OK response
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});