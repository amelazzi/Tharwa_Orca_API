
var multer  = require('multer')
var upload = multer()

module.exports = function(express,tokenController,usersController,clientController,accountController){
   
    const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------------------      Service d'inscription du banquier      -------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    router.post('/BankerInscription',(req,res) =>{
        
        //récupérer le Access token du gestionnaire qui veut créer le compte pour le banquier
        const token = req.headers['token']; 
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                usersController.BankerInscription(OauthResponse.userId,req,res);
            }else {
                
                res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
            }
        });
        
    });


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------------------      Service d'inscription du client      ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


    router.post('/ClientInscription',(req,res) =>{

        // 1- Uploader l'image du client
        usersController.FileUpload(req,res,'./uploads',(response)=>{
            
            if(response.statutCode == 200){
                //2- Insciption du client ( creation Usre + Client + Compte courant )
                clientController.addClient(req,res,(response2)=>{
                    if (response2.statutCode == 201){
                        res.status(response2.statutCode).json({'success':response2.success});
                    }
                    else {
                        res.status(response2.statutCode).json({'error':response2.error});
                    }
                }) 
            }else{
              res.status(response.statutCode).json({'error':response.error});
            }

        });
        
            
    });

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------- Service pour récupérer les informations du tableau de bord--------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    router.get('/dashBoard',(req,res) =>{


        const token = req.headers['token']; //récupérer le Access token
           
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                 usersController.getUserInfo(OauthResponse.userId,(response)=>{
                   if(response.statutCode == 200){
                    res.status(200).json({'userId': response.userId,
                                          'userName': response.userName,
                                          'type' : response.type});
                   } else {
                    res.status(response.statutCode).json({'error': response.error}); 
                   }
                   
                });
            }else {
                res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
            }
        });

        
    });

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------Service pour modifier le mot de passe---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/mdp',(req,res) =>{

      const token = req.headers['token']; //récupérer le Access token
           
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                if(req.body.newMDP == null || req.body.oldMDP == null){
                    res.status(400).json({'error': "paramètres manquants"});
                } else {
                    usersController.changerMDP(OauthResponse.userId,req.body.newMDP,req.body.oldMDP,(response)=>{
                        if(response.statutCode == 200){
                            
                         res.status(response.statutCode).json({'error': response.success});
                        } else {
                         res.status(response.statutCode).json({'error': response.error}); 
                        }
                        
                     });
                }
                
            }else {
                res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
            }
        });
   
    
});
    return router;
}