package com.fitsphere.controller;

import com.fitsphere.dto.profile.AdminProfileResponse;
import com.fitsphere.dto.profile.AdminProfileUpdateRequest;
import com.fitsphere.exception.ApiException;
import com.fitsphere.security.UserPrincipal;
import com.fitsphere.service.AdminProfileService;
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
@RequestMapping("/api/admin/profile")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Admin Profile", description = "Campus athletics director profile retrieval and updates")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    public AdminProfileController(AdminProfileService adminProfileService) {
        this.adminProfileService = adminProfileService;
    }

    @GetMapping
    @Operation(summary = "Get Admin Profile", description = "Retrieves the authenticated administrator's credentials and profile")
    public ResponseEntity<AdminProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        String email = extractEmail(principal);
        AdminProfileResponse response = adminProfileService.getProfile(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    @Operation(summary = "Update Admin Profile", description = "Updates the authenticated administrator's credentials and profile details")
    public ResponseEntity<AdminProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AdminProfileUpdateRequest request) {
        String email = extractEmail(principal);
        AdminProfileResponse response = adminProfileService.updateProfile(email, request);
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
