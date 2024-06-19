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
            ResultSet rs = stmt.executeQuery("SELECT * FROM restaurant");

            res.append("{\n");
            res.append("\t\"restaurants\": [\n");
            while (rs.next()) {
                res.append("\t\t{\n");
                res.append("\t\t\t\"id\": ").append(rs.getInt("id")).append(",\n");
                res.append("\t\t\t\"nom\": \"").append(rs.getString("nom")).append("\",\n");
                res.append("\t\t\t\"adresse\": \"").append(rs.getString("adresse")).append("\",\n");
                res.append("\t\t\t\"latitude\": \"").append(rs.getString("latitude")).append("\",\n");
                res.append("\t\t\t\"longitude\": \"").append(rs.getString("longitude")).append("\"\n");
                res.append("\t\t},\n");
            }
            if (res.length() > 20) {
                res.deleteCharAt(res.length() - 2); // Remove the last comma
            }
            res.append("\t]\n");
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\",\n");
            res.append("\t\"error\": \"").append(e.getMessage()).append("\"\n");
            res.append("}");
        }
        return res.toString();
    }

    @Override
    public String recupererRestaurant(int num) throws RemoteException, ServerNotActiveException {
        StringBuilder res = new StringBuilder();
        try {
            String SQLPrep = "SELECT * FROM restaurant WHERE id = ?";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setInt(1, num);
            ResultSet rs = prep.executeQuery();

            res.append("{\n");
            if (rs.next()) {
                res.append("\t\"success\": \"true\",\n");
                res.append("\t\"restaurant\": {\n");
                res.append("\t\t\"id\": ").append(rs.getInt("id")).append(",\n");
                res.append("\t\t\"nom\": \"").append(rs.getString("nom")).append("\",\n");
                res.append("\t\t\"adresse\": \"").append(rs.getString("adresse")).append("\",\n");
                res.append("\t\t\"latitude\": ").append(rs.getString("latitude")).append(",\n");
                res.append("\t\t\"longitude\": ").append(rs.getString("longitude")).append("\n");
                res.append("\t}\n");
            } else {
                res.append("\t\"success\": \"false\",\n");
                res.append("\t\"error\": \"Aucun restaurant trouvé avec l'id : ").append(num).append("\"\n");
            }
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\",\n");
            res.append("\t\"error\": \"").append(e.getMessage()).append("\"\n");
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
        prep.executeUpdate();

        res = new StringBuilder("{\n");
        res.append("\t\"success\": true,\n");
        res.append("\t\"message\": \"Restaurant créé avec succès\"\n");
        res.append("}");
    } catch (SQLException e) {
        e.printStackTrace();
        res = new StringBuilder("{\n");
        res.append("\t\"success\": false,\n");
        res.append("\t\"error\": \"").append(e.getMessage()).append("\"\n");
        res.append("}");
    }
    System.out.println("Restaurant créé : " + res.toString());
    return res.toString();
}


    @Override
    public String enregistrerReservation(int idrestau, String date, String heure, String nom, String prenom, int nb_personne) throws RemoteException, ServerNotActiveException {
        System.out.println("Enregistrement de la réservation pour le restaurant " + idrestau + " le " + date + " à " + heure + " pour " + nb_personne + " personnes");
        StringBuilder res;
        try {
            String SQLPrep = "INSERT INTO reservation (restaurant_id, date, heure, nom, prenom, nb_personne) VALUES (?, ?, ?, ?, ?, ?);";
            PreparedStatement prep = connect.prepareStatement(SQLPrep);
            prep.setInt(1, idrestau);
            prep.setString(2, date);
            prep.setString(3, heure);
            prep.setString(4, nom);
            prep.setString(5, prenom);
            prep.setInt(6, nb_personne);
            prep.executeUpdate();

            res = new StringBuilder("{\n");
            res.append("\t\"success\": \"true\",\n");
            res.append("\t\"message\": \"Réservation enregistrée avec succès\"\n");
            res.append("}");
        } catch (SQLException e) {
            e.printStackTrace();
            res = new StringBuilder("{");
            res.append("\t\"success\": \"false\",\n");
            res.append("\t\"error\": \"").append(e.getMessage()).append("\"\n");
            res.append("}");
        }
        return res.toString();
    }
}