package v3_proje.v3_pro.DTO.company;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyCreateDTO {
	private String name;
    private String email;
    private String password;
    private String taxnumber;
}
