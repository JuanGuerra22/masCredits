
import {totalClientes, contarRutas, calSaldoCartera, formatearValor} from './functions.js'

// Funcion para contar la cantidad de clientes que tiene una ruta 
const rutasActivas = document.getElementById('rutas-activas');

contarRutas().then(cantidad => {
    rutasActivas.innerHTML = `${cantidad}`
});

totalClientes().then(cantidad => {
    // Aquí puedes actualizar la interfaz de usuario con la cantidad total de clientes
    document.getElementById('total-clientes').textContent = cantidad;
});

calSaldoCartera().then(valorTotal =>{
    document.getElementById('cartera').textContent = formatearValor(valorTotal);
});