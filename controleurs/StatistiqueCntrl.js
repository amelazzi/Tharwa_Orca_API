


//Routes
module.exports = function(sequelize) {


function operation(option,callback){
    
    switch (option){
        case '0':   // operation par mois 
        {
           console.log("test".red)
        sequelize.query('exec get_operation_mois',
    {
          
        }).then((operation_mois) => {
            
            response = {
                'statutCode' : 200, // success
                'operation': JSON.parse(JSON.stringify(operation_mois[0]))         
            }
            callback(response);
            
            

        }).catch(err => {
            console.log(err)
            response = {
                'statutCode' : 500, // error
                'error': 'erreur dans l\'execution de la requete'          
            }
            callback(response)
          });
        } 
        break ;
        case '1':  // operation par trimestre
        {
        sequelize.query('exec get_operation_trimestre',
        {
              
            }).then((operation_trimestre) => {
                response = {
                    'statutCode' : 200, // success
                    'operation': JSON.parse(JSON.stringify(operation_trimestre[0]))         
                }
                callback(response);
                
                
    
            }).catch(err => {
                console.log(err)
                response = {
                    'statutCode' : 500, // error
                    'error': 'erreur dans l\'execution de la requete'          
                }
                callback(response)
              });
            }   
        break ;
            
        case '2':  // operation par an 
        {
        sequelize.query('exec get_operation_an',
        {
              
            }).then((operation_an) => {
                response = {
                    'statutCode' : 200, // success
                    'operation': JSON.parse(JSON.stringify(operation_an[0]))         
                }
                callback(response);
                
                
    
            }).catch(err => {
                console.log(err)
                response = {
                    'statutCode' : 500, // error
                    'error': 'erreur dans l\'execution de la requete'          
                }
                callback(response)
              });   } 
        break ;
    }
    
    

}


function commission(option,callback){
    switch (option ){
        case '0':   // commission par jour 
        sequelize.query('exec get_commission_journaliere',
    {
          
        }).then((operation_jour) => {
            response = {
                'statutCode' : 200, // success
                'commission': JSON.parse(JSON.stringify(operation_jour[0]))         
            }
            callback(response);
            
            

        }).catch(err => {
            console.log(err)
            response = {
                'statutCode' : 500, // error
                'error': 'erreur dans l\'execution de la requete'          
            }
            callback(response)
          }); 
        break ;
        case '1':   // commission par mois 
        sequelize.query('exec get_commission_mensuelle',
    {
          
        }).then((commission_mois) => {
            response = {
                'statutCode' : 200, // success
                'commission': JSON.parse(JSON.stringify(commission_mois[0]))         
            }
            callback(response);
            
            

        }).catch(err => {
            console.log(err)
            response = {
                'statutCode' : 500, // error
                'error': 'erreur dans l\'execution de la requete'          
            }
            callback(response)
          }); 
        break ;
        case '2':  // commission par trimestre
        sequelize.query('exec get_commission_trimestrielle',
        {
              
            }).then((commission_trimestre) => {
                response = {
                    'statutCode' : 200, // success
                    'commission': JSON.parse(JSON.stringify(commission_trimestre[0]))         
                }
                callback(response);
                
                
    
            }).catch(err => {
                console.log(err)
                response = {
                    'statutCode' : 500, // error
                    'error': 'erreur dans l\'execution de la requete'          
                }
                callback(response)
              });   
        break ;
        case '3':  // commission par an 
        sequelize.query('exec get_commission_annuelle',
        {
              
            }).then((commission_an) => {
                response = {
                    'statutCode' : 200, // success
                    'commission': JSON.parse(JSON.stringify(commission_an[0]))         
                }
                callback(response);
                
                
    
            }).catch(err => {
                console.log(err)
                response = {
                    'statutCode' : 500, // error
                    'error': 'erreur dans l\'execution de la requete'          
                }
                callback(response)
              });    
        break ;
    }
    
    

}




return {operation,commission};
}




