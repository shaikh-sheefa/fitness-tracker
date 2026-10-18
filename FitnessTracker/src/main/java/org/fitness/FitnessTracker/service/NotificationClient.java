
package org.fitness.FitnessTracker.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public String sendNotification(String recipient, String message) {

        return restClient.post()
                .uri("http://localhost:8082/api/notifications")
                .body(Map.of(
                        "recipient", recipient,
                        "message", message
                ))
                .retrieve()
                .body(String.class);
    }
}
