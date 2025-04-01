package com.example.backend.module.user.service.imp;

import com.example.backend.helper.SuccessResource;
import com.example.backend.module.user.dto.*;
import com.example.backend.module.user.entity.Role;
import com.example.backend.module.user.entity.User;
import com.example.backend.module.user.repository.UserRepository;
import com.example.backend.module.user.dto.AuthenticationRequest;
import com.example.backend.module.user.dto.AuthenticationResponse;
import com.example.backend.resource.ResourceNotFoundException;
import com.example.backend.resource.ResponseResource;
import com.example.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import org.hibernate.service.spi.ServiceException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    public AuthenticationResponse authenticate(AuthenticationRequest loginRequest) {

        var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFirstname(), user.getLastname(), user.getPassword(), user.getRole(), user.getPhone(), user.getCity());
        String token = jwtService.generateToken(userDTO);

        return AuthenticationResponse.builder()
                .accessToken(token)
                .user(userDTO)
                .build();
    }

    public ResponseResource<String> register(RegisterRequestDTO request) {
        try {
            var user = User.builder()
                    .firstname("")
                    .lastname("")
                    .city("")
                    .phone("")
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
            UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFirstname(), user.getLastname(), user.getPassword(), user.getRole(), user.getPhone(), user.getCity());
            return ResponseResource.success("User registered successfully");
        } catch (Exception e) {
            throw new ServiceException("An unexpected error occurred during registration", e);
        }

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    public ResponseResource<UserDTO> getUserFromToken(String token) {

        try {
            Claims claims = jwtService.extractAllClaims(token);

            String email = claims.getSubject();

            var user = userRepository.findByEmail(email).orElseThrow(() -> new BadCredentialsException("User not found"));

            UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFirstname(), user.getLastname(), user.getPassword(), user.getRole(), user.getPhone(), user.getCity());

            return ResponseResource.success(userDTO, "Get user successfully");


        } catch (Exception e) {
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public ResponseResource<UserDTO> updateUserFromToken(String token, UserUpdateRequest request) {
        try {
            ResponseResource<UserDTO> response = getUserFromToken(token);
            if (!response.isSuccess()) {
                return ResponseResource.fail("Failed to get user from token", 400);
            }
            UserDTO userDTO = response.getData();
            User user = userRepository.findById(userDTO.getId())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));
            if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                    return ResponseResource.fail("Email already in use", 400);
                }
                user.setEmail(request.getEmail());
            }
            if (request.getFirstName() != null) {
                user.setFirstname(request.getFirstName());
            }

            if (request.getLastName() != null) {
                user.setLastname(request.getLastName());
            }

            if (request.getPhone() != null) {
                user.setPhone(request.getPhone());
            }

            if (request.getCity() != null) {
                user.setCity(request.getCity());
            }

            // Save updated user
            userRepository.save(user);

            // Create updated UserDTO
            UserDTO updatedUserDTO = new UserDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getPassword(),
                    user.getRole(),
                    user.getPhone(),
                    user.getCity()
            );

            return ResponseResource.success(updatedUserDTO, "User updated successfully");
        } catch (Exception e) {
            logger.error("Error updating user: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers(int page, int limit, String search) {
        if (page < 0) {
            page = 0;
        }
        if (limit <= 0) {
            limit = 10;
        }
        Pageable pageable = PageRequest.of(page, limit);

        Page<User> userPage;
        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.searchUsers(search.trim(), pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        List<UserDTO> userDTOList = userPage.getContent()
                .stream()
                .map(this::convertToDTO)
                .toList();
        return userDTOList;
    }

    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email address already in use");
        }
        logger.info("Creating user: " + userDTO);
        User user = convertToEntity(userDTO);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!existingUser.getEmail().equals(userDTO.getEmail()) && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email address already in use");
        }
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setFirstname(userDTO.getFirstname());
        existingUser.setLastname(userDTO.getLastname());
        existingUser.setPhone(userDTO.getPhone());
        existingUser.setCity(userDTO.getCity());
        userRepository.save(existingUser);
        return convertToDTO(existingUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        return user;
    }

}
