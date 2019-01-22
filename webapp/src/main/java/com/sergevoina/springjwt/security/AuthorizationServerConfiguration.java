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
	 * <p>
	 * The Password grant type is used by first-party clients to exchange a
	 * user's credentials for an access token.
	 * <p>
	 * Since this involves the client asking the user for their password, it
	 * should not be used by third party clients. In this flow, the user's
	 * username and password are exchanged directly for an access token.
	 */
	static final String GRANT_TYPE_PASSWORD = "password";

	/**
	 * <p>
	 * The Authorization Code grant type is used by confidential and public
	 * clients to exchange an authorization code for an access token.
	 * <p>
	 * After the user returns to the client via the redirect URL, the
	 * application will get the authorization code from the URL and use it to
	 * request an access token.
	 */
	static final String GRANT_TYPE_AUTHORIZATION_CODE = "authorization_code";

	/**
	 * <p>
	 * The Refresh Token grant type is used by clients to exchange a refresh
	 * token for an access token when the access token has expired.
	 * <p>
	 * This allows clients to continue to have a valid access token without
	 * further interaction with the user.
	 */
	static final String GRANT_TYPE_REFRESH_TOKEN = "refresh_token";

	/**
	 * <p>
	 * The Implicit grant type is a simplified flow that can be used by public
	 * clients, where the access token is returned immediately without an extra
	 * authorization code exchange step.
	 * <p>
	 * It is generally not recommended to use the implicit flow (and some
	 * servers prohibit this flow entirely). In the time since the spec was
	 * originally written, the industry best practice has changed to recommend
	 * that public clients should use the authorization code flow with the PKCE
	 * extension instead.
	 * <p>
	 * The OAuth 2.0 Security Best Current Practice document recommends against
	 * using the Implicit flow entirely, and OAuth 2.0 for Browser-Based Apps
	 * describes the technique of using the authorization code flow with PKCE.
	 */
	static final String GRANT_TYPE_IMPLICIT = "implicit";

	/**
	 * Reading the full information about a single resource.
	 */
	static final String SCOPE_READ = "read";
	/**
	 * Modifying the resource in any way e.g. creating, editing, or deleting.
	 */
	static final String SCOPE_WRITE = "write";

	@Value("${security.oauth.client-id}")
	private String clientId;
	@Value("${security.oauth.client-secret}")
	private String clientSecret;

	@Value("${security.oauth.access-token.validity}")
	private int accessTokenValidity;
	@Value("${security.oauth.refresh-token.validity}")
	private int refreshTokenValidity;

	@Value("${security.jwt.signing-key}")
	private String jwtAccessTokenSigningKey;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Bean
	public JwtAccessTokenConverter accessTokenConverter() {
		JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
		converter.setSigningKey(jwtAccessTokenSigningKey);
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
		configurer.inMemory().withClient(clientId)
			.secret(clientSecret)
			.authorizedGrantTypes(GRANT_TYPE_PASSWORD, GRANT_TYPE_REFRESH_TOKEN)
			.scopes(SCOPE_READ, SCOPE_WRITE)
			.accessTokenValiditySeconds(accessTokenValidity)
			.refreshTokenValiditySeconds(refreshTokenValidity);
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
