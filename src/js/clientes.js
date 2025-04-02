import { collection, onSnapshot, doc, getDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {db} from './firebase.js';
import { contClientesRuta, formatearValor } from './functions.js'


const listaClientes = document.getElementById('lista-clientes');
const btnAddCliente = document.getElementById('add-cliente');

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
            const clienteDiv = document.createElement('div');
            clienteDiv.classList.add('cliente-div')
            clienteDiv.innerHTML = `
                <span class ='posicion-ruta'>${cliente.posicion}</span>
                <p>Nombre: <span> ${cliente.nombreCliente} </span></p>
                <p>Cédula: <span>${cliente.cedula}</span></p>
                <p>Valor Préstamo: <span>${formatearValor(cliente.valor)}</span></p>
                <p>Valor Seguro: <span>${formatearValor(cliente.seguro)}</span></p>
                <p> <b>Total a Pagar:</b> <span>${formatearValor(cliente.totalPagar)}</span></p>
            `;
            listaClientes.appendChild(clienteDiv);

            clienteDiv.addEventListener('click', ()=>{
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