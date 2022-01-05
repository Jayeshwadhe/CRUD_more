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
      birthday: joi.date().required(),
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
      birthday,
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
      birthday,
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
      return res.status(422).send({ Message: "user not founddd" });
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
        birthday: loginuser.birthday,
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
/**
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

    if (!update_emp) {
      return res.status(422).send({ Message: "employee not updated" });
    }

    const userid = req.user.id;

    //we are updating employee name and phoneno.
    const { name, phoneno } = req.body;

    const updatedata = await e_usermodel.findByIdAndUpdate(
      { _id: userid },
      { name, phoneno },
      { new: true }
    );

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

    const field = ({ oldpwd, newpwd, confirmpwd } = req.body);

    const user = await e_usermodel.findOne({ _id: userid });

    const compare = bcrypt.compareSync(oldpwd, user.password);

    if (!compare) {
      return res
        .status(422)
        .send({ Message: "please enter valid credentials." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpwd, salt);

    await e_usermodel.updateOne({ _id: userid }, { password: hash });

    //console.log("5",e_usermodel)
    return res.status(200).send({ Message: "password changed successfully." });
  } catch (e) {
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
}

//EmployeeDetailsApi!
//TotalNoOfEmployee
async function EmployeeDetails(req, res) {
  try {
    const employee = await e_usermodel.find().count();

    //TotalSalaryOfEmployee
    const tsalary = await e_usermodel.aggregate([
      {
        $group: {
          _id: null,
          Tsalary: {
            $sum: "$salary",
          },
        },
      },
    ]);

    //AvgOfTotalSalary
    const AvgSalary = await e_usermodel.aggregate([
      {
        $group: {
          _id: null,
          Asalary: {
            $avg: "$salary",
          },
        },
      },
    ]);

    //TotalGenderMaleAndFemale
    const gender = await e_usermodel.aggregate([
      {
        $project: {
         male: { $cond: [{ $eq: ["$gender", "male"] }, 1, 0] },
          female: { $cond: [{ $eq: ["$gender", "female"] }, 1, 0] },
        },
      },
      {
        $group: {
          _id: null,
          male: { $sum: "$male" },
          female: { $sum: "$female" },
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).send({
      TotalSalary: tsalary[0].Tsalary,
      Employee: employee,
      Gender: gender,
      AvgSalary: AvgSalary[0].Asalary,
    });
  } catch (e) {
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
}

//EmployeeBirthdayApi
async function EmpBday(req, res) {
  try {
    const EmpBday = await e_usermodel
      // .find(
      //   {
      //     $group: {
      //       _id: null,
      //       birthday: {$gte: "$birthday"}}
      //     },

      // ).count()
      .aggregate([
        {
          $project: {
            m: { $month: "$birthday" },
            d: { $dayOfMonth: "$birthday" },
          },
        },
        {
          $match: {
            $or: any,
          },
        },

        {
          $group: {
            _id: {
              month: "$m",
              day: "$d",
            },
            userids: { $push: "$_id" },
          },
        },
      ]);

    return res.status(200).send({ EmployeeBirthday: EmpBday });
  } catch (e) {
    return res.status(500).send({ Message: `something went wrong, ${e}` });
  }
} */

module.exports = {
  Register,
  login,
  // employee_update,
  // reset_password,
  // EmployeeDetails,
  // EmpBday,
};
