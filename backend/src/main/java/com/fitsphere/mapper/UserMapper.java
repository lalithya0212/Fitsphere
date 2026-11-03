package com.fitsphere.mapper;

import com.fitsphere.dto.auth.StudentRegisterRequest;
import com.fitsphere.dto.auth.TrainerRegisterRequest;
import com.fitsphere.dto.auth.UserResponse;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    public User toStudentEntity(StudentRegisterRequest request, String passwordHash) {
        if (request == null) {
            return null;
        }
        return new User(
                request.getName(),
                request.getEmail(),
                passwordHash,
                request.getPhone(),
                Role.STUDENT
        );
    }

    public User toTrainerEntity(TrainerRegisterRequest request, String passwordHash) {
        if (request == null) {
            return null;
        }
        return new User(
                request.getName(),
                request.getEmail(),
                passwordHash,
                request.getPhone(),
                Role.TRAINER
        );
    }
}
