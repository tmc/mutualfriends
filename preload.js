// overwrite the `languages` property to use a custom getter
var prepName = function(n) {   var parts = n.split(', ');   return `${parts[1].split(' ')[0]} ${parts[0]}`; }

var injectRelationships = function() {
  var sel = "#ctl00_ContentPlaceHolderVANPage_gvList > tbody > tr > td > a";
  jQuery(sel).each(function(i, nameLink) { 
	var img = "<img src='http://localhost:3000/mfriends?name=" + prepName(nameLink.innerText) +"' style='max-width: 400px' />";
	jQuery(nameLink).after(img);
	jQuery(nameLink).after("<br/>");  })
}

setTimeout(injectRelationships, 1000);
