import { collection, onSnapshot, doc, getDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {db} from './firebase.js';
import { contClientesRuta, formatearValor } from './functions.js'


const listaClientes = document.getElementById('lista-clientes');
const btnAddCliente = document.getElementById('add-cliente');
const contModal = document.getElementById('cont-modal-cliente');
const contModalInfoCliente = document.getElementById('modal-info-cliente');
const btnCerrar = document.getElementById('btn-cerrar');

function obtenerParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id')
    };
}

const { id } = obtenerParametrosURL();

const clientesRef = collection(db, 'nuevas-rutas', id, 'clientes');
const q = query(clientesRef, orderBy('posicion', 'asc'))

onSnapshot(q, (snapshot) => {
    listaClientes.innerHTML = '';
    if (snapshot.empty) {
        listaClientes.innerHTML = '<p id="default-text">No hay clientes asignados a esta ruta.</p>';
    } else {
        snapshot.forEach((doc) => {
            const cliente = doc.data();
            const clienteId = doc.data(doc.id)
            const clienteDiv = document.createElement('div');
            const moreInfoDiv = document.createElement('div');
            const infoClientes = document.createElement('div');
            clienteDiv.classList.add('cliente-div')
            moreInfoDiv.classList.add('more-info')
            infoClientes.classList.add('info-cliente')
            moreInfoDiv.innerHTML = `
                <p ><span class="material-symbols-outlined" >info</span></p> 
            `;
            infoClientes.innerHTML = `
                <p>${cliente.posicion} - <span> ${cliente.nombreCliente} </span></p>
                <p>$ <span>${formatearValor(cliente.totalPagar)}</span></p>  
            `;
            listaClientes.appendChild(clienteDiv);
            clienteDiv.appendChild(moreInfoDiv)
            clienteDiv.appendChild(infoClientes)

            moreInfoDiv.addEventListener('click', () =>{
                const fechaFormateada = new Date(clienteId.fechaCreacion.toDate()).toLocaleDateString();
                contModal.classList.remove('hidden')
                const divInfoCliente = document.createElement('div');
                divInfoCliente.classList.add('div-info-cliente');
                divInfoCliente.innerHTML = `
                 <p>Nombre: <span>${clienteId.nombreCliente}</span></p>  
                 <p>Cedula: <span>${clienteId.cedula}</span></p>  
                 <p>Ciudad: <span>${clienteId.ciudad}</span></p>  
                 <p>Fecha de Inicio: <span>${fechaFormateada}</span></p>  
                 <p>Préstamo: $<span>${formatearValor(clienteId.valor)}</span></p>  
                 <p>Seguro: $<span>${formatearValor(clienteId.seguro)}</span></p>  
                 <p>Periodo: <span>${clienteId.periodo}</span></p>  
                 <p>Cuotas: <span>${clienteId.cuota}</span></p>   
                 <p>Saldo Actual: $<span>${formatearValor(clienteId.totalPagar)}</span></p>  
                `;
                contModalInfoCliente.appendChild(divInfoCliente)
            })

            btnCerrar.addEventListener('click', () =>{
                contModal.classList.add('hidden');
                contModalInfoCliente.innerHTML = '';
            })

            infoClientes.addEventListener('click', ()=>{
                window.location.href = `liquidar-cliente.html?rutaId=${id}&id=${doc.id}`; // obtengo la id del cliente y de la ruta 
            })
        });
    }

});

btnAddCliente.addEventListener('click', () => {
    // Obtener la información de la ruta desde Firestore
    const rutaRef = doc(db, 'nuevas-rutas', id); // Usar el id de la ruta de la url
    getDoc(rutaRef).then((docSnap) => {
        if (docSnap.exists()) {
            const rutaData = docSnap.data();
            // Redirigir a nuevo-cliente.html con los datos de la ruta
            window.location.href = `nuevo-cliente.html?id=${id}&nombreRuta=${rutaData.nombreRuta}&responsableRuta=${rutaData.responsableRuta}`;
        } else {
            console.log('No se encontró el documento de la ruta');
        }
    }).catch((error) => {
        console.error('Error al obtener el documento de la ruta:', error);
    });
});

contClientesRuta().then(cantidad => {
    console.log('cantidad de clientes es:::', cantidad);    
});