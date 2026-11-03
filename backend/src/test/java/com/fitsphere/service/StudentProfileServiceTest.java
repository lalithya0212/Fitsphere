package com.fitsphere.service;

import com.fitsphere.dto.profile.StudentProfileResponse;
import com.fitsphere.dto.profile.StudentProfileUpdateRequest;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.StudentProfile;
import com.fitsphere.entity.User;
import com.fitsphere.exception.ApiException;
import com.fitsphere.mapper.ProfileMapper;
import com.fitsphere.repository.StudentProfileRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.impl.StudentProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class StudentProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository profileRepository;

    @Spy
    private ProfileMapper profileMapper = new ProfileMapper();

    @InjectMocks
    private StudentProfileServiceImpl profileService;

    private User studentUser;
    private StudentProfile studentProfile;

    @BeforeEach
    void setUp() {
        studentUser = new User("Alex Morgan", "alex@university.edu", "hashedPwd", "+15551234", Role.STUDENT);
        studentUser.setId(10L);

        studentProfile = new StudentProfile(studentUser, "STU-00010");
        studentProfile.setId(1L);
        studentProfile.setDepartment("Sports Science");
        studentProfile.setCourse("B.S. Kinesiology");
        studentProfile.setYearOfStudy(2);
        studentProfile.setFitnessGoal("Speed Endurance");
    }

    @Test
    @DisplayName("Should successfully retrieve existing student profile")
    void testGetProfileSuccess() {
        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(studentUser));
        when(profileRepository.findByUser(studentUser)).thenReturn(Optional.of(studentProfile));

        StudentProfileResponse response = profileService.getProfile("alex@university.edu");

        assertNotNull(response);
        assertEquals("Alex Morgan", response.getName());
        assertEquals("alex@university.edu", response.getEmail());
        assertEquals("STU-00010", response.getStudentId());
        assertEquals("Sports Science", response.getDepartment());
        assertEquals(2, response.getYearOfStudy());
    }

    @Test
    @DisplayName("Should reject access if user role is not STUDENT")
    void testGetProfileForbiddenForNonStudent() {
        User trainerUser = new User("Coach Dave", "coach@university.edu", "hashedPwd", "+15559999", Role.TRAINER);
        when(userRepository.findByEmail("coach@university.edu")).thenReturn(Optional.of(trainerUser));

        assertThrows(ApiException.class, () -> profileService.getProfile("coach@university.edu"));
    }

    @Test
    @DisplayName("Should successfully update student profile without mutating email or role")
    void testUpdateProfileSuccess() {
        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(studentUser));
        when(profileRepository.findByUser(studentUser)).thenReturn(Optional.of(studentProfile));
        when(userRepository.save(any(User.class))).thenReturn(studentUser);
        when(profileRepository.save(any(StudentProfile.class))).thenReturn(studentProfile);

        StudentProfileUpdateRequest request = new StudentProfileUpdateRequest();
        request.setName("Alexandra Morgan");
        request.setPhone("+1 (555) 999-8888");
        request.setDepartment("Athletics & Human Kinetics");
        request.setCourse("M.S. Sports Analytics");
        request.setYearOfStudy(3);
        request.setDateOfBirth(LocalDate.of(2003, 7, 20));
        request.setGender("Female");
        request.setFitnessGoal("Olympic Qualifier Sprinting");
        request.setBio("Varsity collegiate track sprinter.");

        StudentProfileResponse response = profileService.updateProfile("alex@university.edu", request);

        assertNotNull(response);
        assertEquals("Alexandra Morgan", response.getName());
        assertEquals("alex@university.edu", response.getEmail()); // Email must not change
        assertEquals(Role.STUDENT, response.getRole()); // Role must not change
        assertEquals("Athletics & Human Kinetics", response.getDepartment());
        assertEquals(3, response.getYearOfStudy());
        verify(profileRepository).save(any(StudentProfile.class));
    }
}
