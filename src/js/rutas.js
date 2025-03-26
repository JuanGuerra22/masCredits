import {auth, db} from './firebase.js'
import { collection, onSnapshot, orderBy, query, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";



const nuevasRutas = document.getElementById('nuevas-rutas');
const spinner = document.getElementById('spinner-container');


const mostrarRutas = ()=>{
    const nRutas = collection(db, 'nuevas-rutas');
    spinner.classList.remove('hidden');
    // Modificación: agregar ordenamiento por fechaCreacion
    const q = query(nRutas, orderBy('fechaCreacion', 'asc'));

    onSnapshot(q, (snapshot)=>{
            nuevasRutas.innerHTML = '';
            spinner.classList.add('hidden');
           if(snapshot.empty){
            nuevasRutas.innerHTML = '<p id="default-text">No hay clientes asignados a esta ruta.</p>';
           } else{
        snapshot.forEach((doc) => {
            
            const rutas = doc.data();
            const nuevoDiv = document.createElement('div');
            nuevoDiv.classList.add('div-prueba')
            nuevoDiv.innerHTML = `
                <p> Nombre de la Ruta: <span> ${rutas.nombreRuta.toUpperCase()} </span> </p>
                <p>Responsable: <span> ${rutas.responsableRuta} </span></p>
                <p>Cedula: <span>${rutas.cedula} </span></p>
                <p>Clientes Activos:  </p>
            `
            nuevasRutas.appendChild(nuevoDiv);
            // Agregar evento de clic al div
            nuevoDiv.addEventListener('click', () => {
                 // Redirigir a la página de clientes con el ID de la ruta
                 window.location.href = `clientes.html?id=${doc.id}`;
            });
        });
        }
    });
}

mostrarRutas();

