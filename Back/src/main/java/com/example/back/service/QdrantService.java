package com.example.back.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QdrantService {
    RestTemplate restTemplate;
    String qdrantUrl;
    @Value("${qdrant.apikey}")
    String apiKey;
    public QdrantService(RestTemplate restTemplate, @Value("${qdrant.url}") String qdrantUrl, @Value("${qdrant.apikey}") String apiKey) {
        this.restTemplate = restTemplate;
        this.qdrantUrl = qdrantUrl;
        this.apiKey = apiKey;
    }
    public void upsertPoint(String collectionName, Integer pointId, List<Float> vector, Map<String, Object> payload) {

        String url = qdrantUrl + "/collections/" + collectionName + "/points?wait=true";

        Map<String, Object> body = Map.of(
                "points", List.of(
                        Map.of(
                                "id", pointId,
                                "vector", vector,
                                "payload", payload
                        )
                )
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key",apiKey);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body,headers);
        restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
    }
    public List<Map<String, Object>> search(String collectionName, List<Float> vector, int top) {
        String url = qdrantUrl + "/collections/" + collectionName + "/points/search";

        Map<String, Object> body = Map.of(
                "vector", vector,
                "top", top,
                "with_payload", true
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key",apiKey);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body,headers);
        var response = restTemplate.postForEntity(url, request, Map.class);
        Map<String, Object> responseBody = response.getBody();

        return (List<Map<String, Object>>) responseBody.get("result");
    }
}
