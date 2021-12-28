const e_usermodel = require("../model/employee_model");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const { any } = require("joi");

//Register_Api
async function Register(req, res) {
  try {
    const Register = joi.object({
      //serialnumber: joi.string().required(),
      name: joi.string().required(),
      email: joi.string().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
          )
        )
        .required(),
      phoneno: joi.number().required(),
      salary: joi.number().required(),
      gender: joi.string().required(),
      //dob: joi.date().required(),
      //state: joi.string().required(),
      city: joi.string().required(),
    });
    const { error } = Register.validate(req.body);
    if (error) {
      return res.status(422).send({ Message: error.details[0].message });
    }

    const {
      //serialnumber,
      name,
      email,
      password,
      phoneno,
      salary,
      gender,
     //dob,
      //state,
      city,
    } = req.body;

    const finduser = await e_usermodel.findOne({
      email: email,
    });
    if (finduser) {
      return res.status(422).send({ Message: "user is already registered" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new e_usermodel({
      //serialnumber,
      name,
      email,
      password: hash,
      phoneno,
      salary,
      gender,
      //dob,
      //state,
      city,
    });
    user.save();
    return res.status(200).send({ Message: "user Register successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
}

//login_Api
async function login(req, res) {
  try {
    const login = joi.object({
      email: joi.string().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
          )
        )
        .required(),
    });
    const { error } = login.validate(req.body);
    if (error) {
      return res.status(422).send({ Message: error.details[0].message });
    }

    //Taking two parameter(email and password)!
    const { email, password } = req.body;

    //Finding the user from models!
    const loginuser = await e_usermodel.findOne({
      email: email,
    });
    if (!loginuser) {
      return res.status(422).send({ Message: "user not found" });
    }

    //comparing the register and login password from bcrypt method!
    const compare = bcrypt.compareSync(password, loginuser.password);
    if (!compare) {
      return res.status(422).send({ Message: "Please entered valid password" });
    }

    //Token sending with loginuser!

    const token = jwt.sign(
      {
        id: loginuser.id,
        email: loginuser.email,
        name: loginuser.name,
        serialnumber: loginuser.serialnumber,
        phoneno: loginuser.phoneno,
        salary: loginuser.salary,
        gender: loginuser.gender,
        state: loginuser.state,
        city: loginuser.city,
      },
      process.env.JWT_SECRET,
      { expiresIn: "40m" }
    );

    return res
      .status(200)
      .send({ Message: "user login successfully", Token: token });
  } catch (e) {
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
}

//updatEmployeeProfile Api
async function employee_update(req, res) {
  try {
    //importing joi validation!
    const employee_update = joi.object({
      name: joi.string().required(),
      phoneno: joi.number().required(),
    });
    const { error } = employee_update.validate(req.body);
    if (error) {
      return res.status(422).send({ Message: error.details[0].message });
    }
    //updatingEmployee
    const update_emp = await req.body;
    // console.log('1',update_emp)
    if (!update_emp) {
      return res.status(422).send({ Message: "employee not updated" });
    }

    const userid = req.user.id;
    //console.log('2',userid)
    //we are updating employee name and phoneno.
    const { name, phoneno } = req.body;

    const updatedata = await e_usermodel.findByIdAndUpdate(
      { _id: userid },
      { name, phoneno },
      { new: true }
    );
    //console.log('3',updatedata)
    return res.status(200).send({ Message: "Employee updated successfully" });
  } catch (e) {
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
}

//resetPasswordApi!
async function reset_password(req, res) {
  try {
    let reset_password = joi.object({
      oldpwd: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
          )
        )
        .required(),
      newpwd: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
          )
        )
        .required(),
      confirmpwd: joi.ref("newpwd"),
    });
    const { error } = reset_password.validate(req.body);
    if (error) {
      return res.status(422).send({ Message: error.details[0].message });
    }

    //changing password from body
    const userid = req.user.id;
    // console.log("1",userid)
    const field = ({ oldpwd, newpwd, confirmpwd } = req.body);
    //console.log("2",field)
    const user = await e_usermodel.findOne({ _id: userid });
    //console.log("3",updatedata)

    const compare = bcrypt.compareSync(oldpwd, user.password);
    //console.log("4",compare)
    if (!compare) {
      return res
        .status(422)
        .send({ Message: "please enter valid credentials." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpwd, salt);

    await e_usermodel.updateOne( { _id: userid },{ password: hash } );

    //console.log("5",e_usermodel)
    return res.status(200).send({ Message: "password changed successfully." });
  } catch (e) {
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
}

//addEmployeeApi!
async function EmployeeDetails(req,res){
    try{
          const employee = await e_usermodel.find().count()
        console.log("Total number of employee : ",employee)
        return res.status(200).send({ 'Total number of employee': employee })

        //const tSalary = await e_usermodel.
    } 
    catch(e){
        return res.status(500).send({Message: `something went wrong, ${e}`})
    }
}






module.exports = {
  Register,
  login,
  employee_update,
  reset_password,
  EmployeeDetails
};
