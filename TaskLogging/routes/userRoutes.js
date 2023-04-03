const express = require('express');
const router = express.Router();
const {getUsers,getUser,createUser,editUser,registerUser,deleteUser, loginUser,getLogs} = require('../controllers/userController');
const {validateToken} = require('../JWT');


 router.get('/logs',getLogs)
 router.get('/',validateToken,getUsers)
 router.get('/:id',validateToken,getUser)
 router.post('/',validateToken,createUser)
 router.put('/:id',validateToken,editUser)
 router.delete('/:id',validateToken,deleteUser)
 router.post('/register',registerUser)
 router.post('/login',loginUser)

module.exports = router