Ext.define('sci.view.Settings', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.data.proxy.JsonP',
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.Toggle',
        'Ext.field.Radio'
    ],
    xtype: 'settings',
    
    config: {
        title: 'Settings',
        iconCls: 'settings',
        
        items: {
            xtype: 'panel',
            title: 'Settings',
            styleHtmlContent: true,
            scrollable: 'vertical',
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Global',
                    margin: 0,
                    padding: 0,
                    instructions: '',
                    items: [
                        {
                            xtype: 'togglefield',
                            id: 'togglePreview',
                            label: 'Show previews',
                            value: 1,
                            labelWidth: '60%'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Featured Category',
                    margin: 0,
                    padding: 0,
                    instructions: '',
                    items: [
                        {
                            xtype: 'togglefield',
                            label: 'Auto refresh',
                            id: 'toggleTime',
                            value: 0,
                            labelWidth: '60%'
                        },
                        {
                            xtype: 'fieldset',
                            title: 'time between:',
                            id: 'timeOptions',
                            instructions: '',
                            disabled: true,
                            items: [
                                {
                                    xtype: 'radiofield',
                                    labelWidth: '80%',
                                    id: 'timeOptions0',
                                    name : 'time',
                                    value: '0',
                                    disabled: true,
                                    label: '2 minutes'
                                },
                                {
                                    xtype: 'radiofield',
                                    labelWidth: '80%',
                                    id: 'timeOptions1',
                                    name : 'time',
                                    value: '1',
                                    label: '5 minutes',
                                    disabled: true
                                },
                                {
                                    xtype: 'radiofield',
                                    labelWidth: '80%',
                                    id: 'timeOptions2',
                                    name : 'time',
                                    value: '2',
                                    disabled: true,
                                    label: '10 minutes'
                                },
                                {
                                    xtype: 'button',
                                    id: 'timeOptionBtn',
                                    ui: 'normal',
                                    disabled: true,
                                    text: 'Apply'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'All Category',
                    margin: 0,
                    padding: 0,
                    instructions: 'Recommend enabled!',
                    items: [
                        {
                            xtype: 'togglefield',
                            id: 'togglePagination',
                            label: 'Pagination',
                            value: 1,
                            labelWidth: '60%'
                        }
                    ]
                }
            ]
        }
    }
})