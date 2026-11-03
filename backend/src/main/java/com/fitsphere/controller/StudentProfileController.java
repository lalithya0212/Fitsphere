package com.fitsphere.controller;

import com.fitsphere.dto.profile.StudentProfileResponse;
import com.fitsphere.dto.profile.StudentProfileUpdateRequest;
import com.fitsphere.exception.ApiException;
import com.fitsphere.security.UserPrincipal;
import com.fitsphere.service.StudentProfileService;
import com.fitsphere.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/profile")
@PreAuthorize("hasRole('STUDENT')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Student Profile", description = "Student athlete profile retrieval and updates")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping
    @Operation(summary = "Get Student Profile", description = "Retrieves the authenticated student's full athletic and academic profile")
    public ResponseEntity<StudentProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        String email = extractEmail(principal);
        StudentProfileResponse response = studentProfileService.getProfile(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    @Operation(summary = "Update Student Profile", description = "Updates the authenticated student's athletic profile details")
    public ResponseEntity<StudentProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody StudentProfileUpdateRequest request) {
        String email = extractEmail(principal);
        StudentProfileResponse response = studentProfileService.updateProfile(email, request);
        return ResponseEntity.ok(response);
    }

    private String extractEmail(UserPrincipal principal) {
        if (principal != null && principal.getEmail() != null) {
            return principal.getEmail();
        }
        return SecurityUtils.getCurrentUserEmail()
                .orElseThrow(() -> new ApiException("Unauthenticated session", HttpStatus.UNAUTHORIZED));
    }
}
