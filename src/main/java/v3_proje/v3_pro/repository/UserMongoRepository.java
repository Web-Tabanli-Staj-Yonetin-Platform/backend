package v3_proje.v3_pro.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import v3_proje.v3_pro.entity.User;

@Repository
public interface UserMongoRepository extends MongoRepository<User, String>{
	User findByEmail(String email);
	//Optional<User> findById(String id);
	
	@Query("{'username': ?0}")
	Optional<User> findByUsername(String username);
}
