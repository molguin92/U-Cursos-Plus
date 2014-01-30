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
		
		var lastItem = all[i].nextSibling;
		while(lastItem.nextSibling != null)
		{
			lastItem = lastItem.nextSibling;
		}
		
		div.appendChild(img);
		parent.insertBefore(div, lastItem.previousSibling);
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
