package com.corhuilabd.corhuilabd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.corhuilabd.corhuilabd.models.Programa;
import com.corhuilabd.corhuilabd.repositories.IBaseRepository;
import com.corhuilabd.corhuilabd.repositories.IProgramaRepository;

@Service
public class ProgramaServiceImpl extends ABaseService<Programa> implements IProgramaService {
    @Autowired
    private IProgramaRepository repository;

    @Override
    public List<Programa> findByFacultad(String facultad) {
        return repository.findByFacultad(facultad);
    }

    @Override
    protected IBaseRepository<Programa, Long> getRepository() {
        return repository;
    }

}