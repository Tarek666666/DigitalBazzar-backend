import mongoose from 'mongoose'

const createDatabase = async () =>{ 
    try {
        // Connect to the database using the DBURI environment variable and providing additional connection options
        const connection = await mongoose.connect(process.env.DBURI , {
            dbName: `Digital-bazzar-DB`,
            useUnifiedTopology:true,
            useNewUrlParser:true,

        })
        // Log a message to indicate a successful database connection
        console.log('connected to mongodb')
    } catch (error) {
        process.exit(1)
    }
}
export default createDatabase;