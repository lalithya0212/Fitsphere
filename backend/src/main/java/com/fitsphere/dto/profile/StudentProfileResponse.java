package com.fitsphere.dto.profile;

import com.fitsphere.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.time.LocalDate;

@Schema(description = "Combined representation of Student user and profile details")
public class StudentProfileResponse {

    @Schema(example = "1", description = "User ID")
    private Long userId;

    @Schema(example = "Alex Morgan", description = "Student's full legal name")
    private String name;

    @Schema(example = "alex.morgan@university.edu", description = "Collegiate email address")
    private String email;

    @Schema(example = "+1 (555) 234-5678", description = "Contact phone number")
    private String phone;

    @Schema(example = "STUDENT", description = "Platform role")
    private Role role;

    @Schema(example = "true", description = "Account activation state")
    private boolean active;

    @Schema(description = "Account registration timestamp")
    private Instant userCreatedAt;

    @Schema(example = "1", description = "Student profile ID")
    private Long profileId;

    @Schema(example = "ATH-2024-0492", description = "Collegiate student-athlete roll/ID")
    private String studentId;

    @Schema(example = "Kinesiology & Sports Science", description = "Academic department")
    private String department;

    @Schema(example = "Bachelor of Science in Sports Analytics", description = "Degree program or course")
    private String course;

    @Schema(example = "2", description = "Current academic year of study (1-6)")
    private Integer yearOfStudy;

    @Schema(example = "2004-05-15", description = "Date of birth")
    private LocalDate dateOfBirth;

    @Schema(example = "Female", description = "Gender identity")
    private String gender;

    @Schema(example = "Varsity Sprinting & Speed Endurance", description = "Athletic/fitness goal")
    private String fitnessGoal;

    @Schema(example = "Varsity Track & Field athlete specializing in 200m/400m sprint events.", description = "Student athlete bio")
    private String bio;

    @Schema(example = "https://images.unsplash.com/photo-1534528741775-53994a69daeb", description = "Avatar image URL")
    private String profileImageUrl;

    @Schema(description = "Profile creation timestamp")
    private Instant createdAt;

    @Schema(description = "Profile last update timestamp")
    private Instant updatedAt;

    public StudentProfileResponse() {
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

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
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
