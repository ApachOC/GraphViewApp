package cz.zcu.kiv.wernerv.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class DemoCtrl {

    @RequestMapping("/login")
    public Principal user(Principal user) {
        return user;
    }
}
