/**
 * @author Johannes Müller
 * 
 */
var persistencyMgr = {
	prefService : Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService),
	observer : null,
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @param bool
	 * @returns
	 */
	setBool :
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @param bool
	 * @returns
	 */
	function(branch, name, bool) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		branch.setBoolPref(name, bool);
	},
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @returns
	 */
	getBool : function(branch, name) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		try {
			return branch.getBoolPref(name);
		} catch (e) {/* log error */
		}
		return false;
	},
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @param str
	 * @returns
	 */
	setChar : function(branch, name, str) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		branch.setCharPref(name, str);
	},
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @returns
	 */
	getChar : function(branch, name) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		try {
			return branch.getCharPref(name);
		} catch (e) {/* log error */
		}
		return "";
	},
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @param str
	 * @returns
	 */
	setInt : function(branch, name, str) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		branch.setIntPref(name, str);
	},
	/**
	 * @author Johannes Müller
	 * @param branch
	 * @param name
	 * @returns
	 */
	getInt : function(branch, name) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		try {
			return branch.getIntPref(name);
		} catch (e) {/* log error */
		}
		return 0;
	},
	/**
	 * @author Johannes Müller
	 * @param aDomain
	 * @param aObserver
	 * @returns
	 */
	addObserver : function(aDomain, aObserver) {
		observer = this.prefService.getBranch(aDomain + ".");
		observer.QueryInterface(Components.interfaces.nsIPrefBranch2);
		observer.addObserver("", aObserver, false);
	}
};