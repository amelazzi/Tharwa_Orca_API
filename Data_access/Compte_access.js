//imports 
const datetime = require('node-datetime');


//exports
module.exports = function(Compte,sequelize) {

 /*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure de création d'un compte bancaire---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    
    function CreateBanqueAccount(idClient,codeMonnaie,TypeCompte,callback){
        
        //get current date and time 
        var dt = datetime.create();
        var formatted = dt.format('Y-m-dTH:M:S');
        var dateCreation = formatted ;

        //construire le numéro de compte

        sequelize.query('exec GetNextId').spread((results, metadata) => {
            
            var rows = JSON.parse(JSON.stringify(results[0]));
            var numSeq = rows.id;
            var middle = numSeq.toString();
           
            var balance = 0;
            var idUser = idClient;
            var etat = 0;
            var typeCompte = TypeCompte;
            var num = makeNumAccount (middle,codeMonnaie)
            var newCompte = Compte.create({
                Num : num,
                Balance : balance,
                DateCreation : dateCreation,
                CodeMonnaie : codeMonnaie,
                IdUser : idUser,
                Etat :  etat,
                TypeCompte : typeCompte
    
            }).then(function(newCompte){
                if(newCompte){
                    callback(newCompte);
                }
                else {
                    callback(true);
                }
                
                
            })
            .catch(err => {
                
                console.error('Unable to add account', err);
                callback(false);
                 
                 
            });


        });
     
    }

/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------construire un numéro de compte---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
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



    return {CreateBanqueAccount,makeNumAccount};
}