const mdLinks = require("../md-links.js");
const {
  validateFile,
  isAbsolute,
  converAbsolute,
  isFile,
  readThisFile,
} = require("../function-assistant.js");
// se realiza un simulacro(imitacion)para las funciones del archivo function-assistant.js 
//El objeto dentro de jest.mock especifica cómo deben comportarse estas funciones simuladas. 
jest.mock('../function-assistant.js', () => ({
  //En este caso, se están simulando las siguientes funciones: 
  readThisFile: jest.fn(),
  validateFile: jest.fn(),
  isAbsolute: jest.fn(),
  converAbsolute: jest.fn(),
  isFile: jest.fn(),
  readThisFile: jest.fn(),
}))

// conjunto de Pruebas unitarias para la funcion md-links 
describe("mdLinks", () => {
  // it para definir casos de pruebas individuales 
  it("Podria retornar 'no existe ruta' para cuando no se envia ningun valor", () => {
    // aqui se esta verificando el comportamiento de md-link cuando no se le pasa una ruta vacia 
    validateFile.mockReturnValue(false)
    const path = "";
    mdLinks(path)
      .then(() => {})
      .catch((error) => {
        expect(error).toBe("No existe ruta");
      });
  });
  

  it("Podria retornar 'Es una carpeta' para cuando no se envia ningun valor", () => {
    validateFile.mockReturnValue(true)
    isAbsolute.mockReturnValue(false)
    converAbsolute.mockReturnValue('evident/')
    isFile.mockReturnValue(false)
    const path = "evident/";
    mdLinks(path)
      .then(() => {})
      .catch((error) => {
        expect(error).toBe("Es una carpeta");
      });
  });
  it("Podria retornar Links para cuando no se envia ningun valor", () => {
    validateFile.mockReturnValue(true)
    isAbsolute.mockReturnValue(false)
    converAbsolute.mockReturnValue('evident/README2.md')
    isFile.mockReturnValue(true)
    const response = [
      {
        href: 'https://www.wdl.org/es/',
        text: '[Biblioteca Digital Mundial]',
        file: '/Users/nancygonzalez/Desktop/PROYECTO_LABORATORIA/DEV008-md-links/readme/README3.md',
        status: 200,
        ok: 'ok'
      }
    ]
    readThisFile.mockReturnValue(response)
    const path = "evident/";
    mdLinks(path)
      .then(item => {
        expect(item).toBe(response)
      })
  });
});
