import Vue from "vue";
import { userRole } from './user.js'
import { developerRole } from './developer.js'
import { participantRole } from "./participant.js";
import { inventoryManagementRole } from "./inventory_management.js";
import { venuePowerRole } from "./venue_power.js";
import { sanitationManagementRole } from "./sanitation_management.js";
import { staffRole } from "./staff.js";

export default ({ app }, inject) => {
  inject('role', (roleID) => {
    const roleList = [developerRole, participantRole, inventoryManagementRole,venuePowerRole, sanitationManagementRole, staffRole, userRole]
    return roleList[roleID - 1]
  })
}
