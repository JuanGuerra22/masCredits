import { collection, onSnapshot, doc, getDoc, addDoc, updateDoc, serverTimestamp, orderBy, query, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {db} from './firebase.js';
import { formatearValor} from './functions.js';
import {mensajes} from './mensajes.js';


const divLiquidarCliente = document.getElementById('liquidar');
const btnArrowLeft  = document.getElementById('arrow-left');
const btnArrowRight  = document.getElementById('arrow-right');
const spinner = document.getElementById('spinner-container');
const contInfoCliente = document.getElementById('info-cliente');

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
const rutaId = obtenerRutaId();

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
                contInfoCliente.innerHTML=`
                    <div class='infoC1'>
                    <p> <span>${cliente.posicion} - </span>${cliente.nombreCliente}</p>
                    <p><span>CC: </span>${cliente.cedula}</p>
                    </div> 
                    <div  class='infoC2'> 
                    <p>Préstamo Inicial: <span>${formatearValor(cliente.valor)}</span></p>
                    <p>Valor Seguro: <span>${formatearValor(cliente.seguro)}</span></p>
                    <p>Ultimo Abono: <span id='span-ultimo-abono'> ...</span></p>
                    </div> 
                `;
                divCliente.innerHTML = `
                    <div class="cont-abono">
                        <label for="abono">Total a pagar</label>
                        <input value='${formatearValor(cliente.totalPagar)}' id='saldo' disabled readonly>
                        <label for="abono">Abono</label>
                        <input type="number" id="abono">
                        <button class='btn-principal' id="btn-guardar-abono"> Guardar</button>
                    </div>

                `;

                divLiquidarCliente.appendChild(divCliente);
                 // Agregar event listener al input abono
                 const nuevoAbonoInput = document.getElementById('abono');
                 const saldoAnteriorInput = document.getElementById('saldo');
                 const btnGuardarAbono = document.getElementById('btn-guardar-abono');
                 spinner.classList.add('hidden');
                 nuevoAbonoInput.addEventListener('input', () => {
                     const abono = parseFloat(nuevoAbonoInput.value) || 0;
                     const totalPagar = parseFloat(cliente.totalPagar);
                     const saldoActual = totalPagar - abono;
                     saldoAnteriorInput.value = formatearValor(saldoActual);
                 });
                 
                 if (nuevoAbonoInput) {
                    nuevoAbonoInput.addEventListener('wheel', function(event) {
                      event.preventDefault();
                    }, { passive: false });
                  }

                //  agregamos funcionamiento al boton de guardar
                 
                 btnGuardarAbono.addEventListener('click', async ()=>{
                    const abono = parseFloat(nuevoAbonoInput.value);
                    if(!isNaN(abono) && abono > 0 && abono <= parseFloat(cliente.totalPagar)){
                        const abonoCollection = collection(db, 'nuevas-rutas', rutaId, 'clientes', id, 'abonos');
                        try {
                            await addDoc(abonoCollection, {
                                fecha: serverTimestamp(),
                                valorAbono: abono,
                                saldoAnterior: cliente.totalPagar,
                                saldoActual: parseFloat(cliente.totalPagar) - abono
                            });
                            spinner.classList.remove('hidden');
                            divLiquidarCliente.innerHTML = '';
                            await updateDoc(clienteRef, {
                                totalPagar: parseFloat(cliente.totalPagar) - abono
                            });     
                            
                            mensajes('Abono registrado con Éxito')
                            
                        } catch (error) {
                            console.error('Error al guardar el abono:', error);
                            mensajes('Error al registrar el abono.', 'fail');
                        }
                    } else{
                        mensajes('Por favor, ingresa un valor de abono válido y no mayor al saldo.', 'fail');
                    }
  
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

// async function obtenerUltimoAbono(rutaId, clienteId) {
//     const abonoRef =  collection('nuevas-rutas', rutaId, 'clientes', clienteId, 'abonos');
//     const q = query(abonoRef, orderBy('fecha', 'desc'), limit(1));
//     const snapshot = await getDocs(q);
//     if (!snapshot.empty) {
//         return snapshot.docs[0].data();
//     } else {
//         return null;
//     }
// }


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


    // funcion para obtener el historial de abonos

    const btnHistorial = document.getElementById('btn-historial');
    const contHistorial = document.getElementById('cont-historial');
    const modalHistorial = document.getElementById('modal-historial');
    const btnCerrar = document.getElementById('btn-cerrar');

    btnCerrar.addEventListener('click', ()=>{ contHistorial.classList.add('hidden')})


    btnHistorial.addEventListener('click', async()=>{
        const rutaId = obtenerRutaId();
        const clienteId = id;
        const historial = await obtenerHistorial(rutaId, clienteId);
        mostrarHistorial(historial);
        contHistorial.classList.remove('hidden')
    });

async function obtenerHistorial(rutaId, clienteId){
    const abonoRef =  collection(db, 'nuevas-rutas', rutaId, 'clientes', clienteId, 'abonos');
    const q = query(abonoRef, orderBy('fecha')); //Ordena de manera descendenta el historial por fecha
    const snapshot = await getDocs(q);
    const historial = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return historial;
}

function mostrarHistorial(historial){
    let html = '<table class="tabla-abonos"><thead><tr><th>N°</th><th>Fecha</th><th>Saldo Anterior</th><th>Abono</th><th>Saldo Actual</th></tr></thead><tbody>';
    if(historial.length === 0){
        html += '<tr><td colspan="5">No hay historial de abonos.</td></tr>';
    } else{
        let cont = 0
        historial.forEach(abono => {
            const fechaFormateada = new Date(abono.fecha.toDate()).toLocaleDateString();
            cont += 1;
            html += `<tr>
                    <td>${cont}</td>
                    <td>${fechaFormateada}</td>
                    <td>${formatearValor(abono.saldoAnterior)}</td>
                    <td>${formatearValor(abono.valorAbono)}</td>
                    <td>${formatearValor(abono.saldoActual)}</td>
                    </tr>`;
        });
    }
        html += '</tbody></table>';
        modalHistorial.innerHTML = html;
}


