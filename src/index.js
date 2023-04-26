import 'dotenv/config.js'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import routerToys from "./routes/jueguete.js"
import routerUsers from "./routes/users.js"
import routerSession from "./routes/session.js"
import initializePassport from "./config/passport.js"

const app = express()

app.use(express.json())

const connectionMongoose = async () => {
    await mongoose.connect(process.env.MONGODBURL,{
        useNewUrlParser: true,
        useUnifiedTopology : true,
    })
        .catch((error) => console.log(error));
}
connectionMongoose()

app.use(cookieParser(process.env.PRIVATE_KEY_JWT))
app.use(passport.initialize())
initializePassport(passport)
app.use('/users', routerUsers)
app.use('/toys', routerToys)
app.use('/auth', routerSession)



app.listen(4000,() =>{
    console.log(`Server on port 4000`)
})