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
    public String recupererRestaurants() throws RemoteException {
        StringBuilder res = new StringBuilder();
        try {
            Statement stmt = connect.createStatement();
            stmt.executeQuery("SELECT * FROM restaurant");
            ResultSet rs = stmt.getResultSet();

            res.append("{\n");
            res.append("\t\"restaurants\": [\n");
            while (rs.next()) {
                res.append("\t\t{\n");
                res.append("\t\t\t\"id\": " + rs.getInt("id") + ",\n");
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
    public String recupererRestaurant(int num) throws RemoteException, ServerNotActiveException {
        StringBuilder res;
        try {
            String SQLPrep = "SELECT * FROM restaurant WHERE num = ?";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setInt(1, num);
            prep.execute();
            ResultSet rs = prep.getResultSet();

            res = new StringBuilder("{\n");
            if (rs.next()) {
                res.append("\t\"success\": \"true\",\n");
                res.append("\t\"restaurant\": {\n");
                res.append("\t\t\"id\": " + rs.getInt("id") + ",\n");
                res.append("\t\t\"nom\": \"" + rs.getString("nom") + "\",\n");
                res.append("\t\t\"adresse\": \"" + rs.getString("adresse") + "\",\n");
                res.append("\t\t\"latitude\": " + rs.getString("latitude") + ",\n");
                res.append("\t\t\"longitude\": " + rs.getString("longitude") + "\n");
                res.append("\t}\n");
            } else {
                res.append("\t\"success\": \"false\",\n");
                res.append("\t\"error\": \"Aucun restaurant trouvé avec le nom : \'" + num + "\'\"\n");
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
    public String creerRestaurant(String nom, String adresse, Double latitude, Double longitude) throws RemoteException, ServerNotActiveException {
        System.out.println("Création du restaurant " + nom + " à l'adresse " + adresse + " (" + latitude + ", " + longitude + ")");
        StringBuilder res;
        try {
            String SQLPrep = "INSERT INTO restaurant (nom, adresse, latitude, longitude) VALUES (?, ?, ?, ?);";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setString(1, nom);
            prep.setString(2, adresse);
            prep.setDouble(3, latitude);
            prep.setDouble(4, longitude);
            prep.execute();

            res = new StringBuilder("{\n");
            res.append("\t\"success\": \"true\",\n");
            res.append("\t\"message\": \"Restaurant créé avec succès\"\n");
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\"\n");
            res.append("\t\"error\": \"" + e.getMessage() + "\"");
            res.append("}");
        }
        System.out.println("Restaurant créé : " + res.toString());
        return res.toString();
    }

    @Override
    public String enregistrerReservation(int idrestau, Date date, Time heure, String nom, String prenom, int nb_personne) throws RemoteException, ServerNotActiveException {
        StringBuilder res;
        try {
            String SQLPrep = "INSERT INTO reservation (id_restaurant, date, heure, nom, prenom, nb_personne) VALUES (?, ?, ?, ?, ?, ?);";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setInt(1, idrestau);
            prep.setDate(2, date);
            prep.setTime(3, heure);
            prep.setString(4, nom);
            prep.setString(5, prenom);
            prep.setInt(6, nb_personne);
            prep.execute();

            res = new StringBuilder("{\n");
            res.append("\t\"success\": \"true\",\n");
            res.append("\t\"message\": \"Réservation enregistrée avec succès\"\n");
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
