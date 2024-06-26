const mongoose = require('mongoose')
const validator = require('validator')  //zod
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required: true,
    trim: true
  },
  email:{
    type : String,
    unique : true,
    required: true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Invalid Email')
      }
    }
  },
  password:{
    type: String,
    required:true,
    trim:true,
    minLength:7,
    validate(value){
      if(value.includes('password')){
        throw new Error("Cannot contain 'password'")
      }
    }
  },
  tokens:[
    {
      token : {
        type: String,
        required: true
      }
    }
  ],
  avatar : {
    type : Buffer
  }
},{
  timestamps : true,
  toJSON : {
    virtuals : true
  }
})

userSchema.virtual('tasks', {
  ref: 'Task', 
  localField: '_id', 
  foreignField: 'owner'
});

userSchema.statics.findByCredentials = async (email, password) => {

  const user = await User.findOne({email})

  if(!user){
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error('Unable to login')
  }

  return user
}

userSchema.methods.generateAuthToken = async function () {

  const user = this
  const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.pre('save', async function (next) {
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// userSchema.pre('remove', async function (next) {
//   console.log("Error")
//   const user = this
//   // console.log(user)
//   await Task.deleteMany({ owner: user._id })
//   next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User
