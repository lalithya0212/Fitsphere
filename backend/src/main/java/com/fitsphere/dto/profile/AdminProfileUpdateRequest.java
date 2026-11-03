package com.fitsphere.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload for updating an administrator profile")
public class AdminProfileUpdateRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(example = "Shyam Raj", description = "Administrator full name")
    private String name;

    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    @Schema(example = "+1 (555) 000-0001", description = "Contact phone number")
    private String phone;

    @Size(max = 150, message = "Department cannot exceed 150 characters")
    @Schema(example = "Intercollegiate Athletics & Sports Administration", description = "Campus athletics department")
    private String department;

    @Size(max = 150, message = "Designation cannot exceed 150 characters")
    @Schema(example = "Director of Athletics", description = "Title / designation")
    private String designation;

    @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
    @Schema(example = "Campus Athletics Director overseeing intercollegiate varsity programs.", description = "Biography")
    private String bio;

    @Size(max = 500, message = "Profile image URL cannot exceed 500 characters")
    @Schema(example = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", description = "Profile photo URL")
    private String profileImageUrl;

    public AdminProfileUpdateRequest() {
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
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
