import mongoose from 'mongoose'

const createDatabase = async () =>{ 
    try {
        const connection = await mongoose.connect(process.env.DBURI , {
            dbName: `Digital-bazzar-DB`,
            useUnifiedTopology:true,
            useNewUrlParser:true,

        })
        console.log('connected to mongodb')
    } catch (error) {
        process.exit(1)
    }
}
export default createDatabase;