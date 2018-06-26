var multer  = require('multer')
var upload = multer()
var path = require('path');
var winston = require('../config/winston');
const datetime = require('node-datetime');

module.exports = function(express,chemin,VirementController,tokenController,usersController){
   
    const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour le virement vers un autre client Tharwa------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


    router.post('/VirementClientTh',(req,res) =>{
        var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
       // VirementController.TranferClientTH(req,res);
       usersController.FileUpload(req,res,'./justificatifs',(response)=>{
           
            if(response.statutCode == 200){
                var montant=req.body.Montant;
                var dest=req.body.CompteDestinataire;//numero de compte de destinataire
                var Motif=req.body.Motif;
                var imagePath;
                

                console.log("le montant est : "+ montant+" le compte destinataire est : "+dest+ " le motif est : "+Motif)
                const token = req.headers['token']; //récupérer le Access token
                
                //Verification de non null
                if(montant == null || dest == null ||Motif==null||montant<0){
                    winston.error(`${formatted} Status=400 - message = missing parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                    return res.status(400).json({'error':'missing parameters'}); //bad request
                }
                else{ 
                    tokenController(token, function(OauthResponse){
                        if (OauthResponse.statutCode == 200){
                                console.log("ID USER EMMETTEUR EST "+OauthResponse.userId)  
                                if (montant>=200000) {
                                    if(req.file != null){
                                        imagePath =  req.file.path;
                                        VirementController.TranferClientTH(OauthResponse.userId,montant,imagePath,dest,Motif,(response)=>{
                                            if (response.statutCode==200){
                                                winston.info(`${formatted} Status=${response.statutCode} - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                                res.status(200).json({'succe': response.Success});
                                            }else{
                                                winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                                res.status(response.statutCode).json({'error': response.error}); 
                                            }
                                        })
                                    }else {
                                        winston.error(`${formatted} Status=404 - message = Justificatif manquant  - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                        res.status(404).json({'error': "Justificatif manquant"});
                                    }
                                         
                                } 
                                else{
                                    imagePath=null
                                    VirementController.TranferClientTH(OauthResponse.userId,montant,imagePath,dest,Motif,(response)=>{
                                        if (response.statutCode==200){
                                            winston.info(`${formatted} Status=${response.statutCode} - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                            res.status(200).json({'succe': response.Success});
                                        }else{
                                            winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);

                                            res.status(response.statutCode).json({'error': response.error}); 
                                        }
                                    })
                                }       
                                
                         }
                        else {
                            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);

                            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
                        }
            
                    });
                }
        
            }
        });
    });


   

/*-----------------------------------------------------------------------------------------------------------------------*/   
 
/*--------------------------------Service pour les virements entre le meme compte d'un client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.post('/local',(req,res) =>{
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    var montant=req.body.montant;
    var type1 = req.body.type1;
    var type2=req.body.type2;
    var motif=req.body.motif;
    

    if(montant == null || type1 == null || type2== null || motif == null||montant<=0){
        winston.error(`${formatted} Status=400 - message = missing parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
     else{  
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
            VirementController.Virement_local(OauthResponse.userId,montant,type1,type2,motif,(response)=>{
            if(response.statutCode == 200){
            winston.info(`${formatted} Status=${response.statutCode} - message = ${response.succe} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
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
}
});







/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour la liste des virements non encore traités------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.get('/ListVirementNonTraites',(req,res) =>{
    
    VirementController.Listes_virements_non_traites(req,res);
});


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour la liste des virements non encore traités------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/validRejetVirement',(req,res) =>{
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    var code=req.body.code;
    var comptemetteur = req.body.comptemetteur;
    var comtpedestinataire=req.body.comtpedestinataire;
    var statut=req.body.statut;
    

    if(code == null || comptemetteur == null || comtpedestinataire== null || statut == null){
        winston.error(`${formatted} Status=400- message = missing parameters  - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
     else{  
    tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
    VirementController.validerRejeterVirement(code,comptemetteur,comtpedestinataire,statut,(response)=>{
        
        if(response.statutCode == 200){
            console.log("yasm")
        winston.info(`${formatted} Status=${response.statutCode} - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        res.status(200).json({'succe': response.Success});
        } else {
            
            winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        res.status(response.statutCode).json({'error': response.error}); 
        }
       
    });
    
    ;}
    else {
        winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
})
}
});

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*------------------Service pour la récupération du justificatif correspondant à un compte ------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


router.get('/justificatif',(req,res) =>{
    var dt = datetime.create();
    var formatted = dt.format('Y/m/d:H:M:S');

    const token = req.headers['token']; //Récupération de l'access Token
    var codevirement=req.headers['codevirement'];
    console
       
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            VirementController.getJustificatif(OauthResponse.userId,codevirement,(response)=>{
               if(response.statutCode == 200){
                    console.log('le justificatif est récupéré')
                    Justificatif = response.Justificatif;
                    res.sendFile(Justificatif, {"root": chemin});
                     
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

/*------------------Service pour emettre un virement vers un client d'une autre banque ------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.post('/externe',(req,res) =>{
                
            usersController.FileUpload(req,res,'./justificatifs',(response)=>{
                    var dt = datetime.create();
                    var formatted = dt.format('Y/m/d:H:M:S');
                    const token = req.headers['token']; //récupérer le Access token
                    var nomDestinataire = req.body.nomDestinataire
                    var numCompteDestinataire = req.body.numCompteDestinataire
                    var montant=parseInt(req.body.montant);
                    var motif=req.body.motif;
                    tokenController(token, function(OauthResponse){
                        if (OauthResponse.statutCode == 200){
                            if(nomDestinataire == null || numCompteDestinataire == null || montant== null || motif == null||montant<=0){
                                winston.error(`${formatted} Status=400 - message = missing parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                return res.status(400).json({'error':'missing paraameters'}); //bad request
                            }
                            else{
                                
                                if (montant>=200000){
                                    if(req.file != null){
                                        imagePath =  req.file.path;
                                        VirementController.virementExterne(OauthResponse.userId,montant,imagePath,numCompteDestinataire,nomDestinataire,motif,(response)=>{
                                            if (response.statutCode==200){
                                                winston.info(`${formatted} Status=${response.statutCode} - message = ${response.Success} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                                res.status(200).json({'succes': response.Success});
                                            }else{
                                                winston.error(`${formatted} Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                                res.status(response.statutCode).json({'error': response.error}); 
                                            }
                                        })
                                    }else {
                                        winston.error(`${formatted} Status=404 - message = Justificatif manquant  - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                        res.status(404).json({'error': "Justificatif manquant"});
                                    }
                                }else {
                                    
                                    imagePath=null
                                    VirementController.virementExterne(OauthResponse.userId,montant,imagePath,numCompteDestinataire,nomDestinataire,motif,(response2)=>{
                                        if(response2.statutCode == 200){
                                            winston.info(`${formatted} Status=${response2.statutCode} - message = ${response2.succe} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                            res.status(200).json({'succes': response2.succes});
                                        } else {
                                            winston.error(`${formatted} Status=${response.statutCode} - message = ${response2.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                                            res.status(response2.statutCode).json({'error': response2.error}); 
                                        }
                                 
                                    });
                                }
                               
                            }
                        }else {
                            winston.error(`${formatted} Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
                            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
                        }
                    });   
            })
           

});



return router;
}