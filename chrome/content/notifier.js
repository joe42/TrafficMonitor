/**
 * Object to handle notifications in Firefox.
 * 
 * @author Johannes Müller
 */
var notifier = {
	/**
	 * Gives a temporary warning with a message, like the standard "finished download"
	 * message of firefox.
	 * 
	 * @author Johannes Müller 
	 * @param msg message of the warning
	 */
	warnLvl1 : function(msg) {
		//var notificationBox = gBrowser.getNotificationBox(); 
		//notificationBox.appendNotification( msg, "warning", null, notificationBox.PRIORITY_WARNING_MEDIUM);
		var title = "Traffic Monitor Warning";//title of warn-message
		try {
			Components.classes['@mozilla.org/alerts-service;1'].getService(
					Components.interfaces.nsIAlertsService)
					.showAlertNotification(null, title, msg, false, '', null);
		} catch (e) {
			// prevents runtime error on platforms that don't implement nsIAlertsService  
			var image = null;
			var win = Components.classes['@mozilla.org/embedcomp/window-watcher;1']
					.getService(Components.interfaces.nsIWindowWatcher)
					.openWindow(null,
							'chrome://global/content/alerts/alert.xul',
							'_blank', 'chrome,titlebar=no,popup=yes', null);
			win.arguments = [ image, title, msg, false, '' ];
		}
	},
	/**
	 * Gives a permanent warning with a message, like the standard popup-blocked
	 * message of firefox. It can be removed by clicking an OK-button.
	 * 
	 * @author Johannes Müller
	 * @param msg
	 */
	warnLvl2 : function(msg) {
		var nb = gBrowser.getNotificationBox();
		var buttons = [ {
			label : 'OK',
			accessKey : null,
			callback : this.closeNotification
		} ];

		const
		priority = nb.PRIORITY_WARNING_MEDIUM;
		nb.appendNotification(msg, 'popup-blocked',
				'chrome://browser/skin/Info.png', priority, buttons);

	},
	/**
	 * Removes a current notification.
	 * 
	 * @author Johannes Müller 
	 */
	closeNotification : function() {
		gBrowser.getNotificationBox().removeCurrentNotification();
	}
}