/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <reference path="init.js">	 		</reference>
/// <reference path="load.js">	 		</reference>
/// <reference path="fb_load.js"> 		</reference>
/// <references path="rest_api.js">	 	</reference>
/// <reference path="control.js"> 		</reference>
/// <references path="game.js">	 		</reference>

//--------------------------  send_results  -----------------------------------

function send_results() {
	var correct = game_status.game_parts[0].correct + game_status.game_parts[1].correct;
	var answered = game_status.game_parts[0].answers.length + game_status.game_parts[1].answers.length;
	var percent = answered == 0 ? 0 : correct / answered;

	var results = {
		name: to_base64('anonymous'),
		correctness: percent,
		part1: {
			numAnswered: game_status.game_parts[0].answers.length
		},
		part2: {
			numAnswered: game_status.game_parts[1].answers.length
		}
	};

	$.post("/game/results", JSON.stringify(results), resultCallback);
}

function resultCallback(data, status) {
	var res = JSON.parse(data);
	if (status == 'success' && res != undefined && res.success) {
		onSendResultSuccess(res);
	} else {
		var error_msg = 'Error when saving results';
		if (data.message) error_msg += ': ' + data.message;
		if (status != 'success') error_msg += '\n' + status;
		show_error_alert(error_msg);
	}
}

function onSendResultSuccess(data) {
	show_rank_form(user_info);
	rank_token = data.token;
	show_success_alert('Your results has been successfully saved');
}

//----------------------------  change_name  ----------------------------------

function change_name(new_name, token) {
	var data = {
		name: to_base64(new_name),
		token: token
	};
	$.post("/game/results/name", JSON.stringify(data), change_name_callback);
}

function change_name_callback(data, status) {
	var res = JSON.parse(data);
	if (status == 'success' && res!=undefined && res.success) {
		on_change_name_success();
	} else {
		var error_msg = 'Error when trying to change name';
		if (data.message) error_msg += ': ' + data.message;
		if (status != 'success') error_msg += '\n' + status;
		show_error_alert(error_msg);
	}
}

function on_change_name_success() {
	show_success_alert('Your name has been changed');
}