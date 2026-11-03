package com.fitsphere.dto.profile;

import com.fitsphere.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "Combined representation of Trainer user and credentials details")
public class TrainerProfileResponse {

    @Schema(example = "2", description = "User ID")
    private Long userId;

    @Schema(example = "Coach Dave Miller", description = "Coach full name")
    private String name;

    @Schema(example = "coach.dave@university.edu", description = "Coach email address")
    private String email;

    @Schema(example = "+1 (555) 876-5432", description = "Contact phone number")
    private String phone;

    @Schema(example = "TRAINER", description = "Platform role")
    private Role role;

    @Schema(example = "true", description = "Account activation state")
    private boolean active;

    @Schema(description = "Account registration timestamp")
    private Instant userCreatedAt;

    @Schema(example = "1", description = "Trainer profile ID")
    private Long profileId;

    @Schema(example = "TRN-2024-0012", description = "Official athletics coach ID")
    private String trainerId;

    @Schema(example = "M.S. Exercise Physiology, CSCS, USAW Level 2", description = "Professional coaching certifications & degrees")
    private String qualification;

    @Schema(example = "8", description = "Years of professional coaching experience")
    private Integer experienceYears;

    @Schema(example = "Varsity Strength & Speed Conditioning", description = "Primary sports specialization")
    private String specialization;

    @Schema(example = "Head strength and conditioning coach for collegiate track and volleyball programs.", description = "Coach biography")
    private String bio;

    @Schema(example = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", description = "Avatar image URL")
    private String profileImageUrl;

    @Schema(description = "Profile creation timestamp")
    private Instant createdAt;

    @Schema(description = "Profile last update timestamp")
    private Instant updatedAt;

    public TrainerProfileResponse() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getUserCreatedAt() {
        return userCreatedAt;
    }

    public void setUserCreatedAt(Instant userCreatedAt) {
        this.userCreatedAt = userCreatedAt;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
