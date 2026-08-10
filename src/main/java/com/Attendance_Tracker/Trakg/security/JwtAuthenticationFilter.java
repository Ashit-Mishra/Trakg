package com.Attendance_Tracker.Trakg.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        /*
         * Login and registration should never require
         * an existing JWT.
         */
        String path = request.getServletPath();

        if (path.equals("/api/auth/login") ||
                path.equals("/api/auth/register")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Get Authorization header.
         */
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Extract JWT.
         */
        final String jwt = authHeader.substring(7);

        try {

            /*
             * Extract username from JWT.
             */
            String username = jwtService.extractUsername(jwt);

            /*
             * Only authenticate if there isn't already
             * an authenticated user.
             */
            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(username);

                /*
                 * Validate token.
                 */
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);
                }
            }

        } catch (ExpiredJwtException e) {

            /*
             * Token has expired.
             *
             * Do not let the exception crash the request.
             * Continue without authentication.
             */
            System.out.println("JWT expired. User needs to login again.");

        } catch (JwtException e) {

            /*
             * Token is malformed or invalid.
             */
            System.out.println("Invalid JWT: " + e.getMessage());

        } catch (Exception e) {

            /*
             * Prevent unexpected JWT/authentication errors
             * from crashing the filter chain.
             */
            System.out.println(
                    "JWT authentication error: " + e.getMessage()
            );
        }

        /*
         * Always continue the filter chain.
         */
        filterChain.doFilter(request, response);
    }
}