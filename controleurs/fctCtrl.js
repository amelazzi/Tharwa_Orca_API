var oxr = require('open-exchange-rates'),
	fx = require('money');

  /*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour convertir un montant d'une base à une autre ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/ 
 module.exports =  function  (montant,par,callback){
     console.log(montant);
     var valeur;
    oxr.set({ app_id: 'a8a5c2a6302b453f9266c7254b043f6a' });
    oxr.latest(function() {
    // Apply exchange rates and base rate to `fx` library object:
    
	fx.rates = oxr.rates;
    fx.base = oxr.base;
    console.log(montant);
    
    switch (par)
    {
        case 0:   callback( fx(montant).from('DZD').to('EUR')); // courant vers devise euro
        break ;

        case 1: callback(fx(montant).from('DZD').to('USD')) // courant vers devise dollar
        
        break ;
        case 2:  callback(fx(montant).from('EUR').to('DZD')) //   devise euro vers courant 
       
        break ;
        case 3:   callback( fx(montant).from('USD').to('DZD')) //  devise dollar vers courant 
        break ;

        case 4: callback( fx(montant).from('USD').to('DZD'))
        break;
        


    }
   
});
return valeur;
}






  

  

