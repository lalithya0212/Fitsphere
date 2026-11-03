package com.fitsphere.repository;

import com.fitsphere.entity.TrainerProfile;
import com.fitsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {

    Optional<TrainerProfile> findByUser(User user);

    Optional<TrainerProfile> findByUserId(Long userId);

    @Query("SELECT tp FROM TrainerProfile tp JOIN FETCH tp.user u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<TrainerProfile> findByUserEmailIgnoreCase(@Param("email") String email);

    boolean existsByTrainerId(String trainerId);

    boolean existsByUser(User user);
}
