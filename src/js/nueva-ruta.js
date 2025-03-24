import {mensajes} from './mensajes.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { db} from './firebase.js';


const nombreRuta = document.getElementById('ruta');
const responsableRuta = document.getElementById('responsable');
const cedula = document.getElementById('cedula');
const btnGuardarRuta = document.getElementById('btn-guardar-ruta');
const ciudad = document.getElementById('ciudad');
const direccion = document.getElementById('direccion');
const spinner = document.getElementById('spinner-container');


btnGuardarRuta.addEventListener('click', async (e) =>{
    e.preventDefault();
    if(nombreRuta.value !== '' && responsableRuta.value !== '' && cedula.value !== ''){
        spinner.classList.remove('hidden');
        try {
            const docRef = collection(db, 'nuevas-rutas');
            
            await addDoc(docRef, {
                nombreRuta: nombreRuta.value,
                responsableRuta: responsableRuta.value,
                cedula: cedula.value,
                ciudad: ciudad.value,
                direccion: direccion.value,
                fechaCreacion: new Date()
            })
            
            nombreRuta.value = '';
            responsableRuta.value = ''
            cedula.value = '';
            ciudad.value = '';
            direccion.value = '';
            setTimeout(()=>{
                window.location.href = 'rutas.html'
            },100);
        } catch (error) {
            console.log(error.code)
        }
    }else{
        mensajes('Debe completar los campos Obligatorios', 'fail');
    }
    
});


