/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour le virement vers un autre client Tharwa------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
var multer  = require('multer')
var upload = multer()
var path = require('path');

module.exports = function(express,VirementController,tokenController,usersController){
   
    const router = express.Router();

    router.post('/VirementClientTh',(req,res) =>{
       // VirementController.TranferClientTH(req,res);
       usersController.FileUpload(req,res,'./justificatifs',(response)=>{
           console.log("hello")
        if(response.statutCode == 200){
            var montant=req.body.Montant;
            var dest=req.body.CompteDestinataire;//numero de compte de destinataire
            var Motif=req.body.Motif;
            var imagePath;
            

            console.log("le montant est : "+ montant+" le compte destinataire est : "+dest+ " le motif est : "+Motif)
            const token = req.headers['token']; //récupérer le Access token
            
            //Verification de non null
            if(montant == null || dest == null ||Motif==null||montant<0){
                return res.status(400).json({'error':'missing parameters'}); //bad request
            }
            else{ 
                tokenController(token, function(OauthResponse){
                    if (OauthResponse.statutCode == 200){
                            console.log("ID USER EMMETTEUR EST "+OauthResponse.userId)  
                            if (montant>=200000) {
                                imagePath =  req.file.path;      
                            } 
                            else{
                                imagePath=null
                            }       
                            console.log("On verra bien le chemin "+ imagePath)
                            VirementController.TranferClientTH(OauthResponse.userId,montant,imagePath,dest,Motif,(response)=>{
                            if (response.statutCode==500){
                                res.status(200).json({'succe': response.Success});
                            }else{
                                res.status(response.statutCode).json({'error': response.error}); 
                            }
                        })}
                    else {
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
    const token = req.headers['token']; //récupérer le Access token
    var montant=req.body.montant;
    var type1 = req.body.type1;
    var type2=req.body.type2;
    var motif=req.body.motif;
    

    if(montant == null || type1 == null || type2== null || motif == null){
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
     else{  
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
            VirementController.Virement_local(OauthResponse.userId,montant,type1,type2,motif,(response)=>{
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
    const token = req.headers['token']; //récupérer le Access token
    var code=req.body.code;
    var comptemetteur = req.body.comptemetteur;
    var comtpedestinataire=req.body.comtpedestinataire;
    var statut=req.body.statut;
    

    if(code == null || comptemetteur == null || comtpedestinataire== null || statut == null){
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
     else{  
    tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
    VirementController.validerRejeterVirement(code,comptemetteur,comtpedestinataire,statut,req,res);}
    else {
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
})
}
});



return router;
}