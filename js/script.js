
var db = prepareDatabase();
        var createSQL = 'CREATE TABLE IF NOT EXISTS tTravel (' +
                'id INTEGER PRIMARY KEY,' +
                'traveler TEXT,' +
                'destination INTEGER,' +
                'transportation INTEGER' +
            ')';

        // Check if this browser supports Web SQL
        function getOpenDatabase() {
            try {
                if( !! window.openDatabase ) return window.openDatabase;
                else return undefined;
            } catch(e) {
                return undefined;
            }
        }

        // Open the Web SQL database
        function prepareDatabase() {
            var odb = getOpenDatabase();
            if(!odb) {
                dispError('Web SQL Not Supported');
                return undefined;
            } else {
                var db = odb( 'testDatabase', '1.0', 'A Test Database', 10 * 1024 * 1024 );
                db.transaction(function (t) {
                    t.executeSql( createSQL, [], function(t, r) {}, function(t, e) {
                        alert('create table: ' + e.message);
                    });
                });
                return db;
            }
        }

        // How many rows do we have?
        function countRows() {
            if(!db) return;
            db.readTransaction(function (t) {
                t.executeSql('SELECT COUNT(*) AS c FROM tTravel', [], function (t, r) {
                    var c = r.rows.item(0).c;
                    element('rowCount').innerHTML = c ? c : 0;
                }, function(t, e) {
                    alert('countRows: ' + e.message);
                });
            });
        }

        // Create the Edit and Delete buttons for a row
        function rowButtons( id, traveler ) {
            return '<form><input type="button" value="Edit" onClick="javascript:editGo(' + id + ')"/>' +
                '<input type="button" value="Delete" onClick="javascript:deleteGo(' + id + ', &quot;' + traveler + '&quot;)"/></form>';
        }

        // Main display function
        function dispResults() {
            if(errorMessage) {
                element('results').innerHTML = errorMessage;
                return;
            }

            countRows();    // update the row count each time the display is refreshed

            if(db) {
                db.readTransaction(function(t) {    // readTransaction sets the database to read-only
                    t.executeSql('SELECT * FROM tTravel ORDER BY LOWER(traveler)', [], function(t, r) {
                        var bwt = new bwTable();
                        bwt.setHeader(['Name', 'Quantity', 'ID', '']);
                        for( var i = 0; i < r.rows.length; i++ ) {
                            var row = r.rows.item(i);
                            bwt.addRow([row.traveler, row.destination, row.transportation, rowButtons(row.id, row.traveler)]);
                        }
                        element('results').innerHTML = bwt.getTableHTML();
                        element('travelForm').elements['traveler'].focus();
                    });
                });
            }
        }

        // add or update rows in the table
        function dbGo() {
            if(errorMessage) return;
            var f = element('travelForm');
            var action = f.elements['inputAction'].value;
            var traveler = f.elements['traveler'].value;
            var destination = f.elements['destination'].value;
            var transportation = f.elements['transportation'].value;
            var key = f.elements['key'].value;

            switch(action) {
            case 'add': 
                if(! (traveler || destination || transportation)) break;
                db.transaction( function(t) {
                    t.executeSql(' INSERT INTO tTravel ( traveler, destination, transportation ) VALUES ( ?, ?, ? ) ',
                        [ traveler, destination, transportation ]
                    );
                }, function(t, e){ alert('Insert row: ' + e.message); }, function() {
                    resetTravelForm();
                });
                break;
            case 'update':
                if(! (traveler || destination || transportation)) break;
                db.transaction( function(t) {
                    t.executeSql(' UPDATE tTravel SET traveler = ?, destination = ?, transportation = ? WHERE id = ?',
                        [ traveler, destination, transportation, key ]
                    );
                }, function(t, e){ alert('Update row: ' + e.message); }, function() {
                    resetTravelForm();
                });
                break;
            }
            dispResults();
        }

        // update the edited row
        function editGo(id) {
            db.readTransaction(function(t) {
                t.executeSql('SELECT * FROM tTravel WHERE id = ?', [id], function(t, r) {
                    var row = r.rows.item(0);
                    if(row) {
                        var f = element('travelForm');
                        f.elements['traveler'].value = row.traveler;
                        f.elements['destination'].value = row.destination;
                        f.elements['transportation'].value = row.transportation;
                        f.elements['goButton'].value = 'Update';
                        f.elements['inputAction'].value = 'update';
                        f.elements['key'].value = row.id;
                        f.elements['traveler'].focus();
                        f.elements['traveler'].select();
                    }
                });
            });
        }

        // confirm and delete a row
        function deleteGo(id, traveler) {
            if(confirm('Delete ' + traveler + ' (ID: ' + id + ')?')) {
                db.transaction(function(t) {
                    t.executeSql('DELETE FROM tTravel WHERE id = ?', [id]);
                });
                resetTravelForm();
                dispResults();
            }
        }

        // clear all the form fields and reset the button and action elements
        function resetTravelForm() {
            var f = element('travelForm');
            for( var n in [ 'traveler', 'destination', 'transportation', 'key' ] ) {
                f.elements[n].value = '';
            }
            f.elements['inputAction'].value = 'add';
            f.elements['goButton'].value = 'Add';
        }

        // delete all the rows in the table
        function clearDB() {
            if(confirm('Clear the entire table?')) {
                db.transaction(function(t) {
                    t.executeSql('DELETE FROM tTravel');
                });
                dispResults();
            }
        }

        function initDisp() {
            dispResults();
        }

        window.onload = function() {
            initDisp();
        }



// useful for finding elements
var element = function(id) { return document.getElementById(id); }
var errorMessage = undefined;

function getOpenDatabase() {
    try {
        if( !! window.openDatabase ) return window.openDatabase;
        else return undefined;
    } catch(e) {
        return undefined;
    }
}

function getLocalStorage() {
    try {
        if( !! window.localStorage ) return window.localStorage;
        else return undefined;
    } catch(e) {
        return undefined;
    }
}

function getSessionStorage() {
    try {
        if( !! window.sessionStorage ) return window.sessionStorage;
        else return undefined;
    } catch(e) {
        return undefined;
    }
}

function dispError( message ) {
    errorMessage = '<p class="error">' + message + '</p>';
    haveError = true;
}


function bwTable( wrap ) {
    this.wrap = ( wrap == undefined ) ? true : wrap;    // default to true
    this.rows = new Array();
    this.header = [];

    this.setHeader = function( row ) {
        this.header = row;
    }

    this.addRow = function( row ) {
        this.rows.push(row);
    }

    this.getRow = function ( index ) {
        return this.rows[index];
    }

    this.countRows = function () {
        return this.rows.length;
    }

    this.getTableHTML = function () {
        var a = '';
        if(this.wrap) a += '<table class="bwTable">\n';
        a += this.getHeaderHTML();
        for(var row in this.rows) {
            a += this.getRowHTML(this.rows[row]);
        }
        if(this.wrap) a += '</table>\n';
        return a;
    }

    this.getHeaderHTML = function () {
        if( this.header.length == 0 ) return '';
        var a = '<tr>';
        for( var cell in this.header ) {
            a += '<th>' + this.header[cell] + '</th>';
        }
        a += '</tr>\n';
        return a;
    }

    this.getRowHTML = function (row ) {
        var a = '<tr>';
        for( var cell in row ) {
            var v= row[cell];
            if(v == null) v = '<span class="red">NULL</span>';
            a += '<td>' + v + '</td>';
        }
        a += '</tr>\n';
        return a;
    }

    this.writeTable = function () {
        document.write(this.getTableHTML());
    }

}

