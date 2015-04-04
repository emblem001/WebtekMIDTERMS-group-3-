pl.view.app = {
undisplayAllSegmentFields: function (domNode, segmentNames) {
    var i=0, k=0, fields=[];
    if (!domNode) domNode = document;  // normally invoked for a form element
    for (k=0; k < segmentNames.length; k++) {
      fields = domNode.getElementsByClassName( segmentNames[k]);
      for (i=0; i < fields.length; i++) {
        fields[i].style.display = "none";
      }
    }
  },
 displaySegmentFields: function (domNode, segmentNames, segmentIndex) {
    var i=0, k=0, fields=[];
    if (!domNode) domNode = document;  // normally invoked for a form element
    for (k=0; k < segmentNames.length; k++) {
      fields = domNode.getElementsByClassName( segmentNames[k]);
      for (i=0; i < fields.length; i++) {
        fields[i].style.display = (k === segmentIndex-1) ? "block":"none";
      }
    }
  }
};
