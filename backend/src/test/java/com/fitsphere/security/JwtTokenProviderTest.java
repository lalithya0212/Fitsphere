package com.fitsphere.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long testExpirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(testSecret, testExpirationMs);
    }

    @Test
    @DisplayName("Should successfully generate and validate a valid JWT token")
    void testGenerateAndValidateToken() {
        String token = tokenProvider.generateToken(1L, "student@fitsphere.com", "Alex Morgan", "STUDENT");

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("student@fitsphere.com", tokenProvider.getEmailFromToken(token));
        assertEquals("STUDENT", tokenProvider.getRoleFromToken(token));
        assertEquals(1L, tokenProvider.getUserIdFromToken(token));
    }

    @Test
    @DisplayName("Should reject tampered or corrupted JWT tokens")
    void testTamperedTokenFailsValidation() {
        String token = tokenProvider.generateToken(2L, "trainer@fitsphere.com", "Coach Dave", "TRAINER");
        String tamperedToken = token + "xyz";

        assertFalse(tokenProvider.validateToken(tamperedToken));
    }

    @Test
    @DisplayName("Should reject completely invalid strings as JWT tokens")
    void testInvalidStringFailsValidation() {
        assertFalse(tokenProvider.validateToken("not-a-valid-jwt-token"));
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken(null));
    }
}
