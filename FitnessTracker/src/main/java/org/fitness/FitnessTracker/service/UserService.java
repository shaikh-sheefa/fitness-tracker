package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.dto.UserDTO;
import org.fitness.FitnessTracker.entity.User;
import org.fitness.FitnessTracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CREATE
    public UserDTO createUser(UserDTO userDTO) {

        User user = new User();

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setAge(userDTO.getAge());
        user.setHeight(userDTO.getHeight());
        user.setWeight(userDTO.getWeight());

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // READ ALL
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ ONE
    public UserDTO getUserById(Long id) {

        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // UPDATE
    public UserDTO updateUser(Long id, UserDTO userDTO) {

        return userRepository.findById(id)
                .map(user -> {

                    user.setName(userDTO.getName());
                    user.setEmail(userDTO.getEmail());
                    user.setAge(userDTO.getAge());
                    user.setHeight(userDTO.getHeight());
                    user.setWeight(userDTO.getWeight());

                    User updatedUser = userRepository.save(user);

                    return convertToDTO(updatedUser);
                })
                .orElse(null);
    }

    // DELETE
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ENTITY → DTO
    private UserDTO convertToDTO(User user) {

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setHeight(user.getHeight());
        dto.setWeight(user.getWeight());

        return dto;
    }
}