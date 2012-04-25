Ext.define('sci.view.Streams', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.data.Store',
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.plugin.ListPaging'
    ],
    xtype: 'streams',
    
    config: {
        title: 'All',
        iconCls: 'team',
        id: 'streamsWindow',
        navigationBar: {
            items: [
                {
                    xtype: 'selectfield',
                    maxWidth: 'auto',
                    minWidth: 'auto',
                    width: '110px',
                    id: 'selctRaceBtnAll',
                    hidden: true,
                    options: [
                        {text: 'All races',  value: 'a'}
                    ]
                },
                {
                    xtype: 'button',
                    id: 'favoriteBtnAll',
                    iconCls: 'star',
                    iconMask: true,
                    ui: 'decline',
                    align: 'right',
                    hidden: true 
                },
                {
                    xtype: 'button',
                    id: 'refreshLiveBtnAll',
                    iconCls: 'refresh',
                    iconMask: true,
                    ui: 'confirm',
                    align: 'right'
                }
            ]
        },
        listeners : {
            back: function() {
                sci.app.watchedStreamIdAll = null;
                Ext.getCmp('favoriteBtnAll').setHidden(true);
                Ext.getCmp('refreshLiveBtnAll').setHidden(false);
            }
        },
        items: {
            xtype: 'list',
            //itemTpl: sci.app.itemTplWithPrevAll,
            title: 'Streams',
            id: 'streamslistAll',
            plugins: [
                {
                    id: 'streamslistPagingAll',
                    xclass: 'Ext.plugin.ListPaging',
                    autoPaging: false
                }
            ],
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
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: ''
                    }
                }
            },
        }
    }
})
