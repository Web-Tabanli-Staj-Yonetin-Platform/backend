package v3_proje.v3_pro.DTO.user;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {
	private String username;	
	private String email;	
	private String password;	
	private String firstname;
	private String lastname;
	private Date birthdate;
	private String phone;
	private String address;
	private String education;
	private String departmand;
	private String grade;	
	private String gradeaverage;
	private List<String> experience;
	private List<String> skills;
	private List<String> hobbies;
}
