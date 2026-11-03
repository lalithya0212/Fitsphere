package com.fitsphere.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fitsphere.dto.profile.*;
import com.fitsphere.entity.Role;
import com.fitsphere.exception.GlobalExceptionHandler;
import com.fitsphere.security.UserPrincipal;
import com.fitsphere.service.AdminProfileService;
import com.fitsphere.service.StudentProfileService;
import com.fitsphere.service.TrainerProfileService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class ProfileControllersTest {

    private MockMvc studentMvc;
    private MockMvc trainerMvc;
    private MockMvc adminMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Mock
    private StudentProfileService studentProfileService;

    @Mock
    private TrainerProfileService trainerProfileService;

    @Mock
    private AdminProfileService adminProfileService;

    @InjectMocks
    private StudentProfileController studentController;

    @InjectMocks
    private TrainerProfileController trainerController;

    @InjectMocks
    private AdminProfileController adminController;

    private UserPrincipal studentPrincipal;
    private UserPrincipal trainerPrincipal;
    private UserPrincipal adminPrincipal;

    @BeforeEach
    void setUp() {
        studentPrincipal = new UserPrincipal(
                10L, "Alex Morgan", "alex@university.edu", "pass",
                Role.STUDENT, true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        trainerPrincipal = new UserPrincipal(
                20L, "Coach Dave", "coach@university.edu", "pass",
                Role.TRAINER, true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_TRAINER"))
        );

        adminPrincipal = new UserPrincipal(
                1L, "Shyam Raj", "shyamraj@gmail.com", "pass",
                Role.ADMIN, true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        HandlerMethodArgumentResolver principalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.getParameterType().equals(UserPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                var auth = SecurityContextHolder.getContext().getAuthentication();
                return auth != null && auth.getPrincipal() instanceof UserPrincipal ? auth.getPrincipal() : null;
            }
        };

        studentMvc = MockMvcBuilders.standaloneSetup(studentController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();

        trainerMvc = MockMvcBuilders.standaloneSetup(trainerController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();

        adminMvc = MockMvcBuilders.standaloneSetup(adminController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("GET /api/student/profile - Success for authenticated student")
    void testGetStudentProfileSuccess() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(studentPrincipal, null, studentPrincipal.getAuthorities())
        );

        StudentProfileResponse mockResponse = new StudentProfileResponse();
        mockResponse.setUserId(10L);
        mockResponse.setName("Alex Morgan");
        mockResponse.setEmail("alex@university.edu");
        mockResponse.setRole(Role.STUDENT);
        mockResponse.setStudentId("STU-00010");
        mockResponse.setDepartment("Sports Science");

        when(studentProfileService.getProfile("alex@university.edu")).thenReturn(mockResponse);

        studentMvc.perform(get("/api/student/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alex Morgan"))
                .andExpect(jsonPath("$.studentId").value("STU-00010"))
                .andExpect(jsonPath("$.email").value("alex@university.edu"));
    }

    @Test
    @DisplayName("PUT /api/student/profile - Success for authenticated student")
    void testUpdateStudentProfileSuccess() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(studentPrincipal, null, studentPrincipal.getAuthorities())
        );

        StudentProfileUpdateRequest updateReq = new StudentProfileUpdateRequest();
        updateReq.setName("Alexandra Morgan");
        updateReq.setDepartment("Athletics");
        updateReq.setYearOfStudy(3);

        StudentProfileResponse mockResponse = new StudentProfileResponse();
        mockResponse.setUserId(10L);
        mockResponse.setName("Alexandra Morgan");
        mockResponse.setEmail("alex@university.edu");
        mockResponse.setRole(Role.STUDENT);
        mockResponse.setDepartment("Athletics");
        mockResponse.setYearOfStudy(3);

        when(studentProfileService.updateProfile(eq("alex@university.edu"), any(StudentProfileUpdateRequest.class)))
                .thenReturn(mockResponse);

        studentMvc.perform(put("/api/student/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alexandra Morgan"))
                .andExpect(jsonPath("$.yearOfStudy").value(3));
    }

    @Test
    @DisplayName("GET /api/trainer/profile - Success for authenticated trainer")
    void testGetTrainerProfileSuccess() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(trainerPrincipal, null, trainerPrincipal.getAuthorities())
        );

        TrainerProfileResponse mockResponse = new TrainerProfileResponse();
        mockResponse.setUserId(20L);
        mockResponse.setName("Coach Dave");
        mockResponse.setEmail("coach@university.edu");
        mockResponse.setRole(Role.TRAINER);
        mockResponse.setTrainerId("TRN-0020");
        mockResponse.setExperienceYears(6);

        when(trainerProfileService.getProfile("coach@university.edu")).thenReturn(mockResponse);

        trainerMvc.perform(get("/api/trainer/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Coach Dave"))
                .andExpect(jsonPath("$.trainerId").value("TRN-0020"))
                .andExpect(jsonPath("$.experienceYears").value(6));
    }

    @Test
    @DisplayName("GET /api/admin/profile - Success for authenticated admin")
    void testGetAdminProfileSuccess() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(adminPrincipal, null, adminPrincipal.getAuthorities())
        );

        AdminProfileResponse mockResponse = new AdminProfileResponse();
        mockResponse.setUserId(1L);
        mockResponse.setName("Shyam Raj");
        mockResponse.setEmail("shyamraj@gmail.com");
        mockResponse.setRole(Role.ADMIN);
        mockResponse.setEmployeeId("ADM-0001");
        mockResponse.setDesignation("Director of Athletics");

        when(adminProfileService.getProfile("shyamraj@gmail.com")).thenReturn(mockResponse);

        adminMvc.perform(get("/api/admin/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Shyam Raj"))
                .andExpect(jsonPath("$.employeeId").value("ADM-0001"))
                .andExpect(jsonPath("$.designation").value("Director of Athletics"));
    }

    @Test
    @DisplayName("PUT /api/student/profile - Rejects invalid yearOfStudy")
    void testUpdateStudentProfileInvalidDataRejected() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(studentPrincipal, null, studentPrincipal.getAuthorities())
        );

        StudentProfileUpdateRequest updateReq = new StudentProfileUpdateRequest();
        updateReq.setYearOfStudy(25); // Exceeds max 10

        studentMvc.perform(put("/api/student/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.yearOfStudy").exists());
    }
}
