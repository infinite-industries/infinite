const uuidv4 = require('uuid/v4');

const Venue = function(init_obj){

  //required attributes
  // this.id = uuidv4();
  this.name = init_obj.name;
  this.slug = this.name.toLowerCase().replace(/ /g,"-");

  if(init_obj.hasOwnProperty('address')){
    this.address = init_obj.address;
  }
  if(init_obj.hasOwnProperty('city')){
    this.address = this.address || '';
    this.address += (', ' + init_obj.city);
  }
  if(init_obj.hasOwnProperty('zip')){
    this.address = this.address || '';
    this.address += (', ' + init_obj.zip);
  }

  if(init_obj.hasOwnProperty('neighborhood')){
    // TODO: need to add this column to the database, for now including in address
    this.neighborhood = init_obj.neighborhood;
    this.address = this.address || '';
    this.address += (', ' + init_obj.neighborhood);
  }

  if(init_obj.hasOwnProperty('google_maps_link')){
    this.g_map_link = init_obj.google_maps_link;
  }

  this.verified = false;
}


module.exports = Venue;
