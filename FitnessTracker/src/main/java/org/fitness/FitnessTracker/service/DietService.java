package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.dto.DietDTO;
import org.fitness.FitnessTracker.entity.Diet;
import org.fitness.FitnessTracker.entity.User;
import org.fitness.FitnessTracker.repository.DietRepository;
import org.fitness.FitnessTracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DietService {

    private final DietRepository dietRepository;
    private final UserRepository userRepository;

    public DietService(
            DietRepository dietRepository,
            UserRepository userRepository) {

        this.dietRepository = dietRepository;
        this.userRepository = userRepository;
    }

    // CREATE
    public DietDTO createDiet(DietDTO dietDTO) {

        Diet diet = new Diet();

        User user = userRepository
                .findById(dietDTO.getUserId())
                .orElse(null);

        if (user == null) {
            return null;
        }

        diet.setUser(user);
        diet.setMealType(dietDTO.getMealType());
        diet.setFoodName(dietDTO.getFoodName());
        diet.setCalories(dietDTO.getCalories());
        diet.setProtein(dietDTO.getProtein());
        diet.setCarbs(dietDTO.getCarbs());
        diet.setFat(dietDTO.getFat());
        diet.setFibre(dietDTO.getFibre());
        diet.setMealDate(dietDTO.getMealDate());

        Diet savedDiet = dietRepository.save(diet);

        return convertToDTO(savedDiet);
    }

    // READ ALL
    public List<DietDTO> getAllDiets() {

        return dietRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ ONE
    public DietDTO getDietById(Long id) {

        return dietRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // GET DIETS BY USER
    public List<DietDTO> getDietsByUserId(Long userId) {

        return dietRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // UPDATE
    public DietDTO updateDiet(Long id, DietDTO dietDTO) {

        Diet diet = dietRepository.findById(id).orElse(null);

        if (diet == null) {
            return null;
        }

        User user = userRepository
                .findById(dietDTO.getUserId())
                .orElse(null);

        if (user == null) {
            return null;
        }

        diet.setUser(user);
        diet.setMealType(dietDTO.getMealType());
        diet.setFoodName(dietDTO.getFoodName());
        diet.setCalories(dietDTO.getCalories());
        diet.setProtein(dietDTO.getProtein());
        diet.setCarbs(dietDTO.getCarbs());
        diet.setFat(dietDTO.getFat());
        diet.setFibre(dietDTO.getFibre());
        diet.setMealDate(dietDTO.getMealDate());

        Diet updatedDiet = dietRepository.save(diet);

        return convertToDTO(updatedDiet);
    }

    // DELETE
    public void deleteDiet(Long id) {

        dietRepository.deleteById(id);
    }

    // ENTITY → DTO
    private DietDTO convertToDTO(Diet diet) {

        DietDTO dto = new DietDTO();

        dto.setId(diet.getId());
        dto.setMealType(diet.getMealType());
        dto.setFoodName(diet.getFoodName());
        dto.setCalories(diet.getCalories());
        dto.setProtein(diet.getProtein());
        dto.setCarbs(diet.getCarbs());
        dto.setFat(diet.getFat());
        dto.setFibre(diet.getFibre());
        dto.setMealDate(diet.getMealDate());

        if (diet.getUser() != null) {
            dto.setUserId(diet.getUser().getId());
        }

        return dto;
    }
}