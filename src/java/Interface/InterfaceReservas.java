/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package Interface;

import Objetos.Reserva;
import Objetos.Respuesta;
import Objetos.Usuario;

public interface InterfaceReservas {

    public Respuesta create(Reserva r);

    public Respuesta read(Usuario u);

    public Respuesta update(Reserva r);

    public Respuesta delete(Reserva r);
    
    public Respuesta showAvailable();
    
    public Respuesta showMoreAvailable(Reserva r);
    
    public Respuesta consultaReservasActivas(Usuario u);
    
    public Respuesta cancelarReservaActiva(Reserva u);
}
