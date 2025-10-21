// Script para crear perfil de usuario en Firestore
// Uso: node scripts/create-user-profile.js

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🔥 Creador de Perfil de Usuario para Firestore\n");
console.log("📋 Necesitarás:");
console.log("   1. El UID del usuario (desde Firebase Authentication)");
console.log("   2. El email del usuario");
console.log("   3. Nombre y apellido");
console.log("   4. Rol (admin, user, o viewer)\n");

const questions = [
  "UID del usuario: ",
  "Email: ",
  "Nombre: ",
  "Apellido: ",
  "Rol (admin/user/viewer): ",
];

let answers = [];
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion < questions.length) {
    rl.question(questions[currentQuestion], (answer) => {
      answers.push(answer.trim());
      currentQuestion++;
      askQuestion();
    });
  } else {
    rl.close();
    generateFirestoreCode();
  }
}

function generateFirestoreCode() {
  const [uid, email, name, lastName, role] = answers;

  console.log("\n\n✨ Código generado:\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Opción 1: Usando Firebase Console");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log("1. Ve a Firestore Database en Firebase Console");
  console.log('2. Si es la primera vez, crea la colección "users"');
  console.log("3. Crea un documento con ID:", uid);
  console.log("4. Agrega estos campos:\n");
  console.log("   uid:", uid);
  console.log("   email:", email);
  console.log("   name:", name);
  console.log("   lastName:", lastName);
  console.log("   role:", role);
  console.log(
    "   createdAt: (selecciona timestamp y agrega la fecha actual)\n"
  );

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("Opción 2: Usando la consola del navegador (DevTools)");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log("1. Abre tu aplicación en el navegador");
  console.log("2. Presiona F12 para abrir DevTools");
  console.log('3. Ve a la pestaña "Console"');
  console.log("4. Copia y pega este código:\n");
  console.log("```javascript");
  console.log(
    `
// Importar Firebase
import { db } from './src/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Crear perfil de usuario
await setDoc(doc(db, 'users', '${uid}'), {
  uid: '${uid}',
  email: '${email}',
  name: '${name}',
  lastName: '${lastName}',
  role: '${role}',
  createdAt: new Date()
});

console.log('✅ Perfil creado correctamente!');
  `.trim()
  );
  console.log("```\n");

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("Opción 3: JSON para importar (Advanced)");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log(
    JSON.stringify(
      {
        uid,
        email,
        name,
        lastName,
        role,
        createdAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("\n\n✅ ¡Listo! Usa cualquiera de las opciones anteriores.\n");
}

askQuestion();

