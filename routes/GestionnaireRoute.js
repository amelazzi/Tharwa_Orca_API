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
                res.status(200).json({'Banques': response.banques});
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

/*--------------------------------Service pour recuperer la liste des banques ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/listBanquiers',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.listBanquiers((response)=>{
           if(response.statutCode == 200){
            res.status(200).json({'Banquiers': response.banquiers});
           } else {
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
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
            res.status(200).json({'Virements': response.virements});
           } else {
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
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
            res.status(200).json({'succe': response.succe});
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
                return res.status(400).json({'error':'missing parameters'}); //bad request
            }
            GestionnaireController.addBanque(code,RaisonSocial,Adresse,Mail,(response)=>{
        
                if(response.statutCode == 200){
                res.status(200).json({'succe': response.Success});
                } else {
                res.status(response.statutCode).json({'error': response.error}); 
                }
               
            }),
            console.log(" le code est "+ code+ "la raison sociale est "+ RaisonSocial+ "Adresse "+Adresse+ "le mail est "+Mail)
   
        }else {
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
            return res.status(400).json({'error':'missing parameters'}); //bad request
        }
        if (OauthResponse.statutCode == 200){
            GestionnaireController.editBanque(code,RaisonSocial,Adresse,Mail,(response)=>{

                if(response.statutCode == 200){
                res.status(200).json({'succe': response.Success});
                } else {
                res.status(response.statutCode).json({'error': response.error}); 
                }
               
            }),
            console.log(" le code est "+ code+ "la raison sociale est "+ RaisonSocial+ "Adresse "+Adresse+ "le mail est "+Mail)
   
        }else {
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
            return res.status(400).json({'error':'missing parameters'}); //bad request
        }
        if (OauthResponse.statutCode == 200){
            GestionnaireController.deleteBanque(code,(response)=>{
                if(response.statutCode == 200){
                res.status(200).json({'succe': response.Success});
                } else {
                res.status(response.statutCode).json({'error': response.error}); 
                }              
            })
          
        }else {
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
    
});

    return router;
}