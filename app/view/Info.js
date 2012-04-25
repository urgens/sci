Ext.define('sci.view.Info', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.TitleBar'
    ],
    xtype: 'info',
    
    config: {
        title: 'About',
        iconCls: 'info',
        scrollable: 'vertical',
        items: [
            {
                xtype: 'panel',
                title: 'About app',
                styleHtmlContent: true,
                html: 'asdasd'
            }
        ]
    }
})