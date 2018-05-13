const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// load user model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, result) => result.json({ msg: 'Users works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, result) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// check validation
	if (!isValid) {
		return result.status(400).json(errors);
	}
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			errors.email = 'Email already exists.';
			return result.status(400).json(errors);
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200', //size
				r: 'pg', // rating
				d: 'mm' // default
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});

			// hashing pw with bcrypt
			bcrypt.genSalt(10, (error, salt) => {
				bcrypt.hash(newUser.password, salt, (error, hash) => {
					if (error) {
						throw error;
					}

					newUser.password = hash;
					newUser
						.save()
						.then(user => result.json(user))
						.catch(error => console.log(error));
				});
			});
		}
	});
});

// @route   POST api/users/login
// @desc    log in user/ return jwt token
// @access  Public
router.post('/login', (req, result) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// check validation
	if (!isValid) {
		return result.status(400).json(errors);
	}
	const email = req.body.email;
	const password = req.body.password;

	// find user {by email
	User.findOne({ email }).then(user => {
		// check for user
		if (!user) {
			errors.email = 'User not found';
			return result.status(404).json(errors);
		}

		// check pw
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// user matched - create jwt payload
				const payload = {
					id: user.id,
					name: user.name,
					avatar: user.avatar
				};
				// sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 3600 },
					(error, token) => {
						result.json({
							success: true,
							token: 'Bearer ' + token
						});
					}
				);
			} else {
				errors.password = 'Password incorrect';
				return result.status(400).json(errors);
			}
		});
	});
});

// @route   GET api/users/current
// @desc    return current user
// @access  Private
router.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		result.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
		});
	}
);

module.exports = router;
