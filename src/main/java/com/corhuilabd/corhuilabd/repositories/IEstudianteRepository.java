package com.corhuilabd.corhuilabd.repositories;



import java.util.List;

import org.springframework.stereotype.Repository;

import com.corhuilabd.corhuilabd.models.Estudiante;

@Repository
public interface IEstudianteRepository extends IBaseRepository<Estudiante, Long> {
    Estudiante findByDocumento(Long documento);

    List<Estudiante> findByStatus(String status);
}