import dotenv from 'dotenv'
import prisma from './config/prisma'
import app from './app'

dotenv.config()


const PORT = process.env.PORT ?? 3001

const start = async () => {
    try {
        await prisma.$connect()
        console.log('Connection a la BD reussie')

        app.listen(PORT, ()=> {
            console.log(`Our application is listening on http://localhost:${3000}`)
        })
        
    } catch (error) {
        console.error('starting failed')
        
    }
}

start()
