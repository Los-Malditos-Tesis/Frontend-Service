const seedUsers = [
  {
    id: 1,
    name: "Ana Torres",
    email: "ana.torres@example.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Luis Ramirez",
    email: "luis.ramirez@example.com",
    role: "Editor",
  },
  {
    id: 3,
    name: "Sofia Martinez",
    email: "sofia.martinez@example.com",
    role: "Viewer",
  },
  {
    id: 4,
    name: "Carlos Vega",
    email: "carlos.vega@example.com",
    role: "Editor",
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

export const createUserMock = (payload) => {
  const nextId =
    usersMockData.length > 0
      ? Math.max(...usersMockData.map((user) => Number(user.id) || 0)) + 1
      : 1;

  const newUser = {
    id: nextId,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };

  usersMockData = [newUser, ...usersMockData];
  return simulateSuccess(newUser);
};

export const updateUserMock = (id, payload) => {
  const targetId = Number(id);

  usersMockData = usersMockData.map((user) =>
    Number(user.id) === targetId
      ? {
        ...user,
        ...payload,
        id: user.id,
      }
      : user
  );

  const updatedUser = usersMockData.find((user) => Number(user.id) === targetId);
  return simulateSuccess(updatedUser || null);
};

export const deleteUserMock = (id) => {
  const targetId = Number(id);
  usersMockData = usersMockData.filter((user) => Number(user.id) !== targetId);
  return simulateSuccess({ deleted: true, id: targetId });
};

export const resetPasswordMock = (id) =>
  simulateSuccess({ reset: true, id: Number(id) });
