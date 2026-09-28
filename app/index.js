const appInsights = require('applicationinsights');

// Configuração do Application Insights
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();
    console.log("App Insights configurado.");
} else {
    console.log("App Insights connection string não encontrada.");
}

const express = require('express');
const sql = require('mssql');
const app = express();
const port = process.env.PORT || 8080;

// Configuração do Banco de Dados (Os alunos devem preencher as variáveis no Azure WebApp)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // Ex: meuserver.database.windows.net
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Necessário para Azure SQL
        trustServerCertificate: false
    }
};

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Catálogo de Jogos - FIAP</title>
        <style>
            body {
                background-color: #1a1a1a;
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
            }
            .container {
                background-color: #262626;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
                border-top: 5px solid #ED145B;
                max-width: 600px;
            }
            h1 {
                color: #ED145B;
                margin-top: 0;
            }
            p {
                font-size: 1.1em;
                line-height: 1.5;
                color: #cccccc;
            }
            .btn {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #ED145B;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            .btn:hover {
                background-color: #c0104a;
            }
            .badge {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.9em;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="badge">Deploy Status: Sucesso! ✅</div>
            <h1>Catálogo de Jogos · versão 1</h1>
            <p>Cinco jogos, um catálogo e uma esteira de entrega contínua com GitHub Actions e Azure.</p>
            <p>Projeto de Tiago Sousa Leite · 2TSCPW-2026</p>
            <a href="/tema" class="btn">🚀 Ver Dados do Banco</a>
        </div>
    </body>
    </html>
    `);
});

app.get('/tema', async (req, res) => {
    try {
        // Consulta ao catálogo persistido no Azure SQL.
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT ID, Nome, Genero, Plataforma FROM dbo.Jogos ORDER BY ID`;
        
        res.json(result.recordset);
    } catch (err) {
        console.error("Erro ao conectar no banco:", err);
        res.status(500).send("Não foi possível consultar o catálogo no momento.");
    }
});

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});
