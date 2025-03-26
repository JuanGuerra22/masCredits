import { onAuthStateChanged, signOut } from  "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { auth } from "./firebase.js";


//Comprueba que el Usuario esté Logueado. 
auth.onAuthStateChanged(async(user) =>{
    if(!user){
        window.location.href = 'login.html';
        return;
    }else{
        console.log('Usiario autenticado', user.email)
    }
});
//---------------------------------------


const cerrarSesion = document.getElementById('salir-icon');
const spinner = document.getElementById('spinner-container');

if(cerrarSesion){
    cerrarSesion.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            spinner.classList.remove('hidden');
            setTimeout(()=>{
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            mensajes("Error al cerrar sesión. Inténtalo nuevamente", "fail");
        }
    });
}


