//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.application({
    
    refreshStatus: false,
    refreshTime: 60000,
    serverListLive: null,
    favList: {},
    watchedStreamId: null,
    showPreview: true,
    itemTplWithPrev: '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; width: 120px; height: 90px; margin-right: 20px">'+
                                '<img width="120px" height="90px" src="{p}" />'+
                            '</div>'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>race: <tpl for="r">'+
                                '<img src="resources/images/{t}.png" />'+
                            '</tpl></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>',

    itemTplNonPrev: '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>race: <tpl for="r">'+
                                '<img src="resources/images/{t}.png" />'+
                            '</tpl></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>',

    saveToStorage: function(player, stream, idstream) {
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
    },

    removeFromStorage: function(id) {
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
    },

    setStorage: function() {
        if (typeof(localStorage) == 'undefined' ) {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            var size = 0; 
            for(x in sci.app.favList) {
                localStorage.setItem("sizeFav", 0);
                try {
                    localStorage.setItem("fav"+size, "{'n':'" + sci.app.favList[x].n + "','s':'" + sci.app.favList[x].s + "','i':'" + sci.app.favList[x].i + "','id':'"+ size +"'}");
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
    },

    getStorage: function() {
        if (typeof(localStorage) == 'undefined' ) {
            //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
            sci.app.favList =  eval('[]');
        } else {
            if(localStorage.getItem("showPreview") == 'false') sci.app.showPreview = false;
            else  sci.app.showPreview = true;
            if(localStorage.getItem("pagination") == 'false') sci.app.paginationAll = false;
            else  sci.app.paginationAll = true;
            
            var needToSet = false;
            var temp = null;
            var size = localStorage.getItem("sizeFav");
            var fav = '[';
            if(size > 0) {
                for(x=0; x<size; x++) {
                    temp = localStorage.getItem("fav"+x);
                    if(temp != null) {
                        fav += localStorage.getItem("fav"+x) + ',';
                    } else {
                        needToSet = true;
                    }
                }
            }
            fav += ']';
            try {
                sci.app.favList =  eval(fav);
                if(needToSet) { //for compression index
                    localStorage.clear();
                    sci.app.setStorage();
                }
            } catch(e) {
                    //error eval?
            }
        }
    },
    
    manageFavorite: function(watched, addToFav) {
        if(addToFav) { //add to favorite
            if(watched != null) {
                var size = localStorage.getItem("sizeFav");
                if(size == null) size = 0;
                var player = watched.get('n');
                var stream = watched.get('s');
                var idstream = watched.get('i');
                watched.set('f', 'favstm');
                watched.set('fid', size);
                sci.app.favList[size] = {'n': player,'s':stream ,'i': idstream,'id': size};
                sci.app.saveToStorage(player, stream, idstream);
            }
        } else { //remove from favorite
            sci.app.favList[watched.get('fid')] = {};
            sci.app.removeFromStorage(watched.get('fid'));
            watched.set('f', '');
            watched.set('fid', '');
        }
    },
    
    setRace: function() {
        var race = Ext.getCmp('selctRaceBtn').getValue();
        Ext.getCmp('streamslist').up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        var response = [];
        var size = 0;
        switch(race) {
            case 'a':
                response = sci.app.serverListLive;
                break; 
            case 't':
            case 'p':
            case 'z':
                for(x in sci.app.serverListLive) {
                    for(y in sci.app.serverListLive[x].r) {
                        if(sci.app.serverListLive[x].r[y].t == race) {
                            response[size++] = sci.app.serverListLive[x]
                            break;
                        }
                    }
                }
                break;
        }
        var streamList = Ext.getCmp('streamslist');
        //streamList.setItemTpl(sci.app.itemTplNonPrev);
        if(sci.app.showPreview) Ext.getCmp('streamslist').setItemTpl(sci.app.itemTplWithPrev);
        else Ext.getCmp('streamslist').setItemTpl(sci.app.itemTplNonPrev);
        var store = Ext.getCmp('streamslist').getStore();
        store.setData(response);
        streamList.up().setMasked(false);
    },

    refreshList: function () {
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
                    response[x].f = '';
                    response[x].fid = '';
                    for(y in sci.app.favList) {
                        if(sci.app.favList[y].i == response[x].i) {
                            if(sci.app.favList[y].s == response[x].s) {
                                response[x].f = 'favstm';
                                response[x].fid = sci.app.favList[y].id;
                                break;
                            }
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
                
                sci.app.serverListLive = response;
                sci.app.setRace();
                //Ext.getCmp('streamslist').getStore().setData(response);
                //Ext.getCmp('streamslist').up().setMasked(false);
            },
            failure: function () {}
        });
    },

    timeoutTask: null,
    
    refreshTask: function () {
        if(sci.app.refreshStatus) {
            Ext.getCmp('streamslist').up().setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });
            sci.app.refreshList();
            sci.app.timeoutTask = setTimeout("sci.app.refreshTask()", sci.app.refreshTime);
        }
    },
    
    itemTplWithPrevAll: '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; width: 120px; height: 90px; margin-right: 20px">'+
                                '<img width="120px" height="90px" src="{p}" />'+
                            '</div>'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>',

    itemTplNonPrevAll: '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>',

    serverListLiveAll: null,
    watchedStreamIdAll: null,
    paginationAll: true,
    initItemsPageAll: 5,
    itemsPageAll: this.initItemsPageAll,
    
    setRaceAll: function() {
        var streamListAll = Ext.getCmp('streamslistAll');
        streamListAll.up().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        //TODO: settings with or without preview img
        //streamList.setItemTpl(sci.app.itemTplNonPrevAll);
        if(sci.app.showPreview) Ext.getCmp('streamslistAll').setItemTpl(sci.app.itemTplWithPrevAll);
        else Ext.getCmp('streamslistAll').setItemTpl(sci.app.itemTplNonPrevAll);
        var store = Ext.getCmp('streamslistAll').getStore();
        if(sci.app.paginationAll) {
            store.setData(sci.app.serverListLiveAll.slice(0, sci.app.itemsPageAll));
            if(sci.app.serverListLiveAll.length <= sci.app.itemsPageAll) {
                Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().hide();
            } else {
                Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().show();
            }
        } else {
            store.setData(sci.app.serverListLiveAll);
            Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().hide();
        }
        streamListAll.up().setMasked(false);
    },
    
    refreshListAll: function () {
        sci.app.itemsPageAll = sci.app.initItemsPageAll;
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
                    response[x].f = '';
                    response[x].fid = '';
                    for(y in sci.app.favList) {
                        if(sci.app.favList[y].i == response[x].i) {
                            if(sci.app.favList[y].s == response[x].s) {
                                response[x].f = 'favstm';
                                response[x].fid = sci.app.favList[y].id;
                                break;
                            }
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
                
                sci.app.serverListLiveAll = response;
                sci.app.setRaceAll();
            },
            failure: function () {}
        });
    },
    
    controllers: ["Settings", "Streams", "Live"],

    name: 'sci',

    requires: [
        'Ext.MessageBox'
    ],

    views: ['Main', 'Info', 'Live', 'Streams', 'Settings'],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

         var loadNextPage = Ext.plugin.ListPaging.prototype.loadNextPage;
         Ext.override(Ext.plugin.ListPaging, {
            loadNextPage: function() {
                var positionY = Ext.getCmp('streamslistPagingAll').getScroller().position.y;
                sci.app.itemsPageAll+=sci.app.initItemsPageAll;
                sci.app.setRaceAll();
                Ext.getCmp('streamslistPagingAll').getScroller().scrollTo(null, positionY);
                //this.scrollY = this.getScroller().position.y;
            }
         });
         
        sci.app.getStorage();
        // Initialize the main view
        Ext.Viewport.add(Ext.create('sci.view.Main'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
