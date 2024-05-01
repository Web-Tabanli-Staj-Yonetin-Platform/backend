package v3_proje.v3_pro.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "denCompany")
public class Company {
	@Id
	private String id;
	private String name;
	private String email;
	private String password;
	private String about;
	private String phone;
	private String fax;
	private String address;
	private String sector;
	private String taxnumber;
}
