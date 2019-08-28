/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package Interface;

import Objetos.Respuesta;
import Objetos.Usuario;

public interface InterfaceUsuario {

    public Respuesta create(Usuario u);

    public Respuesta read(Usuario u);

    public Respuesta update(Usuario u);

    public Respuesta delete(Usuario u);

    public Respuesta autenticate(Usuario u);

    public Respuesta readAll();

    public Respuesta actualizarDatosUsuario(Usuario u);

}
