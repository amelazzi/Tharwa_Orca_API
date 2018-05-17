
var oxr = require('open-exchange-rates'),
    fx = require('money');
    
module.exports =  function  (Compte,Client,User,Virement,sequelize,TarifCommission,Commission){

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
        case 0:   callback( fx(montant).from('DZD').to('EUR')); // courant vers devise euro
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
    where:{'Num' :comptee} })
    .then((Compte1) => {        
        callback(null,Compte1);
       }).catch(err => {
         callback(err,null);
        });
}

function getCompteBalance(iduseer,callback){
    Compte.findOne({
        attributes:['Num','Balance'],
        where:{'IdUser' :iduseer} })
        .then((CompteBalance) => {     
            console.log("balance de lemmetteur est "+CompteBalance.Balance)   
            callback(null,CompteBalance);
           }).catch(err => {
             callback(err,null);});
}

function getUserr (iduser,callback){
    User.findOne({
        attributes:['username'],
        where:{'userId' :iduser} })
        .then((usernamee) => {        
            callback(null,usernamee.username);
           }).catch(err => {
             callback(err,null);});
}

function getMontantIdCommission(codee, callback){ // Recupération du montant de la commission ansi que sons ID
    Virement.findOne({
        attributes:['Montant','IdCommission'],
        where:{'Code' :codee}
    }).then((MontantIdCommission) => {        
        callback(null,MontantIdCommission);
       }).catch(err => {
         callback(err,null);});
}

function getMontantSent(idcomm, callback){ // Récupération du montant envoye lors dun virement non encore validé
    Commission.findOne({
        attributes:['Montant'],
        where:{'Id' :idcomm}
    }).then((IdCommission) => {        
        callback(null,IdCommission.Montant);
       }).catch(err => {
         callback(err,null);}); 
}

function validerRejeterVirement(Code,CompteEmmett,CompteDestin,Idcomm,MontantComm,MontantVir,call){ // Valider ou rejetr un virement en changeant le statut (statut = 1: valider) (statut = 2: rejeter)
    sequelize.query('exec ValRejVir $Codee, $CompteEmmetteur, $CompteDestinataire, $Idcommission, $MontantCommission,$MontantVirement',
    {
        bind: {
            Codee: Code,   
            CompteEmmetteur: CompteEmmett,
            CompteDestinataire :CompteDestin,                                                              
            Idcommission:Idcomm,    
            MontantCommission:MontantComm,                                                               
            MontantVirement:MontantVir 
                
    }}).then((res) => {
        call(null,res);   
    }).catch(err => {
        console.log("erroor est "+ err)
        call(err,null);  
    });
}

return {GetCompte,GetUser,getNextIdComm,VirCourDevis,VirCourEpar,historique,GetNextIdCommission,GetPourcentageCommission,AddVirementClientTharwa,AddVirementClientTharwaEnAttente,getUserr,getCompteBalance,getIdUser,getMontantIdCommission,getMontantSent,validerRejeterVirement}
}