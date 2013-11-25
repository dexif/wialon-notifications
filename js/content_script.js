// console.log("Wialon Notifications: content script loaded");
window.addEventListener("message", function(event) {
	if (event.source != window){
		return;
	}
	if(event.data.type && event.data.type == 'wialon_message'){
		// console.log("Wialon Notify: content script -> extension");
		if(chrome.extension) {
			chrome.extension.sendMessage({
				message:event.data.message,
				name:event.data.name,
				msg_type: event.data.msg_type
			}, function(response) {
				// console.log(response.text);
			});
		}
	}

}, false);
