import {mensajes} from './mensajes.js';
import { collection, doc, addDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { db } from './firebase.js'


const next = document.getElementById('continuar');
const volver = document.getElementById('volver');

const formUno = document.getElementById('cont-form1');
const formDos = document.getElementById('cont-form2');

const nombreCliente = document.getElementById('nombre-cliente');
const cedula = document.getElementById('cedula');
const ciudad = document.getElementById('ciudad');
const direccion = document.getElementById('direccion');
const valor = document.getElementById('valor');
const interes = document.getElementById('interes');
const posicion = document.getElementById('posicion');
const cuota = document.getElementById('cuota');
const periodo = document.getElementById('periodo');
const seguro = document.getElementById('seguro');

const btnGuardarRuta = document.getElementById('guardar-ruta');
const formulario = document.getElementById('form-nuevo-cliente');

next.addEventListener('click', (e) =>{
    e.preventDefault(); 
    if(nombreCliente.value === '' || cedula.value == ''){
        mensajes('Debe completar los campos Obligatorios', 'fail');
    }else if(!formUno.classList.contains('hidden')){
        formUno.classList.add('hidden');
        formDos.classList.remove('hidden');
        setTimeout( () =>{
            document.getElementById('progreso').classList.add('completa');
        })
    }
});

volver.addEventListener('click', (e) =>{
    e.preventDefault();
    if(!formDos.classList.contains('hidden')){
        formDos.classList.add('hidden');
        formUno.classList.remove('hidden');
    }
    setTimeout( () =>{
        document.getElementById('progreso').classList.remove('completa');
    })
});


// Obtener parámetros de la URL
function obtenerParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id'),
        ruta: {
            nombreRuta: urlParams.get('nombreRuta'),
            responsableRuta: urlParams.get('responsableRuta'),
            cedula: urlParams.get('cedula'),
            ciudad: urlParams.get('ciudad'),
            direccion: urlParams.get('direccion')
        }
    };
}

const { id, ruta } = obtenerParametrosURL();

console.log(ruta)

// Mostrar información de la ruta en el formulario
const nombreRutaP = document.createElement('p');
nombreRutaP.innerHTML = `Nombre de la Ruta: ${ruta.nombreRuta}` 
formUno.insertBefore(nombreRutaP, formUno.children[0]);

const responsableRutaP = document.createElement('p');
responsableRutaP.innerHTML = `Responsable: ${ruta.responsableRuta}` ;
formUno.insertBefore(responsableRutaP, formUno.children[1]);


// Evento de envío del formulario
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosCliente = {
        nombreCliente: nombreCliente.value,
        cedula: cedula.value,
        ciudad: ciudad.value,
        direccion: direccion.value,
        valor: parseFloat(valor.value),
        interes: parseInt(interes.value),
        posicion: parseInt(posicion.value),
        cuota: parseInt(cuota.value),
        periodo: periodo.value,
        seguro: parseFloat(seguro.value) || 0, // Si seguro está vacío, guarda 0
    };

    try {
        const clientesRef = collection(db, 'nuevas-rutas', id, 'clientes');
        await addDoc(clientesRef, datosCliente);
        alert('Cliente guardado con éxito');
        window.location.href = `clientes.html?id=${id}`;
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        alert('Error al guardar cliente');
    }
});
// Función para calcular el valor del seguro
function calcularSeguro(valorPrestamo) {
    return valorPrestamo * 0.10; // Ejemplo: 10% del valor del préstamo
}

valor.addEventListener('input', () => {
    seguro.value = calcularSeguro(parseFloat(valor.value));
});