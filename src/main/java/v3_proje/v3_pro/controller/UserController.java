package v3_proje.v3_pro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import v3_proje.v3_pro.service.UserService;
import v3_proje.v3_pro.DTO.user.LoginDTO;
import v3_proje.v3_pro.DTO.user.UserCreateDTO;
import v3_proje.v3_pro.DTO.user.UserUpdateDTO;
import v3_proje.v3_pro.entity.User;
import v3_proje.v3_pro.response.ResponseMessage;

@RestController
@RequestMapping("/api")
@CrossOrigin//(origins = "http://localhost:3000")
public class UserController {
	
	@Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        User user = userService.getUserByEmail(loginDTO.getEmail());
        if (user != null && user.getPassword().equals(loginDTO.getPassword())) {
            return ResponseEntity.ok("Giriş başarılı.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-posta adresi veya şifre hatalı.");
        }
    }
    
    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody UserCreateDTO userCreateDTO) {
    	try {
			userService.createUser(userCreateDTO);
			return new ResponseEntity<UserCreateDTO>(userCreateDTO, HttpStatus.OK);
		} catch (ResponseMessage e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
		}
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") String id) {
    	try {
			return new ResponseEntity<>(userService.getSingleUser(id), HttpStatus.OK);
		} catch (ResponseMessage e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
    }
    
    @PutMapping("/updateUser/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") String id, @RequestBody UserUpdateDTO userUpdateDTO) {
        try {
            userService.updateUser(id, userUpdateDTO);
            return new ResponseEntity<>("Updated user with id "+id+"", HttpStatus.OK);
        } catch (ResponseMessage e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } 
    }
    
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) throws ResponseMessage{
		try{
			userService.deleteUser(id);
            return new ResponseEntity<>("Successfully deleted user with id "+id, HttpStatus.OK);
        }
        catch (ResponseMessage e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }	
	}
}
