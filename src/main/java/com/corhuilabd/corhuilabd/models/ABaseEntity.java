package com.corhuilabd.corhuilabd.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class ABaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @Column(name = "status_at", nullable = false)
    private Boolean status_At = true;

    @JsonIgnore
    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;

    @JsonIgnore
    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;

    @JsonIgnore
    @Column(name = "deleted_at", nullable = true)
    private LocalDateTime deletedAt;

    @JsonIgnore
    @Column(name = "created_by", nullable = true)
    private Long createdBy;

    @JsonIgnore
    @Column(name = "updated_by", nullable = true)
    private Long updatedBy;

    @JsonIgnore
    @Column(name = "deleted_by", nullable = true)
    private Long deletedBy;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getStatus_at() {
        return status_At;
    }

    public void setStatus_at(Boolean status_at) {
        this.status_At = status_at;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Long getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(Long deletedBy) {
        this.deletedBy = deletedBy;
    }
}