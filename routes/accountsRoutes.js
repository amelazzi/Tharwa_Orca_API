module.exports = function(express,tokenController,accountController){
   
    const router = express.Router();


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------prodédure de création d'un nouveau compte bancaire ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/account',(req,res) =>{
    //récupérer le Access token du banquier qui veut valider le compte banquaire
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            var type = req.body.Type;
            CreateNewBanqueAccount(OauthResponse.userId,type,(response)=>{
                 if(response.statutCode == 201){
                    res.status(response.statutCode)
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