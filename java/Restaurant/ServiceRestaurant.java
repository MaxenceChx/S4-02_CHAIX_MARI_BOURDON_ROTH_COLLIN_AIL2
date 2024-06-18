package Restaurant;

import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;
import java.sql.*;



public class ServiceRestaurant implements InterfaceRestaurant {
    private Connection connect;


    public ServiceRestaurant() throws RemoteException {
        try {
            connect = DBConnection.etablirConnexion();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public String recupererRestaurants() throws RemoteException, ServerNotActiveException {
        StringBuilder res = new StringBuilder();
        try {
            Statement stmt = connect.createStatement();
            stmt.executeQuery("SELECT * FROM projet_map");
            ResultSet rs = stmt.getResultSet();

            res.append("{\n");
            res.append("\t\"restaurants\": [\n");
            while (rs.next()) {
                res.append("\t\t{\n");
                res.append("\t\t\t\"num\": " + rs.getInt("num") + ",\n");
                res.append("\t\t\t\"nom\": \"" + rs.getString("nom") + "\",\n");
                res.append("\t\t\t\"adresse\": \"" + rs.getString("adresse") + "\",\n");
                res.append("\t\t\t\"latitude\": \"" + rs.getString("latitude") + "\",\n");
                res.append("\t\t\t\"longitude\": \"" + rs.getString("longitude") + "\"\n");
                res.append("\t\t},\n");
            }
            res.deleteCharAt(res.length() - 2);
            res.append("\t]\n");
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\"\n");
            res.append("\t\"error\": \"" + e.getMessage() + "\"");
            res.append("}");
        }
        return res.toString();
    }

    @Override
    public String recupererRestaurant(String nom) throws RemoteException, ServerNotActiveException {
        StringBuilder res;
        try {
            String SQLPrep = "SELECT * FROM restaurant WHERE LOWER(nom) like LOWER(?);";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setString(1, '%' + nom + '%');
            prep.execute();
            ResultSet rs = prep.getResultSet();

            res = new StringBuilder("{\n");
            if (rs.next()) {
                res.append("\t\"success\": \"true\",\n");
                res.append("\t\"restaurant\": {\n");
                res.append("\t\t\"id\": " + rs.getInt("id_restaurant") + ",\n");
                res.append("\t\t\"nom\": \"" + rs.getString("nom") + "\",\n");
                res.append("\t\t\"adresse\": \"" + rs.getString("adresse") + "\",\n");
                res.append("\t\t\"latitude\": " + rs.getString("latitude") + ",\n");
                res.append("\t\t\"longitude\": " + rs.getString("longitude") + "\n");
                res.append("\t}\n");
            } else {
                res.append("\t\"success\": \"false\",\n");
                res.append("\t\"error\": \"Aucun restaurant trouvé avec le nom : \'" + nom + "\'\"\n");
            }
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\"\n");
            res.append("\t\"error\": \"" + e.getMessage() + "\"");
            res.append("}");
        }
        return res.toString();
    }

    @Override
    public String enregistrerReservation(String nomRestau, String nom, String prénom, int nbpers, String numTel) throws RemoteException, ServerNotActiveException {
        StringBuilder res;
        try {
            String SQLPrep = "INSERT INTO reservation (nomrestau, nom, prenom, nbpers, numtel, date, id_restaurant) VALUES (?, ?, ?, ?, ?, ?);";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setString(1, nom);
            prep.setString(2, prénom);
            prep.setInt(3, nbpers);
            prep.setString(4, numTel);
            prep.setDate(5, new Date(System.currentTimeMillis()));
            prep.setInt(6, Integer.parseInt(nomRestau));
            prep.execute();

            res = new StringBuilder("{\n");
            res.append("\t\"success\": \"true\",\n");
            res.append("\t\"message\": \"Réservation effectuée avec succès\"\n");
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\"\n");
            res.append("\t\"error\": \"" + e.getMessage() + "\"");
            res.append("}");
        }
        return res.toString();
    }


}
