import { ROLES } from "./conts.jsx";

export const getUserRoleIds = (user) => {
  if (!user) {
    return [];
  }

  const roleIds = [];

  if (Array.isArray(user.roles)) {
    roleIds.push(...user.roles.map((role) => (typeof role === "string" ? role : role?.id)).filter(Boolean));
  }

  if (typeof user.role === "string") {
    roleIds.push(user.role);
  } else if (user.role?.id) {
    roleIds.push(user.role.id);
  }

  return [...new Set(roleIds)];
};

export const hasAnyRole = (user, roleIds = []) => {
  const normalizedRoles = getUserRoleIds(user);
  return normalizedRoles.some((roleId) => roleIds.includes(roleId));
};

export const APP_VIEW_ROLES = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.VIEWER,
  ROLES.VIEWER_ORDER,
  ROLES.USER,
];

export const APP_MANAGE_ROLES = [ROLES.SUPERADMIN, ROLES.ADMIN];

export const APP_ORDER_MANAGE_ROLES = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.VIEWER_ORDER,
];

export const canManageGeneral = (user) => hasAnyRole(user, APP_MANAGE_ROLES);

export const canManageOrders = (user) => hasAnyRole(user, APP_ORDER_MANAGE_ROLES);
