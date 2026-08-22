package org.fitness.FitnessTracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotNull(message = "Age is required")
    @Min(value = 13, message = "Age must be at least 13")
    @Max(value = 100, message = "Age must not exceed 100")
    private Integer age;

    @NotNull(message = "Height is required")
    @Min(value = 50, message = "Height must be at least 50 cm")
    private Double height;

    @NotNull(message = "Weight is required")
    @Min(value = 20, message = "Weight must be at least 20 kg")
    private Double weight;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }
}