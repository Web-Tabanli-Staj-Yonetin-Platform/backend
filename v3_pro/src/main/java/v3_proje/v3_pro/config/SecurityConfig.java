package v3_proje.v3_pro.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import v3_proje.v3_pro.service.CustomerUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Autowired
	 private CustomerUserDetailsService customUserDetailsService; 
	   
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(customUserDetailsService)
			.passwordEncoder(passwordEncoder());
	}
	    
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable()
		 	.authorizeRequests()
		 		.antMatchers("/api/register").permitAll()
		 		.antMatchers("/api/**").authenticated()
	        .and()
	        .formLogin()
	        	.loginProcessingUrl("/api/login")
	            .usernameParameter("email")
	            .passwordParameter("password")
	            .permitAll()
	        .and()
	        .logout()
	            .logoutUrl("/api/logout")
	            .permitAll();
	 }
	    
	 @Bean
	 public PasswordEncoder passwordEncoder() {
		 return new BCryptPasswordEncoder();
	 }
}
