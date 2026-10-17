
package org.fitness.notification.controller;

import org.fitness.notification.dto.NotificationRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class NotificationController {

    @GetMapping("/api/notifications")
    public Map<String, String> getNotifications() {
        return Map.of(
                "message",
                "Welcome to Notification Service!"
        );
    }

    @PostMapping("/api/notifications")
    public Map<String, String> sendNotification(
            @RequestBody NotificationRequest request) {

        return Map.of(
                "status", "success",
                "recipient", request.getRecipient(),
                "message", request.getMessage()
        );
    }
}
