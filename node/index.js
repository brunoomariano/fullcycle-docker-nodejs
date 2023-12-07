const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'db',
  user: 'mysql',
  password: 'mysql',
  database: 'mydb',
  insecureAuth: true
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados');
  }
});

app.get('/create/:nome', (req, res) => {
  const { nome } = req.params;

  if (!nome) {
    return res.status(400).send('Parâmetro inválido');
  }

  const sqlInserir = 'INSERT INTO people (nome) VALUES (?)';
  const valuesInserir = [nome];

  connection.query(sqlInserir, valuesInserir, (errInserir, resultInserir) => {
    if (errInserir) {
      console.error('Erro ao adicionar registro:', errInserir);
      return res.status(500).send('Erro interno do servidor');
    }

    console.log('Registro adicionado com sucesso:', resultInserir);

    const sqlListar = 'SELECT nome FROM people';

    connection.query(sqlListar, (errListar, resultsListar) => {
      if (errListar) {
        console.error('Erro ao obter lista de nomes:', errListar);
        return res.status(500).send('Erro interno do servidor');
      }

      const nomes = resultsListar.map((result) => result.nome);
      const listaNomesHTML = `<h1>Full Cycle Rocks!</h1> <ul>${nomes.map((nome) => `<li>${nome}</li>`).join('')}</ul>`;
      res.send(`Registro adicionado com sucesso para ${nome}. ${listaNomesHTML}`);
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});

