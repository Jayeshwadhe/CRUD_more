const usermodel = require('../model/user_model')
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const res = require('express/lib/response')
const { findByIdAndDelete } = require('../model/user_model')
const { vary } = require('express/lib/response')

//Signup_Api
 async function signup(req,res){
     try{
         //console.log(req)
         

         const signup = joi.object({
             name: joi.string().required(),
             email: joi.string().required(),
             password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
             mobile: joi.number().required()
         })
         const { error } = signup.validate(req.body)
         if(error){
             return res.status(422).send({Message: error.details[0].message})
         }

         const { name, email, password, mobile } = req.body
         console.log(req.body)
         
         const finduser = await usermodel.findOne({
             email:email
         })
         if(finduser){
             return res.status(422).send({Message:'user is already registered'})
         }

            const salt = bcrypt.genSaltSync(10) 
            const hash = bcrypt.hashSync(password, salt)

         const user = new usermodel ({
             name,
             email,
             password: hash,
             mobile
         })
         user.save()
         return res.status(200).send({Message:'user signup successfully'})

     }
     catch(e){
         //console.log(e)
         return res.status(500).send({Message:`something went wrong, ${e}`})
     }
 }

async function login(req,res){
<<<<<<< HEAD
    //console.log('ll')
=======
    console.log('ll')
>>>>>>> bbfcccdb6b1816871542ada5f074952d5a9485fa

    try{
        
<<<<<<< HEAD
=======
        
>>>>>>> bbfcccdb6b1816871542ada5f074952d5a9485fa
        const login = joi.object({
            email: joi.string().required(),
            password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required()
        })
        const { error } = login.validate(req.body)
        
        if(error){
            return res.status(422).send({Message: error.details[0].message})
        }
        
        const { email, password } = req.body
        
        
<<<<<<< HEAD
//console.log('ss',req.body)
=======

>>>>>>> bbfcccdb6b1816871542ada5f074952d5a9485fa
        const loginuser = await usermodel.findOne({
            email:email
        })
        //console.log(loginuser)

        if(!loginuser){
            return res.status(422).send({Message:'user not foundddd'})
        }
        //comparing the password singup and login
        const compare = bcrypt.compareSync(password, loginuser.password)
    if (!compare) {
       return res.status(422).send({ Message: 'Please enter valid password.' })
    }
    
    var token = jwt.sign({ id: loginuser.id, email: loginuser.email, name: loginuser.name }, process.env.JWT_SECRET, { expiresIn: '90m' })
    
    // const userid = req.user.id
    //     var {token}=req.body
    // usermodel.findOneAndUpdate(
    //     {
    //         _id: userid
    //     },
        
    //     {token},{new:true}
    // )
    return res.status(200).send({ Message: 'User login successfully.' , Token: token  })
    
     
    }
    catch(e){
<<<<<<< HEAD
        //console.log(e)
=======
        
>>>>>>> bbfcccdb6b1816871542ada5f074952d5a9485fa
        return res.status(500).send({Message:`something went wrong, ${e}`})
    }
}



//Delete_Api
async function delete_api(req,res){
    try{
        //console.log(req.user)
        await usermodel.findByIdAndUpdate({
            
                _id: req.user.id,
         },
         {
             isdeleted: true
         })
        //console.log(usermodel)
        return res.status(200).send({Message: 'user deleted successfully'})


    }catch(e){
        //console.log(e);
        return res.status(500).send({Message: `something went wrong', ${e}`});
    }
}


//Update_Api
async function update_api(req,res){
    try{
        const update_api = joi.object({
            name: joi.string().required(),
            mobile: joi.number().required()

        })
        const {error} = update_api.validate(req.body)
        if(error){
            return res.status(422).send({Message: error.details[0].message})
        }
        const update= await (req.body)
        //console.log('1', update)

        if(!update){
            return res.status(422).send({Message: error.details[0].message})
        }
        const userid = req.user.id
        const {name,mobile}=req.body

        const updatedata = await usermodel.findByIdAndUpdate(
            {
                _id: userid
            },
            
            {name, mobile},{new:true}

        )
        //console.log('2',updatedata)
        return res.status(200).send({Message: "user updated successfully"})

    }catch(e){
        return res.status(500).send({Message:`something went wrong, ${e}`})
    }
}

//Delete_Ap
async function delete_ap(req,res){
    try{
         await usermodel.findByIdAndDelete({
             _id: req.user.id
         })
         return res.status(200).send({Message: 'user deleted successfully'})

    }catch(e){
        return res.status(500).send({Message: `something went wrong ${e}`})
    }
}


 module.exports = {
     signup,
     login,
     delete_api,
     update_api,
     delete_ap
 }