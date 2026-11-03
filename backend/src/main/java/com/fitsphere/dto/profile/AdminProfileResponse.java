package com.fitsphere.dto.profile;

import com.fitsphere.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "Combined representation of Admin user and sports director profile details")
public class AdminProfileResponse {

    @Schema(example = "1", description = "User ID")
    private Long userId;

    @Schema(example = "Shyam Raj", description = "Administrator full name")
    private String name;

    @Schema(example = "shyamraj@gmail.com", description = "Administrator email address")
    private String email;

    @Schema(example = "+1 (555) 000-0001", description = "Contact phone number")
    private String phone;

    @Schema(example = "ADMIN", description = "Platform role")
    private Role role;

    @Schema(example = "true", description = "Account activation state")
    private boolean active;

    @Schema(description = "Account registration timestamp")
    private Instant userCreatedAt;

    @Schema(example = "1", description = "Admin profile ID")
    private Long profileId;

    @Schema(example = "EMP-2024-0001", description = "Employee ID")
    private String employeeId;

    @Schema(example = "Intercollegiate Athletics & Sports Administration", description = "Department")
    private String department;

    @Schema(example = "Director of Athletics", description = "Campus title / designation")
    private String designation;

    @Schema(example = "Campus Athletics Director overseeing intercollegiate varsity programs.", description = "Biography")
    private String bio;

    @Schema(example = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", description = "Avatar image URL")
    private String profileImageUrl;

    @Schema(description = "Profile creation timestamp")
    private Instant createdAt;

    @Schema(description = "Profile last update timestamp")
    private Instant updatedAt;

    public AdminProfileResponse() {
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

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
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
