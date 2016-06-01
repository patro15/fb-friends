/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <reference path="init.js">	 		</reference>
/// <references path="load.js">	 		</reference>
/// <reference path="fb_load.js"> 		</reference>
/// <reference path="control.js"> 		</reference>
/// <reference path="game.js">	 		</reference>

//----------  parameters  -------------
var load_check_attempts = 25;
var load_check_inverval = 300;	// ms

//-----------  conditions  ------------
var photos_to_load = -1;
var friend_pair_to_check = -1;
var invitable_friends_to_load = -1;
var my_name_to_load = -1;
var window_to_load = -1;

//--------  action performed  ---------
var loaded = false;
var getting_pairs_started = false;
var basic_friends_loaded = false;

//--------  action functions  ---------
var onDataLoaded;
var onReadyToGetPairs;
var onBasicFriendsLoaded;
var onLoadTimeout;      // timeout function

//-----------------------------------------------------------------------------

function init_loader(_onDataLoaded, _onReadyToGetPairs, _onBasicFriendsLoaded, _onLoadTimeout) {
    onDataLoaded = _onDataLoaded;
    onReadyToGetPairs = _onReadyToGetPairs;
    onBasicFriendsLoaded = _onBasicFriendsLoaded;
    onLoadTimeout = _onLoadTimeout;
}

function start_load_checker() {
    setTimeout(load_checker, load_check_inverval);
}

function load_checker() {
    if (!data_loaded()) {
        if (load_check_attempts > 0) {
            load_check_attempts--;
            setTimeout(load_checker, load_check_inverval);
        } else {
            onLoadTimeout();
        }
    }
}

//-----------------------------  step functions  ------------------------------

function photo_loaded() {
    photos_to_load--;
    data_loaded();
}

function friend_pair_checked() {
    friend_pair_to_check--;
    data_loaded();
}

function invitable_frends_loaded() {
    invitable_friends_to_load--;
    data_loaded();
}

//---------------------  condition checking functions  ------------------------

function ready_to_get_pairs() {
    return photos_to_load==0 && invitable_friends_to_load==0;
}

function all_data_loaded() {
	return photos_to_load == 0 && friend_pair_to_check == 0 && invitable_friends_to_load == 0
		&& my_name_to_load == 0 && window_to_load==0;
}

//-----------------------------------------------------------------------------

function data_loaded() {
    if (!loaded && all_data_loaded()) {
        loaded = true;
        onDataLoaded();
    }
    if (!basic_friends_loaded && photos_to_load == 0) {
    	basic_friends_loaded = true;
    	onBasicFriendsLoaded();
    }
    if (!getting_pairs_started && ready_to_get_pairs()) {
        getting_pairs_started = true;
        onReadyToGetPairs();
    }
    return loaded;
}

