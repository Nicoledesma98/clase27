import { createUser , findUserByEmail } from "../services/UserServices.js"
import passport from "passport"
import jwt from "jsonwebtoken"
import { validatePassword, createHash } from "../utils/bcrypt.js"

export const loginUser = async (req,res,next) =>{
    try{
        passport.authenticate('jwt',{session:false},async (err,user,info) =>{
            if(err){
                return res.status(401).send(" error en consulta de token")
            }
            if(!user){
                //el token no existe,entonces consulto por el usuario
            const  {email, password } = req.body
            const userBDD = await findUserByEmail(email)

            if(!userBDD){
                //userbdd no encontrado en mi aplicacion
                return res.status(401).send("User no encontrado")
            }
            if (!validatePassword(password,userBDD.password)){
                //constraseña no es valida
                return res.status(401).send("contraseña no valida")
            }
            //ya que el usuario es valido, genero un nuevo token
            const token = jwt.sign({user:{id:userBDD._id}}, process.env.PRIVATE_KEY_JWT)
            res.cookie('jwt',token,{httpOnly:true})
            return res.status(200).json({token})
            }else{
                //el token existe, asi que lo valido
                const token = req.cookies.jwt
                jwt.verify(token,process.env.PRIVATE_KEY_JWT, async (err, decodedToken) =>{
                    if(err){
                        //token no valido
                        return res.status(401).send("credenciales no validas")
                    }else{
                        //token valido
                        req.user = user
                        next()
                    }
                })
            }
        })
    }catch(error){
        res.status(500).send(`Ocurrio un error en session,${error}`)
    }
}

export const registerUser = async (req,res) =>{
    try{
    const {  first_name, last_name, email, age, password } = req.body   
    const userBDD = await findUserByEmail(email)   
    
    if (userBDD){
        res.status(401).send("usuario ya registrado")
    }else {
        const hashPassword = createHash(password)
        const newUser = await createUser({first_name , last_name , email, age, password:hashPassword })
        console.log(newUser)
        const token = jwt.sign({user:{id: newUser._id}},process.env.PRIVATE_KEY_JWT)
        res.cookie('jwt',token,{httpOnly:true})
        res.status(201).json({token})
    }
    }catch(error){
        res.status(500).send(`Ocurrio un error en registro user, ${error}`)
    }
}