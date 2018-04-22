var express=require("express");
//para crear rutas modulares
var router=express.Router();

//no entiendo por que el "/"
// si declaro el get con "/" la ruta resultante sera la ruta que origino el llamado al rueter /app
// si declar "algo" la ruta final sera /app/algo
router.get("/",function(req,res) {
	res.render("app/home")
});
module.exports= router;