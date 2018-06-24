var expect = require('chai').expect;
var mocha = require('mocha')
var describe = mocha.describe

module.exports = function(NotificationController){
  
describe('Notification Virement Emis ', function () {
  it('should return true ', function () {

    
    // 1. ARRANGE
    var idUser = 'em_meguellati@esi.dz';
    var NomRecepteur = 'Meriem Meguellati';
    var montant = '1000';
    var etat = 1

    // 2. ACT
    NotificationController.addNotificationVirementEmis(idUser,NomRecepteur,montant,etat,(reponse)=>{
                
        // 3. ASSERT
         expect(reponse).to.be.equal(true);
         
       });

  });
});

}