package com.fitsphere.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(description = "Payload for updating a student-athlete profile")
public class StudentProfileUpdateRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(example = "Alex Morgan", description = "Student's full legal name")
    private String name;

    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    @Schema(example = "+1 (555) 234-5678", description = "Contact phone number")
    private String phone;

    @Size(max = 150, message = "Department cannot exceed 150 characters")
    @Schema(example = "Kinesiology & Sports Science", description = "Collegiate academic department")
    private String department;

    @Size(max = 150, message = "Course cannot exceed 150 characters")
    @Schema(example = "Bachelor of Science in Sports Analytics", description = "Degree program or course")
    private String course;

    @Min(value = 1, message = "Year of study must be at least 1")
    @Max(value = 10, message = "Year of study cannot exceed 10")
    @Schema(example = "2", description = "Academic year of study")
    private Integer yearOfStudy;

    @Schema(example = "2004-05-15", description = "Date of birth")
    private LocalDate dateOfBirth;

    @Size(max = 30, message = "Gender cannot exceed 30 characters")
    @Schema(example = "Female", description = "Gender identity")
    private String gender;

    @Size(max = 255, message = "Fitness goal cannot exceed 255 characters")
    @Schema(example = "Varsity Sprinting & Speed Endurance", description = "Athletic/fitness goal")
    private String fitnessGoal;

    @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
    @Schema(example = "Varsity Track & Field athlete specializing in sprint events.", description = "Biography")
    private String bio;

    @Size(max = 500, message = "Profile image URL cannot exceed 500 characters")
    @Schema(example = "https://images.unsplash.com/photo-1534528741775-53994a69daeb", description = "Profile photo URL")
    private String profileImageUrl;

    public StudentProfileUpdateRequest() {
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
}
