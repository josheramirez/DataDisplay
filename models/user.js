// modelo de usuarios

// libreria necesaria
var mongoose=require("mongoose");
var Schema=mongoose.Schema;
//ruta de coneccion a base de datos, tambien crea la base
mongoose.connect("mongodb://localhost/carpeta");

//esquema, la forma de la tabla en forma de json

//validador de enum
var posibles_valores=["M","F"];

//validar el correo con expresion regular
var mail_match=[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/, "Mail invalido"];

var user_schema=new Schema({
	name: String,
	//validacion manual
	password: {
		type:String,
		//required:true,
		minlength:[3,"password muy corto"],
		validate:{
			validator: function(p){
				return this.password_confirmation==p;
			},
			message: "las contraseñas no son iguales"
		}
	},

	username: {type: String, required:false,maxlength:[50,"maximo 50 caracteres"]},
	// validacion de numeros
	age: {type: Number, min:[5, "minimo 5"], max: [100, "maximo 100"]},
	//validacion requires (true, es que debe estar) o  solo mensje
	email: {type: String, required: "El correo debe estar", match: mail_match},
	date_of_birth: Date,
	sex: {type: String, enum:{values: posibles_valores,message:"sexo no valido"}}
});

//validador de datos, se crea variable password_chonfirmation

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c=password;
})


var User=mongoose.model("User", user_schema);

//exporto la variable user=del modelo moongose creado
module.exports.User=User;