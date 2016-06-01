/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <reference path="init.js">	 		</reference>
/// <reference path="load.js">	 		</reference>
/// <reference path="fb_load.js"> 		</reference>
/// <reference path="rest_api.js">	 	</reference>
/// <reference path="control.js"> 		</reference>
/// <references path="game.js">	 		</reference>

var user_info;
var rank_token;
var game_info = {
	eligible_part1: false,
	eligible_part2: false,
	questions_part: [[], []],
	type: 'cannot_play'
};

var _state = {
	not_started: 0,
	started: 1,
	finished: 2
};

var game_status = {
	state: _state.not_started,
	current_question: undefined,
	part_num: undefined,
	game_parts: [{      // part 1
		correct: 0,
		answers: []
	}, {                // part 2
		correct: 0,
		answers: []
	}],
	time_left: 0
}

//-----------------------------------------------------------------------------

function update_header() {
	var part_num = game_status.part_num;
	var q_num = game_info.questions_part[part_num].length;
	var correct = game_status.game_parts[part_num].correct;
	var answered = game_status.game_parts[part_num].answers.length;
	var percent = answered == 0 ? 0 : correct / answered;
	update_question_header(part_num, game_status.current_question + 1, q_num,
        game_status.time_left, correct, percent);
}

function start_part(part_num) {
	game_status.part_num = part_num;
	game_status.current_question = 0;
	show_part(part_num);
	update_header();
	next_question();
}

function generate_questions_part1(num) {
	var questions = [];
	shuffle(friend_list);
	for (var i = 0; i < num; i++) {
		questions.push(friend_list[i]);
	}
	return questions;
}

function generate_questions_part2(num) {
	var questions = [];
	shuffle(friends_to_pair);
	for (var i = 0; i < num; i++) {
		if (Math.random() >= 0.5) questions.push(friend_pairs.pop());
		else questions.push(friend_pairs.shift());
	}
	return questions;
}

function start_game() {
	hide_intro_message();
	game_status.state = _state.started;
	if (game_info.eligible_part1) {
		start_part(0);
	} else if (game_info.eligible_part2) {
		start_part(1);
	}
}

function init_game() {
	var max_num_of_pairs = friend_pairs.length;
	game_info.eligible_part1 = friend_list.length >= min_questions_part1;
	game_info.eligible_part2 = max_num_of_pairs >= min_questions_part2;
	if (game_info.eligible_part1) {
		var questions_num_part1 = Math.min(friend_list.length, max_questions_part1);
		game_info.questions_part[0] = generate_questions_part1(questions_num_part1);
	}
	if (game_info.eligible_part2) {
		var questions_num_part2 = Math.min(max_num_of_pairs, max_questions_part2);
		game_info.questions_part[1] = generate_questions_part2(questions_num_part2);
	}

	if (!game_info.eligible_part1 && !game_info.eligible_part2) {
		game_info.type = 'cannot_play';
		show_not_eligible_message();
	} else {
		show_intro_message(
			generate_intro_text(
				 game_info.eligible_part1,
				 game_info.eligible_part2,
				 total_friend_number,
				 game_info.questions_part[0],
				 game_info.questions_part[1]
			)
		);
	}
}

function validate_answer(answer) {
	var part = game_status.part_num;
	var current_question = game_status.current_question;
	var valid = false;
	if(part==0) {
		var input = get_input_part1();
		valid = game_info.questions_part[0][current_question].name.toUpperCase() == input.toUpperCase();
	} else if(part==1) {
		valid = answer == game_info.questions_part[part][current_question].are_friends;
	}
	if (valid) game_status.game_parts[part].correct++;
	game_status.game_parts[part].answers.push(valid);
}

function game_finished() {
	game_status.state = _state.finished;
	show_finish_message();
	show_summary(game_info, game_status);
	show_summary_table(game_info, game_status);
	send_results();
}

function part_finished() {
	if(game_status.part_num==0 && game_info.eligible_part2) {
		start_part(1);
	} else {
		game_finished();
	}
}

function question_finished(answer) {
	stop_timer();
	var part = game_status.part_num;
	validate_answer(answer);
	game_status.current_question++;
	var last_question = game_status.current_question == game_info.questions_part[part].length;
	if(!last_question) next_question();
	else part_finished();
}

function time_step() {
	if (game_status.time_left == 0) return false;
	game_status.time_left--;
	update_header();
	if (game_status.time_left == 0) question_finished(null);
	return game_status.time_left > 0;
}

function next_question() {
	var part = game_status.part_num;
	temp_block_button(part);
	game_status.time_left = timeout_part[part];
	update_header();
	start_new_timer(time_step);
	var question = game_info.questions_part[part][game_status.current_question];
	if (part == 0) {
		set_img_part1(question.url);
		clear_input_part1();
	} else if (part == 1) {
		set_imgs_part2(question.pair[0].url, question.pair[1].url);
	}
}


function generate_intro_text(part1, part2, total_friends, num_q_p1, num_q_p2) {
	var basic_msg = 'In a moment you start the game. Game consists of two parts. In the first part we show you profile photos of your friends and you have ' +
            timeout_part[0] + ' seconds to enter their full names. In the second part we show you pair of photos and you have ' +
            timeout_part[1] + ' seconds to decide whether they are friends or not.';
	var unavailable_part = !part2 ? 'second part' : (!part1 ? 'first part' : '');
	var available_part = part2 ? 'second part' : (part1 ? 'first part' : '');
	var msg_no_part = 'Unfortunately you can only take part in ' + available_part + ', because you have not enough friends to play '
        + unavailable_part + ' or our app have no access to them. If so you can invite them to play. If they also play, they wil be available in this game for you.';
	var invite_tip = 'You could have more questions if you would invite some of your friends to play.';
	var full_game = part1 && part2;
	var full_questions_num = num_q_p1 == max_questions_part1 && num_q_p2 == max_questions_part2;
	var show_invite_tip = full_game && !full_questions_num;
	var msg = basic_msg + '<br>' + (!full_game ? msg_no_part : '') + (show_invite_tip ? invite_tip : '');
	return msg;
}