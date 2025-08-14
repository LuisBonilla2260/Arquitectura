package com.corhuilabd.corhuilabd.services;

import java.util.List;

import com.corhuilabd.corhuilabd.models.ABaseEntity;

public interface IBaseService<T extends ABaseEntity> {

    List<T> all();
    List<T> findByStateTrue();
    T findById(Long id) throws Exception;
    T save(T entity) throws Exception;
    void update(Long id, T entity) throws Exception;
    void delete(Long id) throws Exception;
    void setStatus_at(Long id, boolean state);

}