let { contas, depositos, transferencias, saques } = require("../bancodedados")
const findCPF = require("../utils/findCpf")
const findEmail = require("../utils/findEmail")

const listarContas = (req, res) => {
  return res.json(contas)
}

let idConta = 1
const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

  if (!nome) {
    return res.status(400).json({ mensagem: "É obrigatório informar o nome" })
  }

  if (!cpf) {
    return res.status(400).json({ mensagem: "É obrigatório informar o cpf" })
  }

  if (!data_nascimento) {
    return res.status(400).json({ mensagem: "É obrigatório informar a data de nascimento" })
  }

  if (!telefone) {
    return res.status(400).json({ mensagem: "É obrigatório informar o telefone" })
  }

  if (!email) {
    return res.status(400).json({ mensagem: "É obrigatório informar o email" })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar a senha" })
  }

  const CPFNaoEUnico = findCPF(cpf)
  const emailNaoEUnico = findEmail(email)

  if (CPFNaoEUnico || emailNaoEUnico) {
    return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
  }

  const data = {
    numero: idConta,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    }
  }

  contas.push(data)
  idConta++

  return res.status(201).send()
}

const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

  if (!numeroConta) {
    return res.status(400).json({ mensagem: "É obrigatório informar o numero da conta" })
  }

  if (!nome) {
    return res.status(400).json({ mensagem: "É obrigatório informar o nome" })
  }

  if (!cpf) {
    return res.status(400).json({ mensagem: "É obrigatório informar o cpf" })
  }

  if (!data_nascimento) {
    return res.status(400).json({ mensagem: "É obrigatório informar a data de nascimento" })
  }

  if (!telefone) {
    return res.status(400).json({ mensagem: "É obrigatório informar o telefone" })
  }

  if (!email) {
    return res.status(400).json({ mensagem: "É obrigatório informar o email" })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar a senha" })
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta)
  })

  if (!conta) {
    return res.status(404).json({ mensagem: "Usuario não encontrado" })
  }

  const CPFNaoEUnico = findCPF(cpf)
  const emailNaoEUnico = findEmail(email)

  if (CPFNaoEUnico) {
    return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" })
  }

  if (emailNaoEUnico) {
    return res.status(400).json({ mensagem: "Já existe uma conta com o email informado!" })
  }

  conta.usuario.nome = nome
  conta.usuario.cpf = cpf
  conta.usuario.email = email
  conta.usuario.data_nascimento = data_nascimento
  conta.usuario.telefone = telefone
  conta.usuario.senha = senha

  return res.status(203).send()

}

const deletarConta = (req, res) => {
  const { numeroConta } = req.params


  if (!numeroConta) {
    return res.status(400).json({ mensagem: "É obrigatório informar o número da conta" })
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta)
  })

  if (!conta) {
    return res.status(404).json({ mensagem: "Usuario não encontrado" })
  }

  if (conta.saldo !== 0) {
    return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
  }

  contas = contas.filter((conta) => {
    return conta.numero !== Number(numeroConta)
  })

  return res.status(204).send()
}

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body

  if (!numero_conta || !valor) {
    return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta)
  })

  if (!conta) {
    return res.status(404).json({ mensagem: "Usuario não encontrado" })
  }

  if (valor <= 0) {
    return res.status(400).json({ mensagem: "Não é permitido depósitos com valores negativos ou zerados" })
  }

  conta.saldo += valor

  const data = new Date().toLocaleString()

  depositos.push({
    data,
    numero_conta,
    valor
  })

  return res.status(204).send()
}

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body
  console.log(senha)

  if (!senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar o senha" })
  }

  if (!numero_conta || !valor) {
    return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta)
  })

  if (!conta) {
    return res.status(404).json({ mensagem: "Usuario não encontrado" })
  }

  if (senha !== conta.usuario.senha) {
    return res.status(400).json({ mensagem: "A senha está incorreta" })
  }

  if (valor <= 0) {
    return res.status(400).json({ mensagem: "Não é permitido depósitos com valores negativos ou zerados" })
  }

  if (valor > conta.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente!" })
  }

  const data = new Date().toLocaleString()

  conta.saldo -= valor

  saques.push({
    data,
    numero_conta,
    valor
  })

  return res.status(204).send()
}

const tranferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body

  if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar numero da conta de origem,numero da conta de destino,senha da conta de origem e valor!" })
  }

  const contaDeOrigem = contas.find((conta) => {
    return conta.numero === Number(numero_conta_origem)
  })

  const contaDeDestino = contas.find((conta) => {
    return conta.numero === Number(numero_conta_destino)
  })

  if (!contaDeDestino || !contaDeOrigem) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" })
  }

  if (senha !== contaDeOrigem.usuario.senha) {
    return res.status(403).json({ mensagem: "Senha está incorreta" })
  }

  if (valor > contaDeOrigem.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente!" })
  }

  contaDeOrigem.saldo -= valor
  contaDeDestino.saldo += valor

  const data = new Date().toLocaleString()

  transferencias.push({
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor
  })

  return res.status(204).send()
}

const mostrarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar numero da conta e senha" })
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta)
  })

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" })
  }

  if (senha !== conta.usuario.senha) {
    return res.status(403).json({ mensagem: "Senha está incorreta!" })
  }

  return res.json({
    "saldo": conta.saldo
  })
}

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  deletarConta,
  depositar,
  sacar,
  tranferir,
  mostrarSaldo
}