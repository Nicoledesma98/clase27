import { findToys, createToy } from "../services/JugeteServices.js"


export const getToys = async (req,res) =>{
    try{
        const toys = await findToys()
        res.status(200).send(toys)

    }catch(error){
        res.status(500).send("ocurrio un error en getToys", error)
    }
}

export const postToys = async (req,res) =>{
    try{
        const { nombre, descripcion, precio } = req.body
        const newToy = createToy({nombre, descripcion, precio})
        res.status(200).send(newToy)
    }catch(error){
        res.status(500).send('ocurrio un error en postToys',error)
    }
}