const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password:{
    type:String,
    required:true
  },
  confirmpassword:{
    type:String,
    required:true
  }
});

employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
      console.log('the current password is %s',this.password);
      this.password=await bcrypt.hash(this.password,10);
      console.log('the current password is %s',this.password);

      this.confirmpassword=undefined;       //we only need confirm password on registration therefore we will not store it.
    }
    next();                         //it allow the next function i.e, save function to run
})


const Register= new mongoose.model("Register",employeeSchema);
module.exports= Register;