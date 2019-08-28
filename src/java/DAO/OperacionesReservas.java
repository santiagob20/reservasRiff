/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package DAO;

import Conexion.Conexion;
import Objetos.Respuesta;
import Interface.InterfaceReservas;
import Objetos.Calendario;
import Objetos.Precio;
import Objetos.Reserva;
import Objetos.Usuario;
import Objetos.Sala;
import com.google.gson.Gson;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class OperacionesReservas implements InterfaceReservas {

    @Override
    public Respuesta create(Reserva r) {
        Respuesta rta = new Respuesta();
        Conexion c = new Conexion();
        Reserva reserva = new Reserva();
        ArrayList<Reserva> listaReservas = new ArrayList<>();
        String sql = "select app.sp_reserva_crud('"
                + "{\"operacion\":\"CREATE\","
                + "\"nombre_empresa\":\"" + r.getNombreEmpresa() + "\","
                + "\"id_usuario\":" + r.getIdUsuario() + ","
                + "\"id_precio\":" + r.getIdPrecio() + ","
                + "\"id_sala\":" + r.getIdSala() + ","
                + "\"fecha_reserva\":\"" + r.getFechaReserva() + "\","
                + "\"hora_inicio\":\"" + r.getHoraInicio() + "\","
                + "\"hora_fin\":\"" + r.getHoraFin() + "\","
                + "\"pago_realizado\":0,"
                + "\"detalles\":\"N/A\"}');";
        try {
            PreparedStatement ps = c.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                reserva = new Gson().fromJson(rs.getString("sp_reserva_crud"), Reserva.class);
                listaReservas.add(reserva);
            }
            rta.setCodigo(Integer.parseInt(reserva.getCodigo()));
            rta.setDescripcion(reserva.getDescripcion());
        } catch (SQLException ex) {
            rta.setCodigo(Integer.parseInt(reserva.getCodigo()));
            rta.setDescripcionError("Error al crear reserva: " + ex);
        } finally {
            c.desconectar();
        }
        return rta;
    }

    @Override
    public Respuesta read(Usuario u) {
        Respuesta rta = new Respuesta();
        Conexion c = new Conexion();
        String sql = "";
        ArrayList<Reserva> listaReservas = new ArrayList<>();
        if (u.getId_usuario() > 0) {
            sql = "select * from app.vst_historico_reservas where id_usuario = " + u.getId_usuario();
        } else {
            sql = "select * from app.vst_historico_reservas";
        }
        try {
            PreparedStatement ps = c.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Reserva reserva = new Reserva();
                Usuario usuario = new Usuario();
                Sala sala = new Sala();
                Precio precio = new Precio();

                reserva.setIdReserva(rs.getInt("id_reserva"));
                reserva.setIdUsuario(rs.getInt("id_usuario"));
                usuario.setUsuario(rs.getString("usuario"));
                usuario.setNombre(rs.getString("nombre"));
                precio.setPrecio(rs.getInt("precio"));
                sala.setNombreSala(rs.getString("nombre_sala"));
                sala.setCapacidadPersonas(rs.getInt("capacidad"));
                reserva.setFechaReserva(rs.getDate("fecha_reserva"));
                reserva.setHoraInicio(rs.getTime("hora_inicio"));
                reserva.setHoraFin(rs.getTime("hora_fin"));

                reserva.setUsuario(usuario);
                reserva.setSala(sala);
                reserva.setPrecio(precio);
                listaReservas.add(reserva);
            }
            rta.setCodigo(1);
            rta.setDescripcion("reservas consultadas correctamente");
            rta.setListaReservas(listaReservas);
        } catch (SQLException ex) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al consultar reservas: " + ex);
        } finally {
            c.desconectar();
        }
        return rta;

    }

    @Override
    public Respuesta update(Reserva r) {
        return null;
    }

    @Override
    public Respuesta delete(Reserva r) {
        return null;
    }

    @Override
    public Respuesta showAvailable() {
        Respuesta rta = new Respuesta();
        ArrayList<Calendario> listaHorarios = new ArrayList<>();
        Conexion cn = new Conexion();
        String sql = "SELECT fecha\n"
                + ",h_08::text\n"
                + ", h_09::text\n"
                + ", h_10::text\n"
                + ", h_11::text\n"
                + ", h_12::text\n"
                + ", h_13::text\n"
                + ", h_14::text\n"
                + ", h_15::text\n"
                + ", h_16::text\n"
                + ", h_17::text\n"
                + ", h_18::text\n"
                + ", h_19::text\n"
                + ", h_20::text\n"
                + ", h_21::text\n"
                + ", h_22::text\n"
                + ", h_23::text\n"
                + "FROM app.vst_calendario order by fecha::date;";

        try {
            PreparedStatement ps = cn.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Calendario horario = new Calendario();
                horario.setFecha(rs.getDate("fecha"));
                horario.setH8(rs.getString("h_08"));
                horario.setH9(rs.getString("h_09"));
                horario.setH10(rs.getString("h_10"));
                horario.setH11(rs.getString("h_11"));
                horario.setH12(rs.getString("h_12"));
                horario.setH13(rs.getString("h_13"));
                horario.setH14(rs.getString("h_14"));
                horario.setH15(rs.getString("h_15"));
                horario.setH16(rs.getString("h_16"));
                horario.setH17(rs.getString("h_17"));
                horario.setH18(rs.getString("h_18"));
                horario.setH19(rs.getString("h_19"));
                horario.setH20(rs.getString("h_20"));
                horario.setH21(rs.getString("h_21"));
                horario.setH22(rs.getString("h_22"));
                horario.setH23(rs.getString("h_23"));
                listaHorarios.add(horario);
            }
            rta.setCodigo(1);
            rta.setDescripcion("Consulta de horarios exitosa");
            rta.setListaHorarios(listaHorarios);
        } catch (SQLException ex) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al consultar horarios, " + ex);
        } finally {
            cn.desconectar();
        }

        return rta;
    }

    @Override
    public Respuesta showMoreAvailable(Reserva r) {
        Respuesta rta = new Respuesta();
        ArrayList<Calendario> listaHorarios = new ArrayList<>();
        Conexion cn = new Conexion();
        String sql = "SELECT fecha\n"
                + ",h_08::text\n"
                + ", h_09::text\n"
                + ", h_10::text\n"
                + ", h_11::text\n"
                + ", h_12::text\n"
                + ", h_13::text\n"
                + ", h_14::text\n"
                + ", h_15::text\n"
                + ", h_16::text\n"
                + ", h_17::text\n"
                + ", h_18::text\n"
                + ", h_19::text\n"
                + ", h_20::text\n"
                + ", h_21::text\n"
                + ", h_22::text\n"
                + ", h_23::text\n"
                + "FROM app.vst_calendario where fecha between '" + r.getFechaReserva() + "' and '" + r.getFechaReserva() + "'::Date + interval '7 days' order by fecha::date;";
        try {
            PreparedStatement ps = cn.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Calendario horario = new Calendario();
                horario.setFecha(rs.getDate("fecha"));
                horario.setH8(rs.getString("h_08"));
                horario.setH9(rs.getString("h_09"));
                horario.setH10(rs.getString("h_10"));
                horario.setH11(rs.getString("h_11"));
                horario.setH12(rs.getString("h_12"));
                horario.setH13(rs.getString("h_13"));
                horario.setH14(rs.getString("h_14"));
                horario.setH15(rs.getString("h_15"));
                horario.setH16(rs.getString("h_16"));
                horario.setH17(rs.getString("h_17"));
                horario.setH18(rs.getString("h_18"));
                horario.setH19(rs.getString("h_19"));
                horario.setH20(rs.getString("h_20"));
                horario.setH21(rs.getString("h_21"));
                horario.setH22(rs.getString("h_22"));
                horario.setH23(rs.getString("h_23"));
                listaHorarios.add(horario);
            }
            rta.setCodigo(1);
            rta.setDescripcion("Consulta de horarios exitosa");
            rta.setListaHorarios(listaHorarios);
        } catch (SQLException ex) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al consultar horarios, " + ex);
        } finally {
            cn.desconectar();
        }

        return rta;
    }

    @Override
    public Respuesta consultaReservasActivas(Usuario u) {
        Respuesta rta = new Respuesta();
        Conexion c = new Conexion();
        ArrayList<Reserva> listaReservas = new ArrayList<>();
        String sql = "SELECT \n"
                + "r.id_reserva, \n"
                + "r.id_usuario,\n"
                + "u.usuario,\n"
                + "u.nombre,\n"
                + "p.precio,\n"
                + "s.nombre_sala,\n"
                + "s.capacidad,\n"
                + "r.fecha_reserva, \n"
                + "r.hora_inicio, \n"
                + "r.hora_fin\n"
                + "FROM app.tbl_reserva r\n"
                + "inner join app.tbl_precios p\n"
                + "on r.id_precio = p.id_precio\n"
                + "inner join app.tbl_sala s\n"
                + "on r.id_sala = s.id_sala\n"
                + "inner join app.tbl_usuario u\n"
                + "on r.id_usuario = u.id_usuario\n"
                + "where r.id_usuario = ? \n"
                + "and r.fecha_reserva >= now()::date \n"
                + "and NOT (detalles @> '{\"adicionales\": \"cancelada\"}'::jsonb);";

        try {
            PreparedStatement ps = c.conectar().prepareStatement(sql);
            ps.setInt(1, u.getId_usuario());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Reserva reserva = new Reserva();
                Usuario usuario = new Usuario();
                Sala sala = new Sala();
                Precio precio = new Precio();

                reserva.setIdReserva(rs.getInt("id_reserva"));
                reserva.setIdUsuario(rs.getInt("id_usuario"));
                usuario.setUsuario(rs.getString("usuario"));
                usuario.setNombre(rs.getString("nombre"));
                precio.setPrecio(rs.getInt("precio"));
                sala.setNombreSala(rs.getString("nombre_sala"));
                sala.setCapacidadPersonas(rs.getInt("capacidad"));
                reserva.setFechaReserva(rs.getDate("fecha_reserva"));
                reserva.setHoraInicio(rs.getTime("hora_inicio"));
                reserva.setHoraFin(rs.getTime("hora_fin"));

                reserva.setUsuario(usuario);
                reserva.setSala(sala);
                reserva.setPrecio(precio);
                listaReservas.add(reserva);
            }
            rta.setCodigo(1);
            rta.setDescripcion("reservas consultadas correctamente");
            rta.setListaReservas(listaReservas);
        } catch (SQLException ex) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al consultar reservas: " + ex);
        } finally {
            c.desconectar();
        }
        return rta;
    }

    @Override
    public Respuesta cancelarReservaActiva(Reserva u) {
        Respuesta rta = new Respuesta();
        Conexion cn = new Conexion();
        String sql = "select app.sp_reserva_crud('{\n"
                + "\"operacion\":\"DELETE\",\n"
                + "\"nombre_empresa\":\"" + u.getNombreEmpresa() + "\",\n"
                + "\"id_reserva\":" + u.getIdReserva() + ",\n"
                + "\"id_sala\":" + u.getDetalles().split("/")[0] + ",\n"
                + "\"fecha_reserva\":\"" + u.getFechaReserva() + "\",\n"
                + "\"hora_inicio\":\"" + u.getHoraInicio() + "\",\n"
                + "\"hora_fin\":\"" + u.getHoraFin()+ "\"}');";
        try {
            PreparedStatement ps = cn.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                rta.setDescripcion(rs.getString("sp_reserva_crud"));
            }
            rta.setCodigo(1);
        } catch (SQLException e) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al cancelarReservaActiva: " + e);
        } finally {
            cn.desconectar();
        }
        return rta;
    }
}
