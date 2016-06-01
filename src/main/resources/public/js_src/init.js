/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <reference path="res.js">	 		</reference>
/// <references path="init.js">	 		</reference>
/// <reference path="load.js">	 		</reference>
/// <reference path="fb_load.js"> 		</reference>
/// <reference path="control.js"> 		</reference>
/// <reference path="game.js">	 		</reference>

function init_modal() {
	$('#cannotPlayModal').on('hidden.bs.modal', function () {
		window.location = "/";
	})
}

function init_panels() {
    $('#intro_panel').hide();
    $('#game_panel').hide();
    $('#finish_panel').hide();
}