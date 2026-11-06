package org.fitness.FitnessTracker.client;

import org.fitness.FitnessTracker.exception.ResourceNotFoundException;
import org.fitness.FitnessTracker.exception.ServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Talks to user-service, which owns all user data.
 */
@Component
public class UserClient {

    private final RestClient restClient;

    public UserClient(
            RestClient restClient,
            @Value("${services.user-service.url}") String userServiceUrl) {
        this.restClient = restClient.mutate().baseUrl(userServiceUrl).build();
    }

    public void ensureUserExists(Long userId) {
        try {
            restClient.get()
                    .uri("/api/users/{id}", userId)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("User " + userId + " not found");
        } catch (RestClientException e) {
            throw new ServiceUnavailableException(
                    "User service is unavailable, so user " + userId + " could not be checked");
        }
    }
}
