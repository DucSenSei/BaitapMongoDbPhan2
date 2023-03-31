const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const { default: mongoose } = require('mongoose');
const methods = require('method-override')
const bodyparser = require('body-parser');
const port = 8080;
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(express.json())
app.use(methods("_method"))
const xehoiModel = require('./xehoiModel');
const uri = 'mongodb://127.0.0.1:27017/cp17310';
mongoose.connect('mongodb://127.0.0.1:27017/cp17310')
                .then(function(){
                    console.log("ket noi thanh cong !")
                })
                .catch(function(err){
                    console.log("error: " + err)
                })


app.engine('.hbs',handlebars.engine({
   extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
   
}))
app.set('view engine','hbs');
app.set('views','./views');


app.get('/', async (req, res) => {
   // await mongoose.connect(uri).then(console.log("Ok men"));
   // let xehois = await xehoiModel.find();
   // console.log(xehois);
   // res.send(xehois);
   res.render('managerProduct');
});
app.get("/getAllxehoi",(req , res) =>{
   xehoiModel.find({}).then(xehoiModel =>{
     res.render("XeHoi",{
        xehoiModel: xehoiModel.map(xehoiModels => xehoiModels.toJSON())
     })
   })
})
app.get('/add_xe', async (req, res) => {
   
   res.render('ThemXeHoi',{
      titleView:"Inserter Products",
   })
});
app.post("/insertXeHoi",async (req , res) =>{
   try {
      const xehoiModels = new xehoiModel(req.body)
      await xehoiModels.save()
      res.redirect("/getAllxehoi")
   } catch (error) {
      res.status(500).render(error)
   }

})
app.get('/deleteXeHoi/:id', async (req, res) => {
   try {
      const ps = await xehoiModel.findByIdAndDelete(req.params.id , req.body)
      if(!ps){
         res.send("not found product")
      }else{
         res.redirect("/getAllxehoi")
      }
   } catch (error) {
      res.status(500).render(error)
   }
  


});
app.get("/NhayManCapNhap/:id", async (req , res) =>{
   
   try {
      await xehoiModel.findById(req.params.id)
     .then((xehoiModels) =>{
         res.render("CapNhapXehoi",{
        titleView:"Update Car",
        xehoiModels : xehoiModels.toJSON()
     })
     })
    
   } catch (error) {
     res.status(500).render(error)
   }
});

app.put("/CapNhapXehoi/:id",(req , res) =>{
   xehoiModel.updateOne({_id:req.params.id} , req.body)
   .then(() => res.status(200).redirect("/getAllxehoi"))
   .catch(error => res.status(500).render(error))
})
app.listen(port, () => {
   console.log('listening on port ' + port);
});