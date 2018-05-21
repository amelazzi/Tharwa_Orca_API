//imports
var crypto = require('crypto');
var http = require("http");
const request = require('request');
var tokenVerifier = require('./tokenCtrl');
var async = require('async-if-else')(require('async')); 
var multer  = require('multer')
var upload = multer()
var Codes = require('../ressources/codes');
var Erreur_francais = require('../ressources/erreur_francais');
//Routes
module.exports = function(Virement,Compte,User,Client,fcts,sequeliz,notificationController) {

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement vers un autre client THARWA----------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function TranferClientTH(iduseremmetteur,montant,imagePath,Comptedest,Motif,rep){
    console.log(" id user emmetteur "+iduseremmetteur)
    console.log(" Montant "+montant+ "chemin "+ imagePath)
    console.log("Compte destinataire "+Comptedest)
    var residcomm ={}
    var nomemmetteur={}
    var pourcentagecomm={}
    var numcompteemmetteur={}
    var idrecepteur={}
    var nomrecepteur={}
    var balanceemetteur={}
    if(Comptedest.substr(0, 3)=='THW'){ // Vérifier si le compte destinaire du type THARWA

    
    async.series({ 
         
       pourcentagecommission(callback){//next commission
            fcts.GetPourcentageCommission(4,function(err,pourcentage){
                if(err){
                    console.log(err)
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'error': Erreur_francais.erreur_francais.commissioninexistante         
                     }
                    rep(response); 
                }
                else {
                    pourcentagecomm=pourcentage // pourcentagecomm
                    callback()
                }
                                
            })
        },

        getnextidcommission(callback){
            fcts.GetNextIdCommission(function(idcoomc){ // paramètre de retour
                residcomm=idcoomc //residcomm
                callback()
            })
        },

        getidudercompte(callback){ // récupération de l'ID qui est l'email de destinataire
            fcts.getIdUser(Comptedest, function(err,comte1){
                if (comte1)
                {
                    idrecepteur=comte1.IdUser
                    console.log("id recepterur est "+idrecepteur)
                    callback()
                 }
                 else
                 {
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'error': Erreur_francais.erreur_francais.idnonexistant        
                     }
                    rep(response); 
                 }
            })
        },
        GetNomjEmmetteur(callback){ // récupération nom emmetteur
            fcts.GetUser(iduseremmetteur,function(err, nomEmmetteur){
                if (err){
                    console.log(err)
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'error': Erreur_francais.erreur_francais.nonemmetteurnonexistant        
                    }
                    rep(response); 
                 }
                 else{
                    nomemmetteur= nomEmmetteur.Nom+' '+nomEmmetteur.Prenom
                    console.log("le nom de l emetteur est "+ nomemmetteur)
                    callback()
                 }

            })
        },  

        getCompteBalancee(callback){ // recupération numéro compte emmetteur
            fcts.GetCompte(iduseremmetteur,0,function(err,comptebalance){
                if(err){
                    console.log(err)
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'error': Erreur_francais.erreur_francais.numcompteemmetteurnonexistant
                    }
                    rep(response); 
                    }
                    else{
                        
                        if ((comptebalance.Num.substr(0, 3)=='THW')&&(comptebalance.Balance>montant)){
                        numcompteemmetteur=comptebalance.Num                  
                        callback()
                        }
                        else{
                            if(comptebalance.Num.substr(0, 3)!='THW'){
                                response = {
                                    'statutCode' : Codes.code.codenotfound, // success
                                    'error': Erreur_francais.erreur_francais.emmetteurnonTHARWA
                                }
                                rep(response); 

                            }
                            else{
                                response = {
                                    'statutCode' : Codes.code.codenotfound, // success
                                    'error': Erreur_francais.erreur_francais.balanceinsuffisante
                                }
                                rep(response); 

                            }
                       
                        }
                    
                }
            })            
        },    
        GetNomDestinataire(callback){ // récupération nom destinataire
            fcts.GetUser(idrecepteur,function(err, usernamee){
                if (err){     
                    console.log(err)           
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'error': Erreur_francais.erreur_francais.nomdestinatairenonexistant         
                    }
                    rep(response); 
                 }
                 else{
                    nomrecepteur= usernamee.Nom+' '+usernamee.Prenom
                    console.log("le nom du recepteur est "+nomrecepteur)
                    callback()
                 }
    
            });
        },     
       
        function(callback){
            console.log("le montant est "+ montant + "le compte destinataire est "+Comptedest+ " numero compte emetteur"+numcompteemmetteur+ " Motif est "+Motif +nomemmetteur+nomrecepteur+pourcentagecomm+'commision '+residcomm+ "le chemin est "+imagePath);
            
           if (montant<200000){

                    fcts.AddVirementClientTharwa(montant,Comptedest,numcompteemmetteur,Motif,nomemmetteur,nomrecepteur,pourcentagecomm,residcomm,function(err,res){
                        
                        if (err){
                            console.log(err)
                             response = {
                                'statutCode' : Codes.code.codenotfound, // success
                                'error': Erreur_francais.erreur_francais.vir_sansjustif_noneffetue         
                            }
                            rep(response); 
                         }
                         else{

                            notificationController.addNotificationVirementEmis(iduseremmetteur,nomrecepteur,montant,1,(idNotification)=>{

                                //envoi de notification mobile "Virement emis validé"
                                notificationController.sendNotification(iduseremmetteur,idNotification)

                                var montantCommission = montant * pourcentagecomm /100

                                notificationController.addNotificationCommission(iduseremmetteur,1,0,montantCommission,(idNotification)=>{

                                    

                                    //envoi de notification mobile "Commission d'opération"
                                    notificationController.sendNotification(iduseremmetteur,idNotification)

                                    notificationController.addNotificationVirementRecu(idrecepteur,nomemmetteur,montant,(idNotification)=>{

                                        //envoi de notification mobile "Virement recu"
                                        notificationController.sendNotification(idrecepteiduseremmetteurur,idNotification)

                                    })

                                })
                            })
                            response = {
                                'statutCode' : Codes.code.codesucce, // success
                                'Success': Erreur_francais.erreur_francais.vir_sansjustif_effetue     
                            }
                            rep(response); 
                         }
                    
                })
            }
            else{

                if ((montant>=200000) &&(imagePath.substr(0,13 )=='justificatifs')){
                    fcts.AddVirementClientTharwaEnAttente(montant,Comptedest,numcompteemmetteur,Motif,nomemmetteur,imagePath,nomrecepteur,pourcentagecomm,residcomm,function(err,res){
                        if (err){  
                            console.log(err)                      
                            response = {
                                'statutCode' : Codes.code.codenotfound, // success
                                'error': Erreur_francais.erreur_francais.vir_justif_noneffetue         
                            }
                            rep(response); 
                         }
                         else{
                            response = {
                                'statutCode' : Codes.code.codesucce, // success
                                'Success': Erreur_francais.erreur_francais.vir_justif_effetue      
                            }
                            rep(response)
                         }
                    
                })

                }
                else{
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'Success': Erreur_francais.erreur_francais.justificatifmanquant        
                    }
                    rep(response);
                }
              
            }//fin funtion
        } 
    


    })

}
}


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement entre les comptes du client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function Virement_local(iduser,Montant,Type1,Type2,Motif,rep){
    
   
    var  emmeteur ={};
    var destinataire ={};
    var nom={};
    var idcom={};

    async.series({

        CompteEmmeteur(callback){ // recuperer le compte emmeteur
            fcts.GetCompte(iduser,Type1,function(err, Compte1) {      
            if (err){
                response = {
                    'statutCode' : 404, 
                    'error': 'Compte emmeteur non existant ou bloqué'          
                }
                rep(response); 
             }else{
                emmeteur=Compte1.Num;
                if (Compte1.Balance>Montant){ // verifier si le montant à virer ne depasse pas la balance du compte
                    response = {
                        'statutCode' : 403, 
                        'error': 'Balance insuffisante'          
                    }
                    rep(response);  
                }
                else callback();
            } 
        });
               
        },
        CompteRecepteur(callback){ // recupere le compte du destinataire 
            fcts.GetCompte(iduser,Type2,function(err,Compte2) {
                if (err){
                   response = {
                       'statutCode' : 404, // success
                       'error': 'Compte destinataire non existant ou bloqué'          
                   }
                   rep(response); 
                }else{
                   destinataire=Compte2.Num;
                  
                    callback(); 
                }
               });

    
  },
     Nom(callback){ // recuperer le nom du client
    
        fcts.GetUser(iduser,function(err,User) {
            if (err){
               response = {
                   'statutCode' : 404, // success
                   'error': 'Utilisateur non existant'          
               }
               rep(response); 
            }else{
                Nom=User.Nom+' '+User.Prenom;
                
                callback(); 
            }
           });

             }
             ,
             idcommission(callback){ // recupere l'id de commission generer par le virement 
             fcts.getNextIdComm(1,function(idc){
                idcom=idc;
                callback();
           })

                
             },
             function (callback){ 
                 // execution des virement
                 if ((Type1=='0')&&(Type2=='2')){ // virement du courant vers devise euro
                    fcts.VirCourDevis(0,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,function(err,res) {
                        if (err){
                            response = {
                                'statutCode' : 500, // error
                                'error': 'Virement non effectue'          
                            }
                            rep(response); 
                        }else{
                            fcts.MontantCommission(idcom,function(err,montantcom){
                                sendgrid.sendEmail(iduser,"Virement THARWA","Un virement de votre compte courant vers votre compte devise Euro avec un montant de "+ Montant + "Da a été effectué avec succès. \n Une commission de : "+montantcom+" Da a été retirée.");

                            });

                            response = {
                                'statutCode' : 200, //succe
                                'succe': 'Virement  de votre Compte courant vers le Compte devise euro effectue avec succe'          
                            }
                            rep(response);
                        }
                       });
    
            }
            else {
               if ((Type1=='0')&&(Type2=='3')){  // virement du courant vers devise dollar
                fcts.VirCourDevis(1,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,function(err,res) {
                    if (err){
                        response = {
                            'statutCode' : 500, // error
                            'error': 'Virement non effectue'          
                        }
                        rep(response); 
                    }else{
                        fcts.MontantCommission(idcom,function(err,montantcom){
                            sendgrid.sendEmail(iduser,"Virement THARWA","Un virement de votre compte courant vers votre compte devise Dollar avec un montant de "+ Montant + "Da a été effectué avec succès. \n Une commission de : "+montantcom+" Da a été retirée.");

                        });
                        response = {
                            'statutCode' : 200, //succe
                            'succe': 'Virement  de votre Compte courant vers le Compte devise dollar effectue avec succe'          
                        }
                        rep(response);
                    }
                   });
                }
               else {
                   if ((Type2=='0')&&(Type1=='2')){ // virement du devise euro vers courant
                    fcts.VirCourDevis(2,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,function(err,res) {
                        if (err){
                            response = {
                                'statutCode' : 500, // error
                                'error': 'Virement non effectue'          
                            }
                            rep(response); 
                        }else{
                            fcts.MontantCommission(idcom,function(err,montantcom){
                                sendgrid.sendEmail(iduser,"Virement THARWA","Un virement de votre compte devise Euro vers votre compte courant avec un montant de "+ Montant + " € a été effectué avec succès. \n Une commission de : "+montantcom+" €  a été retirée.");
    
                            });
                            response = {
                                'statutCode' : 200, //succe
                                'succe': 'Virement  de votre Compte devise euro vers le Compte courant effectue avec succe'          
                            }
                            rep(response);
                        }
                       });
                    }
                   else {
                       if ((Type2=='0')&&(Type1=='3')){ // virement du devise dollar vers courant
                        fcts.VirCourDevis(3,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,function(err,res) {
                            if (err){
                                response = {
                                    'statutCode' : 500, // error
                                    'error': 'Virement non effectue'          
                                }
                                rep(response); 
                            }else{
                                fcts.MontantCommission(idcom,function(err,montantcom){
                                    sendgrid.sendEmail(iduser,"Virement THARWA","Un virement de votre compte devise Dollar vers votre compte courant avec un montant de "+ Montant + " $ a été effectué avec succès. \n Une commission de : "+montantcom+" $ a été retirée.");
        
                                });
                                response = {
                                    'statutCode' : 200, //succe
                                    'succe': 'Virement  de votre Compte devise dollar vers le Compte courant effectue avec succe'          
                                }
                                rep(response);
                            }
                           });
                        }
                       else {
                           // virement entre le compte courant et epargne
                           fcts.VirCourEpar(Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,function(err,res) {
                            if (err){
                                response = {
                                    'statutCode' : 500, // error
                                    'error': 'Virement non effectue'          
                                }
                                rep(response); 
                            }else{
                                sendgrid.sendEmail(iduser,"VirementTHARWA","Le virement entre votre courant et votre compte epargne avec un montant de "+ Montant + "Da a été effectué avec succès ");
                                response = {
                                    'statutCode' : 200, //succe
                                    'succe': 'Virement  entre  votre Compte courant et votre compte epargne  effectue avec succe'          
                                }
                                rep(response);
                            }
                           }); 
             }
            }
        }
    }

}       

    });
    
}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------Procedure pour lister tout les virements qui ne sont pas encore validés----------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function Listes_virements_non_traites(req, res){

    const token = req.headers['token']; //récupérer le Access token
    
    tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification      
    
    if (response.statutCode == 200){ 
         Virement.findAll({
            
            where:{'Statut' : 0} })
        .then((Virements) => {
            res.status(200).json({'virements': Virements});
            
            
          }).catch(err => {
            res.status(404).json({'erreur': err});
    
        });
           
}
else { res.status(response.statutCode).json({'erreur': response.error});}
})

}


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Procedure pour valider ou rejeter un virement -----------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function validerRejeterVirement(code,comptemetteur,comtpedestinataire,statut,rep){
    var idcommission ={}
    var MontantVirement= {}
    var montantcomm ={}
    var nomEmetteur = {}
    var nomRecepteur ={}
    var idEmetteur ={}
    var idRecepteur ={}

    Compte.findOne(
        {
            attributes:['IdUser'],
            where: { 'Num' : comptemetteur }
        }
    ).then((compteFound)=>{

        if(compteFound) idEmetteur = compteFound.IdUser

    }).catch((err)=>{
        console.log('Erreur recherche idEmetteur : '+err)

    });

    Compte.findOne(
        {
            attributes:['IdUser'],
            where: { 'Num' : comtpedestinataire }
        }
    ).then((compteFound)=>{

        if(compteFound) idRecepteur = compteFound.IdUser

    }).catch((err)=>{
        console.log('Erreur recherche idRecepteur : '+err)

    });

    async.series({
        Virements(callback){//montant envoye par lemmetteur non encore envoye
            fcts.getVirement(code,function(err,virement){
                console.log("tes0")
                if(err){
                    console.log("tes4")
                    response = {
                        'statutCode' :  Codes.code.codenotfound, // success
                        'error': Erreur_francais.erreur_francais.montantnontrouve         
                     }
                    rep(response); 
                }
                else {
                    MontantVirement=virement.Montant
                    idcommission=virement.IdCommission
                    nomEmetteur = virement.NomEmetteur
                    nomRecepteur = virement.NomDestinataire
                    console.log("le montant virement non encore validé "+MontantVirement+ "id de la commison finale"+idcommission)
                    callback()
                }
                                
            })
        },
           
        montantenvoye(callback){//Commission non encore enlevee a lemmetter
            fcts.MontantCommission(idcommission,function(err,montantdecommission){
                console.log("tes1")
                if(err){console.log("tes2")
                    response = {
                        'statutCode' : Codes.code.codenotfound, // success
                        'error': "Erreur_francais.erreur_francais.commissioninexistante   "        
                     }
                    rep(response); 
                }
                else {
                    montantcomm=montantdecommission
                    console.log("montant Commission "+montantcomm)
                    callback()
                }
                                
            })
        },
        
        function(callback){//Montant envoye par l'emmetteur pas encore envoyé
        console.log("le code est "+ code+ "compte emmetteur est "+comptemetteur+ "id de la commission est "+idcommission+ " montant de la commission est "+ montantcomm+ " le montant denvoi est "+MontantVirement)
            fcts.validerRejeterVirement(code,comptemetteur,comtpedestinataire,statut,idcommission,montantcomm,MontantVirement,function(err,res){                
                if (err){
                   
                    response = {
                        'statutCode' : Codes.code.codenotfound, 
                        'error': Erreur_francais.erreur_francais.virementnonreussi          
                    }
                    rep(response); 
                 }
                 else{

                    switch(statut){
                        case 1: 
                            notificationController.addNotificationVirementEmis(idEmetteur,nomRecepteur ,MontantVirement,1,(idNotification)=>{

                                //envoi de notification mobile "Virement emis validé"
                                notificationController.sendNotification(idEmetteur,idNotification)

                                notificationController.addNotificationCommission(idEmetteur,1,0,montantcomm,(idNotification)=>{

                                    

                                    //envoi de notification mobile "Commission d'opération"
                                    notificationController.sendNotification(idEmetteur,idNotification)

                                    notificationController.addNotificationVirementRecu(idRecepteur,nomEmetteur,MontantVirement,(idNotification)=>{

                                        //envoi de notification mobile "Virement recu"
                                        notificationController.sendNotification(idRecepteur,idNotification)

                                    })

                                })
                            })

                        break;
                        case 2: 

                            notificationController.addNotificationVirementEmis(idEmetteur,nomRecepteur ,MontantVirement,0,(idNotification)=>{

                                //envoi de notification mobile "Virement emis non validé"
                                notificationController.sendNotification(idEmetteur,idNotification)

                            
                            })

                        break;
                    }
                    response = {
                        'statutCode' : Codes.code.codesucce, // success
                        'Success': Erreur_francais.erreur_francais.virementreussi    
                    }
                    rep(response); 
                 }
    })
}
})
}

function getJustificatif (userId,codevirement,callback){
    
    Virement.findOne({
        attributes:['NomEmetteur','CompteEmmetteur','NomDestinataire','CompteDestinataire','Justificatif'],
        where: {  'Code' : codevirement}
    }).then( (JustificatifFound)=>{

        if(JustificatifFound){
            response = {
                'statutCode' : Codes.code.codesucce, // success
                'NomEmetteur':JustificatifFound.NomEmetteur,
                'CompteEmmetteur': JustificatifFound.CompteEmmetteur,
                'NomDestinataire' : JustificatifFound.NomDestinataire,
                'CompteDestinataire':JustificatifFound.CompteDestinataire,
                'Justificatif' : JustificatifFound.Justificatif    
            }
            callback(response);
        }else {
            response = {
                'statutCode' : Codes.code.codenotfound, //not Found
                'error':Erreur_francais.erreur_francais.justificatifnontrouve      
            }
            callback(response);
        }
    }).catch((err)=>{
        console.log(err);
        response = {
            'statutCode' : Codes.code.servererror, 
            'error':Erreur_francais.erreur_francais.erreurservervirement       
        }
        callback(response);
    });

}

return {TranferClientTH,Virement_local,Listes_virements_non_traites,validerRejeterVirement,getJustificatif};

}



