package com.fitsphere.service;

import com.fitsphere.dto.profile.TrainerProfileResponse;
import com.fitsphere.dto.profile.TrainerProfileUpdateRequest;
import com.fitsphere.entity.TrainerProfile;
import com.fitsphere.entity.User;

public interface TrainerProfileService {

    TrainerProfileResponse getProfile(String email);

    TrainerProfileResponse updateProfile(String email, TrainerProfileUpdateRequest request);

    TrainerProfile createInitialProfile(User user);
}
