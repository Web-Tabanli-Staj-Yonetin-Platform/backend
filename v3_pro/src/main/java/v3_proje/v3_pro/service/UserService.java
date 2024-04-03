package v3_proje.v3_pro.service;

import v3_proje.v3_pro.entity.User;
import v3_proje.v3_pro.response.ResponseMessage;

public interface UserService {		
	//User createUser(String username, String email, String password);	
	
	User getUserByEmail(String email);
	public User getSingleUser(String id) throws ResponseMessage;
	public void createUser(User user) throws ResponseMessage;
    public void updateUser(String id, User user) throws ResponseMessage;
    public void deleteUser(String id) throws ResponseMessage;
}
