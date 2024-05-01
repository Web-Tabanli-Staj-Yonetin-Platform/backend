package v3_proje.v3_pro.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import v3_proje.v3_pro.repository.CompanyMongoRepository;
import v3_proje.v3_pro.repository.UserMongoRepository;
import v3_proje.v3_pro.entity.Company;
import v3_proje.v3_pro.entity.User;

@Service
public class CustomerUserDetailsService implements UserDetailsService{
	@Autowired
	//private UserRepository userRepository;
	private UserMongoRepository userMongoRepository;
	private CompanyMongoRepository companyMongoRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userMongoRepository.findByEmail(email);
	    if (user == null) {
	    	throw new UsernameNotFoundException("Kullanıcı bulunamadı: " + email);
	    }
	    return new org.springframework.security.core.userdetails.User(
	    		user.getEmail(), 
	    		user.getPassword(), 
	    		Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
	    );
	}
	
	//@Override
	public UserDetails loadCompanyByUsername(String email) throws UsernameNotFoundException {
		Company company = companyMongoRepository.findByEmail(email);
	    if (company == null) {
	    	throw new UsernameNotFoundException("Kullanıcı bulunamadı: " + email);
	    }
	    return new org.springframework.security.core.userdetails.User(
	    		company.getEmail(), 
	    		company.getPassword(), 
	    		Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
	    );
	}
}
