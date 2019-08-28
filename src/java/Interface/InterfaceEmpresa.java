/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
package Interface;

import Objetos.Empresa;
import Objetos.Respuesta;

public interface InterfaceEmpresa {

    public Respuesta create(Empresa e);

    public Respuesta read(Empresa e);

    public Respuesta readAll();

    public Respuesta update(Empresa e);

    public Respuesta delete(Empresa e);
}
