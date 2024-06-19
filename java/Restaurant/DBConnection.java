package Restaurant;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private DBConnection() {}

    public static Connection etablirConnexion() throws SQLException, ClassNotFoundException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver chargé");

            Connection conn = DriverManager.getConnection("jdbc:mysql://webetu.iutnc.univ-lorraine.fr:3306/chaix5u", "chaix5u", "@cNk4iDNpLdjs7");
            System.out.println("Connecté à la base de données");

            return conn;
        } catch (ClassNotFoundException e) {
            throw new ClassNotFoundException("MySQL driver non trouvé.");
        }
    }
}
