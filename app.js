var express =require("express"),
    app     =express(),
    methodOverride=require("method-override")
    bodyParser=require("body-parser"),
    mongoose  =require("mongoose")
//appconfig
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));   
app.use(express.static("public"));
app.use(methodOverride("_method"))                                          //here "_method"is parameter which is used to override the method.
//mongoose/model config
var blogSchema =new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {
                type:Date,
                default:Date.now     
             }
});
var Blog =mongoose.model("Blog",blogSchema)
/*Blog.create({
     title:"newblog",
     image:"https://images.unsplash.com/photo-1584044454129-8ddc739d82ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
     body:"this is new blog..."
 })*/


//Restful routes
//index route
app.get("/",function(req,res){
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        {
            console.log("error");
        }
        else{
            res.render("blogs",{blogs:blogs})
        }
    })
})
//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.post("/blogs",function(req,res){

   Blog.create(req.body.blog,function(err,newlyCreatedBlog){
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        } 
    })
})
//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.render("show",{foundBlog: foundBlog })
        }
    })
});
//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{Blog: foundBlog})
        }
    })
//update route    
})
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})
//delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deleteBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})


app.listen(2000,function(){
 console.log("Blogapp server has started");
})