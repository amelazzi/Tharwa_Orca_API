var winston = require('../config/winston')
const datetime = require('node-datetime');
module.exports = function(express,tokenController,accountController,notificationController){
   
    const router = express.Router();


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure de création d'un nouveau compte bancaire ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/new',(req,res) =>{
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            var type = parseInt(req.body.Type);
            accountController.CreateNewBanqueAccount(OauthResponse.userId,type,(response)=>{
                 if(response.statutCode == 201){
                    winston.info(`${formatted} Status=${response.statutCode} - message = ${response.compte} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                    res.status(response.statutCode).json({'compte' : response.compte});
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

/*----------------------------------------Service de validation d'un compte banquaire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/validate',(req,res) =>{

    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');

    //récupérer le Access token du banquier qui veut valider le compte banquaire
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            numCmpt = req.body.num;
            if(numCmpt == null){
                winston.error(`${formatted} Status=400 - message = missing account number - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                res.status(400).json({'error' : 'missing account number '});
            }else {
               
                accountController.validateAccount(numCmpt,(response)=>{
                    if(response.statutCode == 200){
                        accountController.getAccountOwner (numCmpt, (idUser,typeCompte)=>{
                            if(idUser){
                                notificationController.addNotificationCompte(idUser,typeCompte,1,(idNotification)=>{
                                    notificationController.sendNotification(idUser,idNotification)     
                                })
                            }   
                        });
                        winston.info(`${formatted} Status=200 - message = account validated - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(200).json({'success' : 'account validated'});
                    } else {
                        winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);            
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

    
});

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service de rejection d'un compte banquire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/reject',(req,res) =>{

    var dt = datetime.create();
   var formatted = dt.format('Y/m/d:H:M:S');

    //récupérer le Access token du banquier qui veut valider le compte banquaire
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            numCmpt = req.body.num;
            if(numCmpt == null){
                winston.error(`${formatted} Status=400 - message =missing account number - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                res.status(400).json({'error' : 'missing account number '});
            }else {
               
                accountController.rejectAccount(numCmpt,(response)=>{
                    if(response.statutCode == 200){
                        accountController.getAccountOwner (numCmpt, (idUser,typeCompte)=>{
                            if(idUser){
                                notificationController.addNotificationCompte(idUser,typeCompte,0,(idNotification)=>{
                                    notificationController.sendNotification(idUser,idNotification)    
                                })
                            }   
                        });
                        winston.info(`${formatted} Status=200 - message = account rejected - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(200).json({'success' : 'account rejected'});
                    } else {
                        winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

    
});

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service pour extraire les comptes non validés ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/compteNonValide',(req,res) =>{

    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');

    const token = req.headers['token']; //récupérer le Access token
           
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            accountController.getCompteNonValide((response)=>{
               if(response.statutCode == 200){
                winston.info(`${formatted} Status=200 - message = ${response.Comptes} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);

                res.status(200).json({'Comptes': response.Comptes});
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

/*----------------------------------------Service de blocage d'un compte banquaire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/bloc',(req,res) =>{

    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');

    //récupérer le Access token du banquier qui veut valider le compte banquaire
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        var dt = datetime.create();
        var formatted = dt.format('Y-m-dTH:M:S');
        if (OauthResponse.statutCode == 200){
            numCmpt = req.body.num;
            motif = req.body.motif;
            if(numCmpt == null){
                winston.error(`${formatted}Status=${400} - message = missing account number - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                res.status(400).json({'error' : 'missing account number '});
            }else {
                accountController.blocAccount(numCmpt,motif,(response)=>{
                    if(response.statutCode == 200){
                        accountController.getAccountOwner (numCmpt, (idUser,typeCompte)=>{
                            if(idUser){
                                    notificationController.addNotificationCompte(idUser,typeCompte,3,(idNotification)=>{
                                    notificationController.sendNotification(idUser,idNotification)     
                                })
                            }   
                        });
                        winston.info(`${formatted} Status=200 - message = compte bloqué - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(200).json({'success' : 'account bloked'});
                    } else {
                        winston.error(`${formatted}Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

    
});

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service de déblocage d'un compte banquaire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/debloc',(req,res) =>{

    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');

    //récupérer le Access token du banquier qui veut valider le compte banquaire
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            numCmpt = req.body.num;
            motif = req.body.motif;
            var dt = datetime.create();
            var formatted = dt.format('Y-m-dTH:M:S');
            if(numCmpt == null){
                winston.error(`${formatted}Status=${400} - message = missing account number - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                res.status(400).json({'error' : 'missing account number '});
            }else {
               
                accountController. deblocAccount(numCmpt,motif,(response)=>{
                    if(response.statutCode == 200){
                        accountController.getAccountOwner (numCmpt, (idUser,typeCompte)=>{
                            if(idUser){
                                    notificationController.addNotificationCompte(idUser,typeCompte,2,(idNotification)=>{
                                    notificationController.sendNotification(idUser,idNotification)     
                                })
                            }   
                        });
                        winston.info(`${formatted} Status=200 - message = compte débloqué - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(200).json({'success' : 'account debloked'});
                    } else {
                        winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

    
});



    return router;

}