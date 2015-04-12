
function myCanvas() {
    var c = document.getElementById("myCanvas");
    var ctx1 = c.getContext("2d");
	var ctx2 = c.getContext("2d");
	var ctx3 = c.getContext("2d");
	var ctx4 = c.getContext("2d");
	var ctx5 = c.getContext("2d");
	var ctx6 = c.getContext("2d");
    var img1 = document.getElementById("i1");
    var img2 = document.getElementById("i2");
	var img3 = document.getElementById("i3");
	var img4 = document.getElementById("i4");
	var img5 = document.getElementById("i5");
	var img6 = document.getElementById("i6");
	ctx1.drawImage(img1,10,10);
	ctx2.drawImage(img2,220,10);
	ctx3.drawImage(img3,430,10);
	ctx4.drawImage(img4,640,10);
	ctx5.drawImage(img5,850,10);
	ctx6.drawImage(img6,1060,10);
}

