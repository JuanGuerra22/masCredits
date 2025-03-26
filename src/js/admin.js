import { collection, getCountFromServer, collectionGroup} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { db } from "./firebase.js";

// Funcion para contar la cantidad de clientes que tiene una ruta 
const rutasActivas = document.getElementById('rutas-activas');

async function contarRutas(){
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

contarRutas().then(cantidad => {
    rutasActivas.innerHTML = `${cantidad}`
    console.log(`Tienes ${cantidad} Rutas Activas.`);
});


async function totalClientes() {
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

totalClientes().then(cantidad => {
    console.log(`La cantidad total de clientes es: ${cantidad}`);
    // Aquí puedes actualizar la interfaz de usuario con la cantidad total de clientes
    document.getElementById('total-clientes').textContent = cantidad;
});