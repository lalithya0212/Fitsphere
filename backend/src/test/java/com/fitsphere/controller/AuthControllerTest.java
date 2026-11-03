package com.fitsphere.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitsphere.dto.auth.*;
import com.fitsphere.entity.Role;
import com.fitsphere.exception.GlobalExceptionHandler;
import com.fitsphere.exception.InvalidCredentialsException;
import com.fitsphere.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AuthControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/register/student: Success 201 Created")
    void testRegisterStudentSuccess() throws Exception {
        StudentRegisterRequest request = new StudentRegisterRequest("Alex Morgan", "alex@university.edu", "secretPass", "+15551234");
        UserResponse response = new UserResponse(1L, "Alex Morgan", "alex@university.edu", "+15551234", Role.STUDENT, true, Instant.now());

        when(authService.registerStudent(any(StudentRegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.email").value("alex@university.edu"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    @Test
    @DisplayName("POST /api/auth/register/student: Validation failure 400 Bad Request")
    void testRegisterStudentValidationFailure() throws Exception {
        // Missing name and invalid email
        StudentRegisterRequest invalidRequest = new StudentRegisterRequest("", "not-an-email", "123", "+15551234");

        mockMvc.perform(post("/api/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors").exists());
    }

    @Test
    @DisplayName("POST /api/auth/register/trainer: Success 201 Created")
    void testRegisterTrainerSuccess() throws Exception {
        TrainerRegisterRequest request = new TrainerRegisterRequest("Coach Dave", "dave@university.edu", "coachSecret", "+15555678");
        UserResponse response = new UserResponse(2L, "Coach Dave", "dave@university.edu", "+15555678", Role.TRAINER, true, Instant.now());

        when(authService.registerTrainer(any(TrainerRegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register/trainer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.email").value("dave@university.edu"))
                .andExpect(jsonPath("$.role").value("TRAINER"));
    }

    @Test
    @DisplayName("POST /api/auth/login: Success 200 OK")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("admin@fitsphere.com", "Admin@FitSphere2026!");
        UserResponse userResponse = new UserResponse(1L, "Sports Administrator", "admin@fitsphere.com", "+15550001", Role.ADMIN, true, Instant.now());
        AuthResponse authResponse = new AuthResponse("mocked.jwt.token", "Bearer", 86400000L, userResponse);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked.jwt.token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    @DisplayName("POST /api/auth/login: Invalid credentials 401 Unauthorized")
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("admin@fitsphere.com", "wrongPassword");

        when(authService.login(any(LoginRequest.class))).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("GET /api/auth/me: Returns current user profile 200 OK")
    void testGetCurrentUserSuccess() throws Exception {
        Principal mockPrincipal = () -> "alex@university.edu";
        UserResponse response = new UserResponse(10L, "Alex Morgan", "alex@university.edu", "+15551234", Role.STUDENT, true, Instant.now());

        when(authService.getCurrentUser(eq("alex@university.edu"))).thenReturn(response);

        mockMvc.perform(get("/api/auth/me")
                        .principal(mockPrincipal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("alex@university.edu"))
                .andExpect(jsonPath("$.name").value("Alex Morgan"));
    }
}
