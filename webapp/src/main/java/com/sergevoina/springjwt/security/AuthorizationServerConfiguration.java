package com.sergevoina.springjwt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

/**
 * The configuration of the server is used to provide implementations of the
 * client details service and token services and to enable or disable certain
 * aspects of the mechanism globally.
 * 
 * @author serge.voina@gmail.com
 *
 */
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfiguration extends AuthorizationServerConfigurerAdapter {

	/**
	 * OAuth2 provides 4 different roles.
	 * 
	 * <li>Resource Owner: User
	 * <li>Client: Application
	 * <li>Resource Server: API
	 * <li>Authorization Server: API
	 */

	/**
	 * OAuth2 Grant Types: following are the 4 different grant types defined by
	 * OAuth2
	 * 
	 * <li>Authorization Code: used with server-side Applications
	 * 
	 * <li>Implicit: used with Mobile Apps or Web Applications (applications
	 * that run on the user's device)
	 * 
	 * <li>Resource Owner Password Credentials: used with trusted Applications,
	 * such as those owned by the service itself
	 * 
	 * <li>Client Credentials: used with Applications API access
	 * 
	 */
	static final String GRANT_TYPE_PASSWORD = "password";
	static final String GRANT_TYPE_AUTHORIZATION_CODE = "authorization_code";
	static final String GRANT_TYPE_REFRESH_TOKEN = "refresh_token";
	static final String GRANT_TYPE_IMPLICIT = "implicit";

	static final String SCOPE_READ = "read";
	static final String SCOPE_WRITE = "write";
	static final String SCOPE_TRUST = "trust";

	@Value("${security.oauth.client-id}")
	private String CLIEN_ID;
	@Value("${security.oauth.client-secret}")
	private String CLIENT_SECRET;

	@Value("${security.oauth.access-token.validity}")
	private int ACCESS_TOKEN_VALIDITY_SECONDS;
	@Value("${security.oauth.refresh-token.validity}")
	private int FREFRESH_TOKEN_VALIDITY_SECONDS;

	@Value("${security.jwt.signing-key}")
	private String JWT_ACCESS_TOKEN_SIGNING_KEY;
	
	@Autowired
	private AuthenticationManager authenticationManager;

	@Bean
	public JwtAccessTokenConverter accessTokenConverter() {
		JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
		converter.setSigningKey(JWT_ACCESS_TOKEN_SIGNING_KEY);
		return converter;
	}

	@Bean
	public TokenStore tokenStore() {
		return new JwtTokenStore(accessTokenConverter());
	}

	/**
	 * A configurer that defines the client details service.
	 * <ul>
	 * <li>clientId: (required) the client id.
	 * <li>secret: (required for trusted clients) the client secret, if any.
	 * <li>scope: The scope to which the client is limited. If scope is
	 * undefined or empty (the default) the client is not limited by scope.
	 * <li>authorizedGrantTypes: Grant types that are authorized for the client
	 * to use. Default value is empty.
	 * <li>authorities: Authorities that are granted to the client (regular
	 * Spring Security authorities).
	 *
	 * </ul>
	 */
	@Override
	public void configure(ClientDetailsServiceConfigurer configurer) throws Exception {
		// @formatter:off
		configurer.inMemory().withClient(CLIEN_ID)
			.secret(CLIENT_SECRET)
			.authorizedGrantTypes(GRANT_TYPE_PASSWORD, GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN, GRANT_TYPE_IMPLICIT)
			.scopes(SCOPE_READ, SCOPE_WRITE, SCOPE_TRUST)
			.accessTokenValiditySeconds(ACCESS_TOKEN_VALIDITY_SECONDS)
			.refreshTokenValiditySeconds(FREFRESH_TOKEN_VALIDITY_SECONDS);
		// @formatter:on
	}

	// /**
	// * defines the security constraints on the token endpoint.
	// */
	// @Override
	// public void configure(AuthorizationServerSecurityConfigurer oauthServer)
	// throws Exception {
	// oauthServer.tokenKeyAccess("permitAll()").checkTokenAccess("isAuthenticated()");
	// }
	//

	/**
	 * defines the authorization and token endpoints and the token services.
	 */
	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
		endpoints.tokenStore(tokenStore()).authenticationManager(authenticationManager)
				.accessTokenConverter(accessTokenConverter());
	}
}
