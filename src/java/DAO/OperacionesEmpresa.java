/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package DAO;

import Conexion.Conexion;
import Interface.InterfaceEmpresa;
import Objetos.Empresa;
import Objetos.Respuesta;
import Objetos.Sala;
import Objetos.Usuario;
import com.google.gson.Gson;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class OperacionesEmpresa implements InterfaceEmpresa {

    @Override
    public Respuesta create(Empresa e) {
        /*
            EMPRESA
            select app.sp_crud_empresa('{"operacion":"CREATE","nombre_empresa":"empresa de mamoncillos","resumen":"venta de mamoncillos deshidratados","direccion":"CL falsa 123","horarios":"9:00 am - 9:00 pm","correo_electronico":"mamoncillos@gmail.com","servicios":"--","logo":"13","activo":1}');
         */
        Respuesta rta = new Respuesta();
        Empresa empresa = new Empresa();
        String sqlEmpresa = "select app.sp_crud_empresa("
                + "'{\"operacion\":\"CREATE\","
                + "\"nombre_empresa\":\"" + e.getNombreEmpresa() + "\","
                + "\"resumen\":\"" + e.getResumen() + "\","
                + "\"direccion\":\"" + e.getDireccion() + "\","
                + "\"horarios\":\"" + e.getHorarios() + "\","
                + "\"correo_electronico\":\"" + e.getCorreoElectronico() + "\","
                + "\"servicios\":\"salaEnsayo\","
                //                + "\"servicios\":\"" + e.getServicios() + "\","
                + "\"logo\":\"" + e.getLogoEmpresa() + "\","
                + "\"activo\":1}');";
        System.out.println(sqlEmpresa);
        Conexion cn = new Conexion();
        try {
            PreparedStatement ps = cn.conectar().prepareStatement(sqlEmpresa);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                empresa = new Gson().fromJson(rs.getString("sp_crud_empresa"), Empresa.class);
            }
            rta.setCodigo(Integer.parseInt(empresa.getCodigo()));
            rta.setDescripcion(empresa.getDescripcion());
        } catch (SQLException ex) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al crear la empresa: " + e.getNombreEmpresa() + " Error: " + ex);
        } finally {
            cn.desconectar();
        }
        return rta;
    }

    public Respuesta crearSala(Sala s) {
        /*
            SALA
            select app.sp_crud_sala('{"operacion":"CREATE","nombre_empresa":"el toke","nombre_sala":"d","capacidad":5,"valor_bloque":45000,"equipos":"microfono behringer"}');
         */

        Respuesta rta = new Respuesta();
        Empresa empresa = new Empresa();
        String sqlSalas = "select app.sp_crud_sala('{\"operacion\":\"CREATE\","
                + "\"nombre_empresa\":\"" + s.getNombreEmpresa() + "\","
                + "\"nombre_sala\":\"" + s.getNombreSala() + "\","
                + "\"capacidad\":" + s.getCapacidadPersonas() + ","
                + "\"valor_bloque\":" + s.getPrecioSalaHora() + ","
                + "\"equipos\":\"" + s.getEquipo() + "\"}');";
        System.out.println(sqlSalas);
        Conexion cn2 = new Conexion();
        try {
            PreparedStatement ps = cn2.conectar().prepareStatement(sqlSalas);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                empresa = new Gson().fromJson(rs.getString("sp_crud_sala"), Empresa.class);
            }
            rta.setCodigo(Integer.parseInt(empresa.getCodigo()));
            rta.setDescripcion(empresa.getDescripcion());
        } catch (SQLException ex) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al crear la sala Error: " + ex);
        } finally {
            cn2.desconectar();
        }
        return rta;
    }

    @Override
    public Respuesta read(Empresa e) {
        return null;
    }

    @Override
    public Respuesta readAll() {
        Respuesta rta = new Respuesta();
        ArrayList<Empresa> arrEmpresa = new ArrayList<>();
        Conexion cn = new Conexion();
        String sql = "SELECT * FROM app.tbl_empresa order by id_empresa asc;";
        try {
            PreparedStatement ps = cn.conectar().prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Empresa em = new Empresa();
                em.setIdEmpresa(rs.getInt("id_empresa"));
                em.setNombreEmpresa(rs.getString("nombre_empresa"));
                em.setResumen(rs.getString("resumen"));
                em.setDireccion(rs.getString("direccion"));
                em.setHorarios(rs.getString("horarios"));
                em.setCorreoElectronico(rs.getString("correo_electronico"));
                em.setServicios(rs.getString("servicios"));
                em.setActivo(rs.getInt("activo"));
//                em.setImgLogo(rs.getString("img_logo"));
//                em.setImgCard(rs.getString("img_card"));
                arrEmpresa.add(em);
            }
            rta.setCodigo(1);
            rta.setDescripcion("Consulta con exito.");
            rta.setListaEmpresas(arrEmpresa);
        } catch (SQLException e) {
            rta.setCodigo(0);
            rta.setDescripcionError("Error al consultar las empresas: " + e);
        } finally {
            cn.desconectar();
        }
        return rta;
    }

    @Override
    public Respuesta update(Empresa e) {
        return null;
    }

    @Override
    public Respuesta delete(Empresa e) {
        return null;
    }

}
