module.exports = function(express,tokenController,notificationController){

const router = express.Router();

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


  //exports :
  return router;

}