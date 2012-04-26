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
            '#liveWindow': {
                show: 'show'
            },
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
            }
        }
    },
    manageFavorite: function() {
        var addToFav = false;
        var favBtn = Ext.getCmp('favoriteBtn');
        if(favBtn.getUi() == 'decline') { //add to favorite
            favBtn.setUi('confirm');
            addToFav = true;
        } else { //remove from favorite
            favBtn.setUi('decline');
        }
        sci.app.manageFavorite(sci.app.watchedStreamId, addToFav);
    },
    show: function() {
        if(sci.app.serverListLive) {
            Ext.getCmp('streamslistAll').up().setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });
            for(x in sci.app.serverListLive) {
                sci.app.serverListLive[x].f = '';
                sci.app.serverListLive[x].fid = '';
                for(y in sci.app.favList) {
                    if(sci.app.favList[y].i == sci.app.serverListLive[x].i) {
                        if(sci.app.favList[y].s == sci.app.serverListLive[x].s) {
                            sci.app.serverListLive[x].f = 'favstm';
                            sci.app.serverListLive[x].fid = sci.app.favList[y].id;
                            break;
                        }
                    }
                }
            }
            sci.app.setRace();
        }
    },
    //clearTimeout(timeoutTask)
    // 60 000 ms =  1,0 min
    //150 000 ms =  2,5 min
    //300 000 ms =  5,0 min
    //600 000 ms = 10,0 min
    refreshLive: function() {
        clearTimeout(sci.app.timeoutTask);
        Ext.getCmp('streamslist').up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        sci.app.refreshList();
        sci.app.timeoutTask = setTimeout("sci.app.refreshTask()", 150000);
    },
    showStream: function(list, index, element, record) {
        Ext.getCmp('selctRaceBtn').setHidden(true);
        Ext.getCmp('refreshLiveBtn').setHidden(true);
        
        var streamId = record.get('i');
        
        sci.app.watchedStreamId = record;
        var isFav = false;
        if(record.get('fid') != '') isFav = true;
        if(isFav) Ext.getCmp('favoriteBtn').setUi('confirm'); else Ext.getCmp('favoriteBtn').setUi('decline');
        Ext.getCmp('favoriteBtn').setHidden(false);

        var htmlStream = '';
        if(record.get('s') == 'twitch') {
            htmlStream = '<object type="application/x-shockwave-flash" height="100%" width="100%" id="live_embed_player_flash"' +
            'data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+streamId+'" bgcolor="#000000">' +
                            '<param name="allowFullScreen" value="true" />' +
                            '<param name="allowScriptAccess" value="always" />' +
                            '<param name="allowNetworking" value="all" />' +
                            '<param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" />' +
                            '<param name="flashvars" value="hostname=www.twitch.tv&channel='+streamId+'&auto_play=true&start_volume=25" /></object>'; 
        } else if(record.get('s') == 'own3d') {
            htmlStream = '<object width="100%" height="100%"><param name="movie" value="http://www.own3d.tv/livestream/'+streamId+';autoplay=true" />' +
                            '<param name="allowscriptaccess" value="always" />' +
                            '<param name="allowfullscreen" value="true" />' +
                            '<param name="wmode" value="transparent" />' +
                            '<embed src="http://www.own3d.tv/livestream/'+streamId+';autoplay=true" type="application/x-shockwave-flash" allowfullscreen="true"' +
                            'allowscriptaccess="always" width="100%" height="100%" wmode="transparent"></embed></object>';
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
        sci.app.setRace();
    },
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        if(sci.app.showPreview) Ext.getCmp('streamslist').setItemTpl(sci.app.itemTplWithPrev);
        else Ext.getCmp('streamslist').setItemTpl(sci.app.itemTplNonPrev);
        sci.app.refreshList();
    }
});