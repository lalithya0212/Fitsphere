package com.fitsphere.service.impl;

import com.fitsphere.dto.profile.AdminProfileResponse;
import com.fitsphere.dto.profile.AdminProfileUpdateRequest;
import com.fitsphere.entity.AdminProfile;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.User;
import com.fitsphere.exception.ApiException;
import com.fitsphere.exception.UserNotFoundException;
import com.fitsphere.mapper.ProfileMapper;
import com.fitsphere.repository.AdminProfileRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.AdminProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class AdminProfileServiceImpl implements AdminProfileService {

    private static final Logger log = LoggerFactory.getLogger(AdminProfileServiceImpl.class);

    private final UserRepository userRepository;
    private final AdminProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public AdminProfileServiceImpl(
            UserRepository userRepository,
            AdminProfileRepository profileRepository,
            ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    @Override
    @Transactional
    public AdminProfileResponse getProfile(String email) {
        User user = findUserByEmail(email);
        verifyAdminRole(user);

        AdminProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createInitialProfile(user));

        return profileMapper.toAdminProfileResponse(user, profile);
    }

    @Override
    @Transactional
    public AdminProfileResponse updateProfile(String email, AdminProfileUpdateRequest request) {
        User user = findUserByEmail(email);
        verifyAdminRole(user);

        AdminProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> createInitialProfile(user));

        // Update safe user fields (name & phone only; email/role/password/id remain immutable)
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        userRepository.save(user);

        // Update admin profile fields
        profileMapper.updateAdminProfile(profile, request);
        AdminProfile savedProfile = profileRepository.save(profile);

        log.info("Admin profile successfully updated for user ID: {}", user.getId());
        return profileMapper.toAdminProfileResponse(user, savedProfile);
    }

    @Override
    @Transactional
    public AdminProfile createInitialProfile(User user) {
        String employeeId = generateUniqueEmployeeId(user);
        AdminProfile profile = new AdminProfile(user, employeeId);
        profile.setDepartment("Intercollegiate Athletics & Sports Administration");
        profile.setDesignation("Director of Athletics");
        profile.setBio("Campus Athletics Director overseeing intercollegiate varsity programs and department governance.");

        AdminProfile saved = profileRepository.save(profile);
        log.info("Initialized default AdminProfile with employeeId: {} for user: {}", employeeId, user.getEmail());
        return saved;
    }

    private String generateUniqueEmployeeId(User user) {
        long idSuffix = user.getId() != null ? user.getId() : ThreadLocalRandom.current().nextInt(100, 999);
        String candidate = String.format("ADM-%04d", idSuffix);
        int attempts = 0;
        while (profileRepository.existsByEmployeeId(candidate) && attempts < 10) {
            candidate = String.format("ADM-%04d-%03d", idSuffix, ThreadLocalRandom.current().nextInt(100, 999));
            attempts++;
        }
        return candidate;
    }

    private User findUserByEmail(String email) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + normalizedEmail));
    }

    private void verifyAdminRole(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new ApiException("Access denied: Account role is not ADMIN", HttpStatus.FORBIDDEN);
        }
    }
}
