import {auth, db} from './firebase.js'
import { collection, onSnapshot, doc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";



const nuevasRutas = document.getElementById('nuevas-rutas');


// btnAddRuta.addEventListener('click', ()=>{
//     const nuevoDiv = document.createElement('div');
//     nuevoDiv.classList.add('div-prueba')
//     nuevasRutas.appendChild(nuevoDiv);
// });

const mostrarRutas = ()=>{
    const nRutas = collection(db, 'nuevas-rutas');

    onSnapshot(nRutas, (snapshot)=>{
            nuevasRutas.innerHTML = '';
        snapshot.forEach((doc) => {
            const rutas = doc.data();
            const nuevoDiv = document.createElement('div');
            nuevoDiv.classList.add('div-prueba')
            nuevoDiv.innerHTML = `
                <p> Nombre de la Ruta: <span> ${rutas.nombreRuta} </span> </p>
                <p>Responsable: <span> ${rutas.responsableRuta} </span></p>
                <p>Cedula: <span>${rutas.cedula} </span></p>
            `
            nuevasRutas.appendChild(nuevoDiv);
        });
    });
}

mostrarRutas();