package Restaurant;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DBConnection {
    public DBConnection() {
    }

    public static Connection etablirConnexion() throws SQLException, ClassNotFoundException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver chargé");
            Connection var0 = DriverManager.getConnection("jdbc:mysql://localhost:3306/projet_map", "root", "");
            System.out.println("connecté");
            return var0;
        } catch (ClassNotFoundException var1) {
            throw new ClassNotFoundException("Oracle JDBC driver non trouvé.");
        }
    }

    public static void main(String[] var0) throws ClassNotFoundException, SQLException, InterruptedException {
        Connection connection = etablirConnexion();
        String query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(1, 'Brasserie L excelsior', '50 Rue Henri-Poincaré, 54000 Nancy', '48.690775', '6.175630')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(2, 'Piopa Lasagnax', '61 Rue Pierre Semard, 54000 Nancy', '48.689304', '6.178177')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(3, 'Le Café Lecce', '3 Rue Crampel, 54000 Nancy', '48.689555', '6.175335')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(4, 'Piperno', '1 Bis Rue Notre Dame, 54000 Nancy', '48.689555', '6.180362')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(5, 'Coté Sushi', '18 Pl. Henri Mengin, 54000 Nancy', '48.689658', '6.182100')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(6, 'Tanto Bene', '1 Av. Foch, 54000 Nancy', '48.689502', '6.177079')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(7, 'Le Dizneuf', '19 Pl. Henri Mengin, 54000 Nancy', '48.688765', '6.182293')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(8, 'Brasserie Simone', '5 place Simone Veil, 54000 Nancy', '48.689678', '6.175585')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(9, 'Jean Lamour', '7-9 Pl. Stanislas, 54000 Nancy', '48.693892', '6.182529')";
        connection.createStatement().executeUpdate(query);
        query = "INSERT INTO restaurant(num, nom, adresse, latitude, longitude) VALUES(10, 'Au Grand Sérieux', '27 Rue Raugraff, 54000 Nancy', '48.689728', '6.181992')";
        connection.createStatement().executeUpdate(query);
    }
}