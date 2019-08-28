/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package Conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {

    private Connection c;
    private final String userName = "postgres";
    private final String password = "Ucentral2019";
    private final String host = "reservasriff.c6l8vdttvauj.us-east-2.rds.amazonaws.com";
    private final String port = "5431";
    private final String dbName = "reservasriff";
    String jdbcUrl = "jdbc:postgresql://"+host+":"+port+"/"+dbName+ "?user=" + userName + "&password=" + password;

    public Connection conectar() {
        try {
            Class.forName("org.postgresql.Driver");
//            c = DriverManager.getConnection("jdbc:postgresql://", userName, password);
            c = DriverManager.getConnection(jdbcUrl);
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("Error BD: " + e);
        }
        return c;
    }

    public void desconectar() {
        try {
            c.close();
        } catch (SQLException e) {
            System.out.println("Error al desconectar PostgreSQL " + e);
        }
    }
}
