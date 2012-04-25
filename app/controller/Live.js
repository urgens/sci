var serverListLive = {};
var favList = {};
var watchedStreamId = null;
var pagination = true;
var initItemsPage = 5;
var itemsPage = initItemsPage;

var saveToStorage = function(player, stream, idstream) {
    if (typeof(localStorage) == 'undefined' ) {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    } else {
        var size = localStorage.getItem("sizeFav");
        if(size == null) size = 0;
        try {
            localStorage.setItem("fav"+size, "{'n':'" + player + "','s':'" + stream + "','i':'" + idstream + "','id':'"+ size++ +"'}")
        } catch (e) {
            if(e == QUOTA_EXCEEDED_ERR) alert('Quota exceeded!'); else alert('localStorage error!');
        }
        localStorage.setItem("sizeFav", size);
    }
}
var removeFromStorage = function(id) {
    if (typeof(localStorage) == 'undefined' ) {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    } else {
        try {
            localStorage.removeItem("fav"+id);
        } catch (e) {
            if(e == ReferenceError) { //not exists?
            } else { alert('localStorage error!'); }
        }
    }
}
var setStorage = function() {
    if (typeof(localStorage) == 'undefined' ) {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    } else {
        var size = 0; 
        for(x in favList) {
            localStorage.setItem("sizeFav", 0);
            try {
                localStorage.setItem("fav"+size, "{'n':'" + favList[x].n + "','s':'" + favList[x].s + "','i':'" + favList[x].i + "','id':'"+ size +"'}");
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    localStorage.setItem("sizeFav", size);
                    alert('Quota exceeded!');
                } else {
                    alert('localStorage error!');
                }
            }
            size++;
        }
        localStorage.setItem("sizeFav", size);
    }
}
var getStorage = function() {
    if (typeof(localStorage) == 'undefined' ) {
        //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    } else {
        var needToSet = false;
        var temp = null;
        var size = localStorage.getItem("sizeFav");
        if(size > 0) {
            var fav = '[';
            for(x=0; x<size; x++) {
                temp = localStorage.getItem("fav"+x);
                if(temp != null) {
                    fav += localStorage.getItem("fav"+x) + ',';
                } else {
                    needToSet = true;
                }
            }
            fav += ']';
            try {
                favList =  eval(fav);
                if(needToSet) { //for compression index
                    localStorage.clear();
                    setStorage();
                }
            } catch(e) {
                //error eval?
            }
        }
    }
}
var setRace = function() {
        var race = Ext.getCmp('selctRaceBtn').getValue();
        Ext.getCmp('streamslist').up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        var response = [];
        var serverListLiveTemp = serverListLive.slice(0, itemsPage);
        var size = 0;
        switch(race) {
            case 'a':
                response = serverListLiveTemp;
                break; 
            case 't':
            case 'p':
            case 'z':
                for(x in serverListLiveTemp) {
                    for(y in serverListLiveTemp[x].r) {
                        if(serverListLiveTemp[x].r[y].t == race) {
                            response[size++] = serverListLiveTemp[x]
                            break;
                        }
                    }
                }
                break;
        }
        var streamList = Ext.getCmp('streamslist');
        //streamList.setItemTpl(itemTplNonPrev);
        streamList.setItemTpl(itemTplWithPrev);
        var store = Ext.getCmp('streamslist').getStore();
        store.setData(response);
        if(serverListLive.length <= itemsPage) {
            Ext.getCmp('streamslistPaging').getLoadMoreCmp().hide();
        } else {
            Ext.getCmp('streamslistPaging').getLoadMoreCmp().show();
        }
        streamList.up().setMasked(false);
}
var refreshList = function () {
    itemsPage = initItemsPage;
    Ext.data.JsonP.request({
        url: 'https://spreadsheets.google.com/feeds/cells/0AvnajsweGK5WdDBuQVljMGVZQmtEZFVQeHFyUjVQamc/od6/public/basic/R1C1',
        params: {
            'alt': 'json-in-script'
        },
        callbackKey: 'callback',
        success: function (response) {
            response = eval(response.entry.content.$t);
            Ext.getCmp('streamslist').up().setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });
            for(x in response) {
                for(y in favList) {
                    if(favList[y].i == response[x].i) {
                        if(favList[y].s == response[x].s) {
                            response[x].f = 'favstm';
                            response[x].fid = favList[y].id;
                            break;
                        }
                    } else {
                        response[x].f = '';
                        response[x].fid = '';
                    }
                }
                
                switch(response[x].s) {
                    case 'twitch':
                    case 'justin':
                        response[x].p = 'http://static-cdn.justin.tv/previews/live_user_' + response[x].i + '-320x240.jpg';
                        break;
                    case 'own3d':
                        response[x].p = 'http://img.hw.own3d.tv/live/live_tn_' + response[x].i + '_.jpg';
                        break;
                    default:
                        response[x].p = '';
                        break;
                }
            }
            
            serverListLive = response;
            setRace();
            //Ext.getCmp('streamslist').getStore().setData(response);
            //Ext.getCmp('streamslist').up().setMasked(false);
        },
        failure: function () {}
    });
}
var timeoutTask = null;
var refreshTask = function () {
    Ext.getCmp('streamslist').up().setMasked({
        xtype: 'loadmask',
        message: 'Loading...'
    });
    refreshList();
    timeoutTask = setTimeout("refreshTask()", 150000);
}
Ext.define('sci.controller.Live', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.data.Store'
    ],
    config: {
        refs: {
            live: 'live'
        },
        control: {
            '#streamslist': {
                itemtap: 'showStream'
            },
            '#refreshLiveBtn': {
                tap: 'refreshLive'
            },
            '#selctRaceBtn': {
                change: 'changeListRace'
            },
            '#favoriteBtn': {
                tap: 'manageFavorite'
            },
            '#dupadupa': {
                activate: 'loadMoreStreams' 
            }
        }
    },
    loadMoreStreams: function(_1, _2, _3, _4) {
        console.log('load moar!!!!');
    },
    manageFavorite: function() {
        //TODO: check for exists in favorite
        var favBtn = Ext.getCmp('favoriteBtn');
        if(favBtn.getUi() == 'decline') { //add to favorite
            favBtn.setUi('confirm');
            if(watchedStream != null) {
                var size = localStorage.getItem("sizeFav");
                if(size == null) size = 0;
                var player = watchedStream.get('n');
                var stream = watchedStream.get('s');
                var idstream = watchedStream.get('i');
                
                watchedStream.set('f', 'favstm');
                watchedStream.set('fid', size);
                favList[size] = {'n': player,'s':stream ,'i': idstream,'id': size};
                saveToStorage(player, stream, idstream);
            }
        } else { //remove from favorite
            favBtn.setUi('decline');
            favList[watchedStream.get('fid')] = {};
            removeFromStorage(watchedStream.get('fid'));
            watchedStream.set('f', '');
            watchedStream.set('fid', '');
        }
    },
    //clearTimeout(timeoutTask)
    // 60 000 ms =  1,0 min
    //150 000 ms =  2,5 min
    //300 000 ms =  5,0 min
    //600 000 ms = 10,0 min
    refreshLive: function() {
        clearTimeout(timeoutTask);
        Ext.getCmp('streamslist').up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        refreshList();
        timeoutTask = setTimeout("refreshTask()", 150000);
    },
    showStream: function(list, index, element, record) {
        Ext.getCmp('selctRaceBtn').setHidden(true);
        Ext.getCmp('refreshLiveBtn').setHidden(true);
        
        var streamId = record.get('i');
        
        watchedStream = record;
        var isFav = false;
        if(record.get('fid') != '') isFav = true;
        if(isFav) Ext.getCmp('favoriteBtn').setUi('confirm'); else Ext.getCmp('favoriteBtn').setUi('decline');
        Ext.getCmp('favoriteBtn').setHidden(false);

        var htmlStream = '';
        if(record.get('s') == 'twitch') {
            htmlStream = '<object type="application/x-shockwave-flash" height="100%" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+streamId+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+streamId+'&auto_play=true&start_volume=25" /></object>'; 
        } else if(record.get('s') == 'own3d') {
            htmlStream = '<object width="100%" height="100%"><param name="movie" value="http://www.own3d.tv/livestream/'+streamId+';autoplay=true" /><param name="allowscriptaccess" value="always" /><param name="allowfullscreen" value="true" /><param name="wmode" value="transparent" /><embed src="http://www.own3d.tv/livestream/'+streamId+';autoplay=true" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="100%" height="100%" wmode="transparent"></embed></object>';
        } else {
            htmlStream = 'STREAM NOT SUPPORTED<br />Update application!'
        }
        this.getLive().push({
            xtype: 'panel',
            width: window.innerWidth,
            height: window.innerHeight-100,
            title: record.get('n'),
            id: 'streamWindow',
            padding: 0,
            margin: 0,
            html: htmlStream,
            //html: '',
            styleHtmlContent: true,
            scrollable: false,
            styleContent: true
        });
    },
    changeListRace: function(select, newValue, oldValue, _0) {
        //change displayed race stream list
        //newValue.data.value
        setRace();
    },
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        getStorage();
        refreshList();
        timeoutTask = setTimeout("refreshTask()", 150000);
    }
});