package v3_proje.v3_pro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import v3_proje.v3_pro.DTO.company.CompanyCreateDTO;
import v3_proje.v3_pro.DTO.company.CompanyLoginDTO;
import v3_proje.v3_pro.DTO.company.CompanyUpdateDTO;
import v3_proje.v3_pro.entity.Company;
import v3_proje.v3_pro.response.ResponseMessage;
import v3_proje.v3_pro.service.CompanyService;

@RestController
@RequestMapping("/api")
@CrossOrigin//(origins = "http://localhost:3000")
public class CompanyController {
	@Autowired
    private CompanyService companyService;

    @PostMapping("/loginCompany")
    public ResponseEntity<?> loginCompany(@RequestBody CompanyLoginDTO companyloginDTO) {
        Company company = companyService.getCompanyByEmail(companyloginDTO.getEmail());
        if (company != null && company.getPassword().equals(companyloginDTO.getPassword())) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email address or password is incorrect!");
        }
    }
    
    @PostMapping("/createCompany")
    public ResponseEntity<?> createCompany(@RequestBody CompanyCreateDTO companyCreateDTO) {
    	try {
    		companyService.createCompany(companyCreateDTO);
			return new ResponseEntity<CompanyCreateDTO>(companyCreateDTO, HttpStatus.OK);
		} catch (ResponseMessage e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
		}
    }

    @GetMapping("/getCompany/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable("id") String id) {
    	try {
			return new ResponseEntity<>(companyService.getSingleCompany(id), HttpStatus.OK);
		} catch (ResponseMessage e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
    }
    
    @PutMapping("/updateCompany/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable("id") String id, @RequestBody CompanyUpdateDTO companyUpdateDTO) {
        try {
        	companyService.updateCompany(id, companyUpdateDTO);
            return new ResponseEntity<>("Updated company with id "+id+"", HttpStatus.OK);
        } catch (ResponseMessage e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } 
    }
    
    @DeleteMapping("/deleteCompany/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) throws ResponseMessage{
		try{
			companyService.deleteCompany(id);
            return new ResponseEntity<>("Successfully deleted company with id "+id, HttpStatus.OK);
        }
        catch (ResponseMessage e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }	
	}
}
