const r = require('express').Router();
const a = require('../middleware/authMiddleware');
const c = require('../controllers/workoutController');

r.use(a);

r.post('/', c.create);
r.get('/', c.list);

// Streak
r.get('/streak', c.streak);

r.delete('/:id', c.remove);

module.exports = r;