const { contas } = require("../bancodedados")

function findEmail(email) {
  const conta = contas.find((conta) => {
    return conta.usuario.email === email
  })
  return conta
}

module.exports = findEmail