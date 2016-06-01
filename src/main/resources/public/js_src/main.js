/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <reference path="init.js">	 		</reference>
/// <reference path="load.js">	 		</reference>
/// <reference path="fb_load.js"> 		</reference>
/// <reference path="control.js"> 		</reference>
/// <reference path="rest_api.js">	 	</reference>
/// <reference path="rest_api_tests.js"> 	</reference>
/// <reference path="game.js">	 		</reference>
/// <references path="main.js">	 		</reference>

function main() {
	$('#nav_home').removeClass('active');
	$('#nav_game').addClass('active');
    init_modal();
    init_panels();
    onLoadTimeout = show_data_loading_failed_message;
    window_to_load = 0;
    //api_tests.forEach(test => test());
}

function get_fb_data() {
	get_my_name((data) => user_info = data);
	get_all_friends();
}

init_loader(onDataLoaded, get_friend_pairs, get_invitable_friends, show_data_loading_failed_alert);
start_load_checker();
onLoadCallback = get_fb_data;
window.onload = main;