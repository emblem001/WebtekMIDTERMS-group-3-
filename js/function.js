$(function(){
	var operation = "A"; //"A"=Adding; "E"=Editing

	var selected_index = -1; //Index of the selected list item

	var tbClients = localStorage.getItem("tbClients");//Retrieve the stored data

	tbClients = JSON.parse(tbClients); //Converts string to object

	if(tbClients == null) //If there is no data, initialize an empty array
		tbClients = [];

	function Add(){
		var client = JSON.stringify({
			StudentName    : $("#txtStudentName").val(),
			ApparatusName  : $("#txtApparatusName").val(),
			Qty    : $("#txtQty").val(),
		});
		tbClients.push(client);
		localStorage.setItem("tbClients", JSON.stringify(tbClients));
		alert("The data was saved.");
		return true;
	}

	function Edit(){
		tbClients[selected_index] = JSON.stringify({
			StudentName    : $("#txtStudentName").val(),
			ApparatusName  : $("#txtApparatusName").val(),
			Qty    : $("#txtQty").val(),
		});//Alter the selected item on the table
		localStorage.setItem("tbClients", JSON.stringify(tbClients));
		alert("The data was edited.")
		operation = "A"; //Return to default value
		return true;
	}

	function Delete(){
		tbClients.splice(selected_index, 1);
		localStorage.setItem("tbClients", JSON.stringify(tbClients));
		alert("Client deleted.");
	}

	function List(){		
		$("#tblList").html("");
		$("#tblList").html(
			"<thead>"+
			"	<tr>"+
			"	<th></th>"+
			"	<th>StudentName</th>"+
			"	<th>ApparatusName</th>"+
			"	<th>Qty</th>"+
			"	</tr>"+
			"</thead>"+
			"<tbody>"+
			"</tbody>"
			);
		for(var i in tbClients){
			var cli = JSON.parse(tbClients[i]);
		  	$("#tblList tbody").append("<tr>"+
									 	 "	<td><img src='img/edit.png' alt='Edit"+i+"' class='btnEdit'/><img src='img/delete.png' alt='Delete"+i+"' class='btnDelete'/></td>" + 
										 "	<td>"+cli.StudentName+"</td>" + 
										 "	<td>"+cli.ApparatusName+"</td>" +
										 "	<td>"+cli.Qty+"</td>" + 										 
		  								 "</tr>");
		}
	}

	$("#frmCadastre").bind("submit",function(){		
		if(operation == "A")
			return Add();
		else
			return Edit();
	});

	List();

	$(".btnEdit").bind("click", function(){

		operation = "E";
		selected_index = parseInt($(this).attr("alt").replace("Edit", ""));
		
		var cli = JSON.parse(tbClients[selected_index]);
		$("#txtStudentName").val(cli.StudentName);	
		$("#txtApparatusName").val(cli.ApparatusName);
		$("#txtQty").val(cli.Qty);
		
		$("#txtStudentName").focus();
		$("#txtApparatusName").focus();
		$("#txtQty").focus();
	});

	$(".btnDelete").bind("click", function(){
		selected_index = parseInt($(this).attr("alt").replace("Delete", ""));
		Delete();
		List();
	});
});


function toggle_visibility(id) {
			       var e = document.getElementById(id);
			       if(e.style.display == 'block')
			          e.style.display = 'none';
			       else
			          e.style.display = 'block';
}