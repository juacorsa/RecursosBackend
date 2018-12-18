
function obtenerAñoActual() {		
	return new Date().getFullYear();
};

function obtenerEnteroAleatorio(min, max) {
 	min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.obtenerAñoActual = obtenerAñoActual;
exports.obtenerEnteroAleatorio = obtenerEnteroAleatorio;
