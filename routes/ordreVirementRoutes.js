
var winston = require('../config/winston');
const datetime = require('node-datetime');

module.exports = function(express,tokenController,ordreVirementController){
   
    const router = express.Router();


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure qui crée un ordre de virement   ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/creation',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
    var data=req.body.data;
    var titre=req.body.titre;
    
        var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');

    if(data== null || data=="" ){
        winston.error(`${formatted}  Status=400 - message = missing or wrong parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        return res.status(400).json({'error':'missing or wrong parameters'}); //bad request
    }
     else{  
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
            ordreVirementController.creerOrdreVirement(OauthResponse.userId,data,titre,(response)=>{
            if(response.statutCode == 200){
            winston.info(`${formatted} Status=${response.statutCode} -message =l'ordre de virement creé  avec succées  - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'num': response.num});
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


router.get('/listOrdreVirement',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        ordreVirementController.listeOrdreVirement((response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = Liste des ordres de virement extraite avec succes- originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'OrdreVirements': response.ordreVirements});
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
   
router.post('/detail',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    const num =req.body.num;
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        ordreVirementController.detail(num,(response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = detail ordre de virement- originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'OrdreVirements': response.ordreVirements});
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


router.post('/executer',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    const num =req.body.num;
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        ordreVirementController.executer(num,(response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = execution de l'ordre de virement - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'OrdreVirements': response.succes});
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

router.post('/ValRej',(req,res) =>{
    var dt = datetime.create();
        var formatted = dt.format('Y/m/d:H:M:S');
    const token = req.headers['token']; //récupérer le Access token
    const num =req.body.num;
    const statut =req.body.statut;
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        ordreVirementController.ValRej(num,statut,(response)=>{
           if(response.statutCode == 200){
            winston.info(`${formatted} Status=200 - message = execution de l'ordre de virement - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'OrdreVirements': response.succes});
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