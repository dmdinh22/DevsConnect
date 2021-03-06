const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// load profile model
const Profile = require('../../models/Profile');

// load user profile model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, result) => result.json({ msg: 'Profile works' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		const errors = {};
		Profile.findOne({ user: req.user.id })
			// grab user info from another model in db
			.populate('user', ['name', 'avatar'])
			.then(profile => {
				if (!profile) {
					errors.noprofile = 'There is no profile for this user.';
					return result.status(404).json(errors);
				}
				result.json(profile);
			})
			.catch(error => result.status(404).json(error));
	}
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, result) => {
	const errors = {};

	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles.';
				return result.status(404).json(errors);
			}

			result.json(profiles);
		})
		.catch(error =>
			result
				.status(404)
				.json({ profile: 'There are no profiles.', error: error })
		);
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, result) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user.';
				result.status(404).json(errors);
			}

			result.json(profile);
		})
		.catch(error =>
			result
				.status(404)
				.json({ profile: 'There is no profile for this user.', error: error })
		);
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, result) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user.';
				result.status(404).json(errors);
			}

			result.json(profile);
		})
		.catch(error =>
			result
				.status(404)
				.json({ profile: 'There is no profile for this user.', error: error })
		);
});

// @route   POST api/profile
// @desc    Create/edit user profile
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return result.status(400).json(errors);
		}

		// Get fields
		const profileFields = {};
		profileFields.user = req.user.id;

		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.githubusername)
			profileFields.githubusername = req.body.githubusername;

		// SKILLS - Spilt into array
		if (typeof req.body.skills !== 'undefined') {
			profileFields.skills = req.body.skills.split(',');
		}

		// SOCIAL
		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				// Update
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then(profile => result.json(profile));
			} else {
				// Create

				// Check if handle exists
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = 'That handle already exists';
						result.status(400).json(errors);
					}

					// Save Profile
					new Profile(profileFields)
						.save()
						.then(profile => result.json(profile));
				});
			}
		});
	}
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
	'/experience',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		const { errors, isValid } = validateExperienceInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return result.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// Add to exp array
			profile.experience.unshift(newExp);

			profile.save().then(profile => result.json(profile));
		});
	}
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
	'/education',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		const { errors, isValid } = validateEducationInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return result.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldofstudy: req.body.fieldofstudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// Add to exp array
			profile.education.unshift(newEdu);

			profile.save().then(profile => result.json(profile));
		});
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Add experience from profile
// @access  Private
router.delete(
	'/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// get remove index
				const removeIndex = profile.experience
					.map(item => item.id)
					.indexOf(req.params.exp_id);

				// splice out of array
				profile.experience.splice(removeIndex, 1);

				// save
				profile.save().then(profile => result.json(profile));
			})
			.catch(error => result.status(404).json(error));
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Add education from profile
// @access  Private
router.delete(
	'/education/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// get remove index
				const removeIndex = profile.education
					.map(item => item.id)
					.indexOf(req.params.edu_id);

				// splice out of array
				profile.education.splice(removeIndex, 1);

				// save
				profile.save().then(profile => result.json(profile));
			})
			.catch(error => result.status(404).json(error));
	}
);

// @route   DELETE api/profile/
// @desc    Add user and profile
// @access  Private
router.delete(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, result) => {
		Profile.findOneAndRemove({ user: req.user.id }).then(() => {
			User.findOneAndRemove({ _id: req.user.id }).then(() => {
				result.json({ success: true });
			});
		});
	}
);

module.exports = router;
