var mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {

    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb+srv://lucas:xi0XOp6YzuUQq6Xi@cluster0.egwaua5.mongodb.net/test',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    console.log('Database: ON');
}


// xi0XOp6YzuUQq6Xi