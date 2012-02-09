/**
 * Manages the display of the traffic-level with trafficmonitor.xul and notifier.js.
 *  
 * @author Johannes Müller
 */
var trafficStatus = {

	viewElement : null,
	viewAttribute : "",
	prefs : null,
	WarnLvl1 : 0,
	WarnLvl2 : 0,
	trafficURL : "",
	trafficViewURL : "",
	trafficViewURLs : [ 
	               "http://www.wh17.tu-dresden.de/traffic/uebersicht",
	               "https://www.wh2.tu-dresden.de/usertraffic",
	               "http://www.wh25.tu-dresden.de/zeuser/agdsnISAPI.php?site=traffic", 
	               "https://wh12.tu-dresden.de/traffic-o-meter.html",
	               "http://wh10.tu-dresden.de/index.php/traffic.html", ],
	/**
	 * Opens a new tab with the current URL to the site with a user-friendly view of the traffic level.
	 * 
	 * @author Johannes Müller
	 */
	viewTrafficPage : function() {
		this.newTab(this.trafficViewURL);
	},
	/**
	 * Sets the color of the font used to display the traffic level.
	 * 
	 * @author Johannes Müller
	 * @param color the color in HTML-style
	 */
	setColor : function(color) {
		document.getElementById("my-panel").setAttribute("style",
				"color:" + color + ";");
	},
	/**
	 * Initializes the extension.
	 * 
	 * @author Johannes Müller
	 * @param viewElementID id of the XML-Tag used to display the traffic level.
	 * @param viewAttribute attribute of the XML-Tag described by <code>viewElementID</code> to store the traffic level 
	 */
	init : function(viewElementID, viewAttribute) {
		//initialize observer for preferences dialog:  
		persistencyMgr.addObserver("trafficmonitor", this); //monitor changes to the domain "trafficmonitor"
		//initialize the site for user-friendly traffic level view and site for parsing the traffic level
		this.trafficURL = persistencyMgr.getChar("trafficmonitor",
				"trafficURL");
		this.trafficViewURL = persistencyMgr.getChar("trafficmonitor",
				"trafficViewURL");
		if(this.trafficViewURL=="" || this.trafficURL=="http://www.wh2.tu-dresden.de/traffic/getMyTraffic.php"){
			this.findTrafficViewURL();
		}
		//get levels the user is warned on if they are exceeded
		this.WarnLvl1 = persistencyMgr.getInt("trafficmonitor", "WarnLvl1");
		this.WarnLvl2 = persistencyMgr.getInt("trafficmonitor", "WarnLvl2");

		this.viewElement = document.getElementById(viewElementID); //set view element
		this.viewAttribute = viewAttribute;
		this.getTraffic(); //get the traffic level and display it
		setInterval( "trafficStatus.getTraffic()", 60 * 1000 * 5 );
	},

	/**
	 * Observes the changes in traffic-warn-levels and URLs which view the traffic. 
	 * 
	 * @author Johannes Müller
	 * @param subject
	 * @param topic 
	 * @param data name of the value that changed in the registered domain
	 */
	observe : function(subject, topic, data) {
		if (topic != "nsPref:changed") {
			return;
		}
		//if some data has changed in the registered domain:
		switch (data) {
		case "trafficViewURL": //URL changed
			this.trafficViewURL = persistencyMgr.getChar("trafficmonitor",
					"trafficViewURL");
			this.trafficURL = options
					.trafficViewURL2trafficURL(this.trafficViewURL); //get corresponding URL to parse traffic level
			persistencyMgr.setChar("trafficmonitor", "trafficURL",
					this.trafficURL);//store as default
			this.getTraffic(); //refresh view
			break;
		case "WarnLvl1": //change of warnlevel 1
			this.WarnLvl1 = persistencyMgr.getInt("trafficmonitor",
					"WarnLvl1");
			this.getTraffic();
			break;
		case "WarnLvl2": //change of warnlevel 2
			this.WarnLvl2 = persistencyMgr.getInt("trafficmonitor",
					"WarnLvl2");
			this.getTraffic();
			break;
		}
	},

	/**
	 * Gives notifications on exceeding the boundaries determined by integer warn-level 1 and 2.
	 * 
	 * Sets boolean warn-levels appropriately. 
	 * Only on falling below 5% of the integer warn-level 1, the corresponding integer warn-level is set back. 
	 * 
	 * @author Johannes Müller
	 * @param traffic current level of traffic
	 */
	checkTraffic : function(traffic) {
		if (traffic < this.WarnLvl1 - 5 && this.isWarnLvl1()) { //real traffic is below limit 
			this.setWarnLvl1(false); // user should be warned for the next time he exceeds the limit
		}
		if (traffic > this.WarnLvl1 && !this.isWarnLvl1()) { //real traffic is above limit and user has not yet been warned
			notifier.warnLvl1("Traffic over " + this.WarnLvl1
					+ "%. Please be careful!");
			this.setWarnLvl1(true);
		}
		if (traffic < this.WarnLvl2 && this.isWarnLvl2()) { //real traffic is below limit 
			this.setWarnLvl2(false); // user should be warned for the next time he exceeds the limit
		}
		if (traffic > this.WarnLvl2 && !this.isWarnLvl2()) { //real traffic is above limit and user has not yet been warned
			notifier.warnLvl2("Traffic over " + this.WarnLvl2
					+ "%. Please do not exceed your traffic limit!");
			this.setWarnLvl2(true);
		}
	},
	/**
	 * Opens up a new tab in firefox with the given URL.
	 * 
	 * @author Johannes Müller
	 * @param url URL of the new tab
	 */
	newTab : function(url) {
		var browser = top.document.getElementById("content");
		var newtab = browser.addTab(decodeURIComponent(url));
		browser.selectedTab = newtab;
	},
	/**
	 * Shows the current traffic level <code>traffic</code>.
	 * 
	 * Also hides the display if the URL to parse the traffic level from does not return the traffic.
	 * Replaces the display with an appropriate error message if an error occurs.
	 * Checks for exceeded boundaries and colorizes the font accordingly.
	 * 
	 * @author Johannes Müller
	 * @param traffic
	 * @returns
	 */
	showTraffic : function(traffic) {
		if (traffic == "Error loading page") {
			this.viewElement.hidden = true;
		} else {
			this.checkTraffic(traffic);
			this.viewElement.hidden = false;
			this.viewElement.setAttribute(this.viewAttribute, traffic + "%");
			this.colorize();
		}
	},
	/**
	 * Tells if warn-level 1 has been exceeded.
	 * 
	 * @author Johannes Müller
	 * @returns true iff. warn-level 1 has been exceeded and not been set back yet.
	 */
	isWarnLvl1 : function() {
		return persistencyMgr.getBool("trafficmon", "WarnLvl1");
	},
	/**
	 * Tells if warn-level 2 has been exceeded.
	 * 
	 * @author Johannes Müller
	 * @returns true iff. warn-level 2 has been exceeded and not been set back yet.
	 */
	isWarnLvl2 : function() {
		return persistencyMgr.getBool("trafficmon", "WarnLvl2");
	},
	/**
	 * Set the warn-level 1.
	 * 
	 * @author Johannes Müller
	 * @param bool indicates if the warn-level has been exceeded or should be set back.
	 */
	setWarnLvl1 : function(bool) {
		persistencyMgr.setBool("trafficmon", "WarnLvl1", bool);
	},
	/**
	 * Set the warn-level 2.
	 * 
	 * @author Johannes Müller
	 * @param bool indicates if the warn-level has been exceeded or should be set back.
	 */
	setWarnLvl2 : function(bool) {
		persistencyMgr.setBool("trafficmon", "WarnLvl2", bool);
	},
	/**
	 * Colorizes the font of the traffic display.
	 * 
	 * @author Johannes Müller
	 */
	colorize : function() {
		this.setColor("");
		if (this.isWarnLvl1())
			this.setColor("green");
		if (this.isWarnLvl2())
			this.setColor("red");
	},
	/**
	 * Gets the traffic from the URL from which to parse the traffic-level.
	 * 
	 * Parses the traffic level and calls {@link showTraffic(traffic)} to display traffic-level.
	 * 
	 * @author Johannes Müller
	 */
	getTraffic : function() {
		var req = new XMLHttpRequest();
		req.open('GET', this.trafficURL, true);
		req.onreadystatechange = function(aEvt) {
			if (req.readyState == 4) {
				if (req.status != 200) {
					trafficStatus.showTraffic("Error loading page");
					return;
				}
				var traffic = Math.round(parseFloat(req.responseText));
				if (traffic == -1) {
					trafficStatus.showTraffic("Error loading page");
					return;
				}
				trafficStatus.showTraffic(traffic);
			}
		};
		req.send(null);
	},
	/**
	 * Sets the URL for the user-friendly view of the traffic-level and the URL form which the traffic level is parsed.
	 * 
	 * The URL is determined by checking the return value of all 
	 * possible sites for the corresponding site from which the traffic can be parsed.
	 * It is synchronous.
	 * 
	 * @author Johannes Müller 
	 */ 
	findTrafficViewURL: function() {   
		var req = new XMLHttpRequest();
		for ( var i in this.trafficViewURLs) {
			var trafficViewURL = this.trafficViewURLs[i];
			var trafficURL = options.trafficViewURL2trafficURL(trafficViewURL);  
			req.open('GET', trafficURL, false);  
			req.send(null);
			if (req.status == 200) { 
				var traffic = Math.round(parseFloat(req.responseText));
				if (traffic != -1) { 
					this.trafficViewURL = trafficViewURL;
					this.trafficURL = trafficURL;
					persistencyMgr.setChar("trafficmonitor", "trafficViewURL", trafficViewURL);
					return;
				} 
			} 
		}
		
	},
	/**
	 * Callback used by trafficmonitor.xul, when extension is loaded.
	 * 
	 * @author Johannes Müller
	 * @param e
	 * @returns
	 */
	onLoad : function(e) {
		trafficStatus.init('my-panel', 'label'); //initializes trafficStatus with XML-Tag id and attribute to display traffic.
	}
};

window.addEventListener("load", trafficStatus.onLoad, false); //call onLoad when extension is loaded
