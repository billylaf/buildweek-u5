package team4.buildweek_u5.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import team4.buildweek_u5.entities.Utente;
import team4.buildweek_u5.exceptions.UnauthorizedException;
import team4.buildweek_u5.services.UtenteService;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    private final JWTTools jwtTools;
    private final UtenteService utenteService;

    public JWTAuthFilter(JWTTools jwtTools, UtenteService utenteService) {
        this.jwtTools = jwtTools;
        this.utenteService = utenteService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Il token non è presente nell'header Authorization!");
        }

        String accessToken = authHeader.replace("Bearer ", "");

        jwtTools.verifyToken(accessToken);

        // cerco l'utente con il metodo per estrarre l'id dal token
        String utenteId = (jwtTools.extractIdFromToken(accessToken));
        Utente authenticatedUser = utenteService.findById(utenteId);

        // faccio viaggiare l'utente sempre con il suo token per renderlo loggato
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                authenticatedUser,
                null,
                authenticatedUser.getAuthorities()
        );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath()) ||
                new AntPathMatcher().match("/utenti/register", request.getServletPath());
    }
}