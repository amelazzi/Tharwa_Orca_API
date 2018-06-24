/*
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
/*
 
  describe('/GET Virement externe  ', () => {
      it('it should GET all the externe virements', (done) => {
        chai.request(server)
            .get('/gestionnaire/listVirementEx')
            .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.Virements.should.be.a('array');
                res.body.Virements.length.should.be.eql(1);
              done();
            });
      });
  });*/

  describe('/GET historique ', () => {
    it('it should GET historique', (done) => {
      chai.request(server)
          .post('/clients/historique')
          .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
          .send({
            'type': '0'
          })
          .end((err, res) => {
              res.should.have.status(200);
              res.body.historique.should.be.a('array');
            
            done();
          });
    });
 });
/*
describe('/Post Virement entre ces comptes', () => {
  it('it should effectue un virement entre un compte courant et un compte epargne', (done) => {
    chai.request(server)
        .post('/virement/local')
        .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
        .send({
          'montant': '18',
          'type1': '0',
          'type2': '1',
          'motif':'virement'
        })
        .end((err, res) => {
            res.should.have.status(200);
            
          
          done();
        });
  });
});

describe('/Post Virement entre ces comptes ', () => {
  it('il deverai detecter que la balance est insufficante', (done) => {
    chai.request(server)
        .post('/virement/local')
        .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
        .send({
          'montant': '199999999',
          'type1': '0',
          'type2': '1',
          'motif':'virement'
        })
        .end((err, res) => {
            res.should.have.status(403);
            
          
          done();
        });
  });
});*/

/* TEST VIREMENT VERS UN AUTRE CLIENT THARWA */
describe('/virement/VirementClientTh ', () => {
  it('il deverai detecter que le justificatif manquat', (done) => {
    chai.request(server)
        .post('/virement/VirementClientTh')
        .set({'token':'SkCWpa8TzBdFXVP9SQS21WgJwFJZfXJpxDQqIiq5v25LBXZobWnfNXUqlByuEJ1mhJhVubl04b2m2DZbpzqmDWn9rjDU4hHDMiKi9Drr9buSQXNduHrOMsyrXCYXhj6fZt5oczRso0BQlSeKY5BJRLjQt4Cm0bgPxN7EMbHo27HOaZrhmMXQDpErwoPRGvLHYvy4aJlxs1pJl5SDo6ulGOTPEEvJvR1QsVJe0Q18XEBWW4gR2H9pcc1tRwVzDrs'})
        .send({
          'Montant': '300000',
          'CompteDestinataire': 'THW000004DZD',
          'Motif': 'JUSTIFICATIF DEMO',
          //'avatar':'virement'
        })
        .end((err, res) => {
            res.should.have.status(404);
            
          
          done();
        });
  });
});


