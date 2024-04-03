package v3_proje.v3_pro.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

	/*@Override
	public User createUser(String username, String email, String password) {
		String encryptedPassword = passwordEncoder.encode(password);
	    User user = new User(username, email, encryptedPassword);
	    return userMongoRepository.save(user);
	}*/
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
	public void createUser(User user) throws ResponseMessage{		
		Optional<User> userOptional = userMongoRepository.findByUsername(user.getUsername());
		if(userOptional.isPresent()) {
			throw new ResponseMessage(ResponseMessage.AlreadyExistsException());
		}
		else {
			String encryptedPassword = passwordEncoder.encode(user.getPassword());		
			user.setPassword(encryptedPassword);
			userMongoRepository.save(user);
		}			
	}
	
	@Override
    public void updateUser(String id, User user) throws ResponseMessage{
		Optional<User> userWithId = userMongoRepository.findById(id);
	    Optional<User> userWithSameName = userMongoRepository.findByUsername(user.getUsername());
	    if (userWithId.isPresent()) {
	        if (userWithSameName.isPresent() && !userWithSameName.get().getId().equals(id)) {
	            throw new ResponseMessage(ResponseMessage.AlreadyExistsException());
	        }       
	        User userUpdate = userWithId.get();
	        userUpdate.setUsername(user.getUsername());
	        userUpdate.setEmail(user.getEmail());
	        // Şifre güncelleniyorsa, şifrenin yeniden şifrelenmesi gerekiyor
	        if (!user.getPassword().equals(userUpdate.getPassword())) {
	            String encryptedPassword = passwordEncoder.encode(user.getPassword());
	            userUpdate.setPassword(encryptedPassword);
	        }
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
