import bcrypt from 'bcryptjs';

const password = '123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Senha criptografada:', hash);
  }
});
