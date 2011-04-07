var options = {
	/**
	 * Given the URL for the site with user-friendly traffic-level view this returns the corresponding URL from which the traffic level is parsed.
	 * 
	 * @author Johannes Müller
	 * @param trafficViewURL the URL to the site with user-friendly output of the traffic level
	 * @returns the corresponding URL where the traffic-level is viewed
	 */
	trafficViewURL2trafficURL : function(trafficViewURL) {
		switch (trafficViewURL) {
		case "https://www.wh2.tu-dresden.de/usertraffic":
			return "http://www.wh2.tu-dresden.de/traffic/getMyTraffic.php";
		case "http://www.wh17.tu-dresden.de/de/fuer-unsere-netznutzer/mein-traffic.html":
			return "http://www.wh17.tu-dresden.de/traf/traffic_percent.php";
		case "http://www.wh25.tu-dresden.de/zeuser/agdsnISAPI.php?site=traffic":
			return "www.http://wh25.tu-dresden.de/traffic.php";
		case "https://wh12.tu-dresden.de/traffic-o-meter.html":
			return "https://wh12.tu-dresden.de/tom.addon2.php";
		case "http://wh10.tu-dresden.de/phpskripte/getMyTraffic.php":
			return "http://wh10.tu-dresden.de/index.php/traffic.html";
		default:
			/*throw exception*/
			return null;
		}
	},
	/**
	 * Callback for onload function in options.xul to initialize the gui for preferences.
	 * 
	 * options.xul describes the gui for trafficmonitor's preferences and calls this function with the onpaneload Attribute of the prefpane Tag.
	 * This function initializes the interface by selecting the current menuitem element in the meulist.
	 * 
	 * @author Johannes Müller  
	 */
	onLoad : function( ) {
		var menupopup = document.getElementById("menuTrafficViewURL");
		for ( var i = 0; i < menupopup.childNodes.length; i++) {
			if (menupopup.childNodes[i].value == persistencyMgr.getChar(
					"trafficmonitor", "trafficViewURL")) {  

				menupopup.parentNode.selectedIndex = i;
				break;
			}
		}
	}
};