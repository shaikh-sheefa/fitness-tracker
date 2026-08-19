package org.fitness.FitnessTracker.repository;

import org.fitness.FitnessTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}