var asd;
Ext.define('sci.controller.Settings', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            
        },
        control: {
            '#togglePreview': {
                change: 'setpreview'
            },
            '#toggleTime': {
                change: 'settimer'
            },
            '#timeOptionBtn': {
                tap: 'resettimers'
            },
            '#togglePagination': {
                change: 'setpagination'
            }
        }
    },
    setpagination: function(_0, _1, _2, newValue, oldValue, _3) {
        if(newValue == 0) {
            sci.app.paginationAll = true;
            //Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().show();
        } else {
            sci.app.paginationAll = false;
            //Ext.getCmp('streamslistPagingAll').getLoadMoreCmp().hide();
        }
        if (typeof(localStorage) == 'undefined' ) {
            //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            localStorage.setItem("pagination", sci.app.paginationAll);
        }
    },
    setpreview: function(_0, _1, _2, newValue, oldValue, _3) {
        if(newValue == 0) {
            sci.app.showPreview = true;
        } else {
            sci.app.showPreview = false;
        }
        if (typeof(localStorage) == 'undefined' ) {
            //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            localStorage.setItem("showPreview", sci.app.showPreview);
        }
    },
    resettimers: function() {
        try {
            clearTimeout(sci.app.timeoutTask);
        } catch(e) {}
        if(Ext.getCmp('timeOptions0').isChecked()) {
            sci.app.refreshTime = 120000;
        } else if(Ext.getCmp('timeOptions1').isChecked()) {
            sci.app.refreshTime = 300000;
        } else {
            sci.app.refreshTime = 600000;
        }
        if (typeof(localStorage) == 'undefined' ) {
            //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            localStorage.setItem("refreshTime", sci.app.refreshTime);
        }
        sci.app.timeoutTask = setTimeout("sci.app.refreshTask()", sci.app.refreshTime);
    },
    
    settimer: function(_0, _1, _2, newValue, oldValue, _3) {
        try {
            clearTimeout(sci.app.timeoutTask);
        } catch(e) {}
        var options = Ext.getCmp('timeOptions');
        sci.app.refreshStatus = false;
        asd = newValue 
        if(newValue == 0) {
            sci.app.refreshStatus = true;
            if(Ext.getCmp('timeOptions0').isChecked()) {
                sci.app.refreshTime = 120000;
            } else if(Ext.getCmp('timeOptions1').isChecked()) {
                sci.app.refreshTime = 300000;
            } else {
                sci.app.refreshTime = 600000;
            }
            sci.app.timeoutTask = setTimeout("sci.app.refreshTask()", sci.app.refreshTime);
        }
        if (typeof(localStorage) == 'undefined' ) {
            //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            localStorage.setItem("refreshStatus", sci.app.refreshStatus);
            localStorage.setItem("refreshTime", sci.app.refreshTime);
        }
        Ext.getCmp('timeOptionBtn').setDisabled(!sci.app.refreshStatus);
        if(!sci.app.refreshStatus)
            Ext.getCmp('timeOptionBtn').setUi('normal');
        else
            Ext.getCmp('timeOptionBtn').setUi('confirm');
        Ext.getCmp('timeOptions').setDisabled(!sci.app.refreshStatus);
        Ext.getCmp('timeOptions0').setDisabled(!sci.app.refreshStatus);
        Ext.getCmp('timeOptions1').setDisabled(!sci.app.refreshStatus);
        Ext.getCmp('timeOptions2').setDisabled(!sci.app.refreshStatus);
    },
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        if(!sci.app.paginationAll) {
            Ext.getCmp('togglePagination').setValue(0);
        }
        if(!sci.app.showPreview) {
            Ext.getCmp('togglePreview').setValue(0);
        }
        if (typeof(localStorage) == 'undefined' ) {
            //alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            if(localStorage.getItem("refreshStatus") == 'true')
                sci.app.refreshStatus = true;
            else
                sci.app.refreshStatus = false;
            sci.app.refreshTime = Number(localStorage.getItem("refreshTime"));
            switch(sci.app.refreshTime) {
                case 600000:
                    Ext.getCmp('timeOptions2').setChecked(true);
                    break;
                case 300000:
                    Ext.getCmp('timeOptions1').setChecked(true);
                    break;
                default:
                    Ext.getCmp('timeOptions0').setChecked(true);
                    break;
            }
            if(sci.app.refreshStatus) {
                Ext.getCmp('toggleTime').setValue(1);
                Ext.getCmp('timeOptionBtn').setDisabled(false);
                Ext.getCmp('timeOptionBtn').setUi('confirm');
                Ext.getCmp('timeOptions').setDisabled(false);
                Ext.getCmp('timeOptions0').setDisabled(false);
                Ext.getCmp('timeOptions1').setDisabled(false);
                Ext.getCmp('timeOptions2').setDisabled(false);
                sci.app.timeoutTask = setTimeout("sci.app.refreshTask()", sci.app.refreshTime);
            }
        }
    }
});