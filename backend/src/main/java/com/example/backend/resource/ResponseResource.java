package com.example.backend.resource;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseResource<T> {
    private boolean success;
    private String message;
    private T data;
    private int status;

    public static <T> ResponseResource<T> success(T data) {
        return ResponseResource.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .status(200)
                .build();
    }

    public static <T> ResponseResource<T> success(T data, String message) {
        return ResponseResource.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .status(200)
                .build();
    }

    public static <T> ResponseResource<T> fail(String message) {
        return ResponseResource.<T>builder()
                .success(false)
                .message(message)
                .status(400)
                .build();
    }

    public static <T> ResponseResource<T> fail(String message, int status) {
        return ResponseResource.<T>builder()
                .success(false)
                .message(message)
                .status(status)
                .build();
    }
}