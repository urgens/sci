var itemTplWithPrev = '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
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
                        '</div>';
var itemTplNonPrev = '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>race: <tpl for="r">'+
                                '<img src="resources/images/{t}.png" />'+
                            '</tpl></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>';

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
            itemTpl: itemTplWithPrev,
            title: 'Featured Streams',
            id: 'streamslist',
            plugins: [
                {
                    id: 'streamslistPaging',
                    xclass: 'Ext.plugin.ListPaging',
                    autoPaging: false,
                    applyLoadMoreCmp: function(config) {
                        config = Ext.merge(config, {
                            html: this.getLoadTpl().apply({
                                cssPrefix: Ext.baseCSSPrefix,
                                message: this.getLoadMoreText()
                            }),
                            
                            listeners: {
                                tap: {
                                    fn: function() {
                                        var positionY = Ext.getCmp('streamslistPaging').getScroller().position.y;
                                        itemsPage+=initItemsPage;
                                        setRace();
                                        Ext.getCmp('streamslistPaging').getScroller().scrollTo(null, positionY);
                                    },//this.loadNextPage,
                                    scope: this,
                                    element: 'element'
                                }
                            }
                        });
                        return Ext.factory(config, Ext.Component, this.getLoadMoreCmp());
                    }
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
