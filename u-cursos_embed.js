/* 
Script encargado de buscar enlaces a imagenes y videos en YouTube en la pagina e insertarlas 
Parte de la extension U-Cursos +.

Autor: Arachnid92
*/

function expandBlock(btn_id)
{	
	
	//Funcion encargada de expandir y colapsar bloques de video.
	//Recibe como parametro la id del boton que fue presionado.
	//Luego, extrae la id del elemento a expandir/colapsar de la id
	//del boton y ejecuta.
	var id = btn_id.substr(0, btn_id.length - 4);
	
    	var div = document.getElementById("" + id);

	if(div == null)
	{
	    	alert(id + " is null");
	}

	if(div.style.display == "block")
	{
	    	div.style.display = "none";
	}

	else if(div.style.display == "none")
	{
		div.style.display = "block";
	}
}

function resizeImg(btn_id)
{
	
	/*
	funcion encargada de cambiar tamano de imagenes.
	al igual que en la funcion anterior, recibe una id
	de un boton y extrae la informacion necesaria de ahi
	*/
	
	var mod = btn_id.substr(0,1); //modificador del boton (s, m, l)
	var id = btn_id.substr(1, btn_id.length - 5); //id de la img
    	var img = document.getElementById("" + id); 
	
	if(mod == "s")
	{
		img.setAttribute("style", "max-width:400px; max-height:400px");
	}
	
	else if(mod == "m")
	{
		img.setAttribute("style", "max-width:800px; max-height:800px");
	}
	
	else if(mod == "l")
	{
		img.setAttribute("style", "max-width:1600px; max-height:1600px");
	}
}
	

var all = document.getElementsByTagName("a");

for(var i = 0, max = all.length; i < max; i++)
{
	
	var href = all[i].getAttribute("href");
	
	if(href == null)
	{
		continue;
	}
	
	var len = href.length;
	var parent = all[i].parentNode;
	
	if //Imagenes
	(href.substr(len - 4) == ".jpg"
	|| href.substr(len - 5) == ".jpeg"
	|| href.substr(len - 4) == ".png"
	|| href.substr(len - 4) == ".gif")
	{
		
		var div = document.createElement("div");
		div.setAttribute("class", "imagen");
		

		var img = document.createElement("img");
		img.setAttribute("src", href);
		img.setAttribute("style", "max-width:400px; max-height:400px");
		
		// a continuacion nos aseguramos de que la id sea unica
		var id = href.substr(len - 10, len - 5); 
		while(document.getElementById(id) != null)
		{
			id = id + (Math.random() * 10);
		}
		
		img.setAttribute("id", "" + id);
		
		//botones
		var btn_s = document.createElement("button");
		var btn_m = document.createElement("button");
		var btn_l = document.createElement("button");
		
		btn_s.type = "button";
		btn_m.type = "button";
		btn_l.type = "button";
		
		btn_s.id = "s" + id + "_btn";
		btn_m.id = "m" + id + "_btn";
		btn_l.id = "l" + id + "_btn";
		
		btn_s.onclick = function(){ resizeImg(this.id); };
		btn_m.onclick = function(){ resizeImg(this.id); };
		btn_l.onclick = function(){ resizeImg(this.id); };
		
		btn_s.innerHTML = "S";
		btn_m.innerHTML = "M";
		btn_l.innerHTML = "L";
		
		var div_btn = document.createElement("div");
		div_btn.appendChild(btn_s);
		div_btn.appendChild(btn_m);
		div_btn.appendChild(btn_l);
		
		
		var lastItem = all[i].nextSibling;
		while(lastItem.nextSibling != null)
		{
			lastItem = lastItem.nextSibling;
		}
		
		div.appendChild(img);
		parent.insertBefore(div_btn, lastItem.previousSibling);
		parent.insertBefore(div, div_btn);
	}
    
	else if //Videos
	(href.substr(0, 28) == "http://www.youtube.com/watch"
	|| href.substr(0, 29) == "https://www.youtube.com/watch"
	|| href.substr(0, 15) == "http://youtu.be")
	{
	    
		var div = document.createElement("div");
		div.setAttribute("class", "video");
		div.setAttribute("style", "overflow:hidden;display:none;");
	    
		var iframe = document.createElement("iframe");
		iframe.setAttribute("width", "560");
		iframe.setAttribute("height", "315");
	    
		var vCode = 0;
	    
		//A continuacion extraemos el codigo del video del enlace:
		if(href.substr(0, 28) == "http://www.youtube.com/watch")
		{
			vCode =  href.substr(31);
		} 
		else if (href.substr(0, 29) == "https://www.youtube.com/watch")
		{
			vCode = href.substr(32);
		} 
		else 
		{
			vCode = href.substr(16);
		}
	    
		//creamos el objeto iframe necesario para insertar el video
		iframe.setAttribute("src", "https://youtube.com/embed/".concat(vCode));
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allowfullscreen", "1");

		//Aqui asignamos una id unica al contenedor del video
		while(document.getElementById("" + vCode) != null)
		{
		    	vCode = vCode + (Math.random() * 1000);
		}

		div.setAttribute("id", "" + vCode);

	    
		//link para expandir:
		var btn = document.createElement("button");
		btn.type = "button";
		btn.id = vCode + "_btn";
		btn.onclick = function(){ expandBlock(this.id); };
		btn.innerHTML = "Expandir/Colapsar Video";
		
		//insertamos todo
		var lastItem = all[i].nextSibling;
		while(lastItem.nextSibling != null)
		{
			lastItem = lastItem.nextSibling;
		}
		
		div.appendChild(iframe);
		parent.insertBefore(div, lastItem.previousSibling);
		parent.insertBefore(btn, div);

		
	}	    
}
