const bcrypt = require('bcrypt');

// Obtener password desde argumentos o usar default
const password = process.argv[2] || 'admin123';
const saltRounds = 10;

console.log('🔐 Generando hash de contraseña...\n');
console.log(`Password: ${password}`);
console.log(`Salt Rounds: ${saltRounds}\n`);

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log('✅ Hash generado:\n');
    console.log(hash);
    console.log('\n💡 Copia este hash y úsalo en tu migración');
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
