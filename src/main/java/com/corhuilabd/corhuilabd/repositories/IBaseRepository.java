package com.corhuilabd.corhuilabd.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.corhuilabd.corhuilabd.models.ABaseEntity;

// import com.BackPM.BackPM.models.ABaseEntity;

public interface IBaseRepository<T extends ABaseEntity, ID> extends JpaRepository<T,ID> {
}
