IF OBJECT_ID('dbo.Jogos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Jogos (
        ID INT PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Genero NVARCHAR(60) NOT NULL,
        Plataforma NVARCHAR(60) NOT NULL
    );
END;
MERGE dbo.Jogos AS destino
USING (VALUES
    (1, N'Hollow Knight', N'Metroidvania', N'PC'),
    (2, N'Stardew Valley', N'Simulacao', N'PC'),
    (3, N'Portal 2', N'Puzzle', N'PC'),
    (4, N'Hades', N'Roguelike', N'PC'),
    (5, N'Celeste', N'Plataforma', N'PC')
) AS origem (ID, Nome, Genero, Plataforma)
ON destino.ID = origem.ID
WHEN MATCHED THEN UPDATE SET Nome=origem.Nome, Genero=origem.Genero, Plataforma=origem.Plataforma
WHEN NOT MATCHED THEN INSERT (ID, Nome, Genero, Plataforma)
VALUES (origem.ID, origem.Nome, origem.Genero, origem.Plataforma);
SELECT ID, Nome, Genero, Plataforma FROM dbo.Jogos ORDER BY ID;
