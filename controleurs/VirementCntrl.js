//imports
var crypto = require('crypto');
var http = require("http");
const request = require('request');
var tokenVerifier = require('./tokenCtrl');
<<<<<<< HEAD
var async = require('async-if-else')(require('async')); 
var multer  = require('multer')
var upload = multer()
=======
const sendgrid = require('../Utils/sendgrid')
//var conversion = require('./fctCtrl');
var async = require('async-if-else')(require('async'));
//var async = require('async-if-else');
>>>>>>> dfd4f0bf05ba437f2a6b1b623e0d73152cbb905f
//Routes
module.exports = function(Virement,Compte,User,Client,fcts,sequeliz) {

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
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Commission non trouvée'          
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
                        'statutCode' : 404, // success
                        'error': 'ID destinataire non existant'          
                     }
                    rep(response); 
                 }
            })
        },
        GetNomjEmmetteur(callback){ // récupération nom emmetteur
            fcts.GetUser(iduseremmetteur,function(err, nomEmmetteur){
                if (err){
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Nom emmetteur non existant'          
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

<<<<<<< HEAD
        getCompteBalancee(callback){ // recupération numéro compte emmetteur
            fcts.GetCompte(iduseremmetteur,0,function(err,comptebalance){
                if(err){
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Numero de compte emmetteur non existant' 
                    }
                    rep(response); 
                    }
                    else{
                        
                        if ((comptebalance.Num.substr(0, 3)=='THW')&&(comptebalance.Balance>montant)){
                        numcompteemmetteur=comptebalance.Num  
                        console.log("test1"+numcompteemmetteur)                 
                        callback()
                        }
                        else{
                        response = {
                            'statutCode' : 404, // success
                            'error': 'LE compte nest pas de type THARWA ou bien balance insuffisante'
                        }
                        rep(response); 
                        }
                    
                }
            })            
        },    
        GetNomDestinataire(callback){ // récupération nom destinataire
            fcts.GetUser(idrecepteur,function(err, usernamee){
                console.log("errur est "+err)
                if (err){                
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Nom du destinataire non existant'          
                    }
                    rep(response); 
                 }
                 else{
                    nomrecepteur= usernamee.Nom+' '+usernamee.Prenom
                    console.log("le nom du recepteur est "+nomrecepteur)
                    callback()
                 }
    
=======
//Verification de non null
    if(montant == null || dest == null ||Motif==null){
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
   // const token="EWVkyX9tlGFag9uqkMuW7JWiz9UGRfWnHtPQd3EL7cbfopJTKt15xEZc5ul0VkPyycMx3JGgDLT988tQNp1LwkBS0LuZpmSyWcqQpdsYU6W05OcfITrHHoqVLpIxeRWWOcYkcKYcHKdfI7uo0DtAEtrV5Z16Zn8BDf2Qfbxpog7ptRdJWk3tVZqPveYTYYSXzDQdRyb6j2kN9FPXN00wl12vqX9JewEDk7ZXiNCGxffKqhc4ytjsUHUa0TI944p";
   const token = req.headers['token']; //récupérer le Access token
    tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification      
    
    if (response.statutCode == 200){ //si le serveur d'authentification répond positivement (i.e: Access token valide)
            var id = response.userId; //recupérer le id de l'utilisateur
            const value = sequelize.escape(id);
            Compte.findOne({ // Vérification de lexistance du numero de compte destinataire
                attributes:['Num'],
                where:{'Num' :dest} })
                .then(function(CompteFound){
                    if(CompteFound){
                            Compte.findOne({//vérification de l'éxistance du numero de compte de lemetteur
                                attributes:['Num','Balance'],
                                where:{'IdUser' :id} })
                                .then(function(CompteFoundsent){
                                    if(CompteFoundsent){
                                        User.findOne({// recupération du nom de l'emmeteur après vérification de l'éxistance
                                            attributes:['username'],
                                            where:{'userId' :id} })
                                            .then(function(usersend){
                                                if(usersend){
                                                    Compte.findOne({// recupération de l'ID du récépteur après vérification de l'éxistance
                                                    attributes:['IdUser'],
                                                    where:{'Num' :dest} })
                                                    .then(function(IDreceiver){
                                                        if(IDreceiver){
                                                            User.findOne({// recupération de nom du récépteur après vérification de l'éxistance
                                                            attributes:['username'],
                                                            where:{'userId' :IDreceiver.IdUser} })
                                                            .then(function(Nomreceiver){
                                                                if(Nomreceiver){   
                                                                    if (montant<CompteFoundsent.Balance &&  dest.substr(0,3)=='THW'){
                                                                        sequelize.query('exec GetNextIdCommission').spread((results, metadata) => {
                                                                        var rows = JSON.parse(JSON.stringify(results[0]));
                                                                        idcom = parseInt(rows.id);
                                                                        


                                                                        sequelize.query('exec GetPourcentageCommissionVirTH').spread((results, metadata) => {
                                                                        var rows = JSON.parse(JSON.stringify(results[0]));
                                                                        pourc = parseInt(rows.id);
                                                                            

                                                                        if(Justificatif==null){                                                                                                                                                                                                                             
                                                                            // Y a pas de justificatif à fournir dans la t ransaction sera validée directement
                                                                            sequelize.query('exec AddVirementClientTharwa $Montant, $CompteDestinataire, $CompteEmmetteur, $Motif, $NomEmetteur, null, $Statut, $NomDestinataire,$pourcentage,$commission',
                                                                            {
                                                                                bind: {
                                                                                        Montant: montant, 
                                                                                        CompteDestinataire: dest,   //Compte destination                                                                                                                                                                                                                      
                                                                                        CompteEmmetteur:CompteFoundsent.Num,    //Compte emetteur 
                                                                                        Motif:Motif,    //Motif d'envoi                                                               
                                                                                        NomEmetteur:usersend.username, //Nom emetteur
                                                                                        Statut:1,
                                                                                        NomDestinataire:Nomreceiver.username, // Nom recepteur
                                                                                        pourcentage:pourc,
                                                                                        commission:idcom
                                                                                     }
                                                                                     
                                                                            }).then((response) => {
                                                                                return( res.status(200).json({'succe':'Virement sans justificatif effectué avec succe'}));
                                                                            
                                                                             }).catch(err => {return(res.status(401).json({'error': 'Virement sans justificatif non effectue'}))});                                                                     
                                                                                                                                   
                                                                                                                                    
                                                                       }
                                                                        else{   
                                                                            var cmptdest=dest;
                                                                            var emetteur=CompteFoundsent.Num;
                                                                            sequelize.query('exec AddVirementClientTharwaEnAttente $Montant, $CompteDestinataire, $CompteEmmetteur, $Motif, $NomEmetteur,$justificatif, null,  $NomDestinataire,$pourcentage,$commission',
                                                                            {
                                                                                bind: {
                                                                                        CompteDestinataire: dest,   //Compte destination  
                                                                                        Montant: montant,
                                                                                        justificatif :Justificatif,                                                              
                                                                                        CompteEmmetteur:emetteur,    //Compte emetteur 
                                                                                        Motif:Motif,    //Motif d'envoi                                                               
                                                                                        NomEmetteur:usersend.username, //Nom emetteur
                                                                                        NomDestinataire:Nomreceiver.username ,// Nom recepteur
                                                                                        pourcentage:pourc,
                                                                                        commission:idcom
                                                                            }}).then((response) => {
                                                                                return( res.status(200).json({'succe':'Virement avec justificatif et notification effectué avec succe'}));
                                                                            
                                                                             }).catch(err => {return(res.status(401).json({'error': 'Virement avec justificatif et notification non effectue'}))});                                                                     
                                                                                                                                                 
                                                                         
                                                                        }
                                                                    })
                                                                    })
                                                                   
                                                                    } 
                                                                    else{
                                                                        return (res.status(403).json({'error': 'Balance insuffisante'}))
                                                                    }                                                           
                                                                    
                                                                }
                                                                else{ 
                                                                   return res.status(404).json({'error':'Le recepteur ne contient pas de nom lorsquil a etait enregistre'});
                                                                }
                                                            })
                                                            .catch(function(err){
                                                                //Si une erreur interne au serveur s'est produite :
                                                                 res.status(500).json({'error':'peut pas récuperer le nom du recepteur'}); 
                                                                
                                                            });
                                                        }
                                                        else{ 
                                                           return res.status(404).json({'error':'le recepteur n a pas de mail'});
                                                        }   
        
                                                    })
                                                    .catch(function(err){
                                                        //Si une erreur interne au serveur s'est produite :
                                                         res.status(500).json({'error':'peut pas récuperer le mail du recepteur'}); 
                                                        
                                                    });

                                                }
                                                else{ 
                                                    return res.status(404).json({'error':'Le nom de lemetteur inexistant'});
                                                }
                                            })
                                            .catch(function(err){
                                                //Si une erreur interne au serveur s'est produite :
                                                 res.status(500).json({'error':'peut pas vérifier le nom de lemetteur'}); 
                                                
                                            });
                                    
                                    }
                                    else{ 
                                        return res.status(404).json({'error':'Le compte de l\'emetteur inexistant'});
                                    }
                                })
                                .catch(function(err){
                                    //Si une erreur interne au serveur s'est produite :
                                     res.status(500).json({'error':'peut pas vérifier le numero de compte lemetteur'}); 
                                    
                                });
                                 
                    }
                    else{  
                        return res.status(404).json({'error':'Le compte de destination inexistant'});
                    }
            })
            .catch(function(err){ 
                return res.status(500).json({'error':'peut pas vérifier le numero de compte destination'}); //interne error
                
>>>>>>> dfd4f0bf05ba437f2a6b1b623e0d73152cbb905f
            });
        },     
       
        function(callback){
            console.log("le montant est "+ montant + "le compte destinataire est "+Comptedest+ " numero compte emetteur"+numcompteemmetteur+ " Motif est "+Motif +nomemmetteur+nomrecepteur+pourcentagecomm+'commision '+residcomm+ "le chemin est "+imagePath);
            
           if ((imagePath=='null') && (montant<200000)){
               console.log("salut1")

                    fcts.AddVirementClientTharwa(montant,Comptedest,numcompteemmetteur,Motif,nomemmetteur,nomrecepteur,pourcentagecomm,residcomm,function(err,res){
                        console.log("salut2"+err)
                        if (err){
                            console.log("erreur sans justificatif "+err)
                            response = {
                                'statutCode' : 404, // success
                                'error': 'Virement sans justificatif non effectué'          
                            }
                            rep(response); 
                         }
                         else{
                            console.log("salut aa")
                            response = {
                                'statutCode' : 500, // success
                                'Success': 'Virement sans justificatif effectué avec succès'          
                            }
                            rep(response); 
                         }
                    
                })
            }
            else{
                if ((montant>=200000) &&(imagePath.substr(0,13 )=='justificatifs')){
                    fcts.AddVirementClientTharwaEnAttente(montant,Comptedest,numcompteemmetteur,Motif,nomemmetteur,imagePath,nomrecepteur,pourcentagecomm,residcomm,function(err,res){
                        if (err){
                        
                            response = {
                                'statutCode' : 404, // success
                                'error': 'Virement avec justificatif non effectué'          
                            }
                            rep(response); 
                         }
                         else{
                            response = {
                                'statutCode' : 500, // success
                                'Success': 'Virement avec justificatif mis en attente'          
                            }
                            rep(response); 
                         }
                    
                })

                }
                else{
                    response = {
                        'statutCode' : 500, // success
                        'Success': ' Justificatif manquant'          
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
<<<<<<< HEAD
    console.log("type1",Type1)
    console.log("type2",Type2)
    console.log("montant",Montant)
    console.log("motif",Motif)
    //0,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,function(err,res)
=======
    
   
>>>>>>> dfd4f0bf05ba437f2a6b1b623e0d73152cbb905f
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
function validerRejeterVirement(code,comptemetteur,comtpedestinataire,statut,req, res){
    var idcommission ={}
    var montantcommission= {}
    var montantenvoi ={}

    async.series({
        montantcommission(callback){//montant de la commission 
            fcts.getMontantIdCommission(code,function(err,montantcommission){
                if(err){
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Commission inexistante'          
                     }
                    rep(response); 
                }
                else {
                    montantcommission=montantcommission.Montant
                    console.log("le montant virement non encore validé "+montantcommission)
                    callback()
                }
                                
            })
        },
        idcommission(callback){//montant de l'ID de la commission
            fcts.getMontantIdCommission(code,function(err,montantcommission){
                if(err){
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Id inexistant'          
                     }
                    rep(response); 
                }
                else {
                    idcommission=montantcommission.IdCommission
                    console.log("id de la commission est "+idcommission )
                    callback()
                }
                                
            })
        },
        montantenvoye(callback){//Montant envoye par l'emmetteur pas encore envoyé
            fcts.getMontantSent(idcommission,function(err,montantenvoye){
                if(err){
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Commission inexistante'          
                     }
                    rep(response); 
                }
                else {
                    montantenvoi=montantenvoye
                    console.log("le montant de la commission "+montantenvoi)
                    callback()
                }
                                
            })
        },

        function(callback){//Montant envoye par l'emmetteur pas encore envoyé
        console.log("le code est "+ code+ "compte emmetteur est "+comptemetteur+ "id de la commission est "+idcommission+ " montant de la commission est "+ montantcommission+ " le montant denvoi est "+montantenvoi)
     
            fcts.validerRejeterVirement(code,comptemetteur,idcommission,montantcommission,montantenvoi,function(err,res){
                console.log("salut2"+err)
                if (err){
                    console.log("erreur sans justificatif "+err)
                    response = {
                        'statutCode' : 404, // success
                        'error': 'Erreur de validation de virement'          
                    }
                    rep(response); 
                 }
                 else{
                    response = {
                        'statutCode' : 500, // success
                        'Success': 'Le virement a été validé avec succes'          
                    }
                    rep(response); 
                 }
    })
}
})
}
return {TranferClientTH,Virement_local,Listes_virements_non_traites,validerRejeterVirement};

}



