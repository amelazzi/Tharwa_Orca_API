module.exports = function(express,tokenController,accountController,notificationController,clients){
   
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
                    res.status(response.statutCode).json({'compte' : response.compte});
                 }else {
                    res.status(response.statutCode).json({'error': response.error});
                 }
            })
        
        }else {
            
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
                res.status(400).json({'error' : 'missing account number '});
            }else {
               
                accountController.validateAccount(numCmpt,(response)=>{
                    if(response.statutCode == 200){
                        accountController.getAccountOwner (numCmpt, (idUser)=>{
                            if(idUser){
                                notificationController.addNotificationCompte(idUser,0,1,(reponse)=>{
                                    console.log("notification ajoutée à la BDD")
                                    if(clients.get(idUser)){
                                        notificationController.createNotificationMessage(reponse,(notification)=>{
                                            clients.get(idUser).emit('notification',notification.message)
                                            console.log("notification envoyée au client mobile")
                                        });
                                    } else {
                                        console.log("Client offline. Notification non envoyée")
                                    }     
                                })
                            }   
                        });
                        res.status(200).json({'success' : 'account validated'});
                    } else {
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            
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
                res.status(400).json({'error' : 'missing account number '});
            }else {
               
                accountController.rejectAccount(numCmpt,(response)=>{
                    if(response.statutCode == 200){
                        accountController.getAccountOwner (numCmpt, (idUser)=>{
                            if(idUser){
                                notificationController.addNotificationCompte(idUser,0,0,(reponse)=>{
                                    console.log("notification ajoutée à la BDD")
                                    if(clients.get(idUser)){
                                        notificationController.createNotificationMessage(reponse,(notification)=>{
                                            clients.get(idUser).emit('notification',notification.message)
                                            console.log("notification envoyée au client mobile")
                                        });
                                    } else {
                                        console.log("Client offline. Notification non envoyée")
                                    }     
                                })
                            }   
                        });
                        res.status(200).json({'success' : 'account rejected'});
                    } else {
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            
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
                res.status(200).json({'Comptes': response.Comptes});
               } else {
                res.status(response.statutCode).json({'error': response.error}); 
               }
               
            });
        }else {
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

    
   
});


    return router;

}