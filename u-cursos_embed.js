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
    var div = document.getElementById('' + id);
    if (div == null)
    {
        alert(id + ' is null');
    }
    if (div.style.display == 'block')
    {
        div.style.display = 'none';
    } 
    else if (div.style.display == 'none')
    {
        div.style.display = 'block';
    }
}
var all = document.getElementsByTagName('a');
for (var i = 0, max = all.length; i < max; i++)
{
    var href = all[i].getAttribute('href');
    if (href == null)
    {
        continue;
    }
    var len = href.length;
    var parent = all[i].parentNode;
    if
    //Imagenes
    (href.substr(len - 4) == '.jpg'
    || href.substr(len - 4) == '.JPG'
    || href.substr(len - 5) == '.jpeg'
    || href.substr(len - 5) == '.JPEG'
    || href.substr(len - 4) == '.png'
    || href.substr(len - 4) == '.PNG'
    || href.substr(len - 4) == '.gif'
    || href.substr(len - 4) == '.GIF')
    {
		  if // bloque para los archivos del servidor de subefotos.com
	 	  (href.substr(0, 25) == 'http://subefotos.com/ver/'
	 	  || href.substr(0, 26) == 'https://subefotos.com/ver/')
	 	  {
		  	  var vCode = 0;	     
	     	  if (href.substr(0, 25) == 'http://subefotos.com/ver/')
        	  {
            	 vCode = href.substr(26);
        	  } 
        	  else if (href.substr(0, 25) == 'https://subefotos.com/ver/')
        	  {
           	  vCode = href.substr(26);
        	  }
    
		  	  var div = document.createElement('div');
        	  div.setAttribute('class', 'imagen');
        	  var img = document.createElement('img');
        	  img.setAttribute('src', 'http://fotos.subefotos.com/'.concat(vCode));
        	  img.setAttribute('style', 'max-width:560px; max-height:600px');
        	  // a continuacion nos aseguramos de que la id sea unica
        	  var id = href.substr(len - 10, len - 5);
        	  while (document.getElementById(id) != null)
        	  {
           	  id = id + (Math.random() * 10);
        	  }
        	  img.setAttribute('id', '' + id);
        	  var div_btn = document.createElement('div');
        	  var lastItem = all[i].nextSibling;
        	  while (lastItem.nextSibling != null)
        	  {
           	  lastItem = lastItem.nextSibling;
        	  }
        	  div.appendChild(img);
        	  parent.insertBefore(div_btn, lastItem.previousSibling);
        	  parent.insertBefore(div, div_btn);
    	  }        
        else 
        {
        	  var div = document.createElement('div');
        	  div.setAttribute('class', 'imagen');
        	  var img = document.createElement('img');
        	  img.setAttribute('src', href);
        	  img.setAttribute('style', 'max-width:560px; max-height:600px');
        	  // a continuacion nos aseguramos de que la id sea unica
        	  var id = href.substr(len - 10, len - 5);
        	  while (document.getElementById(id) != null)
        	  {
           	  id = id + (Math.random() * 10);
        	  }
        	  img.setAttribute('id', '' + id);
        	  var div_btn = document.createElement('div');
        	  var lastItem = all[i].nextSibling;
        	  while (lastItem.nextSibling != null)
        	  {
           	  lastItem = lastItem.nextSibling;
        	  }
        	  div.appendChild(img);
        	  parent.insertBefore(div_btn, lastItem.previousSibling);
        	  parent.insertBefore(div, div_btn);
        }
        
    }
	 
    else if
    //Videos
    (href.substr(0, 15) == 'http://youtu.be'
    || href.substr(0, 16) == 'https://youtu.be'
    || href.substr(0, 24) == 'http://youtube.com/embed'
    || href.substr(0, 25) == 'https://youtube.com/embed'
    || href.substr(0, 28) == 'http://www.youtube.com/watch'
    || href.substr(0, 29) == 'https://www.youtube.com/watch')
    {
        var div = document.createElement('div');
        div.setAttribute('class', 'video');
        div.setAttribute('style', 'overflow:hidden;display:none;');
        var iframe = document.createElement('iframe');
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        var vCode = 0;
        //A continuacion extraemos el codigo del video del enlace:
        if (href.substr(0, 15) == 'http://youtu.be/')
        {
            vCode = href.substr(18);
        } 
        else if (href.substr(0, 16) == 'https://youtu.be/')
        {
            vCode = href.substr(19);
        } 
        else if (href.substr(0, 24) == 'http://youtube.com/embed')
        {
            vCode = href.substr(27);
        } 
        else if (href.substr(0, 25) == 'https://youtube.com/embed')
        {
            vCode = href.substr(28);
        } 
        else if (href.substr(0, 28) == 'http://www.youtube.com/watch')
        {
            vCode = href.substr(31);
        } 
        else if (href.substr(0, 29) == 'https://www.youtube.com/watch')
        {
            vCode = href.substr(32);
        } 
        else
        {
            vCode = href.substr(16);
        }
        //creamos el objeto iframe necesario para insertar el video

        iframe.setAttribute('src', 'https://youtube.com/embed/'.concat(vCode));
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '1');
        //Aqui asignamos una id unica al contenedor del video
        while (document.getElementById('' + vCode) != null)
        {
            vCode = vCode + (Math.random() * 1000);
        }
        div.setAttribute('id', '' + vCode);
        //link para expandir:
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = vCode + '_btn';
        btn.onclick = function () {
            expandBlock(this.id);
        };
        btn.innerHTML = '+/-';
        //insertamos todo
        var lastItem = all[i].nextSibling;
        while (lastItem.nextSibling != null)
        {
            lastItem = lastItem.nextSibling;
        }
        div.appendChild(iframe);
        parent.insertBefore(div, lastItem.previousSibling);
        parent.insertBefore(btn, div);
    }
}
