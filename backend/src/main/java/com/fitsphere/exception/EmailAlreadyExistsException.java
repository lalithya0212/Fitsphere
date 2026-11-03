package com.fitsphere.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends ApiException {

    public EmailAlreadyExistsException(String email) {
        super("An account with email '" + email + "' already exists.", HttpStatus.CONFLICT);
    }
}
