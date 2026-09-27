import app from '../hono/hono';
import loginService from '../service/login-service';
import result from '../model/result';
import userContext from '../security/user-context';

// SSO cookie name shared across *.rhaeron.com
const SSO_COOKIE = 'rhaeron_session';
const SSO_DOMAIN = '.rhaeron.com';

app.post('/login', async (c) => {
	const token = await loginService.login(c, await c.req.json());
	// Write SSO cookie so blog.rhaeron.com and other subdomains share the session
	c.header('Set-Cookie', `${SSO_COOKIE}=${token}; Domain=${SSO_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
	return c.json(result.ok({ token: token }));
});

app.post('/register', async (c) => {
	const jwt = await loginService.register(c, await c.req.json());
	return c.json(result.ok(jwt));
});

app.delete('/logout', async (c) => {
	await loginService.logout(c, userContext.getUserId(c));
	// Clear SSO cookie across all subdomains
	c.header('Set-Cookie', `${SSO_COOKIE}=; Domain=${SSO_DOMAIN}; Path=/; HttpOnly; Secure; Max-Age=0`);
	return c.json(result.ok());
});
