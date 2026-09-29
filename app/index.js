const appInsights = require('applicationinsights');

// Configuração do Application Insights
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights
        .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();

    console.log('App Insights configurado.');
} else {
    console.log('App Insights connection string não encontrada.');
}

const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 8080;

// Configuração do Azure SQL
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Página principal
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>GameShelf - FIAP</title>

        <style>
            * {
                box-sizing: border-box;
            }

            body {
                background-color: #0f172a;
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

                margin: 0;
                min-height: 100vh;

                display: flex;
                align-items: center;
                justify-content: center;

                text-align: center;
            }

            .container {
                width: 90%;
                max-width: 680px;

                background-color: #17243a;

                padding: 46px 40px;

                border-radius: 16px;

                border-top: 5px solid #38bdf8;

                box-shadow:
                    0 20px 45px rgba(0, 0, 0, 0.45),
                    0 0 25px rgba(56, 189, 248, 0.08);
            }

            .badge {
                display: inline-block;

                background-color: #16a34a;
                color: #ffffff;

                padding: 7px 14px;

                border-radius: 6px;

                font-size: 0.9rem;
                font-weight: 600;

                margin-bottom: 20px;
            }

            h1 {
                color: #38bdf8;

                font-size: 2rem;

                margin-top: 0;
                margin-bottom: 22px;
            }

            p {
                color: #cbd5e1;

                font-size: 1.08rem;
                line-height: 1.6;

                margin: 10px 0;
            }

            .description {
                margin-bottom: 6px;
            }

            .project {
                color: #94a3b8;
                font-size: 0.95rem;

                margin-top: 18px;
            }

            .btn {
                display: inline-block;

                margin-top: 28px;

                padding: 13px 26px;

                background-color: #38bdf8;
                color: #082f49;

                text-decoration: none;

                border-radius: 8px;

                font-weight: 700;

                transition:
                    background-color 0.3s,
                    transform 0.2s,
                    box-shadow 0.2s;
            }

            .btn:hover {
                background-color: #0284c7;
                color: #ffffff;

                transform: translateY(-2px);

                box-shadow: 0 8px 22px rgba(56, 189, 248, 0.25);
            }

            .tech {
                margin-top: 32px;

                padding-top: 20px;

                border-top: 1px solid #334155;

                color: #64748b;

                font-size: 0.82rem;
            }

            @media (max-width: 600px) {
                .container {
                    padding: 36px 24px;
                }

                h1 {
                    font-size: 1.65rem;
                }

                p {
                    font-size: 1rem;
                }
            }
        </style>
    </head>

    <body>

        <main class="container">

            <div class="badge">
                Deploy Status: Sucesso! ✅
            </div>

            <h1>
                GameShelf · deploy automático validado
            </h1>

            <p class="description">
                Cinco jogos, um catálogo e uma esteira de entrega contínua
                utilizando GitHub Actions e Microsoft Azure.
            </p>

            <p class="project">
                Projeto de Tiago Sousa Leite · 2TSCPW-2026
            </p>

            <a href="/tema" class="btn">
                🚀 Ver Dados do Banco
            </a>

            <div class="tech">
                Node.js · Azure Web App · Azure SQL · GitHub Actions · Application Insights
            </div>

        </main>

    </body>
    </html>
    `);
});

// Endpoint que consulta os dados do Azure SQL
app.get('/tema', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT
                ID,
                Nome,
                Genero,
                Plataforma
            FROM dbo.Jogos
            ORDER BY ID
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error('Erro ao conectar no banco:', err);

        res.status(500).json({
            erro: 'Não foi possível consultar o catálogo no momento.'
        });
    }
});

// Inicialização da aplicação
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
