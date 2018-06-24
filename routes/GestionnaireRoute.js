module.exports = function(express,GestionnaireController,tokenController){
   
    const router = express.Router();
    
   

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour recuperer la liste des banques ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    router.get('/listBanque',(req,res) =>{
        const token = req.headers['token']; //récupérer le Access token
         
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
    const token = req.headers['token']; //récupérer le Access token
     
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
    const token = req.headers['token']; //récupérer le Access token
     
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
    const token = req.headers['token']; //récupérer le Access token
    var name=req.body.username
    var tel=req.body.numtel
     
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
    console.log('ajour d une banque');

    const token = req.headers['token']; //récupérer le Access token
    var code = req.body.Code
    var RaisonSocial =req.body.RaisonSocial
    var Adresse = req.body.Adresse
    var Mail = req.body.Mail
           
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
    console.log('Modification d une banque');

    const token = req.headers['token']; //récupérer le Access token
    var code = req.body.Code
    var RaisonSocial =req.body.RaisonSocial
    var Adresse = req.body.Adresse
    var Mail = req.body.Mail
           
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
    console.log('suppression d une banque');

    const token = req.headers['token']; //récupérer le Access token
    var code = req.body.Code
   
           
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

    return router;
}