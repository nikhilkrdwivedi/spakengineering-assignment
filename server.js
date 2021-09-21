import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors';
import {config} from './config/index.js';
import mainRouter from './routes/index.js';
const application = express();

// Server middleware 
application.use(express.json());
application.use(cors());
// application.use(fileUpload());

// Routes entry point
application.use('/api/v1',mainRouter);


application.get('/',(req,res)=>{
    return res.status(200).json({successMsg:`Server is running and current timestamp ${new Date()}`})
});

const startServer = async () =>{
    try {

        // Connection With DB
        await mongoose.connect(config.mongoURI, config.mongoOptions);
        console.log(`Mongoose default connection is open to ${config.mongoURI}`);

        // Start Listening for the server on PORT
        application.listen(config.PORT, () =>
        console.log(`Server started on PORT ${config.PORT} `)
        );
    } catch (err) {
        console.log(`Mongoose default connection has occurred ${err} error`);
        startServer();
    }
}

await startServer();



