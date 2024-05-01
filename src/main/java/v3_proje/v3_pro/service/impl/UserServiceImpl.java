package v3_proje.v3_pro.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import v3_proje.v3_pro.DTO.user.UserCreateDTO;
import v3_proje.v3_pro.DTO.user.UserUpdateDTO;
import v3_proje.v3_pro.entity.User;
import v3_proje.v3_pro.repository.UserMongoRepository;
import v3_proje.v3_pro.response.ResponseMessage;
import v3_proje.v3_pro.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserMongoRepository userMongoRepository;
	    
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public User getUserByEmail(String email) {
		return userMongoRepository.findByEmail(email);
	}
	
	@Override
	public User getSingleUser(String id) throws ResponseMessage{
		Optional<User> userOptional = userMongoRepository.findById(id);
        if(!userOptional.isPresent()) {
        	throw new ResponseMessage(ResponseMessage.NotFoundException(id));
        }else {
        	return userOptional.get();
        }		
	}
	
	@Override
	public void createUser(UserCreateDTO userCreateDTO) throws ResponseMessage{		
		Optional<User> userOptional = userMongoRepository.findByUsername(userCreateDTO.getUsername());
		if(userOptional.isPresent()) {
			throw new ResponseMessage(ResponseMessage.AlreadyExistsException());
		}
		else {
			String encryptedPassword = passwordEncoder.encode(userCreateDTO.getPassword());		
			User user = new User();
			user.setUsername(userCreateDTO.getUsername());
			user.setEmail(userCreateDTO.getEmail());
			user.setPassword(encryptedPassword);
			userMongoRepository.save(user);
		}			
	}
	
	@Override
    public void updateUser(String id, UserUpdateDTO userUpdateDTO) throws ResponseMessage{
		Optional<User> userWithId = userMongoRepository.findById(id);
	    Optional<User> userWithSameName = userMongoRepository.findByUsername(userUpdateDTO.getUsername());
	    if (userWithId.isPresent()) {
	        if (userWithSameName.isPresent() && !userWithSameName.get().getId().equals(id)) {
	            throw new ResponseMessage(ResponseMessage.AlreadyExistsException());
	        }       
	        User userUpdate = userWithId.get();
	        userUpdate.setUsername(userUpdateDTO.getUsername());
	        userUpdate.setEmail(userUpdateDTO.getEmail());
	        if (!userUpdateDTO.getPassword().equals(userUpdate.getPassword())) {
	            String encryptedPassword = passwordEncoder.encode(userUpdateDTO.getPassword());
	            userUpdate.setPassword(encryptedPassword);
	        }
	        userUpdate.setFirstname(userUpdateDTO.getFirstname());
	        userUpdate.setLastname(userUpdateDTO.getLastname());
	        userUpdate.setBirthdate(userUpdateDTO.getBirthdate());
	        userUpdate.setPhone(userUpdateDTO.getPhone());
	        userUpdate.setAddress(userUpdateDTO.getAddress());
	        userUpdate.setEducation(userUpdateDTO.getEducation());
	        userUpdate.setDepartmand(userUpdateDTO.getDepartmand());;
	        userUpdate.setGrade(userUpdateDTO.getGrade());
	        userUpdate.setGradeaverage(userUpdateDTO.getGradeaverage());
	        userUpdate.setExperience(userUpdateDTO.getExperience());
	        userUpdate.setSkills(userUpdateDTO.getSkills());
	        userUpdate.setHobbies(userUpdateDTO.getHobbies());      
	        userMongoRepository.save(userUpdate);
	    } else {
	        throw new ResponseMessage(ResponseMessage.NotFoundException(id));
	    }
    }
	
	@Override
	public void deleteUser(String id) throws ResponseMessage{
		Optional<User> delOptional = userMongoRepository.findById(id);
		if(!delOptional.isPresent()) {
			throw new ResponseMessage(ResponseMessage.NotFoundException(id));
		}
		else {
			userMongoRepository.deleteById(id);
		}
	}
}
