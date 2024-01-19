const express = require('express')
require('./db/mongoose.js')

const userRouter = require('./routers/user-router')
const taskRouter = require('./routers/task-router')
const app = express()

const port = process.env.PORT

// app.use((req, res, next) => {
//     res.send("Website on Maintance")
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () =>{
  console.log(`Server running on Port ${port}`)
})
