import Vue from "vue";
import { userRole } from "./user.js";
import { developerRole } from "./developer.js";
import { managerRole } from "./manager.js";
import { staffRole } from "./staff.js";

export default ({ app }, inject) => {
  inject("role", (roleID) => {
    const roleList = [developerRole, managerRole, staffRole, userRole];
    return roleList[roleID - 1];
  });
};
