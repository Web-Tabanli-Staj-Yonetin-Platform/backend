package v3_proje.v3_pro.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "denNotice")
public class Notice {
	@Id
	private String id;
	private String name;
	private String description;
	private String wanted;
	private String department;
}
