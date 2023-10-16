const user = require("../models/user_detail");
const jwt = require("jsonwebtoken");
const  bcrypt  =  require('bcrypt');
require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "Online-compiler", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {

  try {
    const { userName, email, password } = req.body;

    console.log("hello",email, password, userName);
    const existUserName = await user.findOne({userName});
    if (existUserName) {
      return res.json({
        error: "userName is already taken",
      });
    }
    if(!password || password.length<6){
      return res.json({
        error:"Paswword is required and should be atleast 6 characters long"
      })
    }

    const existEmail = await user.findOne({email});
    if(existEmail){
       return res.json({
        error:"Email is already taken"
       })
    }
    const user_data = await user.create({ userName, email, password });
    return res.json(user_data);
    // console.log(user_data._id);
    // const token = createToken(user_data._id);
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.status(201).json(user_data);
  } catch (err) {
    // const errors = handleErrors(err);
    // res.status(400).json({ err });
    console.log(err);
  }
};

module.exports.longin_post = async (req, res) => {
  const {userName,password} = req.body;
 
  try {
    const isValid = await user.findOne({userName});
    if(!isValid){
      return res.json({error:"Invalid Username"})
    }
    const auth = await bcrypt.compare(password,isValid.password);
    if(!auth){
      return res.json({error:"Invalid Password"})
    }
    else{
    // const token = createToken(isValid._id);
    // res.cookie("cookie", token, { httpOnly: true, maxAge: maxAge * 1000 });
    jwt.sign({email:isValid.email, id:isValid._id, name:isValid.userName}, process.env.JWT_SECRET , {}, (err,token)=>{
      if(err)throw err;
      res.cookie('token',token).json(isValid)
    })
    //  res.json("Password Match");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getProfile = (req,res)=>{
  const {token} = req.cookies;
  if(token){
    jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
      if(err)throw err;
      res.json(user)
    })
  }
  else res.json(null)
}

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  // res.redirect("/");
};
