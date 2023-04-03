const asyncHandler = require('express-async-handler');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const {createTokens, validateToken} = require('../JWT');
const cookieParser = require('cookie-parser');
const Goal = require('../config/goalModel')


app.use(cookieParser())
app.use(express.json());




const getUsers = asyncHandler(async (req,res) =>{
    const users = await prisma.user.findMany()
    res.status(200).json(users);
})

const getUser = asyncHandler(async (req,res) =>{
    const id = req.params.id
    const user = await prisma.user.findUnique({
        where:{id: Number(id)}
    })
    res.status(200).json(user);
})

const createUser = asyncHandler(async (req,res) =>{
    
    const user = await prisma.user.create({
        data:{...req.body}
    })
    res.status(200).json(user);
});

const editUser = asyncHandler(async (req,res) =>{
    const id = req.params.id
    const user = await prisma.user.update({
        where:{id: Number(id)},
        data:{...req.body}
    })
    res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req,res) =>{
    const id = req.params.id
    const user = await prisma.user.delete({
        where:{id: Number(id)}
    })
    res.status(200).json(user);
});


const registerUser = asyncHandler(async (req,res)=>{
    const {name,password} = req.body;
    bcrypt.hash(password,10).then((hash)=>{
        const user =  prisma.user.create({
            data:{
                name: name,
                password:hash
            }
        }).then((x) =>{
            res.json(x);
        }).catch((err)=>{
            if(err){
                res.status(400).json({error: err});
            }
        })

    })
})


const loginUser = asyncHandler(async (req,res)=>{
    const {name,password} = req.body;

    const user = await prisma.user.findMany({where:{name: name}});

    if(!user[0]) res.status(400).json({error: "User does not exist"});

    const dbPassword = user[0].password
    bcrypt.compare(password,dbPassword).then((match)=>{
        if(!match){
            res.status(400).json({error:"Wrong Username and Password Combination!"});
        }
        else{
            
            const accessToken = createTokens(user)

            res.cookie('token', accessToken, {
                maxAge: 60*60*24*30*1000
            })

            res.json("Logged in successfully");
    
        }
        
    })

   
})

const getLogs = asyncHandler(async (req,res,next) =>{
    let {page =1 , size = 10}=req.query;

      const limit = parseInt(size);
      const skip = (page - 1)*size;

      const users =await Goal.find().limit(limit).skip(skip);

      res.send({page , size , data: users})

    })

module.exports = {
    getUsers,
    getUser,
    createUser,
    editUser,
    registerUser,
    loginUser,
    deleteUser,
    getLogs

}