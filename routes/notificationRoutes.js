module.exports = function(express,tokenController,notificationController){

const router = express.Router();


/*---------------------------------------------------------------------------------------------------------------------*/
    
/*------------------------------- service pour récupérer tous les notifications non lues d'un client-----------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/


router.get('/unread',(req,res) =>{
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            
            notificationController.getUnreadNotifications(OauthResponse.userId,(response)=>{

                if(response.statutCode == 200){
                    res.status(response.statutCode).json({'accountNotifications' : response.notifications});
                 }else {
                    res.status(response.statutCode).json({'error': response.error});
                 }

            })

        }else {
            
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

});

/*---------------------------------------------------------------------------------------------------------------------*/
    
/*------------------------------- service pour marquer une notification comme lues ----------------------------------*/   
    
/*---------------------------------------------------------------------------------------------------------------------*/

router.put('/read',(req,res) =>{
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            var idNotification =  parseInt(req.body.IdNotification)
            notificationController.marquerNotificationLue(idNotification,(response)=>{

                if(response.statutCode == 200){
                    res.status(response.statutCode).json({'success' : "notification marquée comme lue"});
                 }else {
                    res.status(response.statutCode).json({'error': response.error});
                 }

            })

        }else {
            
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

});


  //exports :
  return router;

}