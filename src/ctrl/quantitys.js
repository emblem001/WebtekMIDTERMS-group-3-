pl.ctrl.quantitys.manage = {
  initialize: function () {
    Quantity.loadAll();
    pl.view.quantitys.manage.setupUserInterface();
  }
};