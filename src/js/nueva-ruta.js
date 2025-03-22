import {mensajes} from './mensajes.js';


const next = document.getElementById('continuar');
const volver = document.getElementById('volver');
const formUno = document.getElementById('form1');
const formDos = document.getElementById('form2');
const ruta = document.getElementById('ruta');
const responsable = document.getElementById('responsable');
const cedula = document.getElementById('cedula');

next.addEventListener('click', (e) =>{
    e.preventDefault(); 
    if(ruta.value ==='' || responsable.value === '' || cedula.value == ''){
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