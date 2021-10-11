const express = require('express');
const router = express.Router();
const db = require('./../modules/dbConnection');
const {generateID, createToken, verifyToken} = require("../modules/utilityFunc");
const upload = require('../modules/upload')


// app home page
router.get('/', (req, res) => {
    res.render('index')
})

// retrieve all users data
router.get('/all-user', async (req, res) => {
    const [userData, _metadata] = await db.connection.query('SELECT user_id,user_name,user_email,total_orders,created_at,last_logged_in FROM `book_inventory`;',)
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })
    return res.render('all_user', {userData});
})

// retrieve single user data of provided user ID
router.get('/details/:user_id', async (req, res) => {
    let userId = req.params.user_id;
    console.log(userId);
    const [result, _metadata] = await db.connection.query('SELECT user_id,user_name,user_email,total_orders,created_at,last_logged_in FROM `book_inventory` WHERE user_id=?;', {replacements: [userId]})
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })

    return res.json(result);
})


//  update user-entry form
router.get('/update-page', (req, res) => {
    return res.render('update_user');
})

// handle update details of user
router.post('/update', upload.single('image'), async (req, res) => {
    let userData = {
        user_name: req.body.name,
        user_email: req.body.email,
        user_password: req.body.password,
        user_image: req.file.path,
    }
    // jwt payload used for sign request
    let jwtPayload = {
        user_email: userData.user_email,
        user_password: userData.user_password
    }
    // creation and verification should been handled from a dedicated route 
    verifyToken(createToken(jwtPayload))  // dummy procedure and have no affect on procedure

    const [dbData, metadata] = await db.connection.query('SELECT user_email,user_password FROM `book_inventory`WHERE user_email=? AND user_password=?', {replacements: [userData.user_email, userData.user_password]})
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })
    try {
        if (dbData[0].user_password !== userData.user_password) {
            return res.send('Values Entered doesn\'t match with any records')
        }
    } catch (err) {
        console.log(err);
        return res.send('Values Entered doesn\'t match with any records')
    }
    delete userData['user_password']
    delete userData['user_email']
   await db.native.promise().query('UPDATE `book_inventory` SET ? WHERE user_email=?', [userData, jwtPayload.user_email])
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })

    return res.send('Data Updated Successfully')
})


// user entry form 
router.get('/insert-page', (req, res) => {
    return res.render('add_user');
})

// handle new user entry
router.post('/insert', upload.single('image'), async (req, res) => {
    let userId = generateID();
    let userData = {
        user_id: userId,
        user_name: req.body.name,
        user_email: req.body.email,
        user_password: req.body.password,
        user_image: req.file.path,
    }

    // jwt payload used for sign request
    let jwtPayload = {
        user_email: userData.user_email,
        user_password: userData.user_password
    }
    // creation and verification should been handled from a dedicated route 
    verifyToken(createToken(jwtPayload))  // dummy procedure and have no affect on procedure

    const [result, _metadata] = await db.native.promise().query('INSERT INTO `book_inventory` SET ?', userData)
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })

    return res.send('Data Inserted Successfully')
})


// delete user data of provided user ID
router.post('/delete/:user_id', async (req, res) => {
    let userId = req.params.user_id;
    const [result, _metadata] = await db.connection.query('DELETE  FROM `book_inventory` WHERE user_id=?', {replacements: [userId]})
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })

    return res.send('Record deleted successfully');
})


// send user image of provided user ID
router.get('/image/:user_id', async (req, res) => {
    let userId = req.params.user_id;
    const [result, _metadata] = await db.connection.query('SELECT `user_image` FROM `book_inventory` WHERE user_id=?', {replacements: [userId]})
        .catch(err => {
            console.log(err)
            return res.send('Something gone wrong!')
        })
    return res.json({
        userId, image: `${req.protocol}://${req.hostname}:${process.env.SERVER_PORT}/${result[0].user_image}`
    });
})

module.exports = router;