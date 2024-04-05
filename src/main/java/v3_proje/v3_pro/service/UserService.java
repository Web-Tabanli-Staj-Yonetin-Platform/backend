package v3_proje.v3_pro.service;

import v3_proje.v3_pro.DTO.user.UserCreateDTO;
import v3_proje.v3_pro.DTO.user.UserUpdateDTO;
import v3_proje.v3_pro.entity.User;
import v3_proje.v3_pro.response.ResponseMessage;

public interface UserService {			
	public User getUserByEmail(String email);
	public User getSingleUser(String id) throws ResponseMessage;
	public void createUser(UserCreateDTO userCreateDTO) throws ResponseMessage;
    public void updateUser(String id, UserUpdateDTO userUpdateDTO) throws ResponseMessage;
    public void deleteUser(String id) throws ResponseMessage;
}
