//imports

var tokenController = require('./tokenCtrl');


//exports
module.exports = function(Client,Compte,compte_access,sequelize) {


 
/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure de création d'un compte bancaire (épargne ou devise) ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function CreateNewBanqueAccount(idClient,type,callback){
    
    Compte.findOne(
        {
            attributes:['Num','Etat'],
            where: {  'IdUser' : idClient, "TypeCompte" : 0 }
        }
    ).then(function(CourantAccountFound){
        if (type == 0){
            if(CourantAccountFound){
                response = {
                    'statutCode' : 409, // conflit
                    'error':'account already exist'
                }
                callback(response);
            }else {
                compte_access.CreateBanqueAccount(idClient,'DZD',type,(newAccount)=>{
                    if (newAccount){
                       response = {
                           'statutCode' : 201, // created    
                       }
                       callback(response);
                    } else {
                       response = {
                           'statutCode' : 500, // internal error
                           'error':'cant create accounte'
                       }
                       callback(response);
                    }
                   
               })
            }
        }
        else {
            if(CourantAccountFound){
                if(CourantAccountFound.Etat == 1){
                   Compte.findOne(
                       {
                           attributes:['Num'],
                           where: {  'IdUser' : idClient, "TypeCompte" : type }
                       }
                       
                   ).then((AccountFound)=>{
                       if (AccountFound){
                           response = {
                               'statutCode' : 409, // conflit
                               'error':'account already exist'
                           }
                           callback(response);
                       } else { //creation du compte :
                           if(type == 1){
                               compte_access.CreateBanqueAccount(idClient,'DZD',type,(newAccount)=>{
                                    if (newAccount){
                                       response = {
                                           'statutCode' : 201, // created    
                                       }
                                       callback(response);
                                    } else {
                                       response = {
                                           'statutCode' : 500, // internal error
                                           'error':'cant create accounte'
                                       }
                                       callback(response);
                                    }
                                  
                               })
                           } else if (type == 2){
                               compte_access.CreateBanqueAccount(idClient,'EUR',type,(newAccount)=>{
                                   if (newAccount){
                                       response = {
                                           'statutCode' : 201, // created
                                           
                                       }
                                       callback(response);
                                    } else {
                                       response = {
                                           'statutCode' : 500, // internal error
                                           'error':'cant create accounte'
                                       }
                                       callback(response);
                                    }
                                    
                               })
                           } else if (type == 3){
                               compte_access.CreateBanqueAccount(idClient,'USD',type,(newAccount)=>{
                                   if (newAccount){
                                       response = {
                                           'statutCode' : 201,
                                           'compte' : newAccount // created
                                           
                                       }
                                       callback(response);
                                    } else {
                                       response = {
                                           'statutCode' : 500, // internal error
                                           'error':'cant create accounte'
                                       }
                                       callback(response);
                                    }
                                    
                               })
                           } else {
                               response = {
                                   'statutCode' : 400, //bad request
                                   'error':'type de compte non valide'
                               }
                               callback(response);
                           }
                           
                       }
                   }).catch((err)=>{
                       console.log(err);
                       response = {
                           'statutCode' : 500, // erreur interne
                           'error':'Unable to create account'
                       }
                       callback(response);
                   });
                }
                else {
                   response = {
                       'statutCode' : 400, // bad request
                       'error':'Courant account is not activated yet'
                   }
                   callback(response);
                }
           }
           else{
               response = {
                   'statutCode' : 400, // bad request
                   'error':'Client has no courant account yet '
               }
               callback(response);
           }
        }
        
    }).catch((err)=>{
        console.log(err);
        response = {
            'statutCode' : 500, // erreur interne
            'error':'Unable to create account'
        }
        callback(response);
    });
}


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------prodédure de validation d'un compte banquire ---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function validateAccount(numAccout,callback){
    Compte.findOne(
      {
        attributes:['Num','Etat'],
        where: {  'Num' : numAccout }
      }
    ).then(function(account){
    
        if (account){
            if(account.Etat == 0){
                account.update({
                    Etat: 1
                }).then(function() {
                    response = {
                        'statutCode' : 200, // compte validé
                    }
                    callback(response);
                    
                }).catch(err => {

                    console.log(err);
                    response = {
                        'statutCode' : 500, // erreur interne
                        'error':'Unable to validate account'
                    }
                    callback(response);
                });
            } else {
                response = {
                    'statutCode' : 400, //bad request
                    'error'  : 'account already active'           
                   }
                callback(response);
            }
        }
        else{
            response = {
                'statutCode' : 404, //not found
                'error'  : 'account not found'           
               }
            callback(response);
        }

    }).catch((err)=>{
        console.log(err);
        response = {
            'statutCode' : 500, // erreur interne
            'error':'Unable to validate account'
        }
        callback(response);
    });
}

/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------récupérer les informations de tous les comptes d'un client ---------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


function getClientAccounts(ClientId,callback){
        Client.hasMany(Compte, {foreignKey: 'IdUser'})
        Compte.belongsTo(Client, {foreignKey: 'IdUser'})
        Compte.findAll({

            attributes:['Num','Etat','Balance'],
            where: { 'IdUser' : ClientId} 
            
        })
        .then((Comptes) => { 
            
                //res.status(200).json({'Comptes': Comptes});
                response ={
                    'statutCode' : 200,
                    'Comptes' : Comptes
                }
                callback(response)
            
        }).catch(err => {
           // res.status(404).json({'error': 'erreur dans l\'execution de la requete'})
            response ={
                'statutCode' : 500,
                'error' : 'cant verify accounts'
            }
            callback(response)
        });
}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour extraire les comptes non validés------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function getCompteNonValide(callback){
           // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
            Client.hasMany(Compte, {foreignKey: 'IdUser'})
            Compte.belongsTo(Client, {foreignKey: 'IdUser'})
            Compte.findAll({

                include: [{
                    model: Client,
                    required: true
                   }],
                where:{'Etat' :0, 
                } ,
               })
            .then((Comptes) => {  
                response = {
                    'statutCode' : 200, // success
                    'Comptes': Comptes          
                }
                callback(response);     
                
              }).catch(err => {
              response = {
                'statutCode' : 500, // success
                'error': 'erreur dans l\'execution de la requete'          
            }
            callback(response) });

        
   
}



//exports :
return {CreateNewBanqueAccount,validateAccount,getClientAccounts,getCompteNonValide};

}
