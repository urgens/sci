var serverListLiveAll = {};
var watchedStreamIdAll = null;
var paginationAll = true;
var initItemsPageAll = 5;
var itemsPageAll = initItemsPageAll;
var setRaceAll = function() {
        var race = Ext.getCmp('selctRaceBtnAll').getValue();
        Ext.getCmp('streamslistAll').up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        var response = [];
        var serverListLiveTempAll = serverListLiveAll.slice(0, itemsPageAll);
        var size = 0;
        switch(race) {
            case 'a':
                response = serverListLiveTempAll;
                break; 
            case 'p':
            case 'z':
                for(x in serverListLiveTempAll) {
                    for(y in serverListLiveTempAll[x].r) {
                        if(serverListLiveTempAll[x].r[y].t == race) {
                            response[size++] = serverListLiveTempAll[x]
                            break;
                        }
                    }
                }
                break;
        }
        var streamListAll = Ext.getCmp('streamslistAll');
        //streamList.setItemTpl(itemTplNonPrev);
        streamListAll.setItemTpl(itemTplWithPrevAll);
        var store = Ext.getCmp('streamslistAll').getStore();
        store.setData(response);
        if(serverListLiveAll.length <= itemsPageAll) {
            Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().hide();
        } else {
            Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().show();
        }
        streamListAll.up().setMasked(false);
}
var refreshListAll = function () {
    itemsPageAll = initItemsPageAll;
    Ext.data.JsonP.request({
        url: 'https://spreadsheets.google.com/feeds/cells/0AvnajsweGK5WdGloZnBBbFVLdEtuS2VoV3RPTFE0V0E/od6/public/basic/R1C1',
        params: {
            'alt': 'json-in-script'
        },
        callbackKey: 'callback',
        success: function (response) {
            response = eval(response.entry.content.$t);
            Ext.getCmp('streamslistAll').up().setMasked({
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
            
            serverListLiveAll = response;
            setRaceAll();
            //Ext.getCmp('streamslist').getStore().setData(response);
            //Ext.getCmp('streamslist').up().setMasked(false);
        },
        failure: function () {}
    });
}
var timeoutTaskAll = null;
var refreshTaskAll = function () {
    Ext.getCmp('streamslistAll').up().setMasked({
        xtype: 'loadmask',
        message: 'Loading...'
    });
    refreshListAll();
    timeoutTaskAll = setTimeout("refreshTaskAll()", 150000);
}

Ext.define('sci.controller.Streams', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.data.Store'
    ],
    config: {
        refs: {
            streams: 'streams'
        },
        control: {
            '#streamslistAll': {
                itemtap: 'showStream'
            },
            '#refreshLiveBtnAll': {
                tap: 'refreshLive'
            },
            // '#selctRaceBtnAll': {
                // change: 'changeListRace'
            // },
            '#favoriteBtnAll': {
                tap: 'manageFavorite'
            }
        }
    },
    manageFavorite: function() {
        //TODO: check for exists in favorite
        var favBtn = Ext.getCmp('favoriteBtnAll');
        if(favBtn.getUi() == 'decline') { //add to favorite
            favBtn.setUi('confirm');
            if(watchedStreamAll != null) {
                var size = localStorage.getItem("sizeFav");
                if(size == null) size = 0;
                var player = watchedStreamAll.get('n');
                var stream = watchedStreamAll.get('s');
                var idstream = watchedStreamAll.get('i');
                
                watchedStreamAll.set('f', 'favstm');
                watchedStreamAll.set('fid', size);
                favList[size] = {'n': player,'s':stream ,'i': idstream,'id': size};
                saveToStorage(player, stream, idstream);
            }
        } else { //remove from favorite
            favBtn.setUi('decline');
            favList[watchedStreamAll.get('fid')] = {};
            removeFromStorage(watchedStreamAll.get('fid'));
            watchedStreamAll.set('f', '');
            watchedStreamAll.set('fid', '');
        }
    },
    //clearTimeout(timeoutTask)
    // 60 000 ms =  1,0 min
    //150 000 ms =  2,5 min
    //300 000 ms =  5,0 min
    //600 000 ms = 10,0 min
    refreshLive: function() {
        clearTimeout(timeoutTask);
        Ext.getCmp('streamslistAll').up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        refreshListAll();
        timeoutTask = setTimeout("refreshTaskAll()", 150000);
    },
    showStream: function(list, index, element, record) {
        Ext.getCmp('selctRaceBtnAll').setHidden(true);
        Ext.getCmp('refreshLiveBtnAll').setHidden(true);
        
        var streamId = record.get('i');
        
        watchedStreamAll = record;
        var isFav = false;
        if(record.get('fid') != '') isFav = true;
        if(isFav) Ext.getCmp('favoriteBtnAll').setUi('confirm'); else Ext.getCmp('favoriteBtnAll').setUi('decline');
        Ext.getCmp('favoriteBtnAll').setHidden(false);

        var htmlStream = '';
        if(record.get('s') == 'twitch') {
            htmlStream = '<object type="application/x-shockwave-flash" height="100%" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+streamId+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+streamId+'&auto_play=true&start_volume=25" /></object>'; 
        } else if(record.get('s') == 'own3d') {
            htmlStream = '<object width="100%" height="100%"><param name="movie" value="http://www.own3d.tv/livestream/'+streamId+';autoplay=true" /><param name="allowscriptaccess" value="always" /><param name="allowfullscreen" value="true" /><param name="wmode" value="transparent" /><embed src="http://www.own3d.tv/livestream/'+streamId+';autoplay=true" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="100%" height="100%" wmode="transparent"></embed></object>';
        } else {
            htmlStream = 'STREAM NOT SUPPORTED<br />Update application!'
        }
        this.getStreams().push({
            xtype: 'panel',
            width: window.innerWidth,
            height: window.innerHeight-100,
            title: record.get('n'),
            id: 'streamWindowAll',
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
        setRaceAll();
    },
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        refreshListAll();
        timeoutTaskAll = setTimeout("refreshTaskAll()", 150000);
    }
});