package com.corhuilabd.corhuilabd.models;

import jakarta.persistence.*;

@Entity
@Table(name = "programa")
public class Programa extends ABaseEntity  {

    @Column(length = 100, nullable = false)
    private String nomPrograma;
    
    @Column(length = 100, nullable = false)
    private String facultad;
    
    @Column(name = "num_semestre", nullable = false)
    private Integer numSemestre;
    
    @Column(name = "num_credito", nullable = false)
    private Integer numCredito;
    
    @Column(nullable = false)
    private String descripcion;

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Getters y setters

    public String getNomPrograma() {
        return nomPrograma;
    }

    public void setNomPrograma(String nomPrograma) {
        this.nomPrograma = nomPrograma;
    }

    public String getFacultad() {
        return facultad;
    }

    public void setFacultad(String facultad) {
        this.facultad = facultad;
    }

    public Integer getNumSemestre() {
        return numSemestre;
    }

    public void setNumSemestre(Integer numSemestre) {
        this.numSemestre = numSemestre;
    }

    public Integer getNumCredito() {
        return numCredito;
    }

    public void setNumCredito(Integer numCredito) {
        this.numCredito = numCredito;
    }
}
