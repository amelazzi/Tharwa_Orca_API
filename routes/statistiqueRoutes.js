
var winston = require('../config/winston');
module.exports = function(express,tokenController,StatistiqueController){
   
    const router = express.Router();


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure qui retourne les statistiques des opétaions  ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/operation',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
    var option=req.body.option;
    
    

    if(option == null || option < 0 || option >2 ){
        winston.error(`Status=400 - message = missing or wrong parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        return res.status(400).json({'error':'missing or wrong parameters'}); //bad request
    }
     else{  
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
            StatistiqueController.operation(option,(response)=>{
            if(response.statutCode == 200){
            winston.info(`Status=${response.statutCode} -  - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'succe': response.operation});
            } else {
            winston.error(`Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(response.statutCode).json({'error': response.error}); 
            }
           
        });
    }else {
        winston.error(`Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});   
}
    
    
});
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------prodédure qui retourne les statistiques des commissions------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.post('/commission',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
    var option=req.body.option;
    
    

    if(option == null || option < 0 || option >3 ){
        winston.error(`Status=400 - message = missing or wrong parameters - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        return res.status(400).json({'error':'missing or wrong parameters'}); //bad request
    }
     else{  
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
            StatistiqueController.commission(option,(response)=>{
            if(response.statutCode == 200){
            winston.info(`Status=${response.statutCode} -  originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(200).json({'succe': response.commission});
            } else {
            winston.error(`Status=${response.statutCode} - message = ${response.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
            res.status(response.statutCode).json({'error': response.error}); 
            }
           
        });
    }else {
        winston.error(`Status=${OauthResponse.statutCode} - message = ${OauthResponse.error} - originalURL=${req.originalUrl} - methode= ${req.method} - ip = ${req.ip}`);
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
    
    
});
}
    
    
});




    return router;

}