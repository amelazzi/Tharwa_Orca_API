/*//imports and constants
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const base_url = "http:localhost:8080";
var request = require("request");
var expect  = require('chai').expect;
chai.use(chaiHttp);

//tester la validation ou rejet dun virement
/*describe('/Post virement/Virement vers un autre client tharwa sans justificatif ', () => {
    it('it should  transfert vers un autre client Tharwa sans justificatif' , (done) => {
      chai.request(server)
          .post('/virement/VirementClientTh')
          .set({'token':'EWVkyX9tlGFag9uqkMuW7JWiz9UGRfWnHtPQd3EL7cbfopJTKt15xEZc5ul0VkPyycMx3JGgDLT988tQNp1LwkBS0LuZpmSyWcqQpdsYU6W05OcfITrHHoqVLpIxeRWWOcYkcKYcHKdfI7uo0DtAEtrV5Z16Zn8BDf2Qfbxpog7ptRdJWk3tVZqPveYTYYSXzDQdRyb6j2kN9FPXN00wl12vqX9JewEDk7ZXiNCGxffKqhc4ytjsUHUa0TI944p'})
          .send({
            'Montant':5,
            'CompteDestinataire':'THW000005DZD',
            'Motif':'Yasmine2',
            'Justificatif':'az'
          })
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
  });*/