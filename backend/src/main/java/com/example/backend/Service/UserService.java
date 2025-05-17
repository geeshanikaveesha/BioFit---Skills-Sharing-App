package com.example.backend.Service;

import com.example.backend.Model.User;
import com.example.backend.Repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }
    public User findByUsername(String username) {
        return userRepository.findByUserName(username);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String Id) {
        return userRepository.findById(Id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(ObjectId Id) {
        return userRepository.findById(String.valueOf(Id));
    }

    public void updateUser(User updatedUser) {
        userRepository.save(updatedUser);
    }

    public void deleteUserById(String userId) {
        userRepository.deleteById(userId);
    }

    public String followUser(String userId1, String userId2){
        User user1 = userRepository.findById(userId1).orElse(null);
        User user2 = userRepository.findById(userId2).orElse(null);
        System.out.print(user1 + " / " + user2);
        if (user1 != null && user2 != null) {
            if(user1.getFollowers().contains(String.valueOf(user2.getId()))){
                return "User already followed";
            }
            else{
                user1.getFollowers().add(String.valueOf(user2.getId()));
                userRepository.save(user1);
                user2.getFollowing().add(String.valueOf(user1.getId()));
                userRepository.save(user2);
            }
            return "Followed";
        }
        return "Error";
    }

    public List<Optional<User>> getFollowers(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        List<Optional<User>> followers = new ArrayList<>();
        assert user != null;
        for (String followerId : user.getFollowers()) {
            Optional<User> follower = userRepository.findById(String.valueOf(followerId));
            if (follower.isPresent()) {
                followers.add(follower);
            }
        }
        return followers;
    }

    public String unFollowUser(String userId1, String userId2){
        User user1 = userRepository.findById(userId1).orElse(null);
        User user2 = userRepository.findById(userId2).orElse(null);
        System.out.print(user1 + " / " + user2);
        if (user1 != null && user2 != null) {
            if(user1.getFollowers().contains(String.valueOf(user2.getId()))){
                user1.getFollowers().remove(String.valueOf(user2.getId()));
                userRepository.save(user1);
                user2.getFollowing().remove(String.valueOf(user1.getId()));
                userRepository.save(user2);

            }
            else{
                return "User not followed";
            }
            return "UnFollowed";
        }
        return "Error";
    }

}
