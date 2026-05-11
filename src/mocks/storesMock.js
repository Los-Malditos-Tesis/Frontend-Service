const seedStores = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Tienda Central",
    code: "ST-001",
    address: "Av. Principal 123, Zona Norte",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Sucursal Sur",
    code: "ST-002",
    address: "Calle 5 #456, Sector Sur",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Punto Este",
    code: "ST-003",
    address: "Ruta 2 Km 45, Región Este",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Sucursal Oeste",
    code: "ST-004",
    address: "Carrera 10 #789, Occidente",
  },
];

let storesMockData = [...seedStores];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

const isDuplicateCode = (code, targetId = null) =>
  storesMockData.some(
    (store) =>
      store.code.toLowerCase() === String(code).toLowerCase() &&
      String(store.id) !== String(targetId)
  );

const buildError = (message) =>
  Promise.reject({
    response: {
      data: {
        message,
      },
    },
  });

export const getStoresMock = () => simulateSuccess([...storesMockData]);

export const createStoreMock = (payload) => {
  if (isDuplicateCode(payload.code)) {
    return buildError("Ya existe una tienda con ese código");
  }

  const newStore = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `store-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: payload.name,
    code: payload.code,
    address: payload.address,
  };

  storesMockData = [newStore, ...storesMockData].sort((a, b) =>
    String(a.name).localeCompare(String(b.name))
  );

  return simulateSuccess(newStore);
};

export const updateStoreMock = (id, payload) => {
  const targetId = String(id);

  if (isDuplicateCode(payload.code, targetId)) {
    return buildError("Ya existe una tienda con ese código");
  }

  storesMockData = storesMockData.map((store) =>
    String(store.id) === targetId
      ? {
          ...store,
          ...payload,
          id: store.id,
        }
      : store
  );

  const updatedStore = storesMockData.find((store) => String(store.id) === targetId);
  return simulateSuccess(updatedStore || null);
};

export const deleteStoreMock = (id) => {
  const targetId = String(id);
  storesMockData = storesMockData.filter((store) => String(store.id) !== targetId);
  return simulateSuccess({ deleted: true, id: targetId });
};