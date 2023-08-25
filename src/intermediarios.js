const { banco } = require("./bancodedados")

validaSenha = (req, res, next) => {
  const { senha_banco } = req.query

  if (!senha_banco) {
    return res.status(401).json({ mensagem: "Senha deve ser informada" })
  }

  if (senha_banco !== banco.senha) {
    return res.status(403).json({ mensagem: "Senha está incorreta!" })
  }

  next()
}

module.exports = validaSenha