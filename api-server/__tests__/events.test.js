const frisby = require('frisby');
const Joi = frisby.Joi;

const route_name = 'events';
const singular_route_name = 'event';
const id = 'dd7e4996-70b2-46ef-93b1-a92b713129eb';
const collection_length = 6;

it('should return json descriptor for ' + route_name + ' entity by id', function(done){
    frisby.get('http://localhost:3003/' + route_name + '/' + id)
        .expect('status', 200)
        .then(function(response){
            expect(response._body.status).toBe('success');

            Joi.assert(response._body[singular_route_name].title, Joi.string());
            Joi.assert(response._body[singular_route_name].id, Joi.string());
        })

        .done(done);
});

it('should return all ' + route_name + ' for /' + route_name + ' path', function(done){
    frisby.get('http://localhost:3003/' + route_name + '/')
        .expect('status', 200)
        .then(function(response){
            expect(response._body.status).toBe('success');
            expect(response._body[route_name].length).toBe(collection_length);
        })

        .done(done);
});

it('should holler back with error if wrong ' + singular_route_name + ' id is used', function(done){
    frisby.get('http://localhost:3003/' + route_name + '/xyz')
        .expect('status', 404)  //Should this be an actuall 500 or not?
        .then(function(response){
            expect(response._body.status).toBe('no_such_id');
        })
        .done(done);
});
