if (wialon && typeof wianoti_loaded === 'undefined'){
    // WebCMS.init_finished
    // WebCMS.init_batch_finished
    // console.log("Wialon Notifications: page side loaded");
    wianoti_loaded = true;

    var wianoti_interval = setInterval( function () {
        if( WebCMS.init_finished || WebCMS.init_batch_finished ){
            // console.log('events');
            var resources = wialon.core.Session.getInstance().getItems("avl_unit");
            var res_arr = new Array();
            if(resources) {
                for (var i = 0; i < resources.length; i++) {
                    var res = resources[i];
                    res.addListener("messageRegistered", function(event){
                        var item = event.getTarget();
                        var msg = event.getData();
                        if (!item || !msg) {
                            return;
                        }
                        if (msg.tp == "ud" || (msg.tp == "xx" && ((msg.f & 0xFF00) == 0x0900))){
                            if(msg.p.text || msg.p.SOS || msg.p.image) {
                                window.postMessage({
                                    type:'wialon_message',
                                    msg_type: (msg.p.text?'text':(msg.p.SOS?'sos':(msg.p.image?'image':''))),
                                    message:msg,
                                    name: item.getName()
                                },'*');
                            }
                        }
                    }, this);
                    res_arr.push(res.getId());
                }
            }
            clearInterval(wianoti_interval);
        }
    } , 2000);
}


