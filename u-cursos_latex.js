/* Script que transforma las imagenes generadas por el motor de LaTeX de U-Cursos en MathJax.

Por Rodolfo Gutiérrez Romo */

function loadMathJax(){
    if (window.MathJax === undefined) {
        var t = '.MathJax .mn {background: inherit;} .MathJax .mi {color: inherit;} .MathJax .mo {background: inherit;}';
        var a = document.createElement('style');
        a.innerText = t;
        try {
            a.textContent = t
        } catch (n) {}
        document.getElementsByTagName('body')[0].appendChild(a);
        var r = document.createElement('script'),
            i;
        r.src = 'https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML.js';
        r.type = 'text/javascript';
        i = 'MathJax.Hub.Config({tex2jax:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']],processEscapes:true}});MathJax.Hub.Startup.onload();';
        r.text = i;
        document.getElementsByTagName('head')[0].appendChild(r)
    }
}

function addScript(i){
	var r = document.createElement('script');
	r.text = i;
	document.getElementsByTagName('head')[0].appendChild(r);
}

function latexMathJax()
{
	loadMathJax();

	addScript('function imgToMathJax() { function a(e) { var a = document.createElement(\'span\'); a.setAttribute(\'class\', \'MathJax_Preview\'); var n = document.createElement(\'script\'); n.setAttribute(\'type\', \'math/tex\'); n.innerText = e.getAttribute(\'alt\'); var r = e.parentElement; r.replaceChild(n, e); a.appendChild(e); r.insertBefore(a, n) } var classnames = [\'latex\', \'sola\']; for (var c = 0; c < classnames.length; ++c) { var n = document.getElementsByClassName(classnames[c]); for (var r = 0; r < n.length; r++) { a(n[r])} } } imgToMathJax();');
	addScript('function txt_preview_mathjax( id ) { $(\'txt_preview_\'+id).removeClassName( \'off\' ); $(\'txt_preview_\'+id).innerHTML = \'<div class="espera">Espere un momento, por favor...</div>\'; var txt_id = $(\'txt_id_\'+id).value; quickAjax( \'?_textarea=preview\', function( txt ) { $(\'txt_preview_\'+id).innerHTML = txt == \'\' ? \'<span class="ayuda">Preview vacio</span>\' : txt; imgToMathJax(); MathJax.Hub.Queue([\'Typeset\', MathJax.Hub]); }, \'txt_id=\'+txt_id+\'&input=\' + $(id).value.urlencode(), id ); }');
	 
	var n = document.getElementsByClassName('modos'), r;
	for (r = 0; r < n.length; ++r){
		n[r].childNodes[3].childNodes[0].setAttribute('href', 'javascript:txt_preview_mathjax(\'contenido\');')
	}
}

chrome.storage.sync.get ( {"mathjax":false}, function ( data )
{
	if ( data.mathjax )
	{
		latexMathJax();
	}
	else
	{
		return;
	}
});