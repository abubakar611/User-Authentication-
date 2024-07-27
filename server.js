if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}


const express = require("express")
const app = express()
const bcrypt = require("bcryptjs")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")

initializePassport(
    passport,
    email => user.find(user => user.email === email),
    id => user.find(user => user.id === id)
    )



const user = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.post("/login", passport.authenticate("local", {
    successRedirect: "/main",
    falureRedirect: "/register",
    falureFlash: true
}
//        console.log(user);
//      res.redirect("/main")
        ))

app.post("/register", async(req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        user.push({
            id: Date.now().toString(),
            email: req.body.email,
            user: req.body.user,
            password: hashedPassword,
        })
        console.log(user);
        res.redirect("/login")

    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})
app.get('/main', (req, res) => {
    res.render("main.ejs")
})

app.get('/login', (req, res) =>{
    res.render("login.ejs")
})

app.get('/register', (req, res) =>{
    res.render("register.ejs")
})

app.listen(3000)