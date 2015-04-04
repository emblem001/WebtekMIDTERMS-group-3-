QuantityTypeEL = Object.defineProperties( {}, {
    MEDICALLABORATORY: { value: 1, writable: false},
    MAX: { value: 1, writable: false},
    names: {value:["MedicalLaboratory"], writable: false}
});
function Quantity( slots) {
  // set the default values for the parameter-free default constructor
  Person.call( this);  // invoke the default constructor of the supertype
  this.quaNo = 0;      // Number (PositiveInteger)
/*
  this.subtype            // Number? {from QuantityTypeEL}
  this.department      // String?
 */
  // constructor invocation with arguments
  if (arguments.length > 0) {
    Person.call( this, slots);  // invoke the constructor of the supertype
    this.setQuaNo( slots.quaNo);
    if (slots.subtype) this.setSubtype( slots.subtype);
    if (slots.department) this.setDepartment( slots.department);
  }
};
Quantity.prototype = Object.create( Person.prototype);  // inherit from Person
Quantity.prototype.constructor = Quantity;  // adjust the constructor property

// ***********************************************
// *** Class-level ("static") properties *********
// ***********************************************
Quantity.instances = {};

// ***********************************************
// *** Checks and Setters ************************
// ***********************************************
/**
 * @method 
 * @static
 * @param {number} n - The quantity number.
 */
Quantity.checkQuaNo = function (n) {
  // convert to integer in case of a string
  n = parseInt( n);
  if (isNaN( n)) {
    return new MandatoryValueConstraintViolation(
        "A value for the quantity number is required!");
  } else if (!util.isPositiveInteger( n)) {
    return new RangeConstraintViolation("The quantity number must be a positive integer!");
  } else if (false) {  // TODO
    return new UniquenessConstraintViolation(
        "There is already a Quantity record with this quantity number!");
  } else {
    return new NoConstraintViolation();
  }
};
/**
 * @method 
 * @param {number} n - The quantity number.
 */
Quantity.prototype.setQuaNo = function (n) {
  var constraintViolation = Quantity.checkQuaNo( n);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.quaNo = parseInt( n);
  } else {
    throw constraintViolation;
  }
};
/**
 * Check if the given value represents a subtype as defined by QuantityTypeEL
 * @method 
 * @static
 * @param {number} t - The subtype of an quantity.
 */
Quantity.checkSubtype = function (t) {
  if (!t) {
    return new NoConstraintViolation();
  } else {
    if (!util.isInteger( t) || t < 1 || t > QuantityTypeEL.MAX) {
      return new RangeConstraintViolation(
          "The value of subtype must represent an quantity type!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
/**
 * @method 
 * @param {number} t - The subtype of an quantity.
 */
Quantity.prototype.setSubtype = function (t) {
  var constraintViolation = null;
  if (this.subtype) {  // already set/assigned
    constraintViolation = new FrozenValueConstraintViolation("The subtype cannot be changed!");
  } else {
    t = parseInt( t);
    constraintViolation = Quantity.checkSubtype( t);
  }
  if (constraintViolation instanceof NoConstraintViolation) {
    this.subtype = t;
  } else {
    throw constraintViolation;
  }
};
/**
 * Check if the attribute "department" applies to the given subtype of book
 * and if the value for it is admissible
 * @method 
 * @static
 * @param {string} d - The department of a manager.
 * @param {number} t - The subtype of an quantity.
 */
Quantity.checkDepartment = function (d,t) {
  if (t === undefined) t = QuantityTypeEL.MEDICALLABORATORY;
  if (t === QuantityTypeEL.MEDICALLABORATORY && !d) {
    return new MandatoryValueConstraintViolation(
        "A department must be provided for a manager!");
  } else if (t !== QuantityTypeEL.MEDICALLABORATORY && d) {
    return new OtherConstraintViolation(
        "A department must not be provided if the quantity is not a manager!");
  } else if (d && (typeof(d) !== "string" || d.trim() === "")) {
    return new RangeConstraintViolation(
        "The department must be a non-quaty string!");
  } else {
    return new NoConstraintViolation();
  }
};
/**
 * @method 
 * @param {string} d - The department of a manager.
 */
Quantity.prototype.setDepartment = function (d) {
  var constraintViolation = Quantity.checkDepartment( d, this.subtype);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.department = d;
  } else {
    throw constraintViolation;
  }
};
// ***********************************************
// *** Other Instance-Level Methods **************
// ***********************************************
/**
 * Serialize Quantity object
 * @method 
 */
Quantity.prototype.toString = function () {
  return "Quantity{ persID: " + this.personId +", name: " + this.name +", quaNo:" + this.quaNo +"}";
};
/**
 * Convert Quantity object to row
 * @method 
 * @returns {{personId: string, name: string, quaNo: number}}
 */
Quantity.prototype.convertObj2Row = function () {
  var row = util.cloneObject(this);
  return row; 
};
// *****************************************************
// *** Class-level ("static") methods ***
// *****************************************************
/**
 * Create a new Quantity row
 * @method 
 * @static
 * @param {{personId: string, name: string, quaNo: number}} slots - A record of parameters.
 */
Quantity.create = function (slots) {
  var qua = null;
  try {
	  qua = new Quantity( slots);
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    qua = null;
  }
  if (qua) {
    Quantity.instances[qua.personId] = qua;
    console.log( Quantity.toString() + " created!");
  }
};
/**
 * Update an existing Quantity row
 * @method 
 * @static
 * @param {{personId: string, name: string, quaNo: number}} slots - A record of parameters.
 */
Quantity.update = function (slots) {
  var qua = Quantity.instances[slots.personId],
      noConstraintViolated = true,
      ending = "",
      updatedProperties = [],
      // save the current state of book
      objectBeforeUpdate = util.cloneObject( qua);
  try {
    if ("name" in slots && qua.name !== slots.name) {
    	qua.setName( slots.name);
        updatedProperties.push("name");
    }
    if ("quaNo" in slots && qua.quaNo !== slots.quaNo) {
      qua.setQuaNo( slots.quaNo);
      updatedProperties.push("quaNo");
    }
    if ("subtype" in slots && "subtype" in qua && qua.subtype !== slots.subtype ||
    		"subtype" in slots && !("subtype" in qua)) {
      qua.setSubtype( slots.subtype);
      updatedProperties.push("subtype");
    } else if (!("subtype" in slots) && "subtype" in qua) {
      delete qua.subtype;  // drop subtype slot
      delete qua.department;  
      updatedProperties.push("subtype");
    }
    if ("department" in slots && qua.department !== slots.department) {
  	  qua.setDepartment( slots.department);
      updatedProperties.push("department");
    }
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    Quantity.instances[slots.personId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log("Propert"+ending+" " + updatedProperties.toString() + 
          " modified for Quantity " + qua.name);
    } else {
      console.log("No property value changed for Quantity " + qua.name + " !");
    }
  }
};
/**
 * Delete an existing Quantity row
 * @method 
 * @static
 * @param {string} personId - The ID of a person.
 */
Quantity.destroy = function (personId) {
  var name = Quantity.instances[personId].name;
  delete Quantity.instances[personId];
  console.log("Quantity " + name + " deleted.");
};
/**
 * Load all Quantity rows and convert them to objects
 * @method 
 * @static
 */
Quantity.loadAll = function () {
  var key="", keys=[], persons={}, quantitys={}, quantityRow={}, i=0;
  if (!localStorage["quantitys"]) {
    localStorage.setItem("quantitys", JSON.stringify({}));
  }  
  try {
    persons = JSON.parse( localStorage["persons"]);
    quantitys = JSON.parse( localStorage["quantitys"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);        
  }
  keys = Object.keys( quantitys);
  console.log( keys.length +" quantitys loaded.");
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    quantityRow = quantitys[key];
    // complete record by adding slots ("name") from supertable
    quantityRow.name = persons[key].name;
    Quantity.instances[key] = Quantity.convertRow2Obj( quantityRow);
  }
};
/**
 * Convert Quantity row to Quantity object
 * @method 
 * @static
 * @param {{personId: string, name: string, quaNo: number}} slots - A record of parameters.
 * @returns {object}
 */
Quantity.convertRow2Obj = function (slots) {
  var qua={};
  try {
    qua = new Quantity( slots);
  } catch (e) {
    console.log( e.constructor.name + " while deserializing a Quantity row: " + e.message);
    qua = null;
  }
  return qua;
};
/**
 * Save all Quantity objects as rows
 * @method 
 * @static
 */
Quantity.saveAll = function () {
  var key="", quantitys={}, qua={}, quaRow={}, i=0;  
  var keys = Object.keys( Quantity.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    qua = Quantity.instances[key];
    quaRow = qua.convertObj2Row();
    // remove "name" slot as a supertype slot
    delete quaRow.name;
    quantitys[key] = quaRow;
  }
  try {
    localStorage["quantitys"] = JSON.stringify( quantitys);
    console.log( keys.length +" quantitys saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
