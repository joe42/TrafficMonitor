function writeCode(s, pointer) {
	var parent, tag, j;	
	for (var i=0; i < s.length; i++) {
		var c = s.charAt(i);
		if (c == "<") {		
				var j = s.indexOf(">", i+1);
				tag = s.substring(i,j+1);	
				if (tag.charAt(tag.length-2) == "/") {	// empty element
					if (pointer != null && pointer.nodeType == 3) { pointer = pointer.parentNode; }				
					pointer.appendChild( createElementFromString(tag) );
				} else if (tag.charAt(1) != "/") {	// normal open tag
					if (pointer != null && pointer.nodeType == 3) { pointer = pointer.parentNode; }				
					pointer = pointer.appendChild( createElementFromString(tag) );		
				} else {	// must be a closing tag
					if (pointer.parentNode != null && pointer.parentNode.parentNode != null)					
						pointer = pointer.parentNode.parentNode;					
				}
				i = j;
		} else {
			if (pointer.nodeType == 3) {
				n = s.indexOf("<", i+1);
				if (n == -1) {
					pointer.nodeValue += s.substr(i);	// textNode.appendData not implemented in IE 5.x	
					i = s.length;
				} else {
					pointer.nodeValue += s.substring(i,n);
					i = n-1;
				}		
			} else {								
				pointer = pointer.appendChild( document.createTextNode(c) );				
			}
		}
	}
}

/**
 * Creates a DOM element node from a raw string by searching for the element's name and the attribute pairs.
 */ 
function createElementFromString(str) {
	var node, a = str.match(/<(\w+)(\s+)?([^>]+)?>/);	// split into name and key/value pairs
	if (a != null) {
		node = document.createElement(a[1]);
		if (a[3] != null) {
			var attrs = a[3].split(" ");	// split the key/value pairs
			if (attrs.length > 0) {
				for (var i=0; i < attrs.length; i++) {
					var att = attrs[i].split("=");	// split a key/value pair
					if (att[0].length > 0 && att[0] != "/" && att[1].length != 2) {	// do not operate on empty attributes
						var a_n = document.createAttribute(att[0]);
						a_n.value = att[1].replace(/^['"](.+)['"]$/, "$1");	// remove quotes from attribute value
						node.setAttributeNode(a_n);	// append attribute node to new node
					}
				}
			}	
		}
	}
	return node;
}