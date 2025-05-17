package com.example.backend.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.backend.Model.Status;
import com.example.backend.Model.User;
import com.example.backend.Repository.StatusRepository;
import com.jayway.jsonpath.Criteria;

@Service
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;
    private MongoTemplate mongoTemplate;

    public List<Status> allStatuses() {
        return statusRepository.findAll();
    }

    public Optional<Status> singleStatus(String id) {
        return statusRepository.findById(id);
    }

    public Status createStatus(Status status) {
        return statusRepository.save(status);

    }
   
    public Status updateStatus(Status updatedStatus) {
    Optional<Status> existingStatusOpt = statusRepository.findById(updatedStatus.getId());
    
    if (existingStatusOpt.isEmpty()) {
        throw new RuntimeException("Status not found with id: " + updatedStatus.getId());
    }
    
    Status existingStatus = existingStatusOpt.get();
    
    // Use Objects.nonNull() for null checks
    if (Objects.nonNull(updatedStatus.getDescription())) {
        existingStatus.setDescription(updatedStatus.getDescription());
    }
    if (Objects.nonNull(updatedStatus.getDistanceRan())) {
        existingStatus.setDistanceRan(updatedStatus.getDistanceRan());
    }
    if (Objects.nonNull(updatedStatus.getPushups())) {
        existingStatus.setPushups(updatedStatus.getPushups());
    }
    if (Objects.nonNull(updatedStatus.getBenchPress())) {
        existingStatus.setBenchPress(updatedStatus.getBenchPress());
    }
    if (Objects.nonNull(updatedStatus.getComments())) {
        existingStatus.setComments(updatedStatus.getComments());
    }
    
    return statusRepository.save(existingStatus);
}

        // Method to delete a status by its Object ID
    public void deleteStatus(String id){
        Optional<Status> statusToDelete = statusRepository.findById(id);

        if(statusToDelete.isPresent()){
            statusRepository.deleteById(id);
        }
    }

       // New method to get all statuses by user
       public List<Status> getAllStatusesByUser(String user) {
        return statusRepository.findByUser(user);
        
    }
   
    // Runs every hour to delete statuses older than 24 hours
    @Scheduled(fixedRate = 3600000) // Every 1 hour
    public void deleteOldStatuses() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        List<Status> oldStatuses = statusRepository.findByCreatedAtBefore(twentyFourHoursAgo);
        statusRepository.deleteAll(oldStatuses);
    }


}
