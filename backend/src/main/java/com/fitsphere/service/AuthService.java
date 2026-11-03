package com.fitsphere.service;

import com.fitsphere.dto.auth.*;

public interface AuthService {

    UserResponse registerStudent(StudentRegisterRequest request);

    UserResponse registerTrainer(TrainerRegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser(String email);
}
