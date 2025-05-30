import Vue from "vue";
import { managerRole } from "./manager.js";
import { staffRole } from "./staff.js";
import { userRole } from "./user.js";

export default ({ app }, inject) => {
  inject("role", (roleID) => {
    const roleList = [managerRole, staffRole, userRole];
    return roleList[roleID - 1];
  });
};
