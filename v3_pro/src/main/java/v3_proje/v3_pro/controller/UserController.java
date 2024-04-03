package v3_proje.v3_pro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import v3_proje.v3_pro.DTO.LoginDTO;
import v3_proje.v3_pro.DTO.UserDTO;
import v3_proje.v3_pro.DTO.UserUpdateDTO;
import v3_proje.v3_pro.service.UserService;
import v3_proje.v3_pro.entity.User;
import v3_proje.v3_pro.response.ResponseMessage;

@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:3000")
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

    /*@PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        if (!isValidEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Geçersiz e-posta adresi.");
        }

        User existingUser = userService.getUserByEmail(userDTO.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Bu e-posta adresi zaten kullanımda.");
        } else {
            User newUser = userService.createUser(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
            if (newUser != null) {
                return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Kullanıcı kaydedilirken bir hata oluştu.");
            }
        }
    }*/
    
    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody User user) {
    	try {
			userService.createUser(user);
			return new ResponseEntity<User>(user, HttpStatus.OK);
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
    public ResponseEntity<?> updateUser(@PathVariable("id") String id, @RequestBody User user) {
        try {
            userService.updateUser(id, user);
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
