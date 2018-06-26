
var oxr = require('open-exchange-rates'),
fx = require('money');
var async = require('async-if-else')(require('async'));
    
module.exports =  function  (Compte,Client,User,Virement,sequelize,TarifCommission,Commission){

function GetCompte(iduser,Type1,callback){
    Compte.findOne({
        attributes:['Num','Balance'],
        where:{'IdUser' :iduser, 
        'TypeCompte': Type1
    ,'Etat':1} })            
    .then((Compte1) => {
        if(Compte1) callback(null,Compte1);
        else callback("no compte matching "+iduser,null)
       
      }).catch(err => {
        callback(err,null);});
}
function MontantCommission(idcom,callback){
    Commission.findOne({
        attributes:['Montant'],
        where:{'Id' :idcom} })
    .then((com) => {
        
       callback(null,com.Montant);
      }).catch(err => {
        callback(err,null);});
}
function GetUser(iduser,callback){
    Client.findOne({
       
        where:{'IdUser' :iduser} })    
    .then((User) => {
       callback(null,User);
      }).catch(err => {
        callback(err,null);});
}
function getNextIdComm(test,callback){
    
    var id=18;
    if (test==1) {
        
        sequelize.query('exec get_next_idcommission').spread((results, metadata) => {
           
        var rows = JSON.parse(JSON.stringify(results[0]));
        callback(parseInt(rows.id));
    });}
    if (test==0) {
       
        callback(id);}
}
function historique(iduser,type,callback){
    sequelize.query('exec historique_compte $userid , $typecompte',
                    {
                          bind: {
                                 userid:iduser,
                                 typecompte:type
                                }
                        }).then((historique) => {
                            
                            callback(null,JSON.parse(JSON.stringify(historique[0])) );
                        }).catch(err => {
                          callback(err,null);});
    
}

function conversion(montant,par,callback){
    var valeur;
    oxr.set({ app_id: 'a8a5c2a6302b453f9266c7254b043f6a' });
oxr.latest(function() {
    // Apply exchange rates and base rate to `fx` library object:
    console.log(montant);
	fx.rates = oxr.rates;
	fx.base = oxr.base;
    
    switch (par)
    {
        case 0:    callback( fx(montant).from('DZD').to('EUR')); // courant vers devise euro
        break ;
        case 1: callback(fx(montant).from('DZD').to('USD')) // courant vers devise dollar
        
        break ;
        case 2:  callback(fx(montant).from('EUR').to('DZD')) //   devise euro vers courant 
       
        break ;
        case 3:   callback( fx(montant).from('USD').to('DZD')) //  devise dollar vers courant 
        break ;

        case 4:   callback(140) //  for test euro to dzd
        break ;

        case 5:   callback(115) //  for test dollar  to dzd
        break ;
        


    }
   
});
return valeur;
}

function VirCourDevis(par,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,call){
    conversion(Montant,par,function(resultat){ //conversion du montant vers l'euro
         if (Type1!=0){

             if (par==2)
             {
                conversion(Montant*0.015,2,function(resultat2){
                    console.log("commission , montant  "+resultat2+"   "+resultat)
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id,$montantcom',
                    {
                          bind: {
                                 montant: Montant,
                                 montant2:resultat,
                                emmeteur: emmeteur,
                                recepteur : destinataire,
                                motif : Motif,
                                nom: Nom,
                                type1:Type1,
                                type2:Type2,
                                id:idcom,
                                montantcom: resultat2
                                   }
                            }).then((res) => {
                                call(null,res);   
                            }).catch(err => {
                                console.log(err);
                                call(err,null);  
                            });
                        

                });
             }
             else {
                conversion(Montant*0.015,3,function(resultat2){
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id,$montantcom',
                    {
                          bind: {
                                 montant: Montant,
                                 montant2:resultat,
                                emmeteur: emmeteur,
                                recepteur : destinataire,
                                motif : Motif,
                                nom: Nom,
                                type1:Type1,
                                type2:Type2,
                                id:idcom,
                                montantcom: resultat2
                                   }
                            }).then((res) => {
                                call(null,res);   
                            }).catch(err => {
                                console.log(err);
                                call(err,null);  
                            });
                        

                });

                

             }

           

            }
         else {
         
    
                    commissionmontant=Montant*0.02
                    console.log("commissio "+commissionmontant+"  Type 1 et type 2 = "+Type1+"  "+Type2)
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id,$montantCom',
                    {
                          bind: {
                                 montant: Montant,
                                 montant2:resultat,
                                emmeteur: emmeteur,
                                recepteur : destinataire,
                                motif : Motif,
                                nom: Nom,
                                type1:Type1,
                                type2:Type2,
                                id:idcom,
                                montantCom : commissionmontant
                                   }
                            }).then((res) => {
                                call(null,res);   
                            }).catch(err => {
                                console.log(err);
                                call(err,null);  
                            });
                        }
                });


}
function VirCourEpar(Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,call){
    
           if ( Type1==1)  montantCommision= Montant*0.001
           else montantCommision= 0
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id,$montantCom',
                    {
                          bind: {
                            montant: Montant,
                            montant2:0,
                           emmeteur: emmeteur,
                           recepteur : destinataire,
                           motif : Motif,
                           nom: Nom,
                           type1:Type1,
                           type2:Type2,
                           id:idcom,
                           montantCom: montantCommision
                                   }
                            }).then((res) => {
                                call(null,res);   
                            }).catch(err => {
                                
                                call(err,null);  
                            });
                

}

// Fonctions Virement Tharwa
function GetNextIdCommission(callback){

    sequelize.query('exec GetNextIdCommission').spread((results, metadata) => {
    var rows = JSON.parse(JSON.stringify(results[0]));
    callback(parseInt(rows.id));});
}

function GetPourcentageCommission(code,callback){
    TarifCommission.findOne({
        attributes:['Pourcentage'],
        where:{'Code' :code}})
        .then((pourcentage) => {
            
           callback(null,pourcentage.Pourcentage);
          }).catch(err => {
            callback(err,null);});
    }


function AddVirementClientTharwa(montant, dest,compteemmetteur,Motif,nomemmetteur,nomdestinataire,pourc,idcom,call){

    sequelize.query('exec AddVirementClientTharwa $Montant, $CompteDestinataire, $CompteEmmetteur, $Motif, $NomEmetteur, null, $Statut, $NomDestinataire,$pourcentage,$commission',
    {
        bind: {
                Montant: montant, 
                CompteDestinataire: dest,   //Compte destination                                                                                                                                                                                                                      
                CompteEmmetteur:compteemmetteur,    //Compte emetteur 
                Motif:Motif,    //Motif d'envoi                                                               
                NomEmetteur:nomemmetteur, //Nom emetteur
                Statut:1,
                NomDestinataire:nomdestinataire, // Nom recepteur
                pourcentage:pourc,
                commission:idcom
             }
             
    }).then((res) => {
        call(null,res);   
    }).catch(err => {
        call(err,null);  
    });

}
AddVirementClientTharwa
function AddVirementClientTharwaEnAttente(montant,dest,emetteur,Motif,nomemmetteur,Justificatif,nomrecepteur,pourc,idcom,call){
    sequelize.query('exec AddVirementClientTharwaEnAttente $Montant, $CompteDestinataire, $CompteEmmetteur, $Motif, $NomEmetteur,$justificatif, null,  $NomDestinataire,$pourcentage,$commission',
    {
        bind: {
                CompteDestinataire: dest,   //Compte destination  
                Montant: montant,
                justificatif :Justificatif,                                                              
                CompteEmmetteur:emetteur,    //Compte emetteur 
                Motif:Motif,    //Motif d'envoi                                                               
                NomEmetteur:nomemmetteur, //Nom emetteur
                NomDestinataire:nomrecepteur ,// Nom recepteur
                pourcentage:pourc,
                commission:idcom
    }}).then((res) => {
        call(null,res);   
    }).catch(err => {
        call(err,null);  
    });
}




function getIdUser(comptee, callback){
    Compte.findOne({ // Récupération d'un numéro de compte et de son ID
    attributes:['Num','IdUser'],
    where:{'Num' :comptee , 'TypeCompte': 0
    ,'Etat':1} })
    .then((Compte1) => {        
        callback(null,Compte1);
       }).catch(err => {
         callback(err,null);
        });
}

function getVirement(codee, callback){ // Recupération du montant de la commission ansi que sons ID
    Virement.findOne({
        attributes:['Montant','IdCommission','NomDestinataire','NomEmetteur','Motif','Type'],
        where:{'Code' :codee}
    }).then((virement) => {        
        callback(null,virement);
       }).catch(err => {
           console.log("error est "+err)
         callback(err,null);});
}


function validerRejeterVirement(Code,CompteEmmett,CompteDestin,Statut,Idcomm,MontantComm,MontantVir,call){ // Valider ou rejetr un virement en changeant le statut (statut = 1: valider) (statut = 2: rejeter)
    sequelize.query('exec ValRejVir $Codee, $CompteEmmetteur, $CompteDestinataire,$stat, $Idcommission, $MontantCommission,$MontantVirement',
    {
        bind: {
            Codee: Code,   
            CompteEmmetteur: CompteEmmett,
            CompteDestinataire :CompteDestin, 
            stat:Statut,                                                             
            Idcommission:Idcomm,    
            MontantCommission:MontantComm,                                                               
            MontantVirement:MontantVir }
                
      }).then((res) => {
        call(null,res);   
    }).catch(err => {
        call(err,null);  
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////Ajout de commissions mensuelles ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////::
var schedule = require('node-schedule');


  var schedule = require('node-schedule');
  var rule2 = new schedule.RecurrenceRule();
  rule2.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  rule2.hour = 0;
  rule2.minute = 0;

   var  TarifCompteCourant ={};
    var TarifCompteDollar ={};
    var TarifCompteEpargne={};
    var TarifCompteEuro={};
    var commission_devise={};
    
    schedule.scheduleJob(rule2, function(){
  
  async.series({

    CompteCourant(callback){ // recuperer le tarif menseul de la commission du compte courant 
        TarifCommission.findOne({
            attributes:['montant'],
            where:{'Code' :7} })
        .then((montantE) => {
            CompteCourant=montantE.montant
           callback();
          }).catch(err => {
        console.log(err) ;   
        });
    },
    CompteEpargne(callback){ // recuperer le tarif mensuel de la commission du compte epargne 

        TarifCommission.findOne({
            attributes:['montant'],
            where:{'Code' : 8} })
        .then((montantE) => {
            CompteEpargne=montantE.montant
           callback();
          }).catch(err => {
        console.log(err) ;   
        });
    },
    CompteEuro(callback){ // recuperer le tarif mensuel de la commisssion du compte euro et le convertir vers l'euro 

    TarifCommission.findOne({
        attributes:['montant'],
        where:{'Code' : 9} })
    .then((montantEU) => {
        commission_devise=montantEU.montant
        conversion(montantEU.montant,0,function(resultat){
            CompteEuro=resultat
            callback();
        });
        
      }).catch(err => {
    console.log(err) ; 

    });
    },
    CompteDollar(callback){ //recuperer le tarif mensuel de la commisssion du compte dollar et le convertir vers le dollar

        TarifCommission.findOne({
            attributes:['montant'],
            where:{'Code' : 9} })
        .then((montantD) => {
            conversion(montantD.montant,1,function(resultat){
                CompteDollar=resultat
                callback();
            });
            
          }).catch(err => {
        console.log(err) ; 
    
        });
    },
    Commissionmensuel(callback){
        
          

            sequelize.query('exec commission_mensuelle $courant,$epargne,$euro,$dollar,$devise',
                    {
                          bind: {
                            courant: CompteCourant,
                            epargne:CompteEpargne,
                            euro: CompteEuro,
                            dollar : CompteDollar,
                            devise:commission_devise
                          
                                   }
                            }).then((res) => {
                                callback();   
                            }).catch(err => {
                                
                                console.log(err);  
                            });

    
    }
});
  });

  function emettreVirementExterne (date,numVirement,numcompteemmetteur,NomEmetteur,numCompteDestinataire,nomDestinataire,montant,motif,justificatif,idCommission,pourcentage,rep){

    Compte.findOne({
        attributes:['Balance'],
        where:{'Num' :numcompteemmetteur} 
    }).then((compteFound)=>{
     
     if(compteFound ){
         commission = compteFound.Balance * pourcentage/100
         balance = compteFound.Balance - montant -commission
         console.log(compteFound.Balance)
         console.log(montant)
         console.log(pourcentage)
         console.log(montant + commission)
         console.log(balance)
         var banqueDestinataire = numCompteDestinataire.substr(0, 3)
         if(balance>=0){
            sequelize.query('Update Compte set Balance='+ balance+' where Num=$num',
            {
                 bind: {   num:numcompteemmetteur }
             }).then((result)=>{

             
              if(result){

              
               Virement.create({
                   Code : numVirement,
                   Date : date,
                   Statut : 1,
                   Montant : montant,
                   Justificatif : justificatif,
                   NomEmetteur : NomEmetteur,
                   CompteEmmetteur : numcompteemmetteur,
                   BanqueEmmeteur : "THW",
                   NomDestinataire : nomDestinataire,
                   CompteDestinataire : numCompteDestinataire,
                   BanqueDestinataire : banqueDestinataire,
                   Type : 1,
                   IdCommission : idCommission,
                   Motif :motif
   
               }).then((newVirement)=>{
   
                if(newVirement){

                
                Commission.create({
                    Id : idCommission,
                    CodeCommission : 5,
                    Date : date,
                    Montant : commission,
                    NumCompte : numcompteemmetteur
                    
                }).then((newCommision)=>{
                    if(newCommision){
                        response = {
                            'statutCode' : 200, // success
                            'succes': ""         
                        }
                        rep(response);
                    }
                   

                }).catch((err)=>{
                    console.log(err)
                    response = {
                        'statutCode' : 500, // success
                        'error': "Impossible d'effactuer le virement"         
                    }
                    rep(response);
                })
               }
               }).catch((err)=>{
                console.log(err)
                   response = {
                       'statutCode' : 500, // success
                       'error': "Impossible d'effactuer le virement"         
                   }
                   rep(response);
               })
             }
            }  
             ).catch((err)=>{
                 console.log(err)
                response = {
                    'statutCode' : 500, // success
                    'error': "Impossible d'effactuer le virement"         
                }
                rep(response); 
   
             });
         }else {
             
            response = {
                'statutCode' : 400, 
                'error': "Balance insuffisante"         
            }
            rep(response);
         }
         
     } else {
        response = {
            'statutCode' : 404, 
            'error': "Compte emmetteur non trouvé"         
        }
        rep(response);
     }

     }).catch((err)=>{
        console.log(err)
   
         response = {
             'statutCode' : 500, 
             'error': "Impossible d'effactuer le virement"         
         }
         rep(response);
 });
  }


function AddVirementExterneEnAttente(date,numVirement,numcompteemmetteur,NomEmetteur,numCompteDestinataire,nomDestinataire,montant,motif,justificatif,idCommission,pourcentage,rep){
    
    Compte.findOne({
        attributes:['Balance'],
        where:{'Num' :numcompteemmetteur} 
    }).then((compteFound)=>{
     
     if(compteFound ){
         commission = compteFound.Balance * pourcentage/100
         balance = compteFound.Balance - montant -commission
         console.log(compteFound.Balance)
         console.log(montant)
         console.log(pourcentage)
         console.log(montant + commission)
         console.log(balance)
         var banqueDestinataire = numCompteDestinataire.substr(0, 3)
         if(balance>=0){
            sequelize.query('Update Compte set Balance='+ balance+' where Num=$num',
            {
                 bind: {   num:numcompteemmetteur }
             }).then((result)=>{

             
              if(result){

              
               Virement.create({
                   Code : numVirement,
                   Date : date,
                   Statut : 0,
                   Montant : montant,
                   Justificatif : justificatif,
                   NomEmetteur : NomEmetteur,
                   CompteEmmetteur : numcompteemmetteur,
                   BanqueEmmeteur : "THW",
                   NomDestinataire : nomDestinataire,
                   CompteDestinataire : numCompteDestinataire,
                   BanqueDestinataire : banqueDestinataire,
                   Type : 1,
                   IdCommission : idCommission,
                   Motif :motif
   
               }).then((newVirement)=>{
   
                if(newVirement){

                
                Commission.create({
                    Id : idCommission,
                    CodeCommission : 5,
                    Date : date,
                    Montant : commission,
                    NumCompte : numcompteemmetteur
                    
                }).then((newCommision)=>{
                    if(newCommision){
                        response = {
                            'statutCode' : 200, // success
                            'succes': ""         
                        }
                        rep(response);
                    }
                   

                }).catch((err)=>{
                    console.log(err)
                    response = {
                        'statutCode' : 500, // success
                        'error': "Impossible d'effactuer le virement"         
                    }
                    rep(response);
                })
               }
               }).catch((err)=>{
                console.log(err)
                   response = {
                       'statutCode' : 500, // success
                       'error': "Impossible d'effactuer le virement"         
                   }
                   rep(response);
               })
             }
            }  
             ).catch((err)=>{
                 console.log(err)
                response = {
                    'statutCode' : 500, // success
                    'error': "Impossible d'effactuer le virement"         
                }
                rep(response); 
   
             });
         }else {
             
            response = {
                'statutCode' : 400, 
                'error': "Balance insuffisante"         
            }
            rep(response);
         }
         
     } else {
        response = {
            'statutCode' : 404, 
            'error': "Compte emmetteur non trouvé"         
        }
        rep(response);
     }

     }).catch((err)=>{
        console.log(err)
   
         response = {
             'statutCode' : 500, 
             'error': "Impossible d'effactuer le virement"         
         }
         rep(response);
 });

}

return {GetCompte,GetUser,getNextIdComm,VirCourDevis,VirCourEpar,historique,MontantCommission,
    GetNextIdCommission,GetPourcentageCommission,AddVirementClientTharwa,
    AddVirementClientTharwaEnAttente,getIdUser,getVirement,validerRejeterVirement,conversion,AddVirementExterneEnAttente,emettreVirementExterne}
}