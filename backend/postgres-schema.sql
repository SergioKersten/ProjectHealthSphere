-- Datenbank erstellen
-- CREATE DATABASE patientenverwaltung;

-- Verbinden zur Datenbank
\c patientenverwaltung;

-- Versicherung-Tabelle
CREATE TABLE Versicherung (
    versicherungID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    typ VARCHAR(50) NOT NULL,
    kontaktdaten VARCHAR(500)
);

-- Patient-Tabelle
CREATE TABLE Patient (
    patientID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vorname VARCHAR(100) NOT NULL,
    geburtsdatum DATE NOT NULL,
    adresse VARCHAR(255),
    telefon VARCHAR(20),
    versicherungsnummer VARCHAR(50),
    versicherungID INTEGER REFERENCES Versicherung(versicherungID)
);

-- Arzt-Tabelle
CREATE TABLE Arzt (
    arztID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vorname VARCHAR(100) NOT NULL,
    fachbereich VARCHAR(100),
    telefon VARCHAR(20),
    email VARCHAR(100)
);

-- Station-Tabelle
CREATE TABLE Station (
    stationID SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    etage INTEGER NOT NULL,
    bettenAnzahl INTEGER NOT NULL,
    stationsleiterID INTEGER REFERENCES Arzt(arztID)
);

-- Zimmer-Tabelle
CREATE TABLE Zimmer (
    zimmerID SERIAL PRIMARY KEY,
    nummer INTEGER NOT NULL,
    etage INTEGER NOT NULL,
    bettenAnzahl INTEGER NOT NULL,
    stationID INTEGER NOT NULL REFERENCES Station(stationID)
);

-- Bett-Tabelle
CREATE TABLE Bett (
    bettID SERIAL PRIMARY KEY,
    nummer INTEGER NOT NULL,
    belegt BOOLEAN DEFAULT FALSE,
    aktuellerPatientID INTEGER REFERENCES Patient(patientID),
    zimmerID INTEGER NOT NULL REFERENCES Zimmer(zimmerID)
);

-- Termin-Tabelle
CREATE TABLE Termin (
    terminID SERIAL PRIMARY KEY,
    datum DATE NOT NULL,
    uhrzeit TIME NOT NULL,
    dauer INTEGER DEFAULT 30, -- in Minuten
    notizen VARCHAR(500),
    patientID INTEGER NOT NULL REFERENCES Patient(patientID),
    arztID INTEGER NOT NULL REFERENCES Arzt(arztID)
);

-- Behandlung-Tabelle
CREATE TABLE Behandlung (
    behandlungID SERIAL PRIMARY KEY,
    datum DATE NOT NULL,
    therapie VARCHAR(500),
    patientID INTEGER NOT NULL REFERENCES Patient(patientID),
    behandelnderArztID INTEGER NOT NULL REFERENCES Arzt(arztID)
);

-- Diagnose-Tabelle
CREATE TABLE Diagnose (
    diagnoseID SERIAL PRIMARY KEY,
    bezeichnung VARCHAR(200) NOT NULL,
    beschreibung VARCHAR(500),
    icdCode VARCHAR(20) NOT NULL,
    diagnoseDatum DATE NOT NULL,
    behandlungID INTEGER NOT NULL REFERENCES Behandlung(behandlungID),
    diagnostizierenderArztID INTEGER NOT NULL REFERENCES Arzt(arztID)
);

-- Medikation-Tabelle
CREATE TABLE Medikation (
    medikationID SERIAL PRIMARY KEY,
    medikamentenName VARCHAR(100) NOT NULL,
    dosierung VARCHAR(50) NOT NULL,
    häufigkeit VARCHAR(50) NOT NULL,
    startDatum DATE NOT NULL,
    endDatum DATE,
    behandlungID INTEGER NOT NULL REFERENCES Behandlung(behandlungID)
);

-- Benutzer-Tabelle für die Authentifizierung und Autorisierung
CREATE TABLE Benutzer (
    benutzerID SERIAL PRIMARY KEY,
    benutzername VARCHAR(50) NOT NULL UNIQUE,
    passwortHash VARCHAR(255) NOT NULL,
    rolle VARCHAR(20) NOT NULL, -- 'Arzt', 'Verwaltung', 'Admin', etc.
    arztID INTEGER REFERENCES Arzt(arztID)
);

-- Protokoll-Tabelle für Auditing
CREATE TABLE Protokoll (
    protokollID SERIAL PRIMARY KEY,
    benutzerID INTEGER NOT NULL REFERENCES Benutzer(benutzerID),
    aktion VARCHAR(100) NOT NULL,
    zeitstempel TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    beschreibung VARCHAR(500)
);

-- Indizes für häufige Abfragen
CREATE INDEX idx_patient_name ON Patient(name, vorname);
CREATE INDEX idx_arzt_fachbereich ON Arzt(fachbereich);
CREATE INDEX idx_termin_datum ON Termin(datum, uhrzeit);
CREATE INDEX idx_bett_belegt ON Bett(belegt);
CREATE INDEX idx_behandlung_patient ON Behandlung(patientID);
CREATE INDEX idx_diagnose_icd ON Diagnose(icdCode);
