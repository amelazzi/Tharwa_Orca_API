var oxr = require('open-exchange-rates'),
    fx = require('money');
var async = require('async-if-else')(require('async'));
    
module.exports =  function  (Compte,Client,sequelize,TarifCommission){
function GetCompte(iduser,Type1,callback){
    Compte.findOne({
        attributes:['Num','Balance'],
        where:{'IdUser' :iduser, 
        'TypeCompte': Type1} })
    .then((Compte1) => {
        
       callback(null,Compte1);
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
function getNextIdComm(callback){
    
    sequelize.query('exec get_next_idcommission').spread((results, metadata) => {
           
        var rows = JSON.parse(JSON.stringify(results[0]));
        callback(parseInt(rows.id));
    });
}
function historique(iduser,callback){
    sequelize.query('exec historique $userid',
                    {
                          bind: {
                                 userid:iduser
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
        


    }
   
});
return valeur;
}

function VirCourDevis(par,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,call){
    conversion(Montant,par,function(resultat){ //conversion du montant vers l'euro
    
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
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
                                id:idcom
                                   }
                            }).then((res) => {
                                call(null,res);   
                            }).catch(err => {
                                console.log(err);
                                call(err,null);  
                            });
                });

}
function VirCourEpar(Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,call){
    
    
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
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
                           id:idcom
                                   }
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
        
          

            sequelize.query('exec commission_mensuelle $courant,$epargne,$euro,$dollar',
                    {
                          bind: {
                            courant: CompteCourant,
                            epargne:CompteEpargne,
                            euro: CompteEuro,
                            dollar : CompteDollar,
                          
                                   }
                            }).then((res) => {
                                callback();   
                            }).catch(err => {
                                
                                console.log(err);  
                            });

    
    }
});
  });




  

return {GetCompte,GetUser,getNextIdComm,VirCourDevis,VirCourEpar,historique}
}