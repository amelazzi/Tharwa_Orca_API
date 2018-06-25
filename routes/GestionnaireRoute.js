
var winston = require('../config/winston');
const datetime = require('node-datetime');
module.exports = function(accountController,express,GestionnaireController,tokenController){
   
    const router = express.Router();
    
   

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour recuperer la liste des banques ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    router.get('/listBanque',(req,res) =>{
        var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
        const token = req.headers['token']; //récupérer le Access token
        
        var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
         
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            GestionnaireController.listBanque((response)=>{
               if(response.statutCode == 200){
                winston.info(`${formatted} Status=200 - message = ${response.banques} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                res.status(200).json({'Banques': response.banques});
               } else {
                winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                res.status(response.statutCode).json({'error': response.error}); 
               }
               
            });
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
       
    
    });

    /*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour recuperer la liste des banques ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/listBanquiers',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.listBanquiers((response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = ${response.banquiers} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'Banquiers': response.banquiers});
           } else {
            winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
        winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});
   

});

router.get('/listVirementEx',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.listVirementEx((response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = ${response.virements} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
            res.status(200).json({'Virements': response.virements});

           } else {
            winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
        winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});
   

});

router.put('/updateprofil',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    var name=req.body.username
    var tel=req.body.numtel
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.updateProfil(name,tel,OauthResponse.userId,(response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = ${response.succe} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
            res.status(200).json({'succe': response.succe});
           } else {
            winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
        winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});
   

});

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service pour ajouter une banque dans la base de données -----------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.post('/addbanque',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    console.log('ajour d une banque');

    const token = req.headers['token']; //récupérer le Access token
    var code = req.body.Code
    var RaisonSocial =req.body.RaisonSocial
    var Adresse = req.body.Adresse
    var Mail = req.body.Mail
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
           
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            if(code==null ||RaisonSocial==null||Adresse==null ||Mail==null){
                winston.error(`${formatted} Status=400 - message = missing parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`); 
                return res.status(400).json({'error':'missing parameters'}); //bad request
            }
            GestionnaireController.addBanque(code,RaisonSocial,Adresse,Mail,(response)=>{
        
                if(response.statutCode == 200){
                    winston.info(`${formatted} Status=200 - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                    res.status(200).json({'succe': response.Success});
                }else {
                    winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                    res.status(response.statutCode).json({'error': response.error}); 
                }
               
            })            
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
    
});

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service pour modifier une banque dans la base de données -----------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.post('/editbanque',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    console.log('Modification d une banque');

    const token = req.headers['token']; //récupérer le Access token
    var code = req.body.Code
    var RaisonSocial =req.body.RaisonSocial
    var Adresse = req.body.Adresse
    var Mail = req.body.Mail
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');
           
    tokenController(token, function(OauthResponse){
        if(code==null ||RaisonSocial==null||Adresse==null ||Mail==null){
            winston.error(`${formatted} Status=400 - message = missing parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            return res.status(400).json({'error':'missing parameters'}); //bad request
        }
        if (OauthResponse.statutCode == 200){
            GestionnaireController.editBanque(code,RaisonSocial,Adresse,Mail,(response)=>{

                if(response.statutCode == 200){
                    winston.info(`${formatted} Status=${response.statutCode} - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                    res.status(200).json({'succe': response.Success});
                } else {
                    winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                    res.status(response.statutCode).json({'error': response.error}); 
                }
               
            })
           
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
    
});



/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service pour supprimer une banque dans la base de données ---------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.post('/deletebanque',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    console.log('suppression d une banque');

    const token = req.headers['token']; //récupérer le Access token
    var code = req.body.Code
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');
           
    tokenController(token, function(OauthResponse){
        if(code==null){
            winston.error(`${formatted} Status=400 - message = missing parameters- originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
            return res.status(400).json({'error':'missing parameters'}); //bad request
        }
        if (OauthResponse.statutCode == 200){
            GestionnaireController.deleteBanque(code,(response)=>{
                if(response.statutCode == 200){
                    winston.info(`${formatted} Status=200 - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                    res.status(200).json({'succe': response.Success});
                } else {
                    winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                    res.status(response.statutCode).json({'error': response.error}); 
                }              
            })
          
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
    
});

router.get('/infoCompte',(req,res) =>{
    
    const numCompte = req.query.Num
    const token = req.headers['token']; //récupérer le Access token
 //   const numCompte = req.headers['Num'];
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');
    console.log(token)
    console.log(numCompte)
           
    tokenController(token, function(OauthResponse){
        
        if (OauthResponse.statutCode == 200){
            if(numCompte==null){
                console.log(req.headers['Num'])
                winston.error(`${formatted} Status=400 - message = missing parameters- originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                return res.status(400).json({'error':'missing parameters'}); //bad request
            }else {
                accountController.getAccountInfo(numCompte,(err,accountFound)=>{
                    if(!err){
                        winston.info(`${formatted} Status=200 - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                        res.status(200).json({'compte': accountFound});
                    } else {
                        if(err == 404){
                            winston.error(`${formatted} Status= 404 - message = Account not found - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                            res.status(404).json({'error': "account not found"}); 
                        } else {
                            winston.error(`${formatted} Status= 500 - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
                           res.status(500).json({'error': "unable to verify account"}); 
                        }
                        
                    }              
                })
            }
            
          
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);                
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
    
});

    return router;
}
