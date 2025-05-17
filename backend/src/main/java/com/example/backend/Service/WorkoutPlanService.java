package com.example.backend.Service;

import com.example.backend.Dto.EditCommentDto;
import com.example.backend.Model.WorkoutPlan;
import com.example.backend.Model.Comment;
import com.example.backend.Model.Likes;
import com.example.backend.Repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {

        workoutPlan.setCreationDate(new Date());
        workoutPlan.setLastModifiedDate(new Date());
        return workoutPlanRepository.save(workoutPlan);
    }


    public List<WorkoutPlan> getWorkoutPlansByUserId(String userId) {
        return workoutPlanRepository.findByCreatorId(userId);
    }

    public List<WorkoutPlan> getAllWorkoutPlans(){
        List<WorkoutPlan> allPlans = workoutPlanRepository.findAll();
        return allPlans.stream()
                .filter(WorkoutPlan::isVisibility)
                .collect(Collectors.toList());
    }

    public Optional<WorkoutPlan> getWorkoutPostById(String postID){
        return workoutPlanRepository.findById(postID);
    }

    public void deleteWorkoutPlanById(String workoutPlanId) {
        workoutPlanRepository.deleteById(workoutPlanId);
    }

    public WorkoutPlan updateWorkoutPlanById(String workoutPlanId, WorkoutPlan updatedWorkoutPlan) {
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        String prevImage = existingWorkoutPlan.getImage();

        // Update existing workout plan fields with the updated values
        existingWorkoutPlan.setName(updatedWorkoutPlan.getName());
        existingWorkoutPlan.setDescription(updatedWorkoutPlan.getDescription());
        existingWorkoutPlan.setExercises(updatedWorkoutPlan.getExercises());
        existingWorkoutPlan.setDuration(updatedWorkoutPlan.getDuration());
        existingWorkoutPlan.setIntensity(updatedWorkoutPlan.getIntensity());


        if (updatedWorkoutPlan.getImage() == null){
            existingWorkoutPlan.setImage(prevImage);
        }else {
            existingWorkoutPlan.setImage(updatedWorkoutPlan.getImage());
        }

        if (updatedWorkoutPlan.getVideo() == null){
            existingWorkoutPlan.setVideo(existingWorkoutPlan.getVideo());
        }else {
            existingWorkoutPlan.setVideo(updatedWorkoutPlan.getVideo());
        }
        existingWorkoutPlan.setLastModifiedDate(new Date());
        existingWorkoutPlan.setVisibility(updatedWorkoutPlan.isVisibility());

        // Save the updated workout plan
        return workoutPlanRepository.save(existingWorkoutPlan);
    }


    public WorkoutPlan addCommentToWorkoutPlan(String workoutPlanId, Comment comment){
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));


        existingWorkoutPlan.getComments().add(comment);
        existingWorkoutPlan.setLastModifiedDate(new Date());

        return workoutPlanRepository.save(existingWorkoutPlan);
    }

    public WorkoutPlan deleteComment(String workoutPlanId, Comment comment){
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        for(Comment comm: existingWorkoutPlan.getComments()){
            if(comm.getComment().equals(comment.getComment()) && comm.getName().equals(comment.getName())) {

                System.out.println(comm.getComment());
                existingWorkoutPlan.getComments().remove(comm);
                existingWorkoutPlan.setLastModifiedDate(new Date());
                break;
            }else {
                System.out.println("not deleted");
            }
        }
        return workoutPlanRepository.save(existingWorkoutPlan);
    }

    public WorkoutPlan editComment(String workoutPlanId,EditCommentDto comment){
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        for(Comment comm: existingWorkoutPlan.getComments()){
            if(comm.getComment().equals(comment.getPrevComment()) && comm.getName().equals(comment.getName())) {

                comm.setComment(comment.getNewComment());
                existingWorkoutPlan.setLastModifiedDate(new Date());
                break;
            }else {
                System.out.println("not edited");
            }
        }
        return workoutPlanRepository.save(existingWorkoutPlan);
    }

    public WorkoutPlan like(String workoutPlanId, Likes like){
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));


        existingWorkoutPlan.getLikes().add(like);
        existingWorkoutPlan.setLastModifiedDate(new Date());

        return workoutPlanRepository.save(existingWorkoutPlan);
    }

    public WorkoutPlan unlike(String workoutPlanId, Likes unlike){
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));


        existingWorkoutPlan.getLikes().remove(unlike);
        existingWorkoutPlan.setLastModifiedDate(new Date());

        return workoutPlanRepository.save(existingWorkoutPlan);
    }


    // WorkoutPlanService.java

public WorkoutPlan likes(String workoutPlanId, Likes like) {
    WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
            .orElseThrow(() -> new RuntimeException("Workout plan not found"));

    // Check if user already liked
    boolean alreadyLiked = existingWorkoutPlan.getLikes().stream()
            .anyMatch(l -> l.getUserId().equals(like.getUserId()));

    if (!alreadyLiked) {
        existingWorkoutPlan.getLikes().add(like);
        existingWorkoutPlan.setLastModifiedDate(new Date());
    }

    return workoutPlanRepository.save(existingWorkoutPlan);
}

public WorkoutPlan unlikes(String workoutPlanId, Likes unlike) {
    WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
            .orElseThrow(() -> new RuntimeException("Workout plan not found"));

    // Remove all instances of user's like
    List<Likes> filteredLikes = existingWorkoutPlan.getLikes().stream()
            .filter(l -> !l.getUserId().equals(unlike.getUserId()))
            .collect(Collectors.toList());

    existingWorkoutPlan.setLikes(filteredLikes);
    existingWorkoutPlan.setLastModifiedDate(new Date());

    return workoutPlanRepository.save(existingWorkoutPlan);
}


    public WorkoutPlan UpdateVisibility(String workoutPlanId, boolean visibility){
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));


        existingWorkoutPlan.setVisibility(visibility);
        existingWorkoutPlan.setLastModifiedDate(new Date());

        return workoutPlanRepository.save(existingWorkoutPlan);
    }

}
