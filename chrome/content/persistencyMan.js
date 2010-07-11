var myPersitencyMgr = {
	saveBool: function ( branch, name, bool ) {  
		var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		prefService.savePrefFile(null); 
		prefService = prefService.getBranch( branch+"." );
		prefService.QueryInterface(Components.interfaces.nsIPrefBranch2); 
		prefService.setBoolPref( name, bool );   
		//prefService.savePrefFile(null);

	},
	getBool: function ( branch, name ) { 
		var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch( branch+"." );
		//prefService.savePrefFile(null);
 
		prefService.QueryInterface(Components.interfaces.nsIPrefBranch2); 
		try {
			return prefService.getBoolPref(name);
		} catch (e) {}
		return false;
	}
}