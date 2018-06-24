/*//imports and constants
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
chai.use(chaiHttp);

//Tester la récupération de la liste des virements non traites c a d Statut=2
/*describe('/Get virement/ListVirementNonTraites ', () => {
    it('it should get list of transfert non yet validated ', (done) => {
      chai.request(server)
          .get('/virement/ListVirementNonTraites')
          .set({'token':'EWVkyX9tlGFag9uqkMuW7JWiz9UGRfWnHtPQd3EL7cbfopJTKt15xEZc5ul0VkPyycMx3JGgDLT988tQNp1LwkBS0LuZpmSyWcqQpdsYU6W05OcfITrHHoqVLpIxeRWWOcYkcKYcHKdfI7uo0DtAEtrV5Z16Zn8BDf2Qfbxpog7ptRdJWk3tVZqPveYTYYSXzDQdRyb6j2kN9FPXN00wl12vqX9JewEDk7ZXiNCGxffKqhc4ytjsUHUa0TI944p'})
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
  });*/
 