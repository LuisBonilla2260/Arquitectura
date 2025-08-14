package com.corhuilabd.corhuilabd.dto;

public class ApiResponseDto<T> {
    private Boolean status_apiresponse;
    private T data;
    private String message;
    public ApiResponseDto() {
    }
    public ApiResponseDto(String message, T data, Boolean status_apiresponse) {
        this.message = message;
        this.data = data;
        this.status_apiresponse = status_apiresponse;
    }
    public Boolean getStatus_apiresponse() {
        return status_apiresponse;
    }
    public void setstatus_apiresponse(Boolean status_apiresponse) {
        this.status_apiresponse = status_apiresponse;
    }
    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}