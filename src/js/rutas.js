const nuevasRutas = document.getElementById('nuevas-rutas');
const btnAddRuta = document.getElementById('add-ruta');


btnAddRuta.addEventListener('click', ()=>{
    const nuevoDiv = document.createElement('div');
    nuevoDiv.classList.add('div-prueba')
    nuevasRutas.appendChild(nuevoDiv);
});