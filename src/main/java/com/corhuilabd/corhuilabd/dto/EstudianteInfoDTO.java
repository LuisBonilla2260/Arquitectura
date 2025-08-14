package com.corhuilabd.corhuilabd.dto;

public class EstudianteInfoDTO {
    private String documento;
    private String nombreEstudiante;
    private String nombrePrograma;

    public EstudianteInfoDTO(String documento, String nombreEstudiante, String nombrePrograma) {
        this.documento = documento;
        this.nombreEstudiante = nombreEstudiante;
        this.nombrePrograma = nombrePrograma;
    }

    // Getters
    public String getDocumento() {
        return documento;
    }

    public String getNombreEstudiante() {
        return nombreEstudiante;
    }

    public String getNombrePrograma() {
        return nombrePrograma;
    }
}