package v3_proje.v3_pro.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {
	private String id;
	private String username;	
	private String email;	
	private String password;	
	private String firstname;
	private String lastname;
	private String phone;
	private String address;
	private String education;
	private List<String> experience;
	private List<String> skills;
	private List<String> hobbies;
}
