import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'

interface UserRequest{
  name: string;
  email: string;
  password: string;
}

class CreateUserService{
    async execute({name, email, password}: UserRequest){

        //Verifica se ele enviou um email
        if(!email){
            throw new Error("Email incorreto")
        } 

        //Verifica se esse email já está cadastrado na plataforma
        const userAlreadyExixtst = await prismaClient.user.findFirst({ 
           where:{
            email: email
           } 
        })

        if(userAlreadyExixtst){
            throw new Error("Email já cadastrado")
        }

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash,
            },
            select:{
              id: true,
              name: true,
              email: true,
            }
        })

        return user;
    }
}

export { CreateUserService }