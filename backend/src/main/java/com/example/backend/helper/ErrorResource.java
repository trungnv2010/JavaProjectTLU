package com.example.backend.helper;

import java.util.HashMap;
import java.util.Map;

public class ErrorResource {
    private String message;
    private Map<String, String> errors;

    public ErrorResource(String message, Map<String, String> errors) {
        this.message = message;
        this.errors = errors;
    }
    public ErrorResource(String message) {
        this.message = message;
        this.errors = new HashMap<String, String>();
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Map<String, String> getErrors() {
        return errors;
    }
    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

}
