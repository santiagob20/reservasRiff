/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package DAO;

import Conexion.Conexion;
import Interface.InterfaceLog;
import Objetos.Respuesta;
import Objetos.Usuario;
import com.google.gson.Gson;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class OperacionesLog implements InterfaceLog {

    @Override
    public Respuesta create(Usuario u) {
        Respuesta rta = new Respuesta();
        Conexion c = new Conexion();
        Usuario usuario = new Usuario();
        String sql = "select app.sp_log_crud(jsonb_build_object('operacion','CREATE','id_usuario','" + u.getId_usuario() + "','id_session','" + u.getId_session() + "',"
                + "'tp_accion','" + u.getTp_accion() + "','url','" + u.getUrl() + "','ip','" + u.getIp() + "')::varchar);";
        try {
            PreparedStatement ps = c.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                usuario = new Gson().fromJson(rs.getString("sp_log_crud"), Usuario.class);
            }
            rta.setCodigo(Integer.parseInt(usuario.getCodigo()));
            rta.setDescripcion(usuario.getDescripcion());
        } catch (SQLException ex) {
            rta.setCodigo(Integer.parseInt(usuario.getCodigo()));
            rta.setDescripcionError("Error al crear log: " + ex);
        } finally {
            c.desconectar();
        }
        return rta;
    }

    @Override
    public Respuesta read(Usuario u) {
        return null;
    }

    @Override
    public Respuesta update(Usuario u) {
        return null;
    }

    @Override
    public Respuesta delete(Usuario u) {
        return null;
    }

    @Override
    public Respuesta validarSesion(Usuario u) {
        Respuesta rta = new Respuesta();
        Conexion c = new Conexion();
        Usuario usuario = new Usuario();
        String sql = "select app.sp_log_crud(jsonb_build_object('operacion','VALIDATE','id_session','" + u.getId_session() + "')::varchar);";
        try {
            PreparedStatement ps = c.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                usuario = new Gson().fromJson(rs.getString("sp_log_crud"), Usuario.class);
            }
            rta.setCodigo(1);
            rta.setDescripcion("activo: "+usuario.getActivo());
        } catch (SQLException ex) {
            rta.setCodigo(Integer.parseInt(usuario.getCodigo()));
            rta.setDescripcionError("Error al validar sesion: " + ex);
        } finally {
            c.desconectar();
        }
        return rta;

    }

}
