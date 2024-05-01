package v3_proje.v3_pro.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import v3_proje.v3_pro.DTO.company.CompanyCreateDTO;
import v3_proje.v3_pro.DTO.company.CompanyUpdateDTO;
import v3_proje.v3_pro.entity.Company;
import v3_proje.v3_pro.repository.CompanyMongoRepository;
import v3_proje.v3_pro.response.ResponseMessage;
import v3_proje.v3_pro.service.CompanyService;

@Service
public class CompanyServiceImpl implements CompanyService{
	@Autowired
	private CompanyMongoRepository companyMongoRepository;	    
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	
	@Override
	public Company getCompanyByEmail(String email) {
		return companyMongoRepository.findByEmail(email);
	}

	@Override
	public Company getSingleCompany(String id) throws ResponseMessage {
		Optional<Company> companyOptional = companyMongoRepository.findById(id);
        if(!companyOptional.isPresent()) {
        	throw new ResponseMessage(ResponseMessage.NotFoundException(id));
        }else {
        	return companyOptional.get();
        }	
	}

	@Override
	public void createCompany(CompanyCreateDTO companyCreateDTO) throws ResponseMessage {
		Optional<Company> companyOptional = companyMongoRepository.findByUsername(companyCreateDTO.getName());
		if(companyOptional.isPresent()) {
			throw new ResponseMessage(ResponseMessage.AlreadyExistsException());
		}
		else {
			String encryptedPassword = passwordEncoder.encode(companyCreateDTO.getPassword());		
			Company company = new Company();
			company.setName(companyCreateDTO.getName());
			company.setEmail(companyCreateDTO.getEmail());
			company.setPassword(encryptedPassword);
			company.setTaxnumber(companyCreateDTO.getTaxnumber());
			companyMongoRepository.save(company);
		}	
	}

	@Override
	public void updateCompany(String id, CompanyUpdateDTO companyUpdateDTO) throws ResponseMessage {
		Optional<Company> companyWithId = companyMongoRepository.findById(id);
	    Optional<Company> companyWithSameName = companyMongoRepository.findByUsername(companyUpdateDTO.getName());
	    if (companyWithId.isPresent()) {
	        if (companyWithSameName.isPresent() && !companyWithSameName.get().getId().equals(id)) {
	            throw new ResponseMessage(ResponseMessage.AlreadyExistsException());
	        }       
	        Company companyUpdate = companyWithId.get();
	        companyUpdate.setName(companyUpdateDTO.getName());
	        companyUpdate.setEmail(companyUpdateDTO.getEmail());
	        if (!companyUpdateDTO.getPassword().equals(companyUpdate.getPassword())) {
	            String encryptedPassword = passwordEncoder.encode(companyUpdateDTO.getPassword());
	            companyUpdate.setPassword(encryptedPassword);
	        }
	        companyUpdate.setPhone(companyUpdateDTO.getPhone());
	        companyUpdate.setFax(companyUpdateDTO.getFax());
	        companyUpdate.setAddress(companyUpdateDTO.getAddress());    
	        companyUpdate.setAbout(companyUpdateDTO.getAbout()); 
	        companyUpdate.setSector(companyUpdateDTO.getSector()); 
	        companyUpdate.setTaxnumber(companyUpdateDTO.getTaxnumber()); 
	        companyMongoRepository.save(companyUpdate);
	    } else {
	        throw new ResponseMessage(ResponseMessage.NotFoundException(id));
	    }
	}

	@Override
	public void deleteCompany(String id) throws ResponseMessage {
		Optional<Company> delOptional = companyMongoRepository.findById(id);
		if(!delOptional.isPresent()) {
			throw new ResponseMessage(ResponseMessage.NotFoundException(id));
		}
		else {
			companyMongoRepository.deleteById(id);
		}
	}

}
