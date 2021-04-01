const mongoose=require('mongoose');
const config=require('config');
const connectionstring=config.get('mongoURI');

const dbConnection=async()=>{
    try{
        await mongoose.connect(connectionstring,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        });
        console.log('connected to database');
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}


module.exports=dbConnection;