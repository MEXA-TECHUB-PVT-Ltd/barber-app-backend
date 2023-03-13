
module.exports = (err,req,res , next)=>{
    
    if(err){
        console.log("Error Handling Middleware called")
    console.log('Path: ', req.path)
    console.error('Error: ', err)
    }
    
    
}