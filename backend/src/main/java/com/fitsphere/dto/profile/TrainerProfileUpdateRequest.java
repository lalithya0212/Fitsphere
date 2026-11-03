package com.fitsphere.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload for updating a trainer/coach profile")
public class TrainerProfileUpdateRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(example = "Coach Dave Miller", description = "Trainer full name")
    private String name;

    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    @Schema(example = "+1 (555) 876-5432", description = "Contact phone number")
    private String phone;

    @Size(max = 255, message = "Qualification cannot exceed 255 characters")
    @Schema(example = "M.S. Exercise Physiology, CSCS, USAW Level 2", description = "Degrees and certifications")
    private String qualification;

    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 70, message = "Experience years cannot exceed 70")
    @Schema(example = "8", description = "Years of professional coaching experience")
    private Integer experienceYears;

    @Size(max = 150, message = "Specialization cannot exceed 150 characters")
    @Schema(example = "Varsity Strength & Speed Conditioning", description = "Primary sports specialization")
    private String specialization;

    @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
    @Schema(example = "Head strength and conditioning coach for collegiate athletes.", description = "Biography")
    private String bio;

    @Size(max = 500, message = "Profile image URL cannot exceed 500 characters")
    @Schema(example = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", description = "Profile photo URL")
    private String profileImageUrl;

    public TrainerProfileUpdateRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
}
