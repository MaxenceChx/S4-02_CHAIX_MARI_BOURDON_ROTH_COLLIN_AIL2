CREATE TABLE restaurant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    longitude DECIMAL(18, 14) NOT NULL,
    latitude DECIMAL(18, 14) NOT NULL
);

CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    date DATE NOT NULL,
    heure TIME NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    nb_personne INT NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
);