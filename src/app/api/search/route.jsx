export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
  
    // Simulación de datos (esto vendría de la base de datos real)
    const data = [
      { id: 1, name: "El árbol de los deseos", image:"arbol_deseos.png", audio:"El_arbol_de_Katherine_Applegate.mp3", archive:"el_arbol.pdf" },
      { id: 2, name: "El principito",image:"El_principito.png", audio:"El_principito.mp3", archive: "El_principito.pdf" },
      { id: 3, name: "El corredor del laberinto", image:"maze_runner.png", audio:"maze_runner.mp3", archive: "maze_runner.pdf" },
      { id: 4, name: "El fabricante de lágrimas", image: "Fabricante_lagrimas.png", audio:"Fabricante_lagrimas.mp3", archive:"Fabricante_lagrimas.pdf"},
      { id: 5, name: "El jardín de las mariposas", image: "Jardin_mariposas.png", audio:"Jardin_mariposas.mp3", archive:"jardin_mariposas.pdf"}
    ];
  
    // Filtrar resultados
    const results = data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  
    return Response.json(results);
  }
  