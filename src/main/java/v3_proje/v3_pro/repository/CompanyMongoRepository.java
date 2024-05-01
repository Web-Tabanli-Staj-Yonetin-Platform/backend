package v3_proje.v3_pro.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import v3_proje.v3_pro.entity.Company;

public interface CompanyMongoRepository extends MongoRepository<Company, String>{
	Company findByEmail(String email);
	//Optional<User> findById(String id);
	
	@Query("{'username': ?0}")
	Optional<Company> findByUsername(String username);
}
