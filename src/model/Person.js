PersonTypeEL = Object.defineProperties( {}, {
	QUANTITY: {value: 1, writable: false},
	AUTHOR: {value: 2, writable: false},
    MAX: {value: 2, writable: false},
    names: {value:["Quantity","Author"], writable: false}
});
// ***********************************************
// *** Constructor with property definitions ****
// ***********************************************
function Person( slots) {
  this.personId = 0;        // Number (Integer)
  this.name = "";           // String

  // constructor invocation with arguments
  if (arguments.length > 0) {
    this.setPersonId( slots.personId);
    this.setName( slots.name);
  }
};
// ***********************************************
// *** Checks and Setters ************************
// ***********************************************
Person.checkPersonId = function (id) {
  if (id === undefined) {  // this is okay, as we just check the syntax
    return new NoConstraintViolation();
  } else {
    // convert to integer in case of string
    id = parseInt( id);
    if (isNaN( id) || !util.isPositiveInteger( id)) {
      return new RangeConstraintViolation("The author ID must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
Person.checkPersonIdAsId = function (id, personOrSubclass) {
  var constraintViolation=null;
  id = parseInt( id);  // convert to integer in case of a string
  if (isNaN( id)) {
	  constraintViolation = new MandatoryValueConstraintViolation(
        "A value for the person ID is required!");
  } else {
    constraintViolation = Person.checkPersonId( id);
    if ((constraintViolation instanceof NoConstraintViolation)) {
      if (personOrSubclass.instances[String(id)]) {  // convert id to string if number
        constraintViolation = new UniquenessConstraintViolation(
            'There is already a '+ personOrSubclass.name +' record with this person ID!');
      }     	      	  
    }
  }
  return constraintViolation;
};
Person.prototype.setPersonId = function (id) {
  var constraintViolation = null;
  // this.constructor may be Person or any subtype of it
  constraintViolation = Person.checkPersonIdAsId( id, this.constructor);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.personId = parseInt( id);
  } else {
    throw constraintViolation;
  }
};
Person.checkName = function (n) {
  if (!n) {
    return new MandatoryValueConstraintViolation("A name must be provided!");
  } else if (typeof(n) !== "string" || n.trim() === "") {
    return new RangeConstraintViolation("The name must be a non-quaty string!");
  } else {
    return new NoConstraintViolation();
  }
};
Person.prototype.setName = function (n) {
  var constraintViolation = Person.checkName( n);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.name = n;
  } else {
    throw constraintViolation;
  }
};

/**
 *  Save all person objects in a JSON table
 *  by extracting their data from the Person subclasses Quantity and Author
 */
Person.saveAll = function () {
  var key="", keys=[], persons={}, i=0, n=0;
  keys = Object.keys( Quantity.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    qua = Quantity.instances[key];
    persons[key] = {personId: qua.personId, name:qua.name};
  }
  keys = Object.keys( Author.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    if (!persons[key]) {
      author = Author.instances[key];
      persons[key] = {personId: author.personId, name: author.name};    	
    }
  }
  try {
    localStorage["persons"] = JSON.stringify( persons);
    n = Object.keys( persons).length;
    console.log( n +" persons saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
