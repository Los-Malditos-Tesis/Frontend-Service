const seedUsers = [
  {
    id: "7b7e0d7b-1c1e-4b83-9e1a-8d42c4fd1001",
    name: "Ana Torres",
    email: "ana.torres@example.com",
    status: true,
    roles: [
      { id: "ADMIN", name: "Administrator" },
      { id: "USER", name: "Operative" },
    ],
  },
  {
    id: "7b7e0d7b-1c1e-4b83-9e1a-8d42c4fd1002",
    name: "Luis Ramirez",
    email: "luis.ramirez@example.com",
    status: true,
    roles: [{ id: "USER", name: "Operative" }],
  },
  {
    id: "7b7e0d7b-1c1e-4b83-9e1a-8d42c4fd1003",
    name: "Sofia Martinez",
    email: "sofia.martinez@example.com",
    status: false,
    roles: [{ id: "USER", name: "Operative" }],
  },
  {
    id: "7b7e0d7b-1c1e-4b83-9e1a-8d42c4fd1004",
    name: "Carlos Vega",
    email: "carlos.vega@example.com",
    status: true,
    roles: [{ id: "ADMIN", name: "Administrator" }],
  },
];

let usersMockData = [...seedUsers];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

export const getUsersMock = () => simulateSuccess([...usersMockData]);

export const searchUsersMock = (filters = {}) => {
  const { name = "", email = "", status, page = 1, limit = 10 } = filters;
  const normalizedName = String(name).trim().toLowerCase();
  const normalizedEmail = String(email).trim().toLowerCase();
  const hasStatusFilter = status !== undefined && status !== null && status !== "";
  const normalizedStatus =
    typeof status === "string" ? status === "true" : Boolean(status);

  const filteredUsers = usersMockData.filter((user) => {
    const matchesName = normalizedName
      ? user.name.toLowerCase().includes(normalizedName)
      : true;
    const matchesEmail = normalizedEmail
      ? user.email.toLowerCase().includes(normalizedEmail)
      : true;
    const matchesStatus = hasStatusFilter ? user.status === normalizedStatus : true;

    return matchesName && matchesEmail && matchesStatus;
  });

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.max(Number(limit) || 10, 1);
  const start = (currentPage - 1) * currentLimit;
  const items = filteredUsers.slice(start, start + currentLimit);

  return simulateSuccess({
    items,
    total: filteredUsers.length,
    page: currentPage,
    limit: currentLimit,
    pages: Math.max(Math.ceil(filteredUsers.length / currentLimit), 1),
  });
};

export const findUserByIdMock = (id) => {
  const user = usersMockData.find((item) => item.id === id) || null;
  return simulateSuccess(user);
};

export const createUserMock = (payload) => {
  const newUser = {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: payload.name,
    email: payload.email,
    status: Boolean(payload.status),
    roles: payload.roles || [{ id: "USER", name: "Operative" }],
  };

  usersMockData = [newUser, ...usersMockData];
  return simulateSuccess(newUser);
};

export const updateUserMock = (id, payload) => {
  const targetId = String(id);

  usersMockData = usersMockData.map((user) =>
    String(user.id) === targetId
      ? {
        ...user,
        ...payload,
        roles: payload.roles || user.roles,
        id: user.id,
      }
      : user
  );

  const updatedUser = usersMockData.find((user) => String(user.id) === targetId);
  return simulateSuccess(updatedUser || null);
};

export const blockUserMock = (id) => {
  const targetId = String(id);

  usersMockData = usersMockData.map((user) =>
    String(user.id) === targetId
      ? {
        ...user,
        status: false,
      }
      : user
  );

  const blockedUser = usersMockData.find((user) => String(user.id) === targetId);
  return simulateSuccess(blockedUser || null);
};

export const deleteUserMock = (id) => blockUserMock(id);

export const resetPasswordMock = (id) => simulateSuccess({ reset: true, id: String(id) });
