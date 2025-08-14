package com.corhuilabd.corhuilabd.services;

import java.util.List;

import com.corhuilabd.corhuilabd.models.Programa;

public interface IProgramaService extends IBaseService<Programa> {

    List<Programa> findByFacultad(String facultad);

}
