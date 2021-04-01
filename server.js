const express=require('express');

const app=express();


// connecting to the database :

require('./config/db')();

app.use(express.json({extended:true}));
app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/contacts',require('./routes/contacts'));


const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`connected to port ${PORT}`));