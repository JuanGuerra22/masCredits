import {db} from './firebase.js'
import { collection, onSnapshot, orderBy, query, getCountFromServer} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { saldoRuta, formatearValor } from './functions.js';


const nuevasRutas = document.getElementById('nuevas-rutas');
const spinner = document.getElementById('spinner-container');
const contModalInfoRuta = document.getElementById('modal-info-ruta');
const contModal = document.getElementById('cont-modal-ruta');
const btnCerrar = document.getElementById('btn-cerrar');




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
        snapshot.forEach(async (doc) => {

            
            const rutas = doc.data();
            const rutasId = doc.data(doc.id)
            const nuevoDiv = document.createElement('div');
            const rutaActiva = document.createElement('div');
            const btnMoreInfo = document.createElement('div');
            const divInfoRuta = document.createElement('div');
            divInfoRuta.classList.add('div-info-ruta')
            rutaActiva.classList.add('ruta-activa');
            btnMoreInfo.classList.add('more-info');
            nuevoDiv.classList.add('div-ruta-activa');
            // Obtener la cantidad de clientes de la ruta
            const cantidadClientes = await contClientesRuta(doc.id);
             // Obtener el saldo total de los clientes de la ruta
            const saldoEnRuta = await saldoRuta(doc.id)
            rutaActiva.innerHTML = `
                <p><span> ${rutas.nombreRuta.toUpperCase()} </span></p>
                <p><span> ${rutas.responsableRuta} </span></p>
                <p>Clientes Activos: <span>${cantidadClientes} </span>  </p>
                <p>Saldo en Ruta: <span>${formatearValor(saldoEnRuta)}</span> </p>
                <p>Saldo en Mora: <span>0</span> </p>
            `;
            btnMoreInfo.innerHTML = `   
                <div>
                <span class="material-symbols-outlined" >info</span>
                </div>
            `;
            nuevasRutas.appendChild(nuevoDiv);
            nuevoDiv.appendChild(btnMoreInfo);
            nuevoDiv.appendChild(rutaActiva);

            btnMoreInfo.addEventListener('click', ()=> {
                contModal.classList.remove('hidden')
                const fechaFormateada = new Date(rutasId.fechaCreacion.toDate()).toLocaleDateString();
                divInfoRuta.innerHTML = `
                <p> Nombre de la Ruta: <span> ${rutasId.nombreRuta.toUpperCase()} </span></p>
                <p>Responsable: <span> ${rutasId.responsableRuta} </span></p>
                <p>Cédula: <span> ${rutasId.cedula} </span></p>
                <p>Ciudad: <span> ${rutasId.ciudad} </span></p>
                <p>Dirección: <span> ${rutasId.direccion} </span></p>
                <p>Fecha de creación: <span> ${fechaFormateada} </span></p>
                <p>Clientes Activos: <span>${cantidadClientes} </span>  </p>
                <p>Saldo en Ruta: <span>${formatearValor(saldoEnRuta)}</span> </p>
                <p>Saldo en Mora: <span>0</span> </p>
                `
                contModalInfoRuta.appendChild(divInfoRuta)
            });

            btnCerrar.addEventListener('click', ()=>{
                contModal.classList.add('hidden')
                contModalInfoRuta.innerHTML = ''
            })
            // Agregar evento de clic al div
            rutaActiva.addEventListener('click', () => {
                 // Redirigir a la página de clientes con el ID de la ruta
                 window.location.href = `clientes.html?id=${doc.id}`;
            });
        });
        }
    });
}

async function contClientesRuta(rutaId) {
    try {
        const clientesRef = collection(db, 'nuevas-rutas', rutaId, 'clientes');
        const snapshot = await getCountFromServer(clientesRef);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error al contar clientes de la ruta:', error);
        return 0; // Devuelve 0 en caso de error
    }
}

mostrarRutas();



