var dotenv = require('dotenv');
const frisby = require('frisby');
const Joi = frisby.Joi;

it('should have basic index page', function (done) {
  frisby.get('http://localhost:3003')
    .expect('status', 200)
    .done(done);
});


it('should return json descriptor for artwork entity by id', function(done){
  frisby.get('http://localhost:3003/artworks/cc432195-2a2c-49e4-9a55-32d9f10dcc97')
    .expect('status', 200)
    .then(function(response){
      expect(response._body.status).toBe('success');
      //expect(response._body.artwork.title).toBe("billy")

      Joi.assert(response._body.artwork.title, Joi.string());
      Joi.assert(response._body.artwork.id, Joi.string());
    })

    .done(done);
});

it('should holler back with error if wrong artwork id is used', function(done){
  frisby.get('http://localhost:3003/artworks/xyz')
    .expect('status', 404)  //Should this be an actuall 500 or not?
    .then(function(response){
      expect(response._body.status).toBe('no_such_id');
    })
    .done(done);
});
