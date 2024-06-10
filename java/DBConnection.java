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
            throw new ClassNotFoundException("Oracle JDBC driver not found.");
        }
    }

    public static void main(String[] var0) throws ClassNotFoundException, SQLException, InterruptedException {
        Connection var1 = etablirConnexion();
        String var2 = "SELECT nom from restaurant";
        ResultSet var3 = var1.createStatement().executeQuery(var2);

        while(var3.next()) {
            System.out.println(var3.getString(1));
        }

    }
}