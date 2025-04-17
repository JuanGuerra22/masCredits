import {db} from './firebase.js'
import { collection, getCountFromServer, collectionGroup, getDocs} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Obtener parámetros de la URL
export function obtenerParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id'),
        ruta: {
            nombreRuta: urlParams.get('nombreRuta'),
            responsableRuta: urlParams.get('responsableRuta'),
            cedula: urlParams.get('cedula'),
            ciudad: urlParams.get('ciudad'),
            direccion: urlParams.get('direccion')
        }
    };
}

const { id, ruta } = obtenerParametrosURL();

// Funcion para contar la cantidad total de CLIENTES. 
export async function totalClientes() {
    try {
        const clientesRef = collectionGroup(db, 'clientes');
        const snapshot = await getCountFromServer(clientesRef);
        const cantidadTotalClientes = snapshot.data().count;
        return cantidadTotalClientes;
    } catch (error) {
        console.error('Error al obtener la cantidad total de clientes:', error);
        return 0; // Devuelve 0 en caso de error
    }
}
// ---------------------------------------------------

// Funcion para contar la cantidad total de las RUTAS. 
export async function contarRutas(){
    try {
        const rutasRef = collection(db, 'nuevas-rutas');
        const snapshot = await getCountFromServer(rutasRef);
        const cantidadClientes = snapshot.data().count;
        return cantidadClientes;
    } catch (error) {
        console.log('Error al obtener la cantidad de clientes', error);
        return 0;
    }
}
// ---------------------------------------------------

// Funcion para contar la cantidad de Clientes por Ruta. 
export async function contClientesRuta() {
    try {
        const rutasClienRef = collection(db, 'nuevas-rutas', id, 'clientes');
        const snapshot = await getCountFromServer(rutasClienRef);
        const cantClientesRuta = snapshot.data().count;
        return cantClientesRuta;
    } catch (error) {
        console.log('Error al obtener la cantidad de Clientes por Ruta', error);
        return 0;
    }
}
// ---------------------------------------------------

// Funcion para dar formato a los numeros
export function formatearValor(valor){
    if(typeof valor !== "number"){
        return valor;
    }
    return valor.toLocaleString('es-CO', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}
// ---------------------------------------------------


export async function calSaldoCartera(){
    try{
    const clienteRef = collectionGroup(db, 'clientes');
    const snapshot = await getDocs(clienteRef);
    let valorTotal = 0

    snapshot.forEach( (doc) => {
        const cliente = doc.data();
        if(cliente.totalPagar){
            valorTotal += cliente.totalPagar;
        }
    });
    return valorTotal;
    } catch{
        console.error('Error al obtener el valor total de los préstamos:', error);
        return 0; // Devuelve 0 en caso de error
    }
}

export async function saldoRuta(rutaId) {
    try {
        const clienteRef = collection(db, 'nuevas-rutas', rutaId, 'clientes');
        const snapshot = await getDocs(clienteRef);
        let valorTotal = 0

        snapshot.forEach( (doc) => {
            const cliente = doc.data();
            if(cliente.totalPagar){
                valorTotal += cliente.totalPagar;
            }
        });
        return valorTotal;
    } catch (error) {
        console.error('Error al obtener el valor total del saldo en Ruta:', error);
        return 0; // Devuelve 0 en caso de error
    }
}