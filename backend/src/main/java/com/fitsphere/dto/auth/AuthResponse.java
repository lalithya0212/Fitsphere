package com.fitsphere.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "JWT authentication response payload containing access token and user profile")
public class AuthResponse {

    @Schema(description = "Signed JSON Web Token for Bearer authorization")
    private String token;

    @Schema(example = "Bearer", description = "Token type prefix")
    private String tokenType = "Bearer";

    @Schema(example = "86400000", description = "Token validity window in milliseconds (24h)")
    private long expiresIn;

    @Schema(description = "Authenticated user profile")
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String token, String tokenType, long expiresIn, UserResponse user) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
