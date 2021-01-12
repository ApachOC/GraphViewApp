package cz.zcu.kiv.wernerv.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller which redirects requests to index page.
 * Spring prefers more specific mapping, so this should only work for
 * requests outside of /api
 */
@Controller
public class ForwardCtrl {
    @RequestMapping(value = {"/projects", "/administration/**"})
    public String redirect() {
        return "forward:/";
    }
}
