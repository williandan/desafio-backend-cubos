const express = require("express")
const { listarContas, criarConta, atualizarUsuario, deletarConta, depositar, sacar, tranferir, mostrarSaldo } = require("./controladores/controladores")
const validaSenha = require("./intermediarios")

const rotas = express()

rotas.get("/contas", validaSenha, listarContas)
rotas.post("/contas", criarConta)
rotas.put("/contas/:numeroConta/usuario", atualizarUsuario)
rotas.delete("/contas/:numeroConta", deletarConta)
rotas.post("/transacoes/depositar", depositar)
rotas.post("/transacoes/sacar", sacar)
rotas.post("/transacoes/transferir", tranferir)
rotas.get("/contas/saldo", mostrarSaldo)

module.exports = rotas