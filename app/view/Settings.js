Ext.define('sci.view.Settings', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.TitleBar'
    ],
    xtype: 'settings',
    
    config: {
        title: 'Settings',
        iconCls: 'settings',
        scrollable: 'vertical',
        items: {
            xtype: 'panel',
            title: 'Configure app',
            styleHtmlContent: true,
            html: 'settings'
        }
    }
})