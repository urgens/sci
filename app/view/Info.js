Ext.define('sci.view.Info', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.TitleBar'
    ],
    xtype: 'info',
    
    config: {
        title: 'Home',
        iconCls: 'home',
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