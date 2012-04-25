var itemTplWithPrevAll = '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; width: 120px; height: 90px; margin-right: 20px">'+
                                '<img width="120px" height="90px" src="{p}" />'+
                            '</div>'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>';
var itemTplNonPrevAll = '<div style="display: -webkit-box; -webkit-box-orient: horizontal;">'+
                            '<div style="display: -webkit-box; -webkit-box-flex: 1; -webkit-box-orient: vertical;">'+
                            '<div class="{f}"><b>{n}</b></div>'+
                            '<div>viewers: {v}</div>'+
                            '<div>@{s}</div>'+
                        '</div>';

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
                watchedStreamAll = null;
                Ext.getCmp('favoriteBtnAll').setHidden(true);
                Ext.getCmp('refreshLiveBtnAll').setHidden(false);
                //Ext.getCmp('selctRaceBtnAll').setHidden(false);
                //TODO: show main buttons
            }
        },
        items: {
            xtype: 'list',
            itemTpl: itemTplWithPrevAll,
            title: 'All Streams',
            id: 'streamslistAll',
            plugins: [
                {
                    id: 'streamslistPagingAll',
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
                                        var positionY = Ext.getCmp('streamslistPagingAll').getScroller().position.y;
                                        itemsPageAll+=initItemsPageAll;
                                        setRaceAll();
                                        Ext.getCmp('streamslistPagingAll').getScroller().scrollTo(null, positionY);
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
