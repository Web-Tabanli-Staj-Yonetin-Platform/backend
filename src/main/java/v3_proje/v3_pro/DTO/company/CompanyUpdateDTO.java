package v3_proje.v3_pro.DTO.company;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyUpdateDTO {
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
