package com.fitsphere.service;

import com.fitsphere.dto.profile.TrainerProfileResponse;
import com.fitsphere.dto.profile.TrainerProfileUpdateRequest;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.TrainerProfile;
import com.fitsphere.entity.User;
import com.fitsphere.exception.ApiException;
import com.fitsphere.mapper.ProfileMapper;
import com.fitsphere.repository.TrainerProfileRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.impl.TrainerProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class TrainerProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TrainerProfileRepository profileRepository;

    @Spy
    private ProfileMapper profileMapper = new ProfileMapper();

    @InjectMocks
    private TrainerProfileServiceImpl profileService;

    private User trainerUser;
    private TrainerProfile trainerProfile;

    @BeforeEach
    void setUp() {
        trainerUser = new User("Coach Dave", "coach@university.edu", "hashedPwd", "+15555678", Role.TRAINER);
        trainerUser.setId(20L);

        trainerProfile = new TrainerProfile(trainerUser, "TRN-0020");
        trainerProfile.setId(2L);
        trainerProfile.setQualification("M.S. Exercise Physiology");
        trainerProfile.setExperienceYears(6);
        trainerProfile.setSpecialization("Strength & Conditioning");
    }

    @Test
    @DisplayName("Should successfully retrieve existing trainer profile")
    void testGetProfileSuccess() {
        when(userRepository.findByEmail("coach@university.edu")).thenReturn(Optional.of(trainerUser));
        when(profileRepository.findByUser(trainerUser)).thenReturn(Optional.of(trainerProfile));

        TrainerProfileResponse response = profileService.getProfile("coach@university.edu");

        assertNotNull(response);
        assertEquals("Coach Dave", response.getName());
        assertEquals("coach@university.edu", response.getEmail());
        assertEquals("TRN-0020", response.getTrainerId());
        assertEquals(6, response.getExperienceYears());
    }

    @Test
    @DisplayName("Should reject access if user role is not TRAINER")
    void testGetProfileForbiddenForNonTrainer() {
        User studentUser = new User("Alex Morgan", "alex@university.edu", "hashedPwd", "+15551234", Role.STUDENT);
        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(studentUser));

        assertThrows(ApiException.class, () -> profileService.getProfile("alex@university.edu"));
    }

    @Test
    @DisplayName("Should successfully update trainer profile")
    void testUpdateProfileSuccess() {
        when(userRepository.findByEmail("coach@university.edu")).thenReturn(Optional.of(trainerUser));
        when(profileRepository.findByUser(trainerUser)).thenReturn(Optional.of(trainerProfile));
        when(userRepository.save(any(User.class))).thenReturn(trainerUser);
        when(profileRepository.save(any(TrainerProfile.class))).thenReturn(trainerProfile);

        TrainerProfileUpdateRequest request = new TrainerProfileUpdateRequest();
        request.setName("Head Coach Dave Miller");
        request.setQualification("M.S. Exercise Physiology, CSCS, USAW Level 2");
        request.setExperienceYears(8);
        request.setSpecialization("Varsity Speed & Power");
        request.setBio("10-year collegiate performance specialist.");

        TrainerProfileResponse response = profileService.updateProfile("coach@university.edu", request);

        assertNotNull(response);
        assertEquals("Head Coach Dave Miller", response.getName());
        assertEquals("coach@university.edu", response.getEmail());
        assertEquals(Role.TRAINER, response.getRole());
        assertEquals(8, response.getExperienceYears());
        verify(profileRepository).save(any(TrainerProfile.class));
    }
}
