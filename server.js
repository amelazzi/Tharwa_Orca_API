//imports
const express = require("express");
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const http = require('http');
var winston = require('./config/winston');
var morgan = require('morgan');
var appRoot = require('app-root-path');

require('colors');

//instanciation du serveur
var server = express();

//Config de Body-Parser
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(morgan('combined', { stream: winston.stream }));


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



var serv2 = http.createServer(server).listen(8080,function (){
   console.log("Serveur en écoute !");
   console.log(__dirname)
});

server.get('/', function(req, res){
   res.sendFile(__dirname + '/socketClient.html');
});

var io = require('socket.io').listen(serv2);
var clientsConnectés = new Map()

function notifier (){
  if(clientsConnectés.get('meriem'))clientsConnectés.get('meriem').emit('notification','message de la notification')
  console.log('notification envoyé') 
}

io.sockets.on('connection', function (socket) {
  console.log('Un client se connect')

   // connexion d'un client mobile
   socket.on('connexion', function(token) {
       tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
          socket.id = OauthResponse.userId;
          clientsConnectés.set(OauthResponse.userId,socket)
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
            if(clientsConnectés.get(socket.id)){
              clientsConnectés.delete(socket.id,socket)
              console.log('le client '+socket.id+' est deconnecté !')
            } else {
              console.log('le client n\'existe pas !')
            }
          }
        }
       });
    });

}); 

var clientsConnectés = new Map()

//Models
const User = sequelize.import(__dirname + "/models/Users");
const Client = sequelize.import(__dirname + "/models/Client");
const Compte = sequelize.import(__dirname + "/models/Compte");
const Virement = sequelize.import(__dirname + "/models/Virement");
const Banque = sequelize.import(__dirname + "/models/Banque");
const TarifCommission=sequelize.import(__dirname + "/models/TarifCommission");
const Commission = sequelize.import(__dirname + "/models/Commission");
const Notification = sequelize.import(__dirname + "/models/Notification");
const OrdreVirement = sequelize.import(__dirname + "/models/OrdreVirement");

//Acces aux données
const compteAccess = require('./Data_access/Compte_access')(Compte,sequelize);

//Controllers  
const notificationController = require('./controleurs/notificationCtrl')(Notification,clientsConnectés,sequelize);

const fcts=require('./controleurs/fcts')(Compte,Client,User,Virement,sequelize,TarifCommission,Commission);
const ordreVirementController = require('./controleurs/ordreVirementCtrl')(OrdreVirement,Virement,Compte,User,Client,fcts,sequelize,notificationController,Commission);

const tokenController = require('./controleurs/tokenCtrl');
const usersController = require('./controleurs/usersCtrl')(User,Virement,sequelize);
const statistiqueController = require('./controleurs/StatistiqueCntrl')(sequelize);
const VirementController = require('./controleurs/VirementCntrl')(Virement,Compte,User,Client,fcts,sequelize,notificationController);

const clientController = require('./controleurs/clientCtrl')(Client,User,Compte,sequelize,fcts);

const accountController = require('./controleurs/accountCtrl')(Client,Compte,compteAccess,sequelize);

const GestionnaireController = require('./controleurs/GestionnaireCntrl')(Virement,User,Banque,sequelize);



//Routes

const OrdreVirementRoute = require('./routes/ordreVirementRoutes')(express,tokenController,ordreVirementController);
server.use('/ordreVirement',OrdreVirementRoute);

const StatistiqueRoute = require('./routes/statistiqueRoutes')(express,tokenController,statistiqueController);
server.use('/statistique',StatistiqueRoute);

const NotificationRoute = require('./routes/notificationRoutes')(express,tokenController,notificationController);
server.use('/notification',NotificationRoute);

const usersRoute = require('./routes/usersRoutes')(express,tokenController,usersController,clientController,accountController);
server.use('/users',usersRoute);

const accountsRoute = require('./routes/accountsRoutes')(express,tokenController,accountController,notificationController);
server.use('/accounts',accountsRoute);

const clientRoute = require('./routes/clientRoutes')(express,__dirname,tokenController,accountController,clientController);
server.use('/clients',clientRoute);


const VirementRoute = require('./routes/VirementRoute')(express,__dirname,VirementController,tokenController,usersController);
server.use('/virement',VirementRoute);

const GestionnaireRoute = require('./routes/GestionnaireRoute')(accountController,express,GestionnaireController,tokenController);
server.use('/gestionnaire',GestionnaireRoute);


/*server.listen(8088,function (){
   console.log("Serveur en écoute ! 8080 ");
   console.log(__dirname)
});*/



module.exports = server; // pour le test 
/*------------------ test --------------------*/
//const testFct = require('./test/testFct')(fcts);
//const accountFct = require('./test/testAccount')(compteAccess);
//const clientTest  = require('./test/testClient')(clientController); 
//const notificationTest  = require('./test/testNotification')(notificationController);
 