/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <reference path="init.js">	 		</reference>
/// <reference path="load.js">	 		</reference>
/// <references path="fb_load.js"> 		</reference>
/// <reference path="control.js"> 		</reference>
/// <reference path="game.js">	 		</reference>

function get_my_name(callback) {
	FB.api(
		"/me",
		onResponse((response) => {
			callback(response);
			my_name_to_load = 0;
			data_loaded();
		}, 'get_my_name')
	);
}

function get_friend_photo(friend) {
    FB.api(
        "/" + friend.id + "/picture",
        onResponse((response) => {
            if (!response.data.is_silhouette && !friend_set.has(friend.name)) {
                friend.url = response.data.url;
                friend_list.push(friend);
                friends_to_pair.push(friend);
                friend_set.add(friend.name);
            }
            photo_loaded();
        }, 'get_friend_photo')
    );
}

function are_friends(pair_item) {
    var user1_id = pair_item.pair[0].id;
    var user2_id = pair_item.pair[1].id;
    FB.api(
        "/" + user1_id + "/friends/" + user2_id,
        onResponse((response) => {
            pair_item.are_friends = response.data.length != 0;
            if (pair_item.are_friends)
                friend_pairs.push(pair_item);
            else
                friend_pairs.unshift(pair_item);
            friend_pair_checked();
        }, 'are_friends')
    );
}

function get_friend_pairs() {
    var len = friends_to_pair.length;
    var num = Math.min(number_of_pairs(len), 2 * max_questions_part2);
    friend_pair_to_check = 0;
    shuffle(friends_to_pair);
    var pair_set = new Set();
    for (var i = 0; i < num; i++) {
        var pair;
        do {
            pair = [Math.floor(Math.random() * len), Math.floor(Math.random() * len)];
        } while (pair[0] == pair[1] || pair_set.has(pair[0] * len + pair[1]));
        pair_set.add(pair[0] * len + pair[1]);
        pair_set.add(pair[1] * len + pair[0]);
        var friend_pair = {
            pair: [friends_to_pair[pair[0]], friends_to_pair[pair[1]]],
            are_friends: undefined
        };
        friend_pair_to_check++;
        are_friends(friend_pair);
    }
    data_loaded();
}

function get_friends() {
    FB.api(
        "/me/friends",
        onResponse((response) => {
            total_friend_number = response.summary.total_count;
            photos_to_load = 0;
            for (var i = 0; i < response.data.length; i++) {
                var friend = response.data[i];
                if (friend_set.has(friend.name)) continue;

                photos_to_load++;
                get_friend_photo(friend);
            }
            data_loaded();
        }, 'get_friends')
    );
}

function get_invitable_friends() {
    FB.api(
        "/me/taggable_friends",
        onResponse((response) => {
            for (var i = 0; i < response.data.length; i++) {
                var friend = response.data[i];
                if (friend_set.has(friend.name) || friend.picture.is_silhouette)
                    continue;
                friend_list.push({
                    name: friend.name,
                    url: friend.picture.data.url
                });
                friend_set.add(friend.name);
            }
            invitable_friends_to_load = 0;
            data_loaded();
        }, 'get_invitable_friends')
    );
}

function get_all_friends() {
    get_friends();
}