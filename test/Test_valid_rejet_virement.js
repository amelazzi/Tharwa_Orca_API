/*//imports and constants
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

//tester la validation ou rejet dun virement
/*describe('/Post virement/validRejetVir ', () => {
    it('it should  update  the transfet: validate or reject', (done) => {
      chai.request(server)
          .post('/virement/validRejetVir')
          .set({'token':'EWVkyX9tlGFag9uqkMuW7JWiz9UGRfWnHtPQd3EL7cbfopJTKt15xEZc5ul0VkPyycMx3JGgDLT988tQNp1LwkBS0LuZpmSyWcqQpdsYU6W05OcfITrHHoqVLpIxeRWWOcYkcKYcHKdfI7uo0DtAEtrV5Z16Zn8BDf2Qfbxpog7ptRdJWk3tVZqPveYTYYSXzDQdRyb6j2kN9FPXN00wl12vqX9JewEDk7ZXiNCGxffKqhc4ytjsUHUa0TI944p'})
          .send({
            'code': 'THW000003DZDTHW000004DZD201803240105',
            'statut': '0',
          })
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
  });*/