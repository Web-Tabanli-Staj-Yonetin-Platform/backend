package v3_proje.v3_pro.DTO.notice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeUpdateDTO {
	private String name;
	private String description;
	private String wanted;
	private String department;
}
