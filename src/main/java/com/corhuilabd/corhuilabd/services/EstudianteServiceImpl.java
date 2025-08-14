package com.corhuilabd.corhuilabd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.corhuilabd.corhuilabd.models.Estudiante;
import com.corhuilabd.corhuilabd.repositories.IBaseRepository;
import com.corhuilabd.corhuilabd.repositories.IEstudianteRepository;

@Service
public class EstudianteServiceImpl extends ABaseService<Estudiante> implements IEstudianteService {
    @Autowired
    private IEstudianteRepository repository;

    @Override
    protected IBaseRepository<Estudiante, Long> getRepository() {
        return repository;
    }

    @Override
    public Estudiante findByDocumento(Long documento) {
        return repository.findByDocumento(documento);
    }

    @Override
    public List<Estudiante> findByStatus(String status) {
        return repository.findByStatus(status);
    }

    /*@Override
    public List<EstudianteInfoDTO> findEstudianteInfoByProgramaId(Integer programaId) {
        return repository.findEstudianteInfoByProgramaId(programaId);
    }*/


}
