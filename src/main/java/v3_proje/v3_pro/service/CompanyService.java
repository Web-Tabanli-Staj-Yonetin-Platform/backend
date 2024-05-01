package v3_proje.v3_pro.service;

import v3_proje.v3_pro.DTO.company.CompanyCreateDTO;
import v3_proje.v3_pro.DTO.company.CompanyUpdateDTO;
import v3_proje.v3_pro.entity.Company;
import v3_proje.v3_pro.response.ResponseMessage;

public interface CompanyService {
	public Company getCompanyByEmail(String email);
	public Company getSingleCompany(String id) throws ResponseMessage;
	public void createCompany(CompanyCreateDTO companyCreateDTO) throws ResponseMessage;
    public void updateCompany(String id, CompanyUpdateDTO companyUpdateDTO) throws ResponseMessage;
    public void deleteCompany(String id) throws ResponseMessage;
}
