var express=require("express");
mongoose=require("mongoose");
passport=require("passport");
bodyparser=require("body-parser");
Localstategy=require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");
user=require("./model/user");
var path=require('path');


mongoose.connect("mongodb://localhost:27017");
var app=express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
// app.set("views", path.join(__dirname, "views"));
app.use('/public', express.static('public'));

    app.use(require("express-session")
({
    secret:"Rusty",
    resave:false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
   app.get("/",function(req,res)
{
    res.render("Home");
});
   app.get("/Output",isLoggedIn,function(req,res)
{
    res.render("Output");
});
   app.get("/Register",function(req,res)
{
    res.render("Register");
});
   app.post("/Register",function(req,res)
{
    var username=req.body.username
    var password=req.body.password
    user.register(new user({username:username}),
    password,function(err,user)
   {
        if (err)
           {
            console.log(err);
            return res.render("Register");
           }
        passport.authenticate("local")
         (
            req,res,function()
          {
           res.render("Output")
          }
         );
    
    });
});



app.get("/Login", function(req,res)
{
    res.render("Login");
})
app.post("/Login",passport.authenticate("local",
    {
     successRedirect:"/Output",
     failureRedirect:"/Login"}),
     
function(req,res)
{
});


app.get("/logout",function(req,res)
{
    req.logout(function(err)
   {
    if(err)
    {
      return next(err);
    }
      res.redirect("/")
   });
});


function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())return next();
    res.redirect("/Login");
}
  var port=6050;
  app.listen(port,function()
{
    console.log("server has started"+port);
});
