package com.fitsphere.service.impl;

import com.fitsphere.dto.profile.TrainerProfileResponse;
import com.fitsphere.dto.profile.TrainerProfileUpdateRequest;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.TrainerProfile;
import com.fitsphere.entity.User;
import com.fitsphere.exception.ApiException;
import com.fitsphere.exception.UserNotFoundException;
import com.fitsphere.mapper.ProfileMapper;
import com.fitsphere.repository.TrainerProfileRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.TrainerProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class TrainerProfileServiceImpl implements TrainerProfileService {

    private static final Logger log = LoggerFactory.getLogger(TrainerProfileServiceImpl.class);

    private final UserRepository userRepository;
    private final TrainerProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public TrainerProfileServiceImpl(
            UserRepository userRepository,
            TrainerProfileRepository profileRepository,
            ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    @Override
    @Transactional
    public TrainerProfileResponse getProfile(String email) {
        User user = findUserByEmail(email);
        verifyTrainerRole(user);

        TrainerProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createInitialProfile(user));

        return profileMapper.toTrainerProfileResponse(user, profile);
    }

    @Override
    @Transactional
    public TrainerProfileResponse updateProfile(String email, TrainerProfileUpdateRequest request) {
        User user = findUserByEmail(email);
        verifyTrainerRole(user);

        TrainerProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createInitialProfile(user));

        // Update safe user fields (name & phone only; email/role/password/id remain immutable)
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        userRepository.save(user);

        // Update trainer profile fields
        profileMapper.updateTrainerProfile(profile, request);
        TrainerProfile savedProfile = profileRepository.save(profile);

        log.info("Trainer profile successfully updated for user ID: {}", user.getId());
        return profileMapper.toTrainerProfileResponse(user, savedProfile);
    }

    @Override
    @Transactional
    public TrainerProfile createInitialProfile(User user) {
        String trainerId = generateUniqueTrainerId(user);
        TrainerProfile profile = new TrainerProfile(user, trainerId);
        profile.setQualification("Certified Collegiate Athletic Coach");
        profile.setExperienceYears(3);
        profile.setSpecialization("Strength & Performance Conditioning");
        profile.setBio("Varsity performance coach dedicated to collegiate athletic excellence.");

        TrainerProfile saved = profileRepository.save(profile);
        log.info("Initialized default TrainerProfile with trainerId: {} for user: {}", trainerId, user.getEmail());
        return saved;
    }

    private String generateUniqueTrainerId(User user) {
        long idSuffix = user.getId() != null ? user.getId() : ThreadLocalRandom.current().nextInt(100, 999);
        String candidate = String.format("TRN-%04d", idSuffix);
        int attempts = 0;
        while (profileRepository.existsByTrainerId(candidate) && attempts < 10) {
            candidate = String.format("TRN-%04d-%03d", idSuffix, ThreadLocalRandom.current().nextInt(100, 999));
            attempts++;
        }
        return candidate;
    }

    private User findUserByEmail(String email) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + normalizedEmail));
    }

    private void verifyTrainerRole(User user) {
        if (user.getRole() != Role.TRAINER) {
            throw new ApiException("Access denied: Account role is not TRAINER", HttpStatus.FORBIDDEN);
        }
    }
}
