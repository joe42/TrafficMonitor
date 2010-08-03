/**
 * Manages persistency and hides XPCOM layer.
 * 
 * @author Johannes Müller
 */
var persistencyMgr = {
	prefService : Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService),
	observer : null,
	/**
	 * @author Johannes Müller
	 * @param branch name of a category pooling <code>name</code> among other things
	 * @param name the name under which this variable is stored
	 * @param bool boolean to store with the given <code>branch</code> and <code>name</code>
	 */
	setBool : function(branch, name, bool) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		branch.setBoolPref(name, bool);
	},
	/**
	 * @author Johannes Müller
	 * @param branch name of a category pooling <code>name</code> among other things
	 * @param name the name under which this variable is stored
	 * @returns value stored for the variable <code>name</code> in the category <code>branch</code>
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
	 * @param branch name of a category pooling <code>name</code> among other things
	 * @param name the name under which this variable is stored
	 * @param str string to store with the given <code>branch</code> and <code>name</code>
	 */
	setChar : function(branch, name, str) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		branch.setCharPref(name, str);
	},
	/**
	 * @author Johannes Müller
	 * @param branch name of a category pooling <code>name</code> among other things
	 * @param name the name under which this variable is stored
	 * @returns value stored for the variable <code>name</code> in the category <code>branch</code>
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
	 * @param branch name of a category pooling <code>name</code> among other things
	 * @param name the name under which this variable is stored
	 * @param num integer to store with the given <code>branch</code> and <code>name</code>
	 */
	setInt : function(branch, name, num) {
		var branch = this.prefService.getBranch(branch + ".");
		branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		branch.setIntPref(name, num);
	},
	/**
	 * @author Johannes Müller
	 * @param branch name of a category pooling <code>name</code> among other things
	 * @param name the name under which this variable is stored
	 * @returns value stored for the variable <code>name</code> in the category <code>branch</code>
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
	 * Adds <code>aObserver</code> as an observer of the category <code>aDomain</code>.
	 * 
	 * Only one observer can be added at a time. 
	 *
	 * @author Johannes Müller
	 * @param aDomain name of the category/branch this observer should be connected to
	 * @param aObserver object with an observe(subject, topic, data) method
	 */
	addObserver : function(aDomain, aObserver) {
		observer = this.prefService.getBranch(aDomain + ".");
		observer.QueryInterface(Components.interfaces.nsIPrefBranch2);
		observer.addObserver("", aObserver, false);
	}
};