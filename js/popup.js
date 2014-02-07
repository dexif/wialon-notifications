var wialonNotificationPopup = {
	availDomains: {},
	init: function () {
		chrome.storage.local.get('domains', function(items) {
			wialonNotificationPopup.availDomains = items;
		});
	},
	getDomain: function (url) {
		var a = document.createElement('a');
		a.href = url;
		return a.hostname;
	}
};

document.addEventListener('DOMContentLoaded', function () {
	wialonNotificationPopup.init();
	document.getElementById('state').addEventListener('click', function () {
		console.log(this);
	});
	chrome.tabs.getCurrent(function(tab){
		console.log(tab)
		document.getElementById('info').innerHTML = wialonNotificationPopup.getDomain(tab.url);
	});

});



var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42824848-4']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
