package v3_proje.v3_pro.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import v3_proje.v3_pro.entity.Notice;

public interface NoticeMongoRepository extends MongoRepository<Notice, String>{

}
