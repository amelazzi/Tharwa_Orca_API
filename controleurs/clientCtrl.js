//imports

var tokenController = require('./tokenCtrl');
var oxr = require('open-exchange-rates'),
    fx = require('money');
const datetime = require('node-datetime');
const crypto = require('crypto');
const sendgrid = require('../Utils/sendgrid')

//exports
module.exports = function(Client,User,Compte,sequelize,fcts) {


/*---------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------procedure pour ajouter un client à la BDD ------------------------------------*/   

/*---------------------------------------------------------------------------------------------------------------------*/
 

    function addClient(req,res,callback) {

        //récupérer les paramètres de l'utilisateur depuis le body de la requete
        var id = req.body.userId;
        var userName = req.body.UserName;
        var password = req.body.Pwd;
        var tele = req.body.Tel
        var type = parseInt(req.body.type);
        var nom = req.body.Nom;
        var prenom = req.body.Prenom;
        var adresse = req.body.Adresse;
        var fonction = req.body.Fonction;
        var imagePath =  req.file.path;

        var dt = datetime.create();
        var formatted = dt.format('Y-m-dTH:M:S');
        var dateCreation = formatted ;

               
        

        if(id == null ||tele== null || userName == null || password == null || type == null || nom == null || prenom == null || adresse == null || fonction == null || imagePath == null){
            response = {
                'statutCode' : 400, //bad request
                'error'  : 'missing parameters'           
               }
            callback(response);
        } 
        
        else {
         
        const value = sequelize.escape(id);
        var idd = sequelize.literal(`userId = CONVERT(varchar, ${value})`)     
        Compte.findOne(
            {
                attributes:['Num','Etat'],
                where: {  'IdUser' : id, "TypeCompte" : 0 }
            }
        ).then(function(compteFound){ 

            if(compteFound){ //si'il existe :
                console.log("exist")
                response = {
                    'statutCode' : 409, // conflit
                    'error':'Client already exists'         
                }
                callback(response);
                
            }
            else{ 
                //former le prochain numero séquentiel du compte banquire
                sequelize.query('exec GetNextId').spread((results, metadata) => {
            
                    var rows = JSON.parse(JSON.stringify(results[0]));
                    var numSeq = rows.id;
                    var middle = numSeq.toString();
                    var Num = makeNumAccount (middle,'DZD');

                    const passwordHash = crypto.createHmac('sha256', password).digest('hex');

                    sequelize.query('exec add_client $Id,$password,$username,$numTel,$Nom,$Prenom,$Adresse,$Fonction,$Photo,$Type,$num,$Date',
                    {
                          bind: {
                                 Id : id,
                                 password:passwordHash,
                                 username: userName,
                                 numTel : tele,
                                 Nom : nom,
                                 Prenom: prenom,
                                 Adresse:adresse,
                                 Fonction:fonction,
                                 Photo:imagePath,
                                 Type : type ,
                                 num : Num,
                                 Date: dateCreation
                                }
                    }).then((res) => {

                               //notifier les banquiers
                               User.findAll({
                                attributes:['userId'],
                                where: { 'type' : 1}
                               }).then((banquiers) => { 
            
                                for(banquer in banquiers ){
                                    sendgrid.sendEmail(banquiers[banquer].userId,"Notification THARWA","Un nouveau compte bancaire Tharwa en attente de validation. ");
                                     
                                     
                                }
                                response = {
                                    'statutCode' : 201, //created
                                    'success': 'Client ajouté'          
                                }
                                callback(response);
                              
                              }).catch((err)=>{
                                   console.log(err)
                              }); 
                                
                                
                    }).catch(err => {

                                console.error(err)
                                response = {
                                    'statutCode' : 500, // error
                                    'error': 'Unable to add client'          
                                }
                                callback(response);
                               
                                
                    });
                });

            }
        })
        .catch(function(err){
                response = {
                    'statutCode' : 500, // error
                    'error':'cant to add client'       
                }
                callback(response);
                console.error('Unable to add client', err);
        });

      }

    }



/*---------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------procedure pour récupérer les informations d'un client authentifié' ---------------------------*/   

/*---------------------------------------------------------------------------------------------------------------------*/
 
function getClientInfo (clientId,callback){
    
    Client.findOne({
        attributes:['Nom','Prenom','Fonction','Type','Adresse','Photo'],
        where: {  'IdUser' : clientId}
    }).then( (clientFound)=>{

        if(clientFound){
            User.findOne({
                attributes:['numTel'],
                where: {  'userId' : clientId}
            }).then((userFound)=>{
                if(userFound){
                    response = {
                        'statutCode' : 200, // success
                        'Nom':clientFound.Nom,
                        'Prenom': clientFound.Prenom,
                        'Fonction' : clientFound.Fonction,
                        'Adresse':clientFound.Adresse,
                        'Type' : clientFound.Type ,
                        'Photo'  : clientFound.Photo ,
                        'Tel' :       userFound.numTel
                    }
                    callback(response);
                }else {
                    response = {
                        'statutCode' : 404, //not Found
                        'error':'User not found'          
                    }
                    callback(response);
                }
                
            }).catch((err)=>{
                console.log(err);
                response = {
                    'statutCode' : 500, 
                    'error':'Can\'t verify client'        
                }
                callback(response);
            });
            
        }else {
            response = {
                'statutCode' : 404, //not Found
                'error':'User not found'          
            }
            callback(response);
        }
    }).catch((err)=>{
        console.log(err);
        response = {
            'statutCode' : 500, 
            'error':'Can\'t verify client'        
        }
        callback(response);
    });

}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*---------------Procedure pour recuperer l'historique de tout les virements et commissions d'un client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function historique(iduser,type,callback){

    fcts.historique(iduser,type,function(err,historique) {
        if (err){
            response = {
                'statutCode' : 500, // success
                'error': 'erreur dans l\'execution de la requete'          
            }
            callback(response) ;
        }else{
            response = {
                'statutCode' : 200, // success
                'historique':historique      
            }
            callback(response);  
        }
       });
      
}
function tauxChange(base,callback){
  

    oxr.set({ app_id: 'a8a5c2a6302b453f9266c7254b043f6a' });
    oxr.latest(function() {
        // Apply exchange rates and base rate to `fx` library object:
        
        fx.rates = oxr.rates;
        fx.base = oxr.base;
        
        switch (base)
        {
            case 'USD':  { 
            response = {
                'statutCode' : 200, // success
                'rates':[{
                    'EUR':fx(1).from('USD').to('EUR')   ,
                    'DZD':fx(1).from('USD').to('DZD')  }  ]
                 
            }
            callback(response); 
        }
            break ;
            case 'EUR': {

                response = {
                    'statutCode' : 200, // success
                    'rates':[{
                        'USD':fx(1).from('EUR').to('USD')   ,
                        'DZD':fx(1).from('EUR').to('DZD')  }  ]
                     
                }
                callback(response); 
            }
            
            break ;
            case 'DZD':  {
                response = {
                    'statutCode' : 200, // success
                    'rates':[{
                        'EUR':fx(1).from('DZD').to('EUR')   ,
                        'USD':fx(1).from('DZD').to('USD')  }  ]
                     
                }
                
                callback(response); 
            }
           
            break ;
            
            
    
    
        }
       
    });


}

  function makeNumAccount (middle,codeMonnaie){

    if (middle.length == 1){
        middle = '00000'+middle;
    }else if (middle.length == 2){
        middle = '0000'+middle;
    }else if (middle.length == 3){
        middle = '000'+middle;
    }else if (middle.length == 4){
        middle = '00'+middle;
    }else if (middle.length == 5){
        middle = '0'+middle;
    }

    var num = 'THW'+ middle + codeMonnaie;
    return num
  }
  

  
    //exporter les services :
    return {addClient,getClientInfo,historique,tauxChange};

}
