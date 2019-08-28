/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package REST;

import DAO.OperacionesContacto;
import DAO.OperacionesEmpresa;
import DAO.OperacionesLog;
import DAO.OperacionesReservas;
import DAO.OperacionesUsuario;
import Objetos.Empresa;
import Objetos.Reserva;
import Objetos.Respuesta;
import Objetos.Sala;
import Objetos.Usuario;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("restServices")
public class RestServices {

    @POST
    @Path("inicioSesionUsuario")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta inicioSesionUsuario(Usuario u) {
        return new OperacionesUsuario().autenticate(u);
    }

    @POST
    @Path("envioFormularioContactenos")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta envioFormularioContactenos(Usuario u) {
        return new Respuesta();
    }

    @POST
    @Path("crearUsuario")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta crearUsuario(Usuario u) {
        return new OperacionesUsuario().create(u);
    }

    @POST
    @Path("editarUsuario")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta editarUsuario(Usuario u) {
        return new OperacionesUsuario().update(u);
    }

    @POST
    @Path("consultarUsuario")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta consultarUsuario(Usuario u) {
        return new OperacionesUsuario().read(u);
    }

    @POST
    @Path("crearReserva")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta crearReserva(Reserva r) {
        return new OperacionesReservas().create(r);
    }

    @GET
    @Path("verHorarios")
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta verHorarios() {
        return new OperacionesReservas().showAvailable();
    }

    @POST
    @Path("verMasHorarios")
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta verMasHorarios(Reserva r) {
        return new OperacionesReservas().showMoreAvailable(r);
    }

    @POST
    @Path("contactanosRiff")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta contactanosRiff(Usuario u) {
        return new OperacionesContacto().contactoRiff(u);
    }

    @POST
    @Path("contactanosCueva")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta contactanosCueva(Usuario u) {
        return new OperacionesContacto().contactoLaCueva(u);
    }

    @POST
    @Path("consultarHistoricoReservas")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta consultarHistoricoReservas(Usuario u) {
        return new OperacionesReservas().read(u);
    }

    @POST
    @Path("consultarReservasActivas")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta consultarReservasActivas(Usuario u) {
        return new OperacionesReservas().consultaReservasActivas(u);
    }

    @POST
    @Path("cancelarReservaActiva")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta cancelarReservaActiva(Reserva r) {
        return new OperacionesReservas().cancelarReservaActiva(r);
    }

    @POST
    @Path("insertarLog")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta insertarLog(Usuario u) {
        return new OperacionesLog().create(u);
    }

    @POST
    @Path("validarSesion")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta validarSesion(Usuario u) {
        return new OperacionesLog().validarSesion(u);
    }

    @GET
    @Path("verUsuarios")
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta verUsuarios() {
        return new OperacionesUsuario().readAll();
    }

    @POST
    @Path("actualizarDatosUsuario")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta actualizarDatosUsuario(Usuario u) {
        return new OperacionesUsuario().actualizarDatosUsuario(u);
    }

    @GET
    @Path("verEmpresas")
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta verEmpresas() {
        return new OperacionesEmpresa().readAll();
    }

    @POST
    @Path("crearEmpresa")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta crearEmpresa(Empresa e) {
        return new OperacionesEmpresa().create(e);
    }

    @POST
    @Path("crearSala")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Respuesta crearSala(Sala s) {
        return new OperacionesEmpresa().crearSala(s);
    }

}
