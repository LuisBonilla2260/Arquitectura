package com.corhuilabd.corhuilabd.controllers;

import org.springframework.web.bind.annotation.*;

import com.corhuilabd.corhuilabd.services.IProgramaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.corhuilabd.corhuilabd.models.Programa;

@CrossOrigin(origins = {"http://localhost:4200"})//el puerto del frontend
@RestController
@RequestMapping("/api/programas")
public class ProgramaController extends ABaseController<Programa, IProgramaService> {

    protected ProgramaController(IProgramaService service) {
        super(service, "Programa");
    }

    @Autowired
    private IProgramaService service;

    @GetMapping("/byFacultad")
    public List<Programa> getByFacultad(@RequestParam String facultad) {
        return service.findByFacultad(facultad);
    }
}
