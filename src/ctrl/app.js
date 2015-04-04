var pl = {
    model: {}, 
    view: { books:{}, authors:{}, quantitys:{}},
    ctrl: { books:{}, authors:{}, quantitys:{}}
};
pl.ctrl.app = {
  initialize: function() {
  },
  createTestData: function() {
    try {
      Book.instances["0553345842"] = new Book({isbn:"0553345842", title:"The Mind's I", year:1982});
      Book.instances["1463794762"] = new Book({isbn:"1463794762", title:"The Critique of Pure Reason", 
        year:2011});
      Book.instances["1928565379"] = new Book({isbn:"1928565379", title:"The Critique of Practical Reason", 
        year:2009, subtype:BookTypeEL.TEXTBOOK, subjectArea:"Philosophy"});
      Book.instances["3498024914"] = new Book({isbn:"3498024914", title:"Kants Welt", 
        year:2003, subtype:BookTypeEL.BIOGRAPHY, about:"Immanuel Kant"});
      Book.saveAll();
      Quantity.instances["1001"] = new Quantity({personId:1001, name:"Gerd Wagner", quaNo:21035});
      Quantity.instances["1002"] = new Quantity({personId:1002, name:"Tom Boss", quaNo:23107, 
          subtype:QuantityTypeEL.MEDICALLABORATORY, department:"Faculty 1"});
      Quantity.saveAll();
      Author.instances["1001"] = new Author({personId:1001, name:"Gerd Wagner", biography:"Born in ..."});
      Author.instances["1077"] = new Author({personId:1077, name:"Immanuel Kant", biography:"Kant was ..."});
      Author.saveAll();
      Person.saveAll();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message);
    }
  },
  clearData: function() {
    try {
      Quantity.instances = {};
      localStorage["quantitys"] = JSON.stringify({});
      Author.instances = {};
      localStorage["authors"] = JSON.stringify({});
      Book.instances = {};
      localStorage["books"] = JSON.stringify({});
      console.log("All data cleared.");
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message);
    }
  }
};
