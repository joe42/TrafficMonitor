var notifier = {
	warnLvl1: function ( msg ) { 
		//var notificationBox = gBrowser.getNotificationBox(); 
		//notificationBox.appendNotification( msg, "warning", null, notificationBox.PRIORITY_WARNING_MEDIUM);
		var title = "Traffic Monitor Warning";
		try {  
			Components.classes['@mozilla.org/alerts-service;1']  
				  .getService(Components.interfaces.nsIAlertsService)  
				  .showAlertNotification(null, title, msg, false, '', null)  
		} catch(e) {  
		    // prevents runtime error on platforms that don't implement nsIAlertsService  
			var image = null  
	        var win = Components.classes['@mozilla.org/embedcomp/window-watcher;1']  
	                            .getService(Components.interfaces.nsIWindowWatcher)  
	                            .openWindow(null, 'chrome://global/content/alerts/alert.xul',  
	                                        '_blank', 'chrome,titlebar=no,popup=yes', null)  
		    win.arguments = [image, title, msg, false, '']  
		}				
	}, 
	warnLvl2: function ( msg ) {  
		var nb = gBrowser.getNotificationBox() 
		var buttons = [{
			label: 'OK',
			accessKey: null,    
			callback: this.closeNotification
		}]

		const priority = nb.PRIORITY_WARNING_MEDIUM
		nb.appendNotification(msg, 'popup-blocked',
							 'chrome://browser/skin/Info.png',
							  priority, buttons) 
				
	}, 
	closeNotification: function ( notification, buttonDesc ) {   
		notifyBox = gBrowser.getNotificationBox().removeCurrentNotification();
	}
}