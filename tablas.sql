USE LinkHostel
GO
CREATE TABLE Clientes (
    Id_Cliente INT IDENTITY(1,1) PRIMARY KEY,    
    DNI NVARCHAR(20) NOT NULL,       
    Huesped NVARCHAR(100) NOT NULL,
    Email NVARCHAR(60),
    Telefono NVARCHAR(20)
);
GO

CREATE TABLE Habitaciones (
    NumeroHabitacion INT PRIMARY KEY,  
    Tipo NVARCHAR(50) NOT NULL,         
    Descripcion NVARCHAR(50) NOT NULL,                 
    Capacidad NVARCHAR(2) NOT NULL, 
    Banio NVARCHAR(20) NOT NULL
);
GO

CREATE TABLE Usuarios (
    Id_Usuario INT IDENTITY(1,1) PRIMARY KEY,
    Usuario NVARCHAR(20) NOT NULL,
    DNI NVARCHAR(20) NOT NULL,
    Clave NVARCHAR(15) NOT NULL,
    FechaDeRegistro DATE NOT NULL,
    Email NVARCHAR (60),
    ROL NVARCHAR (15) NOT NULL
);
GO

CREATE TABLE Reservas (
    Id_Reserva INT IDENTITY(1,1) PRIMARY KEY, 
    NumeroHabitacion INT NOT NULL,           
    Id_Cliente INT NOT NULL,         
    FechaIngreso DATE NOT NULL,
    FechaEgreso DATE NOT NULL,
    CantidadPersonas INT NOT NULL,           
    Estado NVARCHAR(20) NOT NULL  
    
CONSTRAINT FK_Reservas_Habitaciones FOREIGN KEY (NumeroHabitacion) 
        REFERENCES Habitaciones(NumeroHabitacion),
        
    CONSTRAINT FK_Reservas_Clientes FOREIGN KEY (Id_Cliente)  
        REFERENCES Clientes(Id_Cliente)
);
GO