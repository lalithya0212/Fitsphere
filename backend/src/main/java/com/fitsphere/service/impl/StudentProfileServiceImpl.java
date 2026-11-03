package com.fitsphere.service.impl;

import com.fitsphere.dto.profile.StudentProfileResponse;
import com.fitsphere.dto.profile.StudentProfileUpdateRequest;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.StudentProfile;
import com.fitsphere.entity.User;
import com.fitsphere.exception.ApiException;
import com.fitsphere.exception.UserNotFoundException;
import com.fitsphere.mapper.ProfileMapper;
import com.fitsphere.repository.StudentProfileRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.StudentProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class StudentProfileServiceImpl implements StudentProfileService {

    private static final Logger log = LoggerFactory.getLogger(StudentProfileServiceImpl.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public StudentProfileServiceImpl(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    @Override
    @Transactional
    public StudentProfileResponse getProfile(String email) {
        User user = findUserByEmail(email);
        verifyStudentRole(user);

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createInitialProfile(user));

        return profileMapper.toStudentProfileResponse(user, profile);
    }

    @Override
    @Transactional
    public StudentProfileResponse updateProfile(String email, StudentProfileUpdateRequest request) {
        User user = findUserByEmail(email);
        verifyStudentRole(user);

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createInitialProfile(user));

        // Update safe user fields (name & phone only; email/role/password/id remain immutable)
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        userRepository.save(user);

        // Update student profile fields
        profileMapper.updateStudentProfile(profile, request);
        StudentProfile savedProfile = profileRepository.save(profile);

        log.info("Student profile successfully updated for user ID: {}", user.getId());
        return profileMapper.toStudentProfileResponse(user, savedProfile);
    }

    @Override
    @Transactional
    public StudentProfile createInitialProfile(User user) {
        String studentId = generateUniqueStudentId(user);
        StudentProfile profile = new StudentProfile(user, studentId);
        profile.setDepartment("Athletics & Physical Education");
        profile.setCourse("Collegiate Athletic Program");
        profile.setYearOfStudy(1);
        profile.setFitnessGoal("General Fitness & Conditioning");
        profile.setBio("FitSphere collegiate student-athlete.");

        StudentProfile saved = profileRepository.save(profile);
        log.info("Initialized default StudentProfile with studentId: {} for user: {}", studentId, user.getEmail());
        return saved;
    }

    private String generateUniqueStudentId(User user) {
        long idSuffix = user.getId() != null ? user.getId() : ThreadLocalRandom.current().nextInt(1000, 9999);
        String candidate = String.format("STU-%05d", idSuffix);
        int attempts = 0;
        while (profileRepository.existsByStudentId(candidate) && attempts < 10) {
            candidate = String.format("STU-%05d-%03d", idSuffix, ThreadLocalRandom.current().nextInt(100, 999));
            attempts++;
        }
        return candidate;
    }

    private User findUserByEmail(String email) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + normalizedEmail));
    }

    private void verifyStudentRole(User user) {
        if (user.getRole() != Role.STUDENT) {
            throw new ApiException("Access denied: Account role is not STUDENT", HttpStatus.FORBIDDEN);
        }
    }
}
