import {mensajes} from './mensajes.js';


const nombreRuta = document.getElementById('ruta');
const responsableRuta = document.getElementById('responsable');
const cedula = document.getElementById('cedula');
const btnGuardarRuta = document.getElementById('btn-guardar-ruta');

btnGuardarRuta.addEventListener('click', (e) =>{
    e.preventDefault();
    if(nombreRuta.value === '' || responsableRuta.value === '' || cedula.value === ''){
        mensajes('Debe completar los campos Obligatorios', 'fail');
    }
});