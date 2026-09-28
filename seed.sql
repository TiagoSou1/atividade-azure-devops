IF OBJECT_ID('dbo.Jogos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Jogos (
        ID INT PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Genero NVARCHAR(60) NOT NULL,
        Plataforma NVARCHAR(60) NOT NULL
    );
END;
IF NOT EXISTS (SELECT 1 FROM dbo.Jogos WHERE ID=1)
    INSERT INTO dbo.Jogos VALUES (1, N'Hollow Knight', N'Metroidvania', N'PC');
IF NOT EXISTS (SELECT 1 FROM dbo.Jogos WHERE ID=2)
    INSERT INTO dbo.Jogos VALUES (2, N'Stardew Valley', N'Simulacao', N'PC');
IF NOT EXISTS (SELECT 1 FROM dbo.Jogos WHERE ID=3)
    INSERT INTO dbo.Jogos VALUES (3, N'Portal 2', N'Puzzle', N'PC');
IF NOT EXISTS (SELECT 1 FROM dbo.Jogos WHERE ID=4)
    INSERT INTO dbo.Jogos VALUES (4, N'Hades', N'Roguelike', N'PC');
IF NOT EXISTS (SELECT 1 FROM dbo.Jogos WHERE ID=5)
    INSERT INTO dbo.Jogos VALUES (5, N'Celeste', N'Plataforma', N'PC');
SELECT ID, Nome, Genero, Plataforma FROM dbo.Jogos ORDER BY ID;
