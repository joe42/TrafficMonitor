/*
function evaluateXPath(aNode, aExpr) {  
  var xpe = new XPathEvaluator();  
  var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?  
    aNode.documentElement : aNode.ownerDocument.documentElement);  
  var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);  
  var found = [];  
  var res;  
  while (res = result.iterateNext())  
    found.push(res);  
  return found;  
}  
<statusbarpanel id="my-panel" label="0" onclick="trafficStatus.showTraffic('my-panel','label');"/> 
		/*
		var node = document.createDocumentFragment(); //document.implementation.createDocument("", "", null); //
		writeCode("<h>gg</h>", node);		
		alert(content);	
		*  
*/        
var trafficStatus = { 
	viewElement: null,
	viewAttribute: "",   
	prefs: null,
	WarnLvl1: 0,
	WarnLvl2: 0,
	trafficURL: "",
	trafficViewURL: "",
	  
	trafficViewURL2trafficURL: function( trafficViewURL ){
		switch (arbeitstag) {
			case "https://www.wh2.tu-dresden.de/usertraffic": 
				return "http://www.wh2.tu-dresden.de/traffic/getMyTraffic.php";
			default: return "http://www.wh2.tu-dresden.de/traffic/getMyTraffic.php";
		}

	},
	viewTrafficPage: function(){
		this.newTab(this.trafficViewURL);
	},
	
   // Initialize the extension
	init: function (viewElementID, viewAttribute) { 
		//initialise observer for preferences dialog:
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("trafficmonitor.");
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.prefs.addObserver("", this, false);
		this.trafficURL = this.prefs.getCharPref("trafficURL");
		this.trafficViewURL = this.prefs.getCharPref("trafficViewURL");
		this.WarnLvl1 = this.prefs.getIntPref("WarnLvl1");
		this.WarnLvl2 = this.prefs.getIntPref("WarnLvl2");  
		
		this.viewElement = document.getElementById( viewElementID );
		this.viewAttribute = viewAttribute; 
		this.getTraffic();
		setInterval( "trafficStatus.getTraffic()", 60 * 1000 * 5 );
	},
	
	observe: function(subject, topic, data){
		if (topic != "nsPref:changed") {
			return;
		}
  
		switch(data) {
			case "trafficViewURL":
				this.trafficViewURL = this.prefs.getCharPref("trafficViewURL");  
				this.trafficURL = trafficViewURL2trafficURL( this.trafficViewURL );
				this.prefs.setCharPref( "trafficURL", this.trafficURL );//store as default
				this.getTraffic();
				break; 
			case "WarnLvl1":
				this.WarnLvl1 = this.prefs.getCharPref("WarnLvl1"); 
				this.getTraffic();
				break;
			case "WarnLvl2":
				this.WarnLvl2 = this.prefs.getCharPref("WarnLvl2"); 
				this.getTraffic();
				break;
		}
   },


	checkTraffic: function ( traffic ) {  
		if( traffic<this.WarnLvl1-5 &&  myPersitencyMgr.getBool( "trafficmon.", "WarnLvl1" ) ) { //real traffic is below limit 
			myPersitencyMgr.saveBool( "trafficmon.", "WarnLvl1", false ); // user should be warned for the next time he exceeds the limit
		}
		if( traffic>this.WarnLvl1 && !myPersitencyMgr.getBool( "trafficmon.", "WarnLvl1" ) ){ //real traffic is above limit and user has not yet been warned
			notifier.warnLvl1("Traffic over "+this.WarnLvl1+"%. Please be careful!");
			myPersitencyMgr.saveBool( "trafficmon.", "WarnLvl1", true );
		}
		if( traffic<this.WarnLvl2 &&  myPersitencyMgr.getBool( "trafficmon.", "WarnLvl2" ) ) { //real traffic is below limit 
			myPersitencyMgr.saveBool( "trafficmon.", "WarnLvl2", false );  // user should be warned for the next time he exceeds the limit
		}
		if( traffic>this.WarnLvl2 && !myPersitencyMgr.getBool( "trafficmon.", "WarnLvl2" ) ){ //real traffic is above limit and user has not yet been warned
			notifier.warnLvl2("Traffic over "+this.WarnLvl2+"%. Please do not exceed your traffic limit!");
			myPersitencyMgr.saveBool( "trafficmon.", "WarnLvl2", true );
		}
	},   
	newTab : function ( url ) {
		var browser = top.document.getElementById("content");
		var newtab = browser.addTab(decodeURIComponent(url));
		browser.selectedTab = newtab;
	},
	showTraffic: function ( traffic ) {    
		if(traffic=="Error loading page"){
			this.viewElement.hidden = true;
		} else {
			this.checkTraffic( traffic );
			this.viewElement.hidden = false;
			this.viewElement.setAttribute(this.viewAttribute, traffic+"%");
		}
	},   
	getTraffic: function (){  		
		var req = new XMLHttpRequest();  
		req.open('GET', this.trafficURL, true);    
		req.onreadystatechange = function (aEvt) {    
			if (req.readyState == 4) {    
				if(req.status != 200){
					trafficStatus.showTraffic( "Error loading page" );
					return;
				}
				var traffic = Math.round( parseFloat( req.responseText ) );
				if(traffic == -1){
					trafficStatus.showTraffic( "Error loading page" );
					return;
				} 
				trafficStatus.showTraffic( traffic );     
			}    
		};  
		req.send(null);     
	},	
	onLoad: function (e) {  
		trafficStatus.init('my-panel', 'label');
	}
};
 
 
window.addEventListener("load", trafficStatus.onLoad, false);  