
package org.fitness.FitnessTracker.controller;

import org.fitness.FitnessTracker.service.NotificationClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-notification")
public class NotificationTestController {

    private final NotificationClient notificationClient;

    public NotificationTestController(
            NotificationClient notificationClient) {
        this.notificationClient = notificationClient;
    }

    @PostMapping
    public String testNotification() {
        return notificationClient.sendNotification(
                "sheefa@example.com",
                "Hello from Fitness Tracker!"
        );
    }
}
