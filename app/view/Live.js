Ext.define('sci.view.Live', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.data.Store',
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.field.Select',
        'Ext.plugin.ListPaging'
    ],
    xtype: 'live',
    
    config: {
        title: 'Featured',
        iconCls: 'favorites',
        id: 'liveWindow',
        navigationBar: {
            items: [
                {
                    xtype: 'selectfield',
                    maxWidth: 'auto',
                    minWidth: 'auto',
                    width: '130px',
                    id: 'selctRaceBtn',
                    options: [
                        {text: 'All races',  value: 'a'},
                        {text: 'terran', value: 't'},
                        {text: 'protoss',  value: 'p'},
                        {text: 'zerg',  value: 'z'}
                    ]
                },
                {
                    xtype: 'button',
                    id: 'favoriteBtn',
                    iconCls: 'star',
                    iconMask: true,
                    ui: 'decline',
                    align: 'right',
                    hidden: true 
                },
                {
                    xtype: 'button',
                    id: 'refreshLiveBtn',
                    iconCls: 'refresh',
                    iconMask: true,
                    ui: 'confirm',
                    align: 'right'
                }
            ]
        },
        listeners : {
            back: function() {
                sci.app.watchedStreamId = null;
                Ext.getCmp('favoriteBtn').setHidden(true);
                Ext.getCmp('refreshLiveBtn').setHidden(false);
                Ext.getCmp('selctRaceBtn').setHidden(false);
                //TODO: show main buttons
            }
        },
        items: {
            xtype: 'list',
            //itemTpl: sci.app.itemTplWithPrev,
            title: '',
            id: 'streamslist',
            //n - player name (server)
            //r - player race (server)
            //s - streamType (server)
            //i - streamID (server)
            //v - viewers (server)
            //p - preview(img) (generated)
            //f - favorite (localstorage)
            //fid - favorite id (localstorage)
            fields: ['n', 'r', 's', 'i', 'v', 'p', 'f', 'fid'],
            store: {
                autoLoad: true,
                fields: ['n', 'r', 's', 'i', 'v', 'p', 'f', 'fid'],
            },
        }
    }
})
