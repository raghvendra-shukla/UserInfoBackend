const mongoose=require("mongoose");
const { Schema } = mongoose;

const AdduserSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    gender:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        required:true,
    }
});
module.exports=mongoose.model("Adduser",AdduserSchema);