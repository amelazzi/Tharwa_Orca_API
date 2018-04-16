var expect = require('chai').expect;
var mocha = require('mocha')
var describe = mocha.describe
var sendGrid = require('../Utils/sendgrid')


describe('envoyer une notification par mail ', function () {
    it('should return true (new bank account created)', function () {
      
      // 1. ARRANGE
      var idClient = 'em_meguellati@esi.dz';
      var codeMonnaie = 'EUR';
      var TypeCompte = 2;
  
      // 2. ACT
      compteAccess.CreateBanqueAccount(idClient,codeMonnaie,TypeCompte,function(isCreated) {
                  
          // 3. ASSERT
           expect(isCreated).to.be.equal(true);
         });
  
      
  
    });
});