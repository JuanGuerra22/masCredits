import { collection, onSnapshot, doc, getDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {db} from './firebase.js';
import { formatearValor} from './functions.js';


const divLiquidarCliente = document.getElementById('liquidar');
const btnArrowLeft  = document.getElementById('arrow-left');
const btnArrowRight  = document.getElementById('arrow-right');

function obtenerRutaId() {
    // Obtener el id de la ruta desde la url.
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('rutaId');
}

function obtenerParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id')
    };
}

const { id } = obtenerParametrosURL();

async function mostrarCliente() {
    try {
        // 1. Obtener la referencia del documento del cliente
        const clienteRef = doc(db, 'nuevas-rutas', obtenerRutaId(), 'clientes', id);

        // 2. Usar onSnapshot para escuchar los cambios en el documento
        onSnapshot(clienteRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const cliente = docSnapshot.data();
                const divCliente = document.createElement('div');
                divCliente.classList.add('div-cliente');
                divCliente.innerHTML = `
                    <div>
                    <span> ${cliente.nombreCliente} </span>
                    <span>CC. ${cliente.cedula}</span>
                    </div>
                    <div id='posicion-ruta'>
                    <p> ${cliente.posicion}</p>
                    </div>
                    <p>Valor Préstamo: <span>${formatearValor(cliente.valor)}</span></p>
                    <p>Valor Seguro: <span>${formatearValor(cliente.seguro)}</span></p>
                    <p> <b>Total a Pagar:</b> <span>${formatearValor(cliente.totalPagar)}</span></p>
                    
                `;
                divLiquidarCliente.appendChild(divCliente);
            } else {
                console.log("No such document!");
            }
        });
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

mostrarCliente()