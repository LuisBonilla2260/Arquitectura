package com.corhuilabd.corhuilabd.controllers;

import com.corhuilabd.corhuilabd.models.Estudiante;
import com.corhuilabd.corhuilabd.services.EstudianteServiceImpl;
import com.corhuilabd.corhuilabd.services.IEstudianteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200"})//el puerto del frontend
// Controlador REST para manejar las operaciones CRUD de estudiantes
// y la búsqueda por estado
@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController extends ABaseController<Estudiante, IEstudianteService> {

    @Autowired
    private EstudianteServiceImpl estudianteService;
    
    protected EstudianteController(IEstudianteService service) {
        super(service, "Estudiante");
    }

    // Buscar estudiantes por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Estudiante>> getEstudiantesByStatus(@PathVariable String status) {
        List<Estudiante> estudiantes = estudianteService.findByStatus(status);
        if (estudiantes.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay estudiantes con ese estado
        } else {
            return ResponseEntity.ok(estudiantes); // 200 OK con la lista de estudiantes con ese estado
        }
    }
}
