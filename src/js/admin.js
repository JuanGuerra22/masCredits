
import {totalClientes, contarRutas} from './functions.js'

// Funcion para contar la cantidad de clientes que tiene una ruta 
const rutasActivas = document.getElementById('rutas-activas');

contarRutas().then(cantidad => {
    rutasActivas.innerHTML = `${cantidad}`
    console.log(`Tienes ${cantidad} Rutas Activas.`);
});

totalClientes().then(cantidad => {
    console.log(`La cantidad total de clientes es: ${cantidad}`);
    // Aquí puedes actualizar la interfaz de usuario con la cantidad total de clientes
    document.getElementById('total-clientes').textContent = cantidad;
});