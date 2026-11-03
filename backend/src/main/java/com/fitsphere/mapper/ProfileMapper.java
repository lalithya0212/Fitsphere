package com.fitsphere.mapper;

import com.fitsphere.dto.profile.*;
import com.fitsphere.entity.AdminProfile;
import com.fitsphere.entity.StudentProfile;
import com.fitsphere.entity.TrainerProfile;
import com.fitsphere.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    public StudentProfileResponse toStudentProfileResponse(User user, StudentProfile profile) {
        if (user == null && profile == null) {
            return null;
        }

        StudentProfileResponse response = new StudentProfileResponse();
        if (user != null) {
            response.setUserId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            response.setRole(user.getRole());
            response.setActive(user.isActive());
            response.setUserCreatedAt(user.getCreatedAt());
        }

        if (profile != null) {
            response.setProfileId(profile.getId());
            response.setStudentId(profile.getStudentId());
            response.setDepartment(profile.getDepartment());
            response.setCourse(profile.getCourse());
            response.setYearOfStudy(profile.getYearOfStudy());
            response.setDateOfBirth(profile.getDateOfBirth());
            response.setGender(profile.getGender());
            response.setFitnessGoal(profile.getFitnessGoal());
            response.setBio(profile.getBio());
            response.setProfileImageUrl(profile.getProfileImageUrl());
            response.setCreatedAt(profile.getCreatedAt());
            response.setUpdatedAt(profile.getUpdatedAt());
        }

        return response;
    }

    public TrainerProfileResponse toTrainerProfileResponse(User user, TrainerProfile profile) {
        if (user == null && profile == null) {
            return null;
        }

        TrainerProfileResponse response = new TrainerProfileResponse();
        if (user != null) {
            response.setUserId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            response.setRole(user.getRole());
            response.setActive(user.isActive());
            response.setUserCreatedAt(user.getCreatedAt());
        }

        if (profile != null) {
            response.setProfileId(profile.getId());
            response.setTrainerId(profile.getTrainerId());
            response.setQualification(profile.getQualification());
            response.setExperienceYears(profile.getExperienceYears());
            response.setSpecialization(profile.getSpecialization());
            response.setBio(profile.getBio());
            response.setProfileImageUrl(profile.getProfileImageUrl());
            response.setCreatedAt(profile.getCreatedAt());
            response.setUpdatedAt(profile.getUpdatedAt());
        }

        return response;
    }

    public AdminProfileResponse toAdminProfileResponse(User user, AdminProfile profile) {
        if (user == null && profile == null) {
            return null;
        }

        AdminProfileResponse response = new AdminProfileResponse();
        if (user != null) {
            response.setUserId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            response.setRole(user.getRole());
            response.setActive(user.isActive());
            response.setUserCreatedAt(user.getCreatedAt());
        }

        if (profile != null) {
            response.setProfileId(profile.getId());
            response.setEmployeeId(profile.getEmployeeId());
            response.setDepartment(profile.getDepartment());
            response.setDesignation(profile.getDesignation());
            response.setBio(profile.getBio());
            response.setProfileImageUrl(profile.getProfileImageUrl());
            response.setCreatedAt(profile.getCreatedAt());
            response.setUpdatedAt(profile.getUpdatedAt());
        }

        return response;
    }

    public void updateStudentProfile(StudentProfile profile, StudentProfileUpdateRequest request) {
        if (request == null || profile == null) {
            return;
        }

        if (request.getDepartment() != null) {
            profile.setDepartment(request.getDepartment().trim());
        }
        if (request.getCourse() != null) {
            profile.setCourse(request.getCourse().trim());
        }
        if (request.getYearOfStudy() != null) {
            profile.setYearOfStudy(request.getYearOfStudy());
        }
        if (request.getDateOfBirth() != null) {
            profile.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            profile.setGender(request.getGender().trim());
        }
        if (request.getFitnessGoal() != null) {
            profile.setFitnessGoal(request.getFitnessGoal().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(request.getProfileImageUrl().trim());
        }
    }

    public void updateTrainerProfile(TrainerProfile profile, TrainerProfileUpdateRequest request) {
        if (request == null || profile == null) {
            return;
        }

        if (request.getQualification() != null) {
            profile.setQualification(request.getQualification().trim());
        }
        if (request.getExperienceYears() != null) {
            profile.setExperienceYears(request.getExperienceYears());
        }
        if (request.getSpecialization() != null) {
            profile.setSpecialization(request.getSpecialization().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(request.getProfileImageUrl().trim());
        }
    }

    public void updateAdminProfile(AdminProfile profile, AdminProfileUpdateRequest request) {
        if (request == null || profile == null) {
            return;
        }

        if (request.getDepartment() != null) {
            profile.setDepartment(request.getDepartment().trim());
        }
        if (request.getDesignation() != null) {
            profile.setDesignation(request.getDesignation().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(request.getProfileImageUrl().trim());
        }
    }
}
