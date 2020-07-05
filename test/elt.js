/*

// example
var node = elt("div", "id=mandelbro",
    elt("canvas", "id=canvas"),
    elt("p", "id=infoPara")
);	

*/

function elt(type) {
    // Create HTML element tree 
    // modified from eloquent javascript
	
	var node = document.createElement(type);
	var i;
	var child;
	var attr;
	for (i = 1; i < arguments.length; i+=1) {
	  child = arguments[i];
	  if (typeof child === "string"){

	  	if ( child.includes("=") ) {
			attr = child.split("=");
	      node.setAttribute(attr[0],attr[1]);
	    } else {
	    	child = document.createTextNode(child);
	      	node.appendChild(child);
	    }

	  } else {
	  	node.appendChild(child);
		}
	}
	return node;
}

