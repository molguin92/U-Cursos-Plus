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

function markdowninject()
{
	var converter = new showdown.Converter();
	showdown.setOption('ghCodeBlocks', false);
	// encontramos todos los comentarios:
	var textelems = document.getElementsByClassName('texto');
	for (var i = 0, max = textelems.length; i < max; i++)
	{
		// cada comentario puede tener múltiples bloques de texto
		// ya que éstos se separan por <br> tags.
		for(var j = 0, maxj = textelems[i].childNodes.length; j < maxj; j++)
		{
			// la condición de largo es porque U-Cursos agrega padding
			if(textelems[i].childNodes[j].nodeName == "#text" &&
				textelems[i].childNodes[j].nodeValue.length > 2)
			{
				// aquí creamos un nuevo elemento con el texto parseado,
				// y reemplazamos el texto antiguo.
				span = document.createElement('span');

				// la regex elimina los espacios adelante del texto.
				//esto se necesita para la primera linea de los comentarios,
				// ya que vienen con un padding estúpido.
				var text = converter.makeHtml(textelems[i].childNodes[j].nodeValue.replace(/^\s+|$/gm,''))

				//la regex a continuación elimina los tags <p></p>
				span.innerHTML = text.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
				
				textelems[i].insertBefore(span, textelems[i].childNodes[j]);
				textelems[i].removeChild(textelems[i].childNodes[j+1])
			}
		}
	}
}

markdowninject();

/* a continuacion injectamos la barra de configuracion en la parte superior */
var navbar = document.getElementById('navbar');

var div_set = document.createElement('div');
var text_set = document.createElement('p');
text_set.innerHTML = "U-Cursos+: Imágenes -- ";

var rad_img_small = document.createElement('input');
var rad_img_med = document.createElement('input');
var rad_img_big = document.createElement('input');
var s_label = document.createElement('label');
var m_label = document.createElement('label');
var l_label = document.createElement('label');
s_label.setAttribute("style", "color:grey");
m_label.setAttribute("style", "color:grey");
l_label.setAttribute("style", "color:grey");

rad_img_small.type = "radio";
rad_img_small.name = "img_size";
rad_img_small.value = "small";
/* cada radiobutton tiene una funcion para guardar el tamano de la img,
* y actualizar las imgs ya mostradas */
rad_img_small.onclick = function () {
	if ( this.checked )
	{
		chrome.storage.sync.set({'imgsize':1},
			function ()
				{
					var imgSize = 'max-width:200px; max-height:200px;';
					updateImgSize ( imgSize )
				});
	}
};
s_label.innerHTML = "&nbsp;Pequeñas";
s_label.appendChild(rad_img_small);

rad_img_med.type = "radio";
rad_img_med.name = "img_size";
rad_img_med.value = "med";
rad_img_med.onclick = function () {
	if ( this.checked )
	{
		chrome.storage.sync.set({'imgsize':2},
			function ()
				{
					var imgSize = 'max-width:400px; max-height:400px;';
					updateImgSize ( imgSize )
				});
	}
};
m_label.innerHTML = "&nbsp;&nbsp;Medianas";
m_label.appendChild(rad_img_med);

rad_img_big.type = "radio";
rad_img_big.name = "img_size";
rad_img_big.value = "big";
rad_img_big.onclick = function () {
	if ( this.checked )
	{
		chrome.storage.sync.set({'imgsize':3},
			function ()
				{
					var imgSize = 'max-width:600px; max-height:600px;';
					updateImgSize ( imgSize )
				});
	}
};
l_label.innerHTML = "&nbsp;&nbsp;Grandes";
l_label.appendChild(rad_img_big);


/*checkbox para LaTeX -> MathJax*/
var cbox= document.createElement("input");
cbox.setAttribute("type", "checkbox");
cbox.onclick = function () {
	if ( this.checked )
	{
		chrome.storage.sync.set ( {"mathjax":true}, function ()
		{
			location.reload();
		});
	}
	else
	{
		chrome.storage.sync.set ( {"mathjax":false}, function ()
		{
			location.reload();
		});
	}
};

var cbox_label = document.createElement("label");
cbox_label.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;LaTeX --> MathJax";
cbox_label.appendChild(cbox);
cbox_label.setAttribute("style", "color:grey");


div_set.appendChild(text_set);
text_set.appendChild(s_label);
text_set.appendChild(m_label);
text_set.appendChild(l_label);
text_set.appendChild(cbox_label);

text_set.setAttribute ( "style", "color:grey" );

navbar.parentNode.insertBefore(div_set, navbar);

/* recuperamos el estado de la checkbox */
chrome.storage.sync.get ( {"mathjax":false}, function ( data )
{
	if ( data.mathjax )
	{
		cbox.checked = true;
	}
	else
	{
		cbox.checked = false;
	}
});

/* a continuacion recuperamos el tamano guardado y actualizamos la pag acorde */
chrome.storage.sync.get({"imgsize":1}, function ( data ) {
	var imgSize;
	switch ( data.imgsize )
	{
		case 1:

			rad_img_small.checked = true;
			imgSize = 'max-width:200px; max-height:200px;';
			break;

		case 2:

			rad_img_med.checked = true;
			imgSize = 'max-width:400px; max-height:400px;';
			break;

		case 3:

			rad_img_big.checked = true;
			imgSize = 'max-width:600px; max-height:600px;';
			break;
	}

	injectImgVid( imgSize );
} );

/* updateImgSize actualiza el tamano de las imgs ya insertadas */
function updateImgSize ( imgSize )
{
	chrome.storage.sync.get ( {"imgIDArray":[]}, function ( data )
	{
		var img;
		var imgIDArray = data.imgIDArray;
		for ( var i = 0; i < imgIDArray.length; i++ )
		{
			img = document.getElementById ( imgIDArray[i] );
			img.setAttribute ( 'style', imgSize );
		}

	});
}

/* injectImgVid se encarga de insertar las imgs y los videos en primer lugar.
* Se llama exclusivamente despues de cargar los datos desde chrome.storage */
function injectImgVid( imgSize )
{
	var imgIDArray = []; /* arreglo que almacena la id de cada img insertada */
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
	    || href.substr(len - 5) == '.jpeg'
	    || href.substr(len - 4) == '.png'
	    || href.substr(len - 4) == '.gif'
	    || href.substr(len - 4) == '.bmp'
	    || href.substr(len - 4) == '.JPG'
	    || href.substr(len - 5) == '.JPEG'
	    || href.substr(len - 4) == '.PNG'
	    || href.substr(len - 4) == '.GIF'
	    || href.substr(len - 4) == '.BMP')
	    {
		if // bloque para los archivos del servidor de subefotos.com
		 (href.substr(0, 25).toLowerCase() == 'http://subefotos.com/ver/'
		 || href.substr(0, 26).toLowerCase() == 'https://subefotos.com/ver/')
		{
			var vCode = 0;
			if (href.substr(0, 25).toLowerCase() == 'http://subefotos.com/ver/')
			{
				vCode = href.substr(26);
			}
			else if (href.substr(0, 25).toLowerCase() == 'https://subefotos.com/ver/')
			{
			vCode = href.substr(26);
			}

			var div = document.createElement('div');
			div.setAttribute('class', 'imagen');
			var img = document.createElement('img');
			img.setAttribute('src', 'http://fotos.subefotos.com/'.concat(vCode));
			img.setAttribute('style', imgSize);


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

			imgIDArray.push(id);
		}
		else
		{
			var div = document.createElement('div');
			div.setAttribute('class', 'imagen');
			var img = document.createElement('img');
			img.setAttribute('src', href);
			img.setAttribute('style', imgSize);

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

			imgIDArray.push(id);
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

	chrome.storage.sync.set ( {"imgIDArray": imgIDArray }, function () { return; });
}
