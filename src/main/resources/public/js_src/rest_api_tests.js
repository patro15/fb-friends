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

var api_tests = [

	function send_results_test() {
		var results = {
			name: to_base64('anonymous'),
			correctness: "0.5",
			part1: {
				numAnswered: 3
			},
			part2: {
				numAnswered: 4
			}
		};

		$.post("/game/results", JSON.stringify(results), (data, status) => {
			console.log('data: '+data+'\nstatus:'+status);
		});
	},

	function change_name_valid_token_test() {
		var data = {
			name: to_base64('new_name'),
			token: '02016.05.22.20.21.256983818250360432828028434701628804108546772046973267793702371739753198789695'
		};
		$.post("/game/results/name", JSON.stringify(data), (data, status) => {
			console.log('data: ' + data + '\nstatus:' + status);
		});
	},

	function change_name_invalid_token_test() {
		var data = {
			name: to_base64('new_name'),
			token: '123'
		};
		$.post("/game/results/name", JSON.stringify(data), (data, status) => {
			console.log('data: ' + data + '\nstatus:' + status);
		});
	},

	function bad_url_test() {
		var data = {
			name: to_base64('new_name'),
			token: '123'
		};
		$.post("/game/resultsX/name", JSON.stringify(data), (data, status) => {
			console.log('data: ' + data + '\nstatus:' + status);
		});
	}
];