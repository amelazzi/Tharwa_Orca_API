//imports

var tokenController = require('./tokenCtrl');
const sendgrid = require('../Utils/sendgrid')



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
                                           'compte': newAccount
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
        attributes:['Num','Etat','IdUser','TypeCompte'],
        where: {  'Num' : numAccout }
      }
    ).then(function(account){
    
        if (account){
            if(account.Etat == 0){
                sequelize.query('Update Compte set Etat=1 where Num=$num',
                {
                      bind: {
                             num:numAccout
                            }
                }).then(function() {
                    var type;
                    switch(account.TypeCompte)
                    {
                        case 0: type='courant' 
                        break;
                        case 1: type='epargne' 
                        break;
                        case 2: type='devise euro' 
                        break;
                        case 3: type='devise dollar' 
                        break; 
                    }
                    sendgrid.sendEmail(account.IdUser,"Notification THARWA","Votre compte "+type+" est désormais valide.");

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

/*-------------------------------prodédure de réjecction d'un compte banquire ---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function rejectAccount(numAccout,callback){
    Compte.findOne(
      {
        attributes:['Num','Etat','IdUser','TypeCompte'],
        where: {  'Num' : numAccout }
      }
    ).then(function(account){
    
        if (account){
            if(account.Etat == 0){
                account.update({
                    Etat: 2
                }).then(function() {
                    var type;
                    switch(account.TypeCompte)
                    {
                        case 0: type='courant' 
                        break;
                        case 1: type='epargne' 
                        break;
                        case 2: type='devise euro' 
                        break;
                        case 3: type='devise dollar' 
                        break; 
                    }
                    sendgrid.sendEmail(account.IdUser,"Notification THARWA","Votre compte "+type+" a été  rejeté.");

                    response = {
                        'statutCode' : 200, // compte validé
                    }
                    callback(response);
                    
                }).catch(err => {

                    console.log(err);
                    response = {
                        'statutCode' : 500, // erreur interne
                        'error':'Unable to reject account'
                    }
                    callback(response);
                });
            } else  {
                response = {
                    'statutCode' : 400, //bad request
                    'error'  : 'account cant be rejeted '           
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

            attributes:['Num','Etat','Balance','TypeCompte'],
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

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------Procedure pour récupérer le userId du propriétaire d'un compte bancaire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function getAccountOwner (numCompte, callback){

    Compte.findOne(
        {
            attributes:['IdUser','TypeCompte'],
            where: { 'Num' : numCompte}
        }
    ).then((accountFound)=>{
        if(accountFound){
           
            callback(accountFound.IdUser,accountFound.TypeCompte)

        }else {

            callback(false)
        }
    }).catch((err)=>{
        console.log (err)
        callback(false)
    });

}

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------Procedure pour récupérer les info  d'un compte bancaire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function getAccountInfo (numCompte, callback){

    Compte.findOne(
        {
            //attributes:['IdUser','TypeCompte','Balance','DateCreation','CodeMonnaie','IdUser','Etat','TypeCompte'],
            where: { 'Num' : numCompte}
        }
    ).then((accountFound)=>{
        if(accountFound){
           
            callback(null,accountFound)

        }else {

            callback(404,null)
        }
    }).catch((err)=>{
        console.log (err)
        callback(err,null)
    });

}


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------prodédure de validation d'un compte banquire ---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function blocAccount(numAccout,motif,callback){
    
       
    Compte.findOne(
      {
        attributes:['Num','Etat','IdUser','TypeCompte'],
        where: {  'Num' : numAccout }
      }
    ).then(function(account){
    
        if (account){
            if(account.Etat == 1){
                sequelize.query('Update Compte set Etat=3 where Num=$num',
                {
                      bind: {
                             num:numAccout
                            }
                }).then(function() {
                    var type;
                    switch(account.TypeCompte)
                    {
                        case 0: type='courant' 
                        break;
                        case 1: type='epargne' 
                        break;
                        case 2: type='devise euro' 
                        break;
                        case 3: type='devise dollar' 
                        break; 
                    }
                    sendgrid.sendEmail(account.IdUser,"Notification THARWA","Votre compte "+type+" a été bloqué.</br>Motif de blocage : "+motif);

                    response = {
                        'statutCode' : 200, // compte bloqué
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
                if(account.Etat == 3){
                    response = {
                        'statutCode' : 400, //bad request
                        'error'  : 'account is already blocked'           
                       }
                    callback(response);
                }else {

                    response = {
                        'statutCode' : 400, //bad request
                        'error'  : 'account is not active'           
                       }
                    callback(response);
                }
                
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

/*-------------------------------prodédure de déblocage d'un compte banquire ---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function deblocAccount(numAccout,motif,callback){
    
       
    Compte.findOne(
      {
        attributes:['Num','Etat','IdUser','TypeCompte'],
        where: {  'Num' : numAccout }
      }
    ).then(function(account){
    
        if (account){
            if(account.Etat == 3){
                sequelize.query('Update Compte set Etat=1 where Num=$num',
                {
                      bind: {
                             num:numAccout
                            }
                }).then(function() {
                    var type;
                    switch(account.TypeCompte)
                    {
                        case 0: type='courant' 
                        break;
                        case 1: type='epargne' 
                        break;
                        case 2: type='devise euro' 
                        break;
                        case 3: type='devise dollar' 
                        break; 
                    }
                    sendgrid.sendEmail(account.IdUser,"Notification THARWA","Votre compte "+type+" a été débloqué.</br>Motif de déblocage : "+motif);

                    response = {
                        'statutCode' : 200, // compte validé
                    }
                    callback(response);
                    
                }).catch(err => {

                    response = {
                        'statutCode' : 500, // erreur interne
                        'error':'Unable to validate account'
                    }
                    callback(response);
                });
            } else {
                response = {
                    'statutCode' : 400, //bad request
                    'error'  : 'account is not blocked'           
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
        response = {
            'statutCode' : 500, // erreur interne
            'error':'Unable to validate account'
        }
        callback(response);
    });
}



//exports :
return {CreateNewBanqueAccount,validateAccount,getClientAccounts,getCompteNonValide,rejectAccount,getAccountOwner,blocAccount,deblocAccount,getAccountInfo};

}
