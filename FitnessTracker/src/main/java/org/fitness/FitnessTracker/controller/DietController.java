package org.fitness.FitnessTracker.controller;

import jakarta.validation.Valid;
import org.fitness.FitnessTracker.dto.DietDTO;
import org.fitness.FitnessTracker.service.DietService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diets")
public class DietController {

    private final DietService dietService;

    public DietController(DietService dietService) {
        this.dietService = dietService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<DietDTO> createDiet(
            @Valid @RequestBody DietDTO dietDTO) {

        DietDTO createdDiet = dietService.createDiet(dietDTO);

        if (createdDiet == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.status(201).body(createdDiet);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<DietDTO>> getAllDiets() {

        return ResponseEntity.ok(
                dietService.getAllDiets()
        );
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<DietDTO> getDietById(
            @PathVariable Long id) {

        DietDTO dietDTO = dietService.getDietById(id);

        if (dietDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dietDTO);
    }

    // GET DIETS BY USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DietDTO>> getDietsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                dietService.getDietsByUserId(userId)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DietDTO> updateDiet(
            @PathVariable Long id,
            @Valid @RequestBody DietDTO dietDTO) {

        DietDTO updatedDiet =
                dietService.updateDiet(id, dietDTO);

        if (updatedDiet == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedDiet);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiet(
            @PathVariable Long id) {

        dietService.deleteDiet(id);

        return ResponseEntity.noContent().build();
    }
}