/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <references path="config.js">	 	</reference>
/// <references path="res.js">	 		</reference>

var min_questions_part1 = 3;
var min_questions_part2 = 3;
var max_questions_part1 = 12;
var max_questions_part2 = 12;

var timeout_part = [20, 8];

var total_friend_number;
var friend_list = [];
var friends_to_pair = [];
var friend_pairs = [];
var friend_set = new Set();