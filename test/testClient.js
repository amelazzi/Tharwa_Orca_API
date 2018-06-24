/*//imports and constants
const base_url = "http:localhost:8080";
var request = require("request");
var expect  = require('chai').expect;
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp); */


//tester la récupération des info du tableau de bord
/*describe("inscription un client", function () {
    it(" Should create  User, Client and CourantAccount and return with code 201", function (done) {
     /*  request.post(
           {url : base_url + "/users/ClientInscription",
            headers : {
                "Content-Type" : 'multipart/form-data',
            },
            formData: 
                { avatar: 
                    { value: 'fs.createReadStream("E:\\studyS2\\Mobile\\9786070719554.jpg")',
                        options: 
                        { filename: 'E:\\studyS2\\Mobile\\9786070719554.jpg',
                        contentType: null } },
                    userId: 'testUnitaire34@mailinator.com',
                    UserName: 'Meriem',
                    Pwd: 'orca@2018',
                    Tel: '0999',
                    type: '0',
                    Nom: 'Meguellati',
                    Prenom: 'Meriem',
                    Adresse: 'setif',
                    Fonction: 'developper' }},
          function (error, response, body) {
          expect(response.statusCode).to.equal(201);
          
         // done();
        }).then(done());*/

       /* chai.request(server)
        .post('/users/ClientInscription')
        .set({'content-type': 'multipart/form-data'})
        .send({
            'avatar': 
                { value: 'fs.createReadStream("E:\\studyS2\\Mobile\\9786070719554.jpg")',
                    options: 
                    { filename: 'E:\\studyS2\\Mobile\\9786070719554.jpg',
                    contentType: null } },
            'filename': 'E:\\studyS2\\Mobile\\9786070719554.jpg',
            'userId': 'testUnitaire19@mailinator.com',
            'UserName': 'Meriem',
            'Pwd': 'orca@2018',
            'Tel': '0999',
            'type': '0',
            'Nom': 'Meguellati',
            'Prenom': 'Meriem',
            'Adresse': 'setif',
            'Fonction': 'developper'
        })
        .end((err, res) => {
            res.should.have.status(201);
            
          
          done();
        });

    });
  
}); */


/*describe('valider un compte ', () => {
    it('it should validate an account with state 0 ', (done) => {
      chai.request(server)
          .put('/accounts/validate')
          .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
          .send({
            'num' : 'THW000009DZD'
          })
          .end((err, res) => {
              res.should.have.status(200);
              
            
            done();
          });
    });
  });

  describe('Rejeter un compte ', () => {
    it('it should reject an account with state 0 ', (done) => {
      chai.request(server)
          .put('/accounts/reject')
          .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
          .send({
            'num' : 'THW000008DZD'
          })
          .end((err, res) => {
              res.should.have.status(200);
              
            
            done();
          });
    });
  }); */
  

