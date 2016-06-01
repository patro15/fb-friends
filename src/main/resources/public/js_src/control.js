/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <reference path="init.js">	 		</reference>
/// <reference path="load.js">	 		</reference>
/// <reference path="fb_load.js"> 		</reference>
/// <references path="control.js"> 		</reference>
/// <reference path="rest_api.js">	 	</reference>
/// <reference path="game.js">	 		</reference>

var timer = null;

function start_new_timer(fun) {
	stop_timer();
	timer = setInterval(() => {
		if (!fun()) stop_timer();
	}, 1000);
}

function stop_timer() {
	if (timer != null) clearInterval(timer);
}

function unblock_button_part1() {
	$("#next_part1").attr('disabled', false);
}

function unblock_button_part2() {
	$("#yes_part2").attr('disabled', false);
	$("#no_part2").attr('disabled', false);
}

function temp_block_button(part) {
	if (part == 0) {
		$("#next_part1").attr('disabled', true);
		setTimeout(unblock_button_part1, 400);
	} else if (part == 1) {
		$("#yes_part2").attr('disabled', true);
		$("#no_part2").attr('disabled', true);
		setTimeout(unblock_button_part2, 185);
	}
}



function onDataLoaded() {
    $('#loading_panel').hide();
	init_game();
}

function show_not_eligible_message() {
	$("#cannotPlayModal").modal();
}

var data_loading_failed_message = "Sorry, but we could not retrieve necessary data from Facebook. Maybe you are not logged in. Try next time.";

function show_data_loading_failed_alert() {
	alert(data_loading_failed_message);
	window.location = "/";
}

function show_data_loading_failed_message() {
	$("#modalMessage").text(data_loading_failed_message);
    $("#cannotPlayModal").modal();
}

function show_intro_message(msg) {
    $('#intro_panel').show();
    $('#game_intro_msg').html(msg);
}

function hide_intro_message() {
    $('#intro_panel').hide();
}

function show_finish_message() {
	$('#finish_panel').show();
	hide_intro_message();
	$('#game_panel').hide();
}

function change_rank_name() {
	change_name(get_selected_name(), rank_token);
}

function append_if_exists(elem, form, radio_value, checked) {
	if (elem) {
		form.append('<input type="radio" name="rank_name" value="' + radio_value + '" ' +
			(checked ? 'checked ' : '') + '> ' + '<span id="rank_name_'+radio_value+'">'+ elem + '</span>');
		form.append('<br>');
		return true;
	}
	return false;
}

function generate_part_summary(part, game_info, game_status) {
	var q_num = game_info.questions_part[part].length;
	var correct = game_status.game_parts[part].correct;
	var answered = game_status.game_parts[part].answers.length;
	var percent = answered == 0 ? 0 : correct / answered;

	var header = 'Part ' + (part + 1) + ':';
	var sq_num = 'Questions answered: ' + q_num;
	var scorr = 'Correctness: ' + correct + '/' + q_num +' ('+(100 * percent).toFixed(2) + ' %)';
	return [header, sq_num, scorr].join('<br>');
}

function show_summary(game_info, game_status) {
	var show_general = game_info.eligible_part1 && game_info.eligible_part2;
	var str = show_general ? 'Total questions answered: ' + (game_info.questions_part[0].length + game_info.questions_part[1].length) + '<br><br>' : '';
	if (game_info.eligible_part1) {
		str += generate_part_summary(0, game_info, game_status);
		str += '<br>';
	}
	if (game_info.eligible_part2) {
		str += generate_part_summary(1, game_info, game_status);
	}
	$('#summary').html(str);
}

function img(src) {
	return '<img src="'+src+'"/>';
}

function summary_table_part(last_sum, part, tbody, game_info, game_status) {
	for (i in game_info.questions_part[part]) {
		var tr = $('<tr></tr>');
		var num = [(parseInt(i) + last_sum + 1).toString()];
		var q;
		var va;
		if (part == 0) {
			q = [img(game_info.questions_part[0][i].url)];
			va = [game_info.questions_part[0][i].name];
		} else if (part == 1) {
			q = [img(game_info.questions_part[1][i].pair[0].url), img(game_info.questions_part[1][i].pair[1].url)];
			va = [game_info.questions_part[1][i].are_friends ? 'are friends' : 'are not friends'];
		}
		var c = [game_status.game_parts[part].answers[i] ? 'correct' : 'incorrect'];
		var r_items = [num, q, va, c];
		for (it in r_items) {
			tr.append('<td>'+r_items[it].join(' ')+'</td>');
		}
		tbody.append(tr);
	}
}

function show_summary_table(game_info, game_status) {
	var table = $('<table class="table table-bordered"></table>');
	var header = $('<thead></thead>');
	var header_tr = $('<tr></tr>');
	var no = $('<td>No.</td>');
	var q = $('<td>Question</td>');
	var va = $('<td>Valid answer</td>');
	var c = $('<td>Your answer correctness</td>');
	var header_items = [no, q, va, c];
	for (hi in header_items) header_tr.append(header_items[hi]);
	header.append(header_tr);
	var tbody = $('<tbody></tbody>');
	var sum = 0;
	if (game_info.eligible_part1) {
		summary_table_part(sum, 0, tbody, game_info, game_status);
		sum += game_info.questions_part[0].length;
	}
	if (game_info.eligible_part2) {
		summary_table_part(sum, 1, tbody, game_info, game_status);
	}
	table.append(header);
	table.append(tbody);
	$('#summary_table').append(table);
}

function show_rank_form(user_info) {
	var form = $('<form></form>');
	var appended = [];
	var to_add = [['anonymous', 'anonymous']];
	to_add = to_add.concat(split_name(user_info.name));
	for (var i = 0; i < to_add.length; i++) {
		if (append_if_exists(to_add[i][0], form, to_add[i][1], appended.length==0)) {
			appended.push(to_add[i][0]);
		}
	}
	form.append('<br>');
	form.append('<button onclick="change_rank_name()" type="button" class="btn btn-default">Send changes</button>');
	$('#rank_form').empty();
	if (appended.length > 1) {
		$('#rank_form').append('How you want to be represented in ranking ?<br><br>');
		$('#rank_form').append(form);
	} else {
		$('#rank_form').append('You will be represented in ranking as ' + appended[0] + '.');
	}
}

function get_selected_name() {
	return $('#rank_name_' + $('input[name=rank_name]').filter(':checked').val()).text();
}

function show_success_alert(text) {
	$('#alert_error').hide();
	$('#alert_success_text').text(text);
	$('#alert_success').show();
}

function show_error_alert(text) {
	$('#alert_success').hide();
	$('#alert_error_text').text(text);
	$('#alert_error').show();
}

function show_part(part_num) {
	if (part_num == 0) {
		$('#part1_panel_body').show();
		$('#part2_panel_body').hide();
	} else if (part_num == 1) {
		$('#part1_panel_body').hide();
		$('#part2_panel_body').show();
	}
	$('#game_panel').show();
}

function get_input_part1() {
	return $("#user_input_part1").val();
}

function clear_input_part1() {
	return $("#user_input_part1").val('');
}

function set_img_part1(src) {
	$("#part1_img").attr('src', src);
}

function set_imgs_part2(src1, src2) {
	$("#part2_img1").attr('src', src1);
	$("#part2_img2").attr('src', src2);
}

function update_question_header(part_num, q_i, q_num, time_left, valid_answer_num, valid_percent) {
    if (def(part_num)) $("#part_num").text(part_num+1);
    if (def(q_i)) $("#question_no").text(q_i);
    if (def(q_num)) $("#question_num").text(q_num);
    if (def(time_left)) $("#time_left").text(time_left);
    if (def(valid_answer_num)) $("#num_correct").text(valid_answer_num);
    if (def(valid_percent)) $("#percent_correct").text((100*valid_percent).toFixed(2) + ' %');
}