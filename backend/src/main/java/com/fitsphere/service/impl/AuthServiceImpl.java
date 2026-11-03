package com.fitsphere.service.impl;

import com.fitsphere.dto.auth.*;
import com.fitsphere.entity.User;
import com.fitsphere.exception.AccountDeactivatedException;
import com.fitsphere.exception.EmailAlreadyExistsException;
import com.fitsphere.exception.InvalidCredentialsException;
import com.fitsphere.exception.UserNotFoundException;
import com.fitsphere.mapper.UserMapper;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.security.JwtTokenProvider;
import com.fitsphere.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final com.fitsphere.service.StudentProfileService studentProfileService;
    private final com.fitsphere.service.TrainerProfileService trainerProfileService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            UserMapper userMapper,
            com.fitsphere.service.StudentProfileService studentProfileService,
            com.fitsphere.service.TrainerProfileService trainerProfileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.userMapper = userMapper;
        this.studentProfileService = studentProfileService;
        this.trainerProfileService = trainerProfileService;
    }

    @Override
    @Transactional
    public UserResponse registerStudent(StudentRegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("Student registration failed: email '{}' already in use", normalizedEmail);
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User studentUser = userMapper.toStudentEntity(request, hashedPassword);
        studentUser.setEmail(normalizedEmail);

        User savedUser = userRepository.save(studentUser);
        studentProfileService.createInitialProfile(savedUser);
        log.info("Student successfully registered with ID: {}, Email: {}", savedUser.getId(), savedUser.getEmail());

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse registerTrainer(TrainerRegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("Trainer registration failed: email '{}' already in use", normalizedEmail);
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User trainerUser = userMapper.toTrainerEntity(request, hashedPassword);
        trainerUser.setEmail(normalizedEmail);

        User savedUser = userRepository.save(trainerUser);
        trainerProfileService.createInitialProfile(savedUser);
        log.info("Trainer successfully registered with ID: {}, Email: {}", savedUser.getId(), savedUser.getEmail());

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed: no user exists with email '{}'", normalizedEmail);
                    return new InvalidCredentialsException();
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login failed: password mismatch for email '{}'", normalizedEmail);
            throw new InvalidCredentialsException();
        }

        if (!user.isActive()) {
            log.warn("Login failed: user account '{}' is deactivated", normalizedEmail);
            throw new AccountDeactivatedException(normalizedEmail);
        }

        String token = tokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );

        UserResponse userResponse = userMapper.toUserResponse(user);
        log.info("User logged in successfully: ID {}, Role {}", user.getId(), user.getRole());

        return new AuthResponse(token, "Bearer", tokenProvider.getExpirationMs(), userResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        String normalizedEmail = normalizeEmail(email);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + normalizedEmail));

        return userMapper.toUserResponse(user);
    }

    private static String normalizeEmail(String email) {
        return email != null ? email.trim().toLowerCase() : "";
    }
}
