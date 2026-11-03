package com.fitsphere.controller;

import com.fitsphere.dto.profile.TrainerProfileResponse;
import com.fitsphere.dto.profile.TrainerProfileUpdateRequest;
import com.fitsphere.exception.ApiException;
import com.fitsphere.security.UserPrincipal;
import com.fitsphere.service.TrainerProfileService;
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
@RequestMapping("/api/trainer/profile")
@PreAuthorize("hasRole('TRAINER')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Trainer Profile", description = "Coach / trainer profile retrieval and updates")
public class TrainerProfileController {

    private final TrainerProfileService trainerProfileService;

    public TrainerProfileController(TrainerProfileService trainerProfileService) {
        this.trainerProfileService = trainerProfileService;
    }

    @GetMapping
    @Operation(summary = "Get Trainer Profile", description = "Retrieves the authenticated coach's credentials and profile")
    public ResponseEntity<TrainerProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        String email = extractEmail(principal);
        TrainerProfileResponse response = trainerProfileService.getProfile(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    @Operation(summary = "Update Trainer Profile", description = "Updates the authenticated coach's credentials and profile details")
    public ResponseEntity<TrainerProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TrainerProfileUpdateRequest request) {
        String email = extractEmail(principal);
        TrainerProfileResponse response = trainerProfileService.updateProfile(email, request);
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
