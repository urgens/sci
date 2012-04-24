Ext.define('sci.view.Live', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.data.Store',
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.field.Select'
    ],
    xtype: 'live',
    
    config: {
        title: 'Live',
        iconCls: 'star',
        navigationBar: {
            items: [
                {
                    xtype: 'selectfield',
                    maxWidth: 'auto',
                    minWidth: 'auto',
                    width: '110px',
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
                watchedStream = null;
                Ext.getCmp('favoriteBtn').setHidden(true);
                Ext.getCmp('refreshLiveBtn').setHidden(false);
                Ext.getCmp('selctRaceBtn').setHidden(false);
                //TODO: show main buttons
            }
        },
        items: {
            xtype: 'list',
            itemTpl:    '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
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
            title: 'Live',
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
                fields: ['n', 'r', 's', 'i', 'v', 'p', 'f', 'fid']
            },
        }
    }
})
