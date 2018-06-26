//imports
var crypto = require('crypto');
var http = require("http");
const request = require('request');
var tokenVerifier = require('./tokenCtrl');
var async = require('async-if-else')(require('async')); 
var multer  = require('multer')
var upload = multer()
var Codes = require('../ressources/codes');
const sendgrid = require('../Utils/sendgrid');
var Erreur_francais = require('../ressources/erreur_francais');
const datetime = require('node-datetime');

//Routes
module.exports = function(ordreVirement,Virement,Compte,User,Client,fcts,sequeliz,notificationController,Commission) {
    /*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour creer un nouveau ordre de virement ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    function creerOrdreVirement(iduser,data,titre,rep){
        data_json=JSON.parse(data)
        var dt = datetime.create();
        var formatted = dt.format('YmdHM');
        
        //parametre
        var employes=data_json.employes
        var  emmeteur ={};
        var destinataire ={};
        var banque_em="THW"
        var banque_des={}
        var Compte_em={}
        var Compte_des={}
        var montant={}
        var num_OrdreVirement=formatted
        var type_Virement={}
        var montant_tot=0
        var code_virement={}
        
        async.series({
            CompteEmmeteur(callback){ // recuperer le compte emmeteur
                fcts.GetCompte(iduser,0,function(err, Compte1) {      
                if (err){
                    response = {
                        'statutCode' : 404, 
                        'error': 'Compte emmeteur non existant ou bloqué'          
                    }
                    rep(response); 
                 }else{
                    Compte_em=Compte1.Num;
                    for (var i in employes){
                        montant_tot+=employes[i].montant
                    }
                    console.log("montant tot"+montant_tot)
                    console.log("Balance "+Compte1.Balance)
                    if (Compte1.Balance< montant_tot) {
                        console.log("inferieur ")
                        
                            response = {
                                'statutCode' : 404, 
                                'error': 'Balance insuffisante'          
                            }
                            rep(response); 

                    }
                    else callback();
                } 
                  });
                   
            },
            NomEmployeur(callback){ // recuperer le nom de l'employeur 
    
                fcts.GetUser(iduser,function(err,User) {
                    if (err){
                       response = {
                           'statutCode' : 404, 
                           'error': 'Utilisateur non existant'          
                       }
                       rep(response); 
                    }else{
                        emmeteur=User.Nom+' '+User.Prenom;
                        callback(); 
                    }
                   });
                     },
                     newOrdreVirement(callback){ // Creer un nouveau ordre de virement 
                        
                    ordreVirement.create({
                        Num: num_OrdreVirement,
                        Etat : 1,
                        Statut : 0,
                        IdUser : iduser,
                        titre:titre
                        
     
                    }).then(function(newOrdreVirement){
                        callback(); 
                        
                    })
                    .catch(err => {
                        console.log(err)
                         response = {
                             'statutCode' : 500, //internal error
                             'error':"Impossible d'ajouter l'ordre de virement "          
                         }
                         rep(response);
                         
                     });
                     },
                     async Suavgarde_Virement(callback){
                        for (var i in employes){
                        
                                    console.log("i=à  "+i)
                                    
                                    Compte_des=employes[i].numero
                                    console.log("compte destinataire "+Compte_des)
                                    banque_des=Compte_des.substr(0, 3) 
                                    if(banque_des!='THW') type_Virement=1 // virement externe  
                                    else{
                                        type_Virement=0 //virement avec un client tharwa
                                        await fcts.getIdUser(Compte_des,function(err, Compte1) {  
                                            console.log("Compteee"+Compte1)    
                                            if (Compte1==null){
                                                response = {
                                                    'statutCode' : 404, 
                                                    'error': 'Compte destinataire non existant ou bloqué'          
                                                }
                                                rep(response); 
                                                
                                             } 
                                            
                                        });
                                         
                                    }
                               
                                    var dt = datetime.create();
                                     temps = dt.format('YmdHM');
                                    console.log("type virement "+type_Virement)
                                    code_virement=Compte_em+""+Compte_des+""+temps
                            destinataire=employes[i].nom+" "+employes[i].prenom
                            montant=employes[i].montant
                            montant_tot+=montant
                            
                            console.log("code virement "+code_virement)
                            //console.log("format date "+dt.format('Y-m-d H:M:S'))
                           // var date=dt.format('Y-m-dTH:M:S')
                            var dt = datetime.create();
                            var formatted = dt.format('Y-m-dTH:M:S');
                            var dateCreation = formatted ;
                            var newVirement = await Virement.create({
                                Code: code_virement,
                                Date : dateCreation,
                                Motif:"test2",
                                Statut : 0,
                                Montant : montant,
                                Justificatif:null,
                                NumOrdreVirement : num_OrdreVirement,
                                NomEmetteur : emmeteur , 
                                CompteEmmetteur : Compte_em , 
                                BanqueEmmeteur : banque_em , 
                                NomDestinataire : destinataire ,
                                CompteDestinataire : Compte_des , 
                                BanqueDestinataire : banque_des , 
                                Type:type_Virement , 
                                IdCommission : 0
                            }).then(function(newvirement){
                               
                                
                            })
                            .catch(err => {
                                console.log(err)
                                 response = {
                                     'statutCode' : 500, //internal error
                                     'error':"Impossible d'ajouter le virement "          
                                 }
                                 rep(response);
                                 
                             });
                                
                        }
                        console.log("montant total "+montant_tot)
            response = {
            'statutCode' : 200, 
             'num':num_OrdreVirement       
                    }
                rep(response)
                       

                     }
                    


        });
        
        

        
        

    }



/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour eAfficher la liste des ordre de virement non executé------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function listeOrdreVirement(rep){
    
    ordreVirement.findAll({
        where:{'Etat' :1 }
      
        
    })
    .then((ordreVirement) => { 
            
        //res.status(200).json({'Comptes': Comptes});
        response ={
            'statutCode' : 200,
            'ordreVirements' : ordreVirement
        }
        rep(response)
    
}).catch(err => {
   // res.status(404).json({'error': 'erreur dans l\'execution de la requete'})
    response ={
        'statutCode' : 500,
        'error' : 'requete non executé'
    }
    rep(response)
});
}

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure Afficher detail d'in ordre de virement------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function detail(num,rep){
    ordreVirement.hasMany(Virement, {foreignKey: 'Num'})
    Virement.belongsTo(ordreVirement, {foreignKey: 'NumOrdreVirement'})
    Virement.findAll({

        attributes:['Code','NumOrdreVirement','NomDestinataire','CompteDestinataire','Montant','Type'],
        where:{'NumOrdreVirement' :num }
      
        
    })
    .then((ordreVirement) => { 
            
        //res.status(200).json({'Comptes': Comptes});
        response ={
            'statutCode' : 200,
            'ordreVirements' : ordreVirement
        }
        rep(response)
    
}).catch(err => {
   // res.status(404).json({'error': 'erreur dans l\'execution de la requete'})
    response ={
        'statutCode' : 500,
        'error' : 'requete non executé'
    }
    rep(response)
});
}

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour executer un ordre de virement------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function executer(num,rep){
    ordreVirement.findOne({
       
        where:{'Num' :num, 
        } })
    .then((ordre) => {
        if ((ordre.Etat==0)){

            response ={
                'statutCode' : 400,
                'error' : "ordre de virement deja executé  "
            }
            rep(response)
        }
        else {
            ordreVirement.update(
                {Etat: 0,Statut:0},
                {where: {Num:num}}
              )
            .then((result) => { 
                    
                //res.status(200).json({'Comptes': Comptes});
                response ={
                    'statutCode' : 200,
                    'succes' : "ordre de virement en cours de traitement "
                }
                rep(response)
            
        }).catch(err => {
            console.log(err)
           // res.status(404).json({'error': 'erreur dans l\'execution de la requete'})
            response ={
                'statutCode' : 500,
                'error' : 'requete non executé'
            }
            rep(response)
        });

        }
        
      
      }).catch(err => {
        response ={
            'statutCode' : 500,
            'error' : 'requete non executé'
        }
        rep(response)});
    
}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour Velider ou rejeté un ordre de virement t------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function ValRej(num,status,rep){

    var commission_tot=0
    var id_commission={}
    var compte_dest={}
    var num_ver={}
    console.log("Num ordre Virement ="+num)

     // ordre de virement rejeté 
        ordreVirement.update(
            {Statut:status},
            {where: {Num:num}}
          )
        .then((result) => { 
                
            //Envoie de le notification par mail 
           if (status==2){ response ={
                'statutCode' : 200,
                'succes' : "Ordre de virement rejeté  "
            }
            rep(response) }

            else {

              detail(num,(response)=>{
                async.series({
                    compte(callback){
                        
                        
                        Virement.findOne({
                            attributes:['CompteEmmetteur'],
                            where:{'NumOrdreVirement' :num , 'CompteDestinataire': response.ordreVirements[0].CompteDestinataire} })
                        .then((Compte1) => {
                            console.log(" compte1"+Compte1)
                            compte_dest=Compte1.CompteEmmetteur

                            console.log("Compte dest est egale "+compte_dest)
                           callback();
                          }).catch(err => {
                            console.log(err)
                            response = {
                                'statutCode' : 500, 
                                'error': 'requete non effectué'          
                            }
                            rep(response);    
                        });

                    },
                async traitement_virement(callback){
                    console.log("hghghhg")

                for (i in response.ordreVirements){
                    console.log("boucle")

                    if (response.ordreVirements[i].Type==0){
                         // Virement interne entre client tharwa
                          Virement.findOne({
                            
                            where:{'NumOrdreVirement' :num , 'CompteDestinataire': response.ordreVirements[i].CompteDestinataire} })
                        .then((Compte1) => { 
                            console.log(" compte1"+Compte1)
                            num_ver=Compte1.Num

                            
                        console.log("Virement interne ") 
                        async.series({
                        async traitement_virement(callback){
                            console.log("numero virement "+num_ver)
                         await virement_interne(num_ver,function(err, montant_commission) {
                            console.log("apres await  ") 
                            if (err){
                                console.log(err)
                                response = {
                                    'statutCode' : 500, 
                                    'error': 'virement non effectué'          
                                }
                                rep(response); 
                             }else{
                                 console.log("commission tot")
                                commission_tot+=montant_commission
                                 callback(); 
                             }

                         });
                        
                        }
                    });
                        }).catch(err => {
                            console.log(err)
                            response = {
                                'statutCode' : 500, 
                                'error': 'requete non effectué'          
                            }
                            rep(response);    
                        });
                    }
                   /* if (response.ordreVirements[i].Type==1){ // Virement externe avec client d'autre banque
                         
                    }*/

                }
                },
                idcommission(callback){ // recupere l'id de commission generer par le virement 
                fcts.getNextIdComm(1,function(idc){
                   id_commission=idc;
                   callback(); })},
                   create_commission(callback){
                    var dt = datetime.create();
                    var formatted = dt.format('Y-m-dTH:M:S');
                    var dateCreation = formatted ;
                    Commission.create({
                        CodeCommission: 10,
                        Date : dateCreation,
                        Montant:commission_tot,
                        NumCompte : compte_dest,
                        
                    }).then(function(newcommission){
                        callback();
                        
                    })
                    .catch(err => {
                        console.log("commission"+err)
                         response = {
                             'statutCode' : 500, //internal error
                             'error':"Impossible d'ajouter une commission"          
                         }
                         rep(response);
                         
                     });

                   },
                   udpate_Commission(callback){
                    ordreVirement.update(
                        {IdCommission: id_commission},
                        {where: {Num:num}}
                      )
                    .then((result) => { 
                            
                        
                        response ={
                            'statutCode' : 200,
                            'succes' : "Ordre de virement effectué avec succées "
                        }
                        rep(response)
                    
                }).catch(err => {
                    console.log("update Commission "+err)
                   
                    response ={
                        'statutCode' : 500,
                        'error' : 'requete non executé'
                    }
                    rep(response)
                });

                   }

            });

               
               // console.log(response.ordreVirements[0].Code)

               //parcourir le list un par un verifier à partir du num compte si c'est un virement interne ou externe 



              });
            }
            
            
        
    }).catch(err => {
        console.log(err)
       // res.status(404).json({'error': 'erreur dans l\'execution de la requete'})
        response ={
            'statutCode' : 500,
            'error' : 'requete non executé'
        }
        rep(response)
    });


    }
    /*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour Velider ou rejeté un ordre de virement t------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    function virement_interne(num_virement,call){
        console.log("Virement interne inerieur ")
        console.log("num_virement  "+num_virement)
        var Compte_des={}
        var Compte_em={}
        var montant={}
        var montant_commission={}
        var id_com={}
       // console("num_virement  "+num_virement)
        async.series({
            info_virement(callback){
                
                Virement.findOne({
       
                    where:{'Code' :num_virement, 
                    } })
                .then((virement) => {
                    Compte_des=virement.CompteDestinataire
                    Compte_em=CompteEmmetteur
                    montant=Montant
                    callback();
                }).catch(err => {
                    response ={
                        'statutCode' : 500,
                        'error' : 'requete non executé'
                    }
                    call(err,null );});

            },
            montant_commission(callback){

                fcts.GetPourcentageCommission(4,function(err,pourcentage){
                    if(err){
                        console.log(err)
                        
                         call(err,null ); 
                    }
                    else {
                        montant_commission=pourcentage*montant 
                        callback()
                    }
                                    
                })
            },
            executer_Virement(callback){
                sequelize.query('exec Virement_interne_ordre_Virement $montant , $emmeteur, $destinataire',
                {
                      bind: {
                             montant:montant,
                             emmeteur:Compte_em,
                             destinataire: Compte_des
                            }
                    }).then((result) => {
                        
                        call(null,montant_commission );
                    }).catch(err => {
                        console.log(err)
                        call(err,null );
                    
                    });

            }
            

        });



    }


    /*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour Velider ou rejeté un ordre de virement t------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    function virement_externe(num_virement,rep){

    }
    
    







return {creerOrdreVirement,listeOrdreVirement,detail,executer,ValRej};

}



