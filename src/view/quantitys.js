function myFunction(){
	var stdid= document.getElementById("addStudentId").value;
	if(stdid != ""){
	var x=document.getElementById("updStudentId");
	var option= document.createElement("option");
		option.text= stdid;
		x.add(option);
		}
		else{
			alert("Student ID cannot be blank!");
		}
}


pl.view.quantitys.handleSubtypeSelectChangeEvent = function (e) {
  var formEl = e.currentTarget.form,
      subtypeIndexStr = formEl.subtype.value,  // the array index of QuantityTypeEL.names
      subtype=0;
  if (subtypeIndexStr) {
    subtype = parseInt( subtypeIndexStr) + 1;
    switch (subtype) {
    case QuantityTypeEL.MEDICALLABORATORY:
      formEl.department.addEventListener("input", function () {
        formEl.department.setCustomValidity( 
            Quantity.checkDepartment( formEl.department.value).message);
      });
      break;
    }
    pl.view.app.displaySegmentFields( formEl, QuantityTypeEL.names, subtype);
  } else {
    pl.view.app.undisplayAllSegmentFields( formEl, QuantityTypeEL.names);
  }
};
pl.view.quantitys.manage = {
  /**
   * Set up the quantity management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.view.quantitys.manage.exit);
  },
  /**
   * Exit the Manage Quantitys UI page
   * Save the current population of Quantity and generate the population of Person 
   * from Quantity and Quantity
   */
  exit: function () {
    Quantity.saveAll();
    Person.saveAll();
  },
  /**
   * Refresh the Manage Quantitys UI
   */
  refreshUI: function () {
    // show the manage quantity UI and hide the other UIs
    document.getElementById("manageQuantitys").style.display = "block";
    document.getElementById("listQuantitys").style.display = "none";
    document.getElementById("createQuantity").style.display = "none";
    document.getElementById("updateQuantity").style.display = "none";
    document.getElementById("deleteQuantity").style.display = "none";
	document.getElementById("borrowQuantity").style.display = "none";
  }
};
/**********************************************
 * Use case List Quantitys
**********************************************/
pl.view.quantitys.list = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("div#listQuantitys>table>tbody");
    var keys = Object.keys( Quantity.instances);
    var row=null, quantity=null, i=0;
    tableBodyEl.innerHTML = "";
    for (i=0; i < keys.length; i++) {
      quantity = Quantity.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = quantity.personId;
      row.insertCell(-1).textContent = quantity.name;
      row.insertCell(-1).textContent = quantity.quaNo;
	  row.insertCell(-1).textContent = quantity.department; //mhac
      /* if (quantity.subtype) {
        switch (quantity.subtype) {
        case QuantityTypeEL.MEDICALLABORATORY:
          row.insertCell(-1).textContent = "MedicalLaboratory of "+ quantity.department + " department";
          break;
        }
      } */
    }
    document.getElementById("manageQuantitys").style.display = "none";
    document.getElementById("listQuantitys").style.display = "block";
  }
};
/**********************************************
 * Use case Create Quantity
**********************************************/
pl.view.quantitys.create = {
  /**
   * initialize the createQuantityForm
   */
  setupUserInterface: function () {
    var formEl = document.forms['createQuantityForm'],
        typeSelectEl = formEl.subtype,
        submitButton = formEl.commit;
    formEl.personId.addEventListener("input", function () { 
      formEl.personId.setCustomValidity( 
          Person.checkPersonIdAsId( formEl.personId.value, Quantity).message);
    });
    formEl.name.addEventListener("input", function () { 
      formEl.name.setCustomValidity(
          Person.checkName( formEl.name.value).message);
    });
    formEl.quaNo.addEventListener("input", function () { 
      formEl.quaNo.setCustomValidity( 
          Quantity.checkDepartment( formEl.quaNo.value).message);
    });
	
    // set up the quantity type selection list
    util.fillSelectWithOptions( typeSelectEl, QuantityTypeEL.names);
    typeSelectEl.addEventListener("change", 
        pl.view.quantitys.handleSubtypeSelectChangeEvent);
    // set up the submit button
    submitButton.addEventListener("click", function (e) {
      var formEl = document.forms['createQuantityForm'],
          typeStr = formEl.subtype.value;
      var slots = {
          personId: formEl.personId.value, 
          name: formEl.name.value,
          quaNo: formEl.quaNo.value
      };
      if (typeStr) {
        slots.subtype = parseInt( typeStr) + 1;
        switch (slots.subtype) {
        case QuantityTypeEL.MEDICALLABORATORY:
          slots.department = formEl.department.value;
          formEl.department.setCustomValidity( 
              Quantity.checkDepartment( formEl.department.value).message);
          break;
        }
      }
      // check all input fields and provide error messages in case of constraint violations
      formEl.personId.setCustomValidity( 
          Person.checkPersonIdAsId( slots.personId, Quantity).message);
      formEl.name.setCustomValidity( Person.checkName( slots.name).message);
      formEl.quaNo.setCustomValidity( 
          Quantity.checkQuaNo( formEl.quaNo.value).message);
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        Quantity.create( slots);
        formEl.reset();
      }
    });
    document.getElementById("manageQuantitys").style.display = "none";
    document.getElementById("createQuantity").style.display = "block";
    formEl.reset();
	
	
  }
};

/**********************************************
 * Use case Update Quantity
**********************************************/
pl.view.quantitys.update = {
  /**
   * initialize the update quantitys UI/form
   */
  setupUserInterface: function () {
    var formEl = document.forms['updateQuantityForm'],
        submitButton = formEl.commit,
        typeSelectEl = formEl.subtype,
        quantitySelectEl = formEl.selectQuantity;
    // set up the quantity selection list
    util.fillAssocListWidgetSelectWithOptions( quantitySelectEl, Quantity.instances, 
        "personId", {displayProp:"name"});
    quantitySelectEl.addEventListener("change", 
        pl.view.quantitys.update.handleQuantitySelectChangeEvent);
    // validate constraints on new user input
    formEl.name.addEventListener("input", function () { 
      formEl.name.setCustomValidity(
          Person.checkName( formEl.name.value).message);
      });
    formEl.quaNo.addEventListener("input", function () { 
      formEl.quaNo.setCustomValidity( 
          Quantity.checkQuaNo( formEl.quaNo.value).message);
      });
    // set up the quantity type selection list
    util.fillSelectWithOptions( typeSelectEl, QuantityTypeEL.names);
    typeSelectEl.addEventListener("change", 
    		pl.view.quantitys.handleSubtypeSelectChangeEvent);
    // set up the submit button
    submitButton.addEventListener("click", function (e) {
      var formEl = document.forms['updateQuantityForm'],
          typeStr = formEl.subtype.value;
      var slots = {
          personId: formEl.personId.value, 
          name: formEl.name.value,
          quaNo: parseInt( formEl.quaNo.value)
      };
      if (typeStr) {
        slots.subtype = parseInt( typeStr) + 1;
        switch (slots.subtype) {
        case QuantityTypeEL.MEDICALLABORATORY:
          slots.department = formEl.department.value;
          formEl.department.setCustomValidity( 
              Quantity.checkDepartment( formEl.department.value).message);
          break;
        }
      }
      // check all relevant input fields and provide error messages 
      // in case of constraint violations
      formEl.name.setCustomValidity( Person.checkName( slots.name).message);
      formEl.quaNo.setCustomValidity( 
          Quantity.checkQuaNo( formEl.quaNo.value).message);
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        Quantity.update( slots);
        formEl.reset();
      }
    });
    document.getElementById("manageQuantitys").style.display = "none";
    document.getElementById("updateQuantity").style.display = "block";
    formEl.reset();
  },
  /**
   * handle quantity selection events
   * on selection, populate the form with the data of the selected quantity
   */
  handleQuantitySelectChangeEvent: function () {
    var formEl = document.forms['updateQuantityForm'];
    var key="", qua=null;
    key = formEl.selectQuantity.value;
    if (key !== "") {
      qua = Quantity.instances[key];
      formEl.personId.value = qua.personId;
      formEl.name.value = qua.name;
      formEl.quaNo.value = qua.quaNo;
      if (qua.subtype) {
        formEl.subtype.selectedIndex = parseInt( qua.subtype);
        pl.view.app.displaySegmentFields( formEl, QuantityTypeEL.names, qua.subtype);
        switch (qua.subtype) {
        case QuantityTypeEL.MEDICALLABORATORY:
          formEl.department.value = qua.department;
          break;
        }
      } else {  // no qua.subtype
        formEl.subtype.value = "";
        formEl.department.value = ""; 
        pl.view.app.undisplayAllSegmentFields( formEl, QuantityTypeEL.names);
      }
    } else {
      formEl.personId.value = "";
      formEl.name.value = "";
      formEl.quaNo.value = "";
    }
  }
};
/**********************************************
 * Use case Delete Quantity
**********************************************/
pl.view.quantitys.destroy = {
  /**
   * initialize the deleteQuantityForm
   */
  setupUserInterface: function () {
    var formEl = document.forms['deleteQuantityForm'],
        deleteButton = formEl.commit,
        quantitySelectEl = formEl.selectQuantity;
    var msgAddendum="";
    // set up the quantity selection list
    util.fillAssocListWidgetSelectWithOptions( quantitySelectEl, Quantity.instances, 
        "personId", {displayProp:"name"});
    deleteButton.addEventListener("click", function () {
        var formEl = document.forms['deleteQuantityForm'],
            personIdRef = formEl.selectQuantity.value;
        if (confirm("Do you really want to delete this quantity"+ msgAddendum +"?")) {
          Quantity.destroy( personIdRef);
          formEl.selectQuantity.remove( formEl.selectQuantity.selectedIndex);
          formEl.reset();
        };
    });
    document.getElementById("manageQuantitys").style.display = "none";
    document.getElementById("deleteQuantity").style.display = "block";
  }
};


/**********************************************
 * Use case Borrow Quantity
**********************************************/
pl.view.quantitys.borrow = { //mhac
  /**
   * initialize the borrow quantitys UI/form
   */
  setupUserInterface: function () {
    var formEl = document.forms['borrowQuantityForm'],
        submitButton = formEl.commit,
        typeSelectEl = formEl.subtype,
        quantitySelectEl = formEl.selectQuantity;
    // set up the quantity selection list
    util.fillAssocListWidgetSelectWithOptions( quantitySelectEl, Quantity.instances, 
        "personId", {displayProp:"name"});
    quantitySelectEl.addEventListener("change", 
        pl.view.quantitys.borrow.handleQuantitySelectChangeEvent);
    // validate constraints on new user input
    formEl.name.addEventListener("input", function () { 
      formEl.name.setCustomValidity(
          Person.checkName( formEl.name.value).message);
      });
    formEl.quaNo.addEventListener("input", function () { 
      formEl.quaNo.setCustomValidity( 
          Quantity.checkQuaNo( formEl.quaNo.value).message);
      });
    // set up the quantity type selection list
    util.fillSelectWithOptions( typeSelectEl, QuantityTypeEL.names);
    typeSelectEl.addEventListener("change", 
    		pl.view.quantitys.handleSubtypeSelectChangeEvent);
    // set up the submit button
    submitButton.addEventListener("click", function (e) {
      var formEl = document.forms['borrowQuantityForm'],
          typeStr = formEl.subtype.value;
      var slots = {
          personId: formEl.personId.value, 
          name: formEl.name.value,
          quaNo: parseInt( formEl.quaNo.value)
      };
      if (typeStr) {
        slots.subtype = parseInt( typeStr) + 1;
        switch (slots.subtype) {
        case QuantityTypeEL.MEDICALLABORATORY:
          slots.department = formEl.department.value;
          formEl.department.setCustomValidity( 
              Quantity.checkDepartment( formEl.department.value).message);
          break;
        }
      }
      // check all relevant input fields and provide error messages 
      // in case of constraint violations
      formEl.name.setCustomValidity( Person.checkName( slots.name).message);
      formEl.quaNo.setCustomValidity( 
          Quantity.checkQuaNo( formEl.quaNo.value).message);
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        Quantity.borrow( slots);
        formEl.reset();
      }
    });
    document.getElementById("manageQuantitys").style.display = "none";
    document.getElementById("borrowQuantity").style.display = "block";
    formEl.reset();
  },
  /**
   * handle quantity selection events
   * on selection, populate the form with the data of the selected quantity
   */
  handleQuantitySelectChangeEvent: function () {
    var formEl = document.forms['borrowQuantityForm'];
    var key="", qua=null;
    key = formEl.selectQuantity.value;
    if (key !== "") {
      qua = Quantity.instances[key];
      formEl.personId.value = qua.personId;
      formEl.name.value = qua.name;
      formEl.quaNo.value = qua.quaNo;
      if (qua.subtype) {
        formEl.subtype.selectedIndex = parseInt( qua.subtype);
        pl.view.app.displaySegmentFields( formEl, QuantityTypeEL.names, qua.subtype);
        switch (qua.subtype) {
        case QuantityTypeEL.MEDICALLABORATORY:
          formEl.department.value = qua.department;
          break;
        }
      } else {  // no qua.subtype
        formEl.subtype.value = "";
        formEl.department.value = ""; 
        pl.view.app.undisplayAllSegmentFields( formEl, QuantityTypeEL.names);
      }
    } else {
      formEl.personId.value = "";
      formEl.name.value = "";
      formEl.quaNo.value = "";
    }
  }
};

