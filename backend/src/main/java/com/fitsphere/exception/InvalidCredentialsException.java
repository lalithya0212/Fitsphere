package com.fitsphere.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends ApiException {

    public InvalidCredentialsException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

    public InvalidCredentialsException() {
        super("Invalid email or password provided.", HttpStatus.UNAUTHORIZED);
    }
}
