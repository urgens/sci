Ext.define("sci.view.Main", {
    extend: 'Ext.tab.Panel',

    config: {
        tabBarPosition: 'bottom',
        items: [
            {
                xtype: 'info'
            },
            {
                xtype: 'live'
            },
            {
                xtype: 'settings'
            }
        ]
    }
});