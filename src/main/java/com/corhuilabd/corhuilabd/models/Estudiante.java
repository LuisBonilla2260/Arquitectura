package com.corhuilabd.corhuilabd.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;


@Entity
@Table(name = "estudiante")
public class Estudiante extends ABaseEntity {

    // Validación de estado con @Pattern
    @Pattern(regexp = "I|A|E", message = "El estado debe ser 'I', 'A' o 'E'")
    @Column(name = "status", length = 1, nullable = false)
    private String status;

    @Column(name = "nombre")
    @NotBlank(message = "El nombre del estudiante es obligatorio")
    private String nombreEstudiante;

    @Column(name = "edad")
    private Long edad;

    @Column(name = "documento")
    @NotBlank(message = "El documento es obligatorio")
    private Long documento;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "programa_id", nullable = false)
    private Programa programaId;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNombreEstudiante() {
        return nombreEstudiante;
    }

    public void setNombreEstudiante(String nombreEstudiante) {
        this.nombreEstudiante = nombreEstudiante;
    }

    public Long getEdad() {
        return edad;
    }

    public void setEdad(Long edad) {
        this.edad = edad;
    }

    public Long getDocumento() {
        return documento;
    }

    public void setDocumento(Long documento) {
        this.documento = documento;
    }

    public Programa getProgramaId() {
        return programaId;
    }

    public void setProgramaId(Programa programaId) {
        this.programaId = programaId;
    }
}
