var all = document.getElementsByTagName("*");

for(var i = 0, max = all.length; i < max; i++){

    if(all[i].getAttribute("href") != null && 
	(all[i].getAttribute("href").substr(all[i].getAttribute("href").length - 4) == ".jpg"
	|| all[i].getAttribute("href").substr(all[i].getAttribute("href").length - 5) == ".jpeg"
	|| all[i].getAttribute("href").substr(all[i].getAttribute("href").length - 4) == ".png"
	|| all[i].getAttribute("href").substr(all[i].getAttribute("href").length - 4) == ".gif")){

	    var img = document.createElement("img");
	    var src = all[i].getAttribute("href");
	    img.setAttribute("src", src);
	    
	    var parent = all[i].parentNode;
	    parent.appendChild(img);
    }
}