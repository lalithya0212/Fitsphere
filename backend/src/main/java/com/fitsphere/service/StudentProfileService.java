package com.fitsphere.service;

import com.fitsphere.dto.profile.StudentProfileResponse;
import com.fitsphere.dto.profile.StudentProfileUpdateRequest;
import com.fitsphere.entity.StudentProfile;
import com.fitsphere.entity.User;

public interface StudentProfileService {

    StudentProfileResponse getProfile(String email);

    StudentProfileResponse updateProfile(String email, StudentProfileUpdateRequest request);

    StudentProfile createInitialProfile(User user);
}
