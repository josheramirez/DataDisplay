var express=require('express');
var app=express();
// para leer archivos
var bodyParser=require("body-parser");
var User=require("./models/user").User;
var session=require("express-session");
var router_app=require("./routes_app")
var session_middleware=require("./middlewares/session");
var nombre="Joshe"

/*
// var userSchemaJSON={
// 	email:String,
// 	password:String
// };

// Schema crea la tabla (documento) en base al eschema
var user_Schema=new Schema(userSchemaJSON);
// modelo consultado en la db 
var User=mongoose.model("User",user_Schema);
*/
//PARA USAR SESIONES
app.use(session({
	//tiene que ser unico enre aplicaciones
	secret:"132234jlefwelru",
	//true vuelve a guardar aunque halla modificaciones en la sesion
	//false guarda solo si se modifica
	resave: false,
	saveUninitialized: false
}));
//permite rutear a carpetas y archivos que usare
app.use(express.static('public'));
//para leer parametros jason por url
app.use(bodyParser.json());
// forma en se parsearan los datos, false no acepta arrglo u objetos solo json
app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine", "jade");

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("index")
});
app.get("/login",function(req,res){
		res.render("login");
});

app.post("/sessions",function(req,res){
	//fin({parametros de busqueda}, (columnas devuelas, vacio son todas), funcion)
	User.findOne({email:req.body.email,password: req.body.password},function(err,user){
		if(user==null){
			return res.send("error");
		}
		console.log(user);
		req.session.user_id=user._id;
		console.log("SE GUARDO: "+ user.email);
		res.send("hola mundo");
	});
	//User.findOne(), devuelve solo un elemento
});

app.post("/users",function(req,res){
	//cracion del usuario
	//solo puedo insertar en el jason variables declaradas en el modelo user
	var user= new User({email: req.body.email,
						password: req.body.password,
						//name:"Joshe",
						password_confirmation: req.body.password_confirmation
					});
	//console.log(user.password_confirmation);
	// este error se recibe si es que hubo un problema de  validacion user.js
	//o con problemas en el abase de dato
	//es asincrono


	// save lo puedo hacer usando callback o usando promise
	//usando callback, se ejecuta despues de que se intento guardar (error,documento creado,numero de filas afectadas agregadas)
	// user.save(function(err){
	// 	if(err){
	// 		console.log(String(err));
	// 		res.send("hay un error "+err);
	// 	}
	// 	else{res.send("Recibimos tus datos "+req.body.email);}
		
	// });
// USANDO PROMISE, ES EL STANDAR, RETORNA PROMESA
	user.save().then(function(us){
		//se ejecutra si todo sale bien
		res.send("Recibimos tus datos "+req.body.email);
		console.log("ingreso correcto")	
	},function(err){
		//se ejecuta si algo sale mas
		if(err){
			console.log("Erro de ingreso!!!")
			res.send("hubo un error "+req.body.email);	
		}
	});
	
});

//cuando llame a /app, se coore primero el middleware
app.use("/app",session_middleware);

//si pasa el middleware ruteo para que cada vez que entro me diriga a home
app.use("/app",router_app);
//
app.listen(8080);