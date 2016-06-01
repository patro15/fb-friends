/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="res.js">	 		</reference>

function show_failure_message() {
	console.log('show_failure_message');
	$('#loading_panel').hide();
	$('#error_panel').show();
}

function show_table() {
	console.log('show_table');
	$('#loading_panel').hide();
	$('#rank_panel').show();
}

function request_for_ranking() {
	console.log('request_for_ranking');
	$.get("/game/results", on_response);
}

function on_response(json, status) {
	console.log('on_response:' + json + '\nstatus: '+status);
	var data = JSON.parse(json);
	if (data != undefined && status == 'success' && data.success) {
		on_success_response(data);
	} else {
		on_failure_response(data, status);
	}
}

function generate_table(data) {
	var table = data.rank.table;
	var vb = $('#rank_table_body');
	vb.empty();
	var cols = ['name', 'date', 'part1Num', 'part2Num', 'correctness'];
	table.forEach((row, i) => {
		let vr = $('<tr></tr>');
		vr.append($('<td></td>').text(i+1));
		cols.forEach((col) => {
			if(col=='correctness') row[col] = (100*row[col]).toFixed(2);
			else if(col=='name') row[col] = from_base64(row[col]);
			let vc = $('<td></td>').text(row[col]);
			vr.append(vc);
		});
		vb.append(vr);
	});
}

function on_success_response(data) {
	console.log('on_success_response');
	generate_table(data);
	show_table();
}

function on_failure_response(data, status) {
	console.log('on_failure_response');
	show_failure_message();
}

function on_load() {			// entry point
	request_for_ranking();
	$('#nav_home').removeClass('active');
	$('#nav_rank').addClass('active');
}

window.onload = on_load;