package com.fitsphere.service;

import com.fitsphere.dto.auth.*;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.User;
import com.fitsphere.exception.AccountDeactivatedException;
import com.fitsphere.exception.EmailAlreadyExistsException;
import com.fitsphere.exception.InvalidCredentialsException;
import com.fitsphere.exception.UserNotFoundException;
import com.fitsphere.mapper.UserMapper;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.security.JwtTokenProvider;
import com.fitsphere.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private StudentProfileService studentProfileService;

    @Mock
    private TrainerProfileService trainerProfileService;

    @Spy
    private UserMapper userMapper = new UserMapper();

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleStudent;
    private User sampleTrainer;

    @BeforeEach
    void setUp() {
        sampleStudent = new User("Alex Morgan", "alex@university.edu", "$2a$12$hashedPassword", "+15551234", Role.STUDENT);
        sampleStudent.setId(10L);

        sampleTrainer = new User("Dave Miller", "coach@university.edu", "$2a$12$hashedPassword", "+15555678", Role.TRAINER);
        sampleTrainer.setId(20L);
    }

    @Test
    @DisplayName("Register Student: Success scenario")
    void testRegisterStudentSuccess() {
        StudentRegisterRequest request = new StudentRegisterRequest("Alex Morgan", "alex@university.edu", "secretPass", "+15551234");

        when(userRepository.existsByEmail("alex@university.edu")).thenReturn(false);
        when(passwordEncoder.encode("secretPass")).thenReturn("$2a$12$hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleStudent);

        UserResponse response = authService.registerStudent(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("alex@university.edu", response.getEmail());
        assertEquals(Role.STUDENT, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register Student: Throws EmailAlreadyExistsException on duplicate email")
    void testRegisterStudentDuplicateEmail() {
        StudentRegisterRequest request = new StudentRegisterRequest("Alex Morgan", "alex@university.edu", "secretPass", "+15551234");

        when(userRepository.existsByEmail("alex@university.edu")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.registerStudent(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Register Trainer: Success scenario")
    void testRegisterTrainerSuccess() {
        TrainerRegisterRequest request = new TrainerRegisterRequest("Dave Miller", "coach@university.edu", "coachSecret", "+15555678");

        when(userRepository.existsByEmail("coach@university.edu")).thenReturn(false);
        when(passwordEncoder.encode("coachSecret")).thenReturn("$2a$12$hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleTrainer);

        UserResponse response = authService.registerTrainer(request);

        assertNotNull(response);
        assertEquals(20L, response.getId());
        assertEquals("coach@university.edu", response.getEmail());
        assertEquals(Role.TRAINER, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Login: Success scenario returning JWT token")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("alex@university.edu", "correctPassword");

        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(sampleStudent));
        when(passwordEncoder.matches("correctPassword", sampleStudent.getPasswordHash())).thenReturn(true);
        when(tokenProvider.generateToken(eq(10L), eq("alex@university.edu"), eq("Alex Morgan"), eq("STUDENT")))
                .thenReturn("mocked.jwt.token");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(10L, response.getUser().getId());
        assertEquals(Role.STUDENT, response.getUser().getRole());
    }

    @Test
    @DisplayName("Login: Throws InvalidCredentialsException on invalid password")
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest("alex@university.edu", "wrongPassword");

        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(sampleStudent));
        when(passwordEncoder.matches("wrongPassword", sampleStudent.getPasswordHash())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Login: Throws InvalidCredentialsException when email not found")
    void testLoginEmailNotFound() {
        LoginRequest request = new LoginRequest("unknown@university.edu", "anyPassword");

        when(userRepository.findByEmail("unknown@university.edu")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Login: Throws AccountDeactivatedException when user is inactive")
    void testLoginDeactivatedAccount() {
        sampleStudent.setActive(false);
        LoginRequest request = new LoginRequest("alex@university.edu", "correctPassword");

        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(sampleStudent));
        when(passwordEncoder.matches("correctPassword", sampleStudent.getPasswordHash())).thenReturn(true);

        assertThrows(AccountDeactivatedException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("GetCurrentUser: Returns UserResponse without exposing password")
    void testGetCurrentUserSuccess() {
        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(sampleStudent));

        UserResponse response = authService.getCurrentUser("alex@university.edu");

        assertNotNull(response);
        assertEquals("alex@university.edu", response.getEmail());
        assertEquals("Alex Morgan", response.getName());
    }

    @Test
    @DisplayName("GetCurrentUser: Throws UserNotFoundException when email not in database")
    void testGetCurrentUserNotFound() {
        when(userRepository.findByEmail("missing@university.edu")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> authService.getCurrentUser("missing@university.edu"));
    }
}
