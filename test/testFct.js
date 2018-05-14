var expect = require('chai').expect;
var mocha = require('mocha')
var describe = mocha.describe
//const { describe, it, before, after } = require('mocha');
module.exports = function(fcts){
  
describe('Compte ', function () {
  it('should return a num Compte ', function () {
    
    // 1. ARRANGE
    var Compte = 'THW000003DZD';
    var iduser = 'en_kerkar@esi.dz';
    var Type = '0';

    // 2. ACT
    fcts.GetCompte(iduser,Type,function(err, Compte1) {
                
        // 3. ASSERT
         expect(Compte1.Num).to.be.equal(Compte);
       });

    
 
  });
});
describe('Nom ', function () {
  it('should return  the user  ', function () {
    
    // 1. ARRANGE
    var nom = 'nawal';
    var prenom='kerkar'
    var iduser = 'en_kerkar@esi.dz';
   

    // 2. ACT
    fcts.GetUser(iduser,function(err, User) {
                
        // 3. ASSERT
      
         expect(User.Nom).to.be.equal(nom);
         expect(User.Prenom).to.be.equal(prenom);
       });

  });
});
describe('Id commission ', function () {
  it('should return  the next id commission  ', function () {
    // 1. ARRANGE
    var id =18;
    // 2. ACT
    fcts.getNextIdComm(0,function(idcom) {
                
        // 3. ASSERT
        
         expect(idcom).to.be.equal(id);
       });
  });
});
describe('Taux de change  ', function () {
  it('should return la conversion de 1 euro vers le dinar ', function () {
    
    // 1. ARRANGE
    var montant = 140;
    

    // 2. ACT
    fcts.conversion(1,4,function(montant_conv) {
                
        // 3. ASSERT
         expect(montant).to.be.equal(montant_conv);
       });

    
 
  });
});



describe('Taux de change  ', function () {
  it('should return la conversion de 1 dollar vers le dinar ', function () {
    
    // 1. ARRANGE
    var montant = 115;
    

    // 2. ACT
    fcts.conversion(1,5,function(montant_conv) {
                
        // 3. ASSERT
         expect(montant).to.be.equal(montant_conv);
       });

    
 
  });
});
}