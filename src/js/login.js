import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth } from "./firebase.js";
import {mensajes} from './mensajes.js'


const loginForm = document.getElementById('login-form');
const spinner = document.getElementById('spinner-container');


if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email-usuario').value;
        const password = document.getElementById('password-usuario').value;

        if(!email || !password){
            return; 
        }
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
         
            spinner.classList.remove('hidden');

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } catch (error) {
                mensajes('Usuario no registrado o Incorrecto', "fail");
        }
    });
}