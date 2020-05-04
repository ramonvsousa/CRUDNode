
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@crudnode-z42sr.gcp.mongodb.net/test?retryWrites=true&w=majority";
var ObjectId = require('mongodb').ObjectId;

//CONEXÃO COM O MONGO DB
MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('CRUDNode')
    
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000')        
    })
})
//BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }))
//VIEW ENGINE
app.set('view engine', 'ejs')

//RENDER HOME
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/show', (req, res)=>{
    //criar a coleção “data”, que irá armazenar nossos dados
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
     
        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
      })
});

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

//MOSTRAR DADOS DO BANCO
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results }) 
    })
})

//CRUD UPDATE
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
  console.log('id')
 
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
  var rg = req.body.rg
  var cpf = req.body.cpf
  var gender = req.body.gender
  var born = req.body.born
  var telefone = req.body.telefone
  var celular = req.body.celular
  var email = req.body.email
  var endereco = req.body.endereco
  var numero = req.body.numero
  var cidade = req.body.cidade
  var estado = req.body.estado
  var interesse = req.body.interesse
 
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname,
      rg: rg,
      cpf: cpf,
      gender: gender,
      born: born,
      telefone: telefone,
      celular: celular,
      email: email,
      endereco: endereco,
      numero: numero,
      cidade: cidade,
      estado: estado,
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

//CRUD DELETE
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})
