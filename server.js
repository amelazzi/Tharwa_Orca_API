//imports
const express = require("express");
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const http = require('http');

//instanciation du serveur
var server = express();

//Config de Body-Parser
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());


// config of database THARWA
//den1.mssql6.gear.host

const sequelize = new Sequelize('tharwa', 'cnx', 'orca@2018', {
  host: 'localhost',
  dialect: 'mssql',
  operatorsAliases: false,

  pool: {
    max: 5, 
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  
});

sequelize
    .authenticate()
    .then(() => {
      console.log('Connection to database has been established successfully.');
      
    
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });




//Models
const User = sequelize.import(__dirname + "/models/Users");
const Client = sequelize.import(__dirname + "/models/Client");
const Compte = sequelize.import(__dirname + "/models/Compte");
const Virement = sequelize.import(__dirname + "/models/Virement");
const Banque = sequelize.import(__dirname + "/models/Banque");
const TarifCommission=sequelize.import(__dirname + "/models/TarifCommission");
const Commission = sequelize.import(__dirname + "/models/Commission");
const Notification = sequelize.import(__dirname + "/models/Notification");

//Acces aux données
const compteAccess = require('./Data_access/Compte_access')(Compte,sequelize);

//Controllers                                         
const fcts=require('./controleurs/fcts')(Compte,Client,User,Virement,sequelize,TarifCommission,Commission);
const tokenController = require('./controleurs/tokenCtrl');
const usersController = require('./controleurs/usersCtrl')(User,Virement,sequelize);
const VirementController = require('./controleurs/VirementCntrl')(Virement,Compte,User,Client,fcts,sequelize);

const clientController = require('./controleurs/clientCtrl')(Client,User,Compte,sequelize,fcts);

const accountController = require('./controleurs/accountCtrl')(Client,Compte,compteAccess,sequelize);

const GestionnaireController = require('./controleurs/GestionnaireCntrl')(Virement,User,Banque,sequelize);

const notificationController = require('./controleurs/notificationCtrl')(Notification,sequelize);


var serv2 = http.createServer(server).listen(8080,function (){
   console.log("Serveur en écoute !");
   console.log(__dirname)
});

server.get('/', function(req, res){
   res.sendFile(__dirname + '/socketClient.html');
});

var io = require('socket.io').listen(serv2);
var clients = new Map()

function notifier (){
  if(clients.get('meriem'))clients.get('meriem').emit('notification','message de la notification')
  console.log('notification envoyé') 
}

io.sockets.on('connection', function (socket) {
  console.log('Un client se connect')

   // connexion d'un client mobile
   socket.on('connexion', function(token) {
       tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
          socket.id = OauthResponse.userId;
          clients.set(OauthResponse.userId,socket)
          console.log('le client '+OauthResponse.userId+' est connecté !')
        } else {
          console.log('Client non identifié !')
        }
       });
   });

   
    // deconnexion d'un client mobile
    socket.on('deconnexion', function(token) { 
      tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
          if(socket.id == OauthResponse.userId ){
            if(clients.get(socket.id)){
              clients.delete(socket.id,socket)
              console.log('le client '+socket.id+' est deconnecté !')
            } else {
              console.log('le client n\'existe pas !')
            }
          }
        }
       });
    });

});


//Routes
const NotificationRoute = require('./routes/notificationRoutes')(express,tokenController,notificationController);
server.use('/notification',NotificationRoute);

const usersRoute = require('./routes/usersRoutes')(express,tokenController,usersController,clientController,accountController);
server.use('/users',usersRoute);

const accountsRoute = require('./routes/accountsRoutes')(express,tokenController,accountController,notificationController,clients);
server.use('/accounts',accountsRoute);

const clientRoute = require('./routes/clientRoutes')(express,__dirname,tokenController,accountController,clientController);
server.use('/clients',clientRoute);


const VirementRoute = require('./routes/VirementRoute')(express,__dirname,VirementController,tokenController,usersController);
server.use('/virement',VirementRoute);

const GestionnaireRoute = require('./routes/GestionnaireRoute')(express,GestionnaireController,tokenController);
server.use('/gestionnaire',GestionnaireRoute);


/*server.listen(8088,function (){
   console.log("Serveur en écoute !");
   console.log(__dirname)
});*/

module.exports = server; // pour le test 
