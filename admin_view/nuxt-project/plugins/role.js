import Vue from "vue";

const developerRole = {
  place: {
    read: true,
    create: true,
    update: true,
    delete: true,
  },
  rental_items: {
    read: true,
    create: true,
    update: true,
    delete: true,
  }
}

const managerRole = {
  place: {
    read: true,
    create: false,
    update: false,
    delete: false,
  },
  rental_items: {
    read: true,
    create: false,
    update: false,
    delete: false,
  }
}

const userRole = {
  place: {
    read: false,
    create: false,
    update: false,
    delete: false,
  },
  rental_items: {
    read: false,
    create: false,
    update: false,
    delete: false,
  }
}

export default ({ app }, inject) => {
  inject('role', (roleID) => {
    const roleList = [developerRole, managerRole, userRole]
    return roleList[roleID - 1]
  })
}
