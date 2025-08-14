package com.corhuilabd.corhuilabd.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.corhuilabd.corhuilabd.models.Programa;

@Repository
public interface IProgramaRepository  extends IBaseRepository<Programa, Long>{
    List<Programa> findByFacultad(String facultad);
}
