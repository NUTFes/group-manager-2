import Vue from "vue";
import { userRole } from './user.js'
import { managerRole } from './manager.js'
import { developerRole } from './developer.js'
import { memberRole } from "./member.js";

export default ({ app }, inject) => {
  inject('role', (roleID) => {
    const roleList = [developerRole, managerRole, userRole, memberRole]
    return roleList[roleID - 1]
  })
}
