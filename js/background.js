console.log('Wialon Notifications: Extension loaded');
function notify (type, message, name, tabId) {
	var title = '';
	switch(type) {
		case "text":
			title = "Text message from ";
			content = message.p.text;
			break;
		case "image":
			title = "Image from ";
			content = 'New image received!';
			break;
		case "sos":
			title = "SOS from ";
			content = '';
			break;
		default:
			title = "Notification from ";
			content = '';
	}
	title += name;
	var notification = webkitNotifications.createNotification(
		'img/wialon_notify48.png',
		title,
		content
	);
	notification.addEventListener('click', function() {
		notification.cancel();
		chrome.tabs.update(tabId, {selected: true});
	})
	notification.show();
	setTimeout(function(){notification.cancel();}, 15000);
}
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		// console.log("Wialon Notify: ", request);
		// chrome.tabs.highlight({tabs:sender.tab.id}, function(){console.log(sender.tab.id, arguments)})
		if(request) {
			if(request.msg_type == 'system') {
					chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'img/wialon_notify_blue24.png'});
			} else {
					notify(request.msg_type, request.message, request.name, sender.tab.id);
			}
		}
		sendResponse({text: "Request received"});
	}
);

var page_js = 'var scr = document.createElement("script");' +
	'scr.type="text/javascript";' +
	'scr.src="' + chrome.extension.getURL("js/wialon_side.js") + '";' +
	'scr.id="wialon_notification_ext";' +
	'if(!document.getElementById("wialon_notification_ext")){' +
	'(document.head || document.body || document.documentElement).appendChild(scr);}';

chrome.tabs.onCreated.addListener(function(tab) {
	if(tab.url.indexOf('hosting.wialon.com')>=0){
		// console.log(tab);
		setTimeout(function () {
			console.log('Wialon Notifications: script tag created')
			chrome.tabs.executeScript(tab.id, {code: page_js});
			chrome.pageAction.setIcon({tabId: tab.id, path: 'img/wialon_notify24.png'});
			chrome.pageAction.setTitle({tabId: tab.id, title: 'Wialon Notifications'});
			chrome.pageAction.show(tab.id);
		},5000)
	}
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if((changeInfo.url || changeInfo.status == 'complete') && tab.url.indexOf('hosting.wialon.com')>=0) {
		// console.log(changeInfo, tab);
		setTimeout(function () {
			console.log('Wialon Notifications: script tag created (updated)')
			chrome.tabs.executeScript(tabId, {code: page_js});
			chrome.pageAction.setIcon({tabId: tab.id, path: 'img/wialon_notify24.png'});
			chrome.pageAction.setTitle({tabId: tab.id, title: 'Wialon Notifications'});
			chrome.pageAction.show(tabId);
		},5000);
	}
});

var tabsIds = [];
chrome.windows.getAll({populate: true}, function (window_list) {
	for(var i=0; i<window_list.length; i++) {
		var tabs = window_list[i].tabs;
		for (var j = 0; j < tabs.length; j++) {
			if (tabs[j].url.indexOf("hosting.wialon.com") >= 0 && !tabsIds[tabs[j].id]){
				chrome.tabs.executeScript(tabs[j].id, {code: page_js});
				chrome.pageAction.setIcon({tabId: tabs[j].id, path: 'img/wialon_notify_red24.png'});
				chrome.pageAction.setTitle({tabId: tabs[j].id,title: 'Please reload page to enable Wialon Notifications.'});
				chrome.pageAction.show(tabs[j].id);
				tabsIds[tabs[j].id] = tabs[j];
			}
		};
	}
});


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42824848-4']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
