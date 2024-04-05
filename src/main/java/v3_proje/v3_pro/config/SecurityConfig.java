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
        		.antMatchers("/login").permitAll()
            	.antMatchers("/createUser").permitAll()
            	//.antMatchers("/**").authenticated()
            	.antMatchers("/**").permitAll()
            .and()
            .formLogin()
            	.loginPage("/login") 
            	.loginProcessingUrl("/login") 
            	.usernameParameter("email") 
            	.passwordParameter("password")
            	.defaultSuccessUrl("/") 
            	.permitAll()
            .and()
            .logout()
            	.logoutUrl("/logout")
            	.permitAll();
	 }	
	 @Bean
	 public PasswordEncoder passwordEncoder() {
		 return new BCryptPasswordEncoder();
	 }
}
