const { contas } = require("../bancodedados")

function findCPF(cpf) {
  const conta = contas.find((conta) => {
    return conta.usuario.cpf === cpf
  })
  return conta
}

module.exports = findCPF