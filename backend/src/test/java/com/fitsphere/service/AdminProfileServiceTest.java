package com.fitsphere.service;

import com.fitsphere.dto.profile.AdminProfileResponse;
import com.fitsphere.dto.profile.AdminProfileUpdateRequest;
import com.fitsphere.entity.AdminProfile;
import com.fitsphere.entity.Role;
import com.fitsphere.entity.User;
import com.fitsphere.exception.ApiException;
import com.fitsphere.mapper.ProfileMapper;
import com.fitsphere.repository.AdminProfileRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.impl.AdminProfileServiceImpl;
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
class AdminProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminProfileRepository profileRepository;

    @Spy
    private ProfileMapper profileMapper = new ProfileMapper();

    @InjectMocks
    private AdminProfileServiceImpl profileService;

    private User adminUser;
    private AdminProfile adminProfile;

    @BeforeEach
    void setUp() {
        adminUser = new User("Shyam Raj", "shyamraj@gmail.com", "hashedPwd", "+15550001", Role.ADMIN);
        adminUser.setId(1L);

        adminProfile = new AdminProfile(adminUser, "ADM-0001");
        adminProfile.setId(1L);
        adminProfile.setDepartment("Athletics Administration");
        adminProfile.setDesignation("Director of Athletics");
    }

    @Test
    @DisplayName("Should successfully retrieve existing admin profile")
    void testGetProfileSuccess() {
        when(userRepository.findByEmail("shyamraj@gmail.com")).thenReturn(Optional.of(adminUser));
        when(profileRepository.findByUser(adminUser)).thenReturn(Optional.of(adminProfile));

        AdminProfileResponse response = profileService.getProfile("shyamraj@gmail.com");

        assertNotNull(response);
        assertEquals("Shyam Raj", response.getName());
        assertEquals("shyamraj@gmail.com", response.getEmail());
        assertEquals("ADM-0001", response.getEmployeeId());
        assertEquals("Director of Athletics", response.getDesignation());
    }

    @Test
    @DisplayName("Should reject access if user role is not ADMIN")
    void testGetProfileForbiddenForNonAdmin() {
        User studentUser = new User("Alex Morgan", "alex@university.edu", "hashedPwd", "+15551234", Role.STUDENT);
        when(userRepository.findByEmail("alex@university.edu")).thenReturn(Optional.of(studentUser));

        assertThrows(ApiException.class, () -> profileService.getProfile("alex@university.edu"));
    }

    @Test
    @DisplayName("Should successfully update admin profile")
    void testUpdateProfileSuccess() {
        when(userRepository.findByEmail("shyamraj@gmail.com")).thenReturn(Optional.of(adminUser));
        when(profileRepository.findByUser(adminUser)).thenReturn(Optional.of(adminProfile));
        when(userRepository.save(any(User.class))).thenReturn(adminUser);
        when(profileRepository.save(any(AdminProfile.class))).thenReturn(adminProfile);

        AdminProfileUpdateRequest request = new AdminProfileUpdateRequest();
        request.setName("Dean Shyam Raj");
        request.setDepartment("Intercollegiate Athletics & University Sports");
        request.setDesignation("Dean & Executive Athletic Director");
        request.setBio("Overseeing university varsity athletics, intramural sports, and wellness.");

        AdminProfileResponse response = profileService.updateProfile("shyamraj@gmail.com", request);

        assertNotNull(response);
        assertEquals("Dean Shyam Raj", response.getName());
        assertEquals("shyamraj@gmail.com", response.getEmail());
        assertEquals(Role.ADMIN, response.getRole());
        assertEquals("Dean & Executive Athletic Director", response.getDesignation());
        verify(profileRepository).save(any(AdminProfile.class));
    }
}
