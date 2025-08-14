package com.corhuilabd.corhuilabd.services;

import java.util.List;

import com.corhuilabd.corhuilabd.models.Estudiante;

public interface IEstudianteService extends IBaseService<Estudiante> {
    Estudiante findByDocumento(Long documento); // Busca un estudiante por su número de documento
    //List<EstudianteInfoDTO> findEstudianteInfoByProgramaId(Integer programaId); // Encuentra estudiantes por ID de programa y devuelve información específica usando un DTO
    List<Estudiante> findByStatus(String status); // Busca un estudiante por su estado

}