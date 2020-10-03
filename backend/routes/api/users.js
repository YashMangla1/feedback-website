const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator');


const User = require('../../models/User');


//@route  POST api/users
//@desc  Register user route 
//@access Public
router.post('/', [
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please provide a valid Email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters.'
    ).isLength({
        min: 6
    })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exits' }] });
            }


            //getting users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //Encrypt passwords
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt); //anything which returns promise we have to add sync away 

            await user.save();

            //return jsonweb token
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });


        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }




    });

module.exports = router;