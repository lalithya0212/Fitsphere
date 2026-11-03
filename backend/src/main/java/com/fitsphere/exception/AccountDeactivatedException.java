package com.fitsphere.exception;

import org.springframework.http.HttpStatus;

public class AccountDeactivatedException extends ApiException {

    public AccountDeactivatedException(String email) {
        super("User account associated with email '" + email + "' is deactivated. Please contact campus athletics administration.", HttpStatus.FORBIDDEN);
    }
}
