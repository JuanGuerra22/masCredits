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
                    <div class="cont-abono">
                        <label for="abono">Total a pagar</label>
                        <input value='${formatearValor(cliente.totalPagar)}' id='total-pagar' disabled readonly>
                        <label for="abono">Abono</label>
                        <input type="number" id="abono">
                        <button class='btn-principal'> Guardar </button>
                `;

                divLiquidarCliente.appendChild(divCliente);
                 // Agregar event listener al input abono
                 const inputAbono = document.getElementById('abono');
                 const inputTotalPagar = document.getElementById('total-pagar');
 
                 inputAbono.addEventListener('input', () => {
                     const abono = parseFloat(inputAbono.value) || 0;
                     const totalPagar = parseFloat(cliente.totalPagar);
                     const nuevoTotalPagar = totalPagar - abono;
 
                     inputTotalPagar.value = formatearValor(nuevoTotalPagar);
                 });
                
            } else {
                console.log("No such document!");
            }
        });
    } catch (error) {
        console.error("Error getting document:", error);
    }
}
mostrarCliente();


    const btnAddCliente = document.getElementById('add-cliente');

    btnAddCliente.addEventListener('click', () => {
        // Obtener la información de la ruta desde Firestore
        const rutaRef = doc(db, 'nuevas-rutas', obtenerRutaId()); // Usar el id de la ruta de la url
        getDoc(rutaRef).then((docSnap) => {
            if (docSnap.exists()) {
                const rutaData = docSnap.data();
                // Redirigir a nuevo-cliente.html con los datos de la ruta
                window.location.href = `nuevo-cliente.html?id=${obtenerRutaId()}&nombreRuta=${rutaData.nombreRuta}&responsableRuta=${rutaData.responsableRuta}`;
            } else {
                console.log('No se encontró el documento de la ruta');
            }
        }).catch((error) => {
            console.error('Error al obtener el documento de la ruta:', error);
        });
    });


