//imports 
const datetime = require('node-datetime');
const sendgrid = require('../Utils/sendgrid');


//exports
module.exports = function(Notification,clientsConnectes,sequelize) {


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*-------------procedure pour sauvegarder une  notification Acceptation/Rejet du compte bancaire ----------------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/

function addNotificationCompte(idUser,type,etat,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:0 ,//evenement sur un compte bancaire
        TypeCompteEmetteur : type, //type du compte bancaire à rejeter ou à accepter
        Etat : etat // 0 pour evenement de reject et 1 pour evenement d'acceptation, 3 : evenement de blocage, 2 : evenement de déblocage

    }).then(function(newNotification){
         response = newNotification.IdNotification
         callback(response);
        
    })
    .catch(err => {

         response = -1
         callback(response)
         console.error('Unable to add notification', err);
     });

}


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*-------------procedure pour sauvegarder une  notification de virement entre les comptes d'un meme client-------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/

function addNotificationVirementEntreSesComptes(idUser,typeEmetteur,typeRecepteur,montant,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:1 ,//evenement de virement entre les comptes d'un meme client
        TypeCompteEmetteur : typeEmetteur, //type du compte bancaire depuis lequel le virement est éffectué
        TypeCompteRecepteur : typeRecepteur,//type du compte bancaire vers lequel le virement est effectué
        Montant : montant //montant de virement 

    }).then(function(newNotification){
         response = newNotification.IdNotification
         callback(response);
        
    })
    .catch(err => {

         response = -1
         callback(response)
         console.error('Unable to add notification : ', err);
     });

}


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*-------------procedure pour sauvegarder une  notification de virement émis validé/rejeté ----------------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/


function addNotificationVirementEmis(idUser,NomRecepteur,montant,etat,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:2 ,//evenement de virement émis
        Montant: montant, //montant emis
        ClientCorrespondant : NomRecepteur, //nom du client vers qui le virement est effectué
        Etat : etat // 0 pour virement rejeté et 1 pour virement accepté

    }).then(function(newNotification){
         response = newNotification.IdNotification
         callback(response);
        
    })
    .catch(err => {

         response = false
         callback(response)
         console.error('Unable to add notification', err);
     });

}
function addNotificationVirementEmistest(idUser,NomRecepteur,montant,etat,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:2 ,//evenement de virement émis
        Montant: montant, //montant emis
        ClientCorrespondant : NomRecepteur, //nom du client vers qui le virement est effectué
        Etat : etat // 0 pour virement rejeté et 1 pour virement accepté

    }).then(function(newNotification){
         response = true
         callback(response);
        
    })
    .catch(err => {

         response = false
         callback(response)
         console.error('Unable to add notification', err);
     });

}



/*---------------------------------------------------------------------------------------------------------------------*/
    
/*-----------------------procedure pour sauvegarder une  notification de virement reçu --------------------------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/


function addNotificationVirementRecu(idUser,NomEmeteur,montant,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:3 ,//evenement de virement recu
        Montant: montant, //montant reçu
        ClientCorrespondant : NomEmeteur //nom du client  qui a effectué le virement recu.

    }).then(function(newNotification){
         response = newNotification.IdNotification
         callback(response);
        
    })
    .catch(err => {

         response = -1
         callback(response)
         console.error('Unable to add notification', err);
     });

}



function addNotificationVirementRecuTest(idUser,NomEmeteur,montant,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:3 ,//evenement de virement recu
        Montant: montant, //montant reçu
        ClientCorrespondant : NomEmeteur //nom du client  qui a effectué le virement recu.

    }).then(function(newNotification){
         response = true
         callback(response);
        
    })
    .catch(err => {

         response = false
         callback(response)
         console.error('Unable to add notification', err);
     });

}


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*-----------procedure pour sauvegarder une  notification de prise de commission ( de gestion / d'opération)-----------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/


function addNotificationCommission(idUser,typeCommission,typeCompte,montant,callback){
    
    //get current date and time 
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:M:S');
    var dateCreation = formatted ;

    var newNotification = Notification.create({
       
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0, //0 pour notification non lue et 1 pour notification lue
        Evenement:4 ,//evenement de prise de commission
        Montant: montant, //montant de la commission
        TypeCompteEmetteur : typeCompte,//type du compte bancaire depuis lequel est prise la comission
        Etat : typeCommission // 0 pour commission de gestion et 1 pour commision d'opération.

    }).then(function(newNotification){
         response = newNotification.IdNotification
         callback(response);
        
    })
    .catch(err => {

         response = -1
         callback(response)
         console.error('Unable to add notification', err);
     });

}


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*-----------------------procedure pour sauvegarder une  notification d'un ordre de virement---------------------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/


function addNotificationOrdreVirement(){
    
    //pas encore développée

}


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*------------------------------- procedure pour marquer une  notification comme lue -----------------------------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/



function marquerNotificationLue(idNotification,callback){
    
    Notification.findOne(
       {
          attributes:['IdNotification','Lue'],
          where: { 'IdNotification' : idNotification }
       }
    ).then(function(NotificationFound){

        if (NotificationFound){
            if(NotificationFound.Lue == 0){
                NotificationFound.update({
                    Lue: 1
                }).then(function() {
                    
                    response = {
                        'statutCode' : 200, // notification marquée comme lue 
                    }
                    callback(response);
                    
                }).catch(err => {

                    console.log(err);
                    response = {
                        'statutCode' : 500, // erreur interne
                        'error':'Unable mark notification'
                    }
                    callback(response);
                });
            } else {
                response = {
                    'statutCode' : 400, // bad request
                    'error':'notification déjà lue'
                }
                callback(response);
            }

        }else {
            response = {
                'statutCode' : 404, // not found
                'error':'Unable to find notification'
            }
            callback(response);

         }
        
        
    })
    .catch(err => {

        console.log(err);
        response = {
            'statutCode' : 500, // erreur interne
            'error':'Unable mark notification'
        }
        callback(response);
     });

}

/*---------------------------------------------------------------------------------------------------------------------*/
    
/*------------------------------- procedure pour récupérer tous les notifications non lues d'un client-----------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/

function getUnreadNotifications(idUser,callback){
    
    Notification.findAll(
        {
            attributes:['IdNotification','Evenement','Montant','ClientCorrespondant','TypeCompteEmetteur','TypeCompteRecepteur','Etat'],
            order: [
                ['Date', 'DESC']
            ],
            where: { 'IdUser' : idUser,'Lue':0} 
        }

    ).then((notifications)=>{

        
        response ={
            'statutCode' : 200,
            'notifications' : notifications
        }
        callback(response)

    }).catch((err)=>{

        console.log(err)
        response ={
            'statutCode' : 500,
            'error' : "unable to get unread notifications"
        }
        callback(response)
    })

}


/*---------------------------------------------------------------------------------------------------------------------*/

/*------------------------------- procedure pour construire le message d'une notification de validation d'un compte----*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/

function createNotificationMessage(idNotification,callback){
    
    Notification.findOne(
        {
            where: { 'IdNotification' : idNotification} 
        }

    ).then((notificationFound)=>{

        if(notificationFound){

            switch (notificationFound.Evenement)
            {
                case 0:   ; // acceptation/rejet de copte
                    var typeCompte = "?"
                    var etatCompte = "?"
                    switch (notificationFound.TypeCompteEmetteur){ //type du compte bancaire à rejeter ou à accepter
                        case 0 : typeCompte = "courant"; break;
                        case 1:  typeCompte = "épargne"; break;
                        case 2:  typeCompte = "devise euro"; break;
                        case 3:  typeCompte = "devise dollar"; break;
                    }
                    
                    switch(notificationFound.Etat){ // 0 pour evenement de reject et 1 pour evenement d'acceptation
                        case 0 : etatCompte = "rejetée"; break;
                        case 1 : etatCompte = "validée"; break;
                    }
                    notification = {
                        "id" : idNotification,
                        "evenement": notificationFound.Evenement,
                        "titre" : "Création de compte",
                        "message": "la création de votre compte "+typeCompte+" a été "+etatCompte+" ."
                    }
                    callback(notification)
                break ;

                case 1: // Virement entre les compte du meme client
                    var typeCptEmetteur = "?"
                    var monnaie = "?"
                    var typeCptRecepteur = "?"
                    switch(notificationFound.TypeCompteEmetteur ){//type du compte bancaire depuis lequel le virement est éffectué
                        case 0 : typeCptEmetteur = "courant"; monnaie = "DZD"; break;
                        case 1 : typeCptEmetteur = "épargne"; monnaie = "DZD"; break;
                        case 2 : typeCptEmetteur = "devise euro";monnaie = "EUR";  break;
                        case 3 : typeCptEmetteur = "devise dollar";monnaie = "USD"; break;
 
                    }
                     
                    switch (notificationFound.TypeCompteRecepteur ){  //type du compte bancaire vers lequel le virement est effectué
                        case 0 : typeCptRecepteur = "courant"; break;
                        case 1 : typeCptRecepteur = "épargne"; break;
                        case 2 : typeCptRecepteur = "devise euro"; break;
                        case 3 : typeCptRecepteur = "devise dollar"; break;

                    }
                    notification = {
                        "id" : idNotification,
                        "evenement": notificationFound.Evenement,
                        "titre" : "Virement entre vos comptes",
                        "message": "Un virement depuis votre compte "+typeCptEmetteur+" vers votre compte "+typeCptEmetteur+" d'un montant de "+notificationFound.Montant+" "+monnaie+" a été effectué."
                    }
                    callback(notification)
                   
                break ;

                case 2:   //   Virement émis validé/rejeté 
                    var etatVirement = "?"
                    switch(notificationFound.Etat){ // 0 pour evenement de reject et 1 pour evenement d'acceptation
                        case 0 : etatVirement = "rejeté"; break;
                        case 1 : etatVirement = "validé"; break;
                    }
                    notification = {
                        "id" : idNotification,
                        "evenement": notificationFound.Evenement,
                        "titre" : "Virement emis",
                        "message": "Le virement vers "+notificationFound.ClientCorrespondant+" du montant "+notificationFound.Montant+" DZD a été "+etatVirement+ " ."
                    }
                    callback(notification)
        
                break ;

                case 3:    //  Virement recu 
                    notification = {
                        "id" : idNotification,
                        "evenement": notificationFound.Evenement,
                        "titre" : "Virement reçu",
                        "message": "Un virement "+notificationFound.Montant+" DZD est reçu depuis "+notificationFound.ClientCorrespondant+" ."
                    }
                    callback(notification)

                break ;

                case 4:    //  Commission de gestion/opération
                    var typeCpt = "?"
                    var monnaie = "?"
                    var message = "?"
                    var titre = "?"
                    switch(notificationFound.TypeCompteEmetteur){ //type du compte bancaire depuis lequel est prise la comission
                        case 0 : typeCpt = "courant"; monnaie = "DZD"; break;
                        case 1 : typeCpt = "épargne"; monnaie = "DZD"; break;
                        case 2 : typeCpt = "devise euro";monnaie = "EUR";  break;
                        case 3 : typeCpt = "devise dollar";monnaie = "USD"; break;

                    }
                    switch(notificationFound.Etat){ // 0 pour commission de gestion et 1 pour commision d'opération.
                        case 0:
                            message = "Une commission de gestion de "+notificationFound.Montant+" "+monnaie+" a été prise sur votre compte "+typeCpt+" ."
                            titre = "Commission de Gestion"
                            break;
                        case 1:
                            message = "Une commission d\'opération de "+notificationFound.Montant+" "+monnaie+" a été prise sur votre compte "+typeCpt+" ."
                            titre = "Commission d\'opération"
                            break;


                    } 
                    notification = {
                        "id" : idNotification,
                        "evenement": notificationFound.Evenement,
                        "titre" : titre,
                        "message": message
                    }
                    callback(notification)
                break ;
            }

        }        
       
    }).catch((err)=>{

        console.log(err)
        callback(-1)
    })

}

/*---------------------------------------------------------------------------------------------------------------------*/

/*------------------------------- procedure pour envoyer une notification mobile à un client connecé-----------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/

function sendNotification(idUser,idNotification){

    console.log("notification ajoutée à la BDD")
    if(clientsConnectes.get(idUser)){

        createNotificationMessage(idNotification,(notification)=>{
        clientsConnectes.get(idUser).emit('notification',notification.message)
        console.log("notification envoyée au client mobile")
              });
    } else {
           console.log("Client offline. Notification non envoyée")
    }


}


function sendNotificationMail(idUser,idNotification){

   
        createNotificationMessage(idNotification,(notification)=>{
       // clientsConnectes.get(idUser).emit('notification',notification.message)
        sendgrid.sendEmail(idUser,"Virement THARWA",notification.message);
        //console.log("notification envoyée au client mobile")
              });
    


}


function addNotificationVirementEmistest(idUser,NomRecepteur,montant,etat,callback){
   
    //get current date and time
    var dt = datetime.create();
    var formatted = dt.format('Y-m-dTH:m:S');
    var dateCreation = formatted ;
 
    var newNotification = Notification.create({
      
        IdUser : idUser,
        Date : dateCreation,
        Lue : 0,//0 pour notification non lue et 1 pour notification lue
        Evenement:2 ,//evenement de virement émis
        Montant: montant, //montant emis
        ClientCorrespondant : NomRecepteur, //nom du client vers qui le virement est effectué
        Etat : etat // 0 pour virement rejeté et 1 pour virement accepté
 
    }).then(function(newNotification){
         response = true
         callback(response);
        
    })
    .catch(err => {
 
         response = false
         callback(response)
         console.error('Unable to add notification', err);
     });
 
 }



//exporter les procedure :
return {addNotificationCompte,addNotificationVirementEntreSesComptes,addNotificationVirementEmis,
        addNotificationVirementRecu,addNotificationCommission,marquerNotificationLue,getUnreadNotifications,
        createNotificationMessage,sendNotification,addNotificationVirementEmistest,addNotificationVirementRecuTest,sendNotificationMail};


}    