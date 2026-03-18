const express = require('express');// servidor web
const fs = require('fs');// manipulação de arquivos
const path = require('path');// manipulação de caminhos

const app = express();
const port = 3000;

app.use(express.json());

/*
CLIENTES ENDPOINTS
 */
const clientesPath = path.join(__dirname, 'clientes.json');

/*
PRODUTOS ENDPOINTS
 */
const produtosPath = path.join(__dirname, 'produtos.json');

function lerClientes() {
    if(!fs.existsSync(clientesPath)){
        return [];
    }

    const dados = fs.readFileSync(clientesPath, 'utf8');
    try{
       return JSON.parse(dados)  || [];

    }catch(e){
       return [];
    }
}

function salvarClientes(clientes) {
  fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2), 'utf-8');
}

function lerProdutos() {
    if(!fs.existsSync(produtosPath)){
        return [];
    }
    const dados = fs.readFileSync(produtosPath, 'utf8');
    try{
       return JSON.parse(dados)  || [];
    }catch(e){
       return [];
    }
}

function salvarProdutos(produtos) {
  fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2), 'utf-8');
} 

app.post('/produtos', (req, res) => {
    const { id, nome , valor, descricao } = req.body;
    
    // Debug para verificar os campos recebidos
    console.log('Dados do produto recebidos:', { id, nome, valor, descricao });
  
    if (!id || !nome || !valor || !descricao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const produtos = lerProdutos();
    
    if(produtos.some(p => p.id === id)){
        return res.status(400).json({ error: 'ID já cadastrado' });
    }

    const novoProduto = { id, nome, valor, descricao };
    produtos.push(novoProduto);
    salvarProdutos(produtos);
    res.status(201).json({ message: 'Produto criado com sucesso', produto: novoProduto});
});

app.get('/clientes', (req, res) => {
    const clientes = lerClientes();
    res.json(clientes);
});

app.get('/clientes/:cpf', (req, res) => {
    const clientes = lerClientes();
    const cliente = clientes.find(c => c.cpf === req.params.cpf);
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
app.get("/produtos", (req, res) => {
    const produtos = lerProdutos();
    res.status(200).json(produtos);
});

app.get("/produtos/:id", (req, res) => {
    const produtos = lerProdutos();
    const produto = produtos.find(p => p.id == req.params.id);
    if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
});
