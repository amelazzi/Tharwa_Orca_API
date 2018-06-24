


//Routes
module.exports = function(Virement,User,Banque,sequelize) {

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement vers un autre client THARWA----------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function listBanque(callback){
    // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
     
     Banque.findAll()
     .then(function (banques) {
        
        response = {
            'statutCode' : 200, // success
            'banques': banques          
        }
        callback(response);
        
    }).catch(function(err) {
        
        response = {
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
    });
    

}


function listBanquiers(callback){
    // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
     
     User.findAll(

       { attributes:['userId','username','type','numTel']
        ,where:{'type' :1}}
     )
     .then(function (banquiers) {
        
        response = {
            'statutCode' : 200, // success
            'banquiers': banquiers          
        }
        callback(response);
        
    }).catch(function(err) {
        
        response = {
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
    });
    

}
function listVirementEx(callback){
    // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
    const Op = sequelize.Op;
     Virement.findAll(

       { 
        where:{ 
            type: {
              [Op.or]: [1, 2]
            } }
    }
     )
     .then(function (virements) {
        
        response = {
            'statutCode' : 200, // success
            'virements': virements          
        }
        callback(response);
        
    }).catch(function(err) {
        
        response = {
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
    });
    

}
function updateProfil(name,tel,iduser,callback){
   
                  User.update(

                      { numTel: tel,username: name },
                      { where: { 'userId' :iduser} }

                  ).then(function() {
        
        response = {
            'statutCode' : 200, // success
            'succe': 'Compte modifie'        
        }
        callback(response);
        
    }).catch(function(err) {
        console.log(err)
        response = {
            
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
           });
}

//Fonction pour ajotuer une banque
function addBanque(codebanque, RaisnSocial, Adress, email,rep){
   
    var newBanque = Banque.create({
    Code : codebanque,
    RaisonSocial : RaisnSocial,
    Adresse : Adress,
    Mail : email

}).then(function(newBanque){
    response = {
        'statutCode' : 200, // success
        'Success': "nouvelle banque a ete ajoutee"     
    }
    rep(response)
    
})
.catch(err => {
    response = {
        'statutCode' : 400, // fail
        'error': "la banque n a pas ete ajoutee"     
    }
    rep(response)
     console.error('Unable to add banq', err);
 });
}

 //Fonction pour modifier une banque
function editBanque(codebanque, RaisnSocial, Adress, email,rep){

    Banque.findOne(
        {
           attributes:['Code','RaisonSocial','Adresse','Mail'],
           where: { 'Code' : codebanque }
        }
     ).then(function(BanqueFound){
         if(BanqueFound){
             BanqueFound.update({
                RaisonSocial:RaisnSocial,
                Adresse:Adress,
                Mail:email
             }).then(function() {
                response = {
                    'statutCode' : 200, // success
                    'Success': "nouvelle banque a ete modifiee"     
                }
                rep(response)
                
            }).catch(err => {
                console.log(err);
                response = {
                    'statutCode' : 400, // fail
                    'error': "la banque n a pas ete modifiée"     
                }
                rep(response)
            });
        }else{
            response = {
                'statutCode' : 404, // fail
                'error': "la banque inexistante"     
            }
            rep(response)
        }
 }).catch(err => {
    console.log(err);
    response = {
        'statutCode' : 500, // fail
        'error': "Error server"     
    }
    rep(response)
});

}


//Fonction pour ajotuer une banque
function deleteBanque(codebanque,rep){
   
    Banque.findOne(
        {
           attributes:['Code'],
           where: { 'Code' : codebanque }
        }
     ).then(function(BanqueFound){
         if(BanqueFound){
             BanqueFound.destroy({
                 Code:codebanque
               
             }).then(function() {
                response = {
                    'statutCode' : 200, // success
                    'Success': "nouvelle banque a ete modifiee"     
                }
                rep(response)
                
            }).catch(err => {
                console.log(err);
                response = {
                    'statutCode' : 400, // fail
                    'error': "la banque n a pas ete modifiée"     
                }
                rep(response)
            });
        }else{
            response = {
                'statutCode' : 404, // fail
                'error': "la banque inexistante"     
            }
            rep(response)
        }
 }).catch(err => {
    console.log(err);
    response = {
        'statutCode' : 500, // fail
        'error': "Error server"     
    }
    rep(response)
});

}

return {listBanque,listBanquiers,listVirementEx,updateProfil,addBanque,editBanque,deleteBanque};
}




