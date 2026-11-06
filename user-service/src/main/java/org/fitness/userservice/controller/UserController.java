
package org.fitness.userservice.controller;

import org.fitness.userservice.entity.User;
import org.fitness.userservice.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import org.fitness.userservice.dto.UserDTO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }
    @PostMapping
    public User createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setAge(userDTO.getAge());
        user.setHeight(userDTO.getHeight());
        user.setWeight(userDTO.getWeight());

        return userService.createUser(user);
    }
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {

        User updatedUser = new User();
        updatedUser.setName(userDTO.getName());
        updatedUser.setEmail(userDTO.getEmail());
        updatedUser.setAge(userDTO.getAge());
        updatedUser.setHeight(userDTO.getHeight());
        updatedUser.setWeight(userDTO.getWeight());

        return userService.updateUser(id, updatedUser);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
