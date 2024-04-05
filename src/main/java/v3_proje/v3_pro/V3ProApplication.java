package v3_proje.v3_pro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
public class V3ProApplication {

	public static void main(String[] args) {
		SpringApplication.run(V3ProApplication.class, args);
	}
	
	@Bean
	public Docket api() { 
	    return new Docket(DocumentationType.SWAGGER_2)
	    	.enable(true)
            .apiInfo(new ApiInfoBuilder()
            		.title("Swagger Super")
            		
                    .description("Swagger Description details")
                    .version("1.0").build())
	        .select()                                  
	        .apis(RequestHandlerSelectors.basePackage("v3_proje.v3_pro"))                   
	        .paths(PathSelectors.any()).build();                                         
	}

}
