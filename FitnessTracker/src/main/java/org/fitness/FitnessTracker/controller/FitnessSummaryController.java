package org.fitness.FitnessTracker.controller;

import org.fitness.FitnessTracker.dto.FitnessSummaryDTO;
import org.fitness.FitnessTracker.service.FitnessSummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/fitness")
public class FitnessSummaryController {

    private final FitnessSummaryService fitnessSummaryService;

    public FitnessSummaryController(
            FitnessSummaryService fitnessSummaryService) {

        this.fitnessSummaryService = fitnessSummaryService;
    }

    // DAILY FITNESS SUMMARY
    @GetMapping("/users/{userId}/summary")
    public ResponseEntity<FitnessSummaryDTO> getDailySummary(
            @PathVariable Long userId,
            @RequestParam LocalDate date) {

        FitnessSummaryDTO summary =
                fitnessSummaryService.getDailySummary(
                        userId,
                        date
                );

        return ResponseEntity.ok(summary);
    }
}
