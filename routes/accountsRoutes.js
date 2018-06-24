module.exports = function(express,tokenController,accountController,notificationController){
   
    const router = express.Router();


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure de création d'un nouveau compte bancaire ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/new',(req,res) =>{
    
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

/*----------------------------------------Service de validation d'un compte banquire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/validate',(req,res) =>{

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
                        accountController.getAccountOwner (numCmpt, (idUser)=>{
                            if(idUser){
                                notificationController.addNotificationCompte(idUser,0,1,(idNotification)=>{
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
                        accountController.getAccountOwner (numCmpt, (idUser)=>{
                            if(idUser){
                                notificationController.addNotificationCompte(idUser,0,0,(idNotification)=>{
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


    return router;

}