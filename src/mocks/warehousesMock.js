const seedWarehouses = [
  {
    id: 1,
    name: "Bodega Central",
    address: "Av. Principal 123, Zona Norte",
    locations_count: 8,
    active: true,
  },
  {
    id: 2,
    name: "Centro de Distribución Sur",
    address: "Calle 5 #456, Sector Sur",
    locations_count: 5,
    active: true,
  },
  {
    id: 3,
    name: "Almacén Este",
    address: "Ruta 2 Km 45, Región Este",
    locations_count: 12,
    active: true,
  },
  {
    id: 4,
    name: "Bodega Oeste",
    address: "Carrera 10 #789, Occidente",
    locations_count: 3,
    active: true,
  },
];

let warehousesMockData = [...seedWarehouses];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

export const getWarehousesMock = () => simulateSuccess([...warehousesMockData]);

export const createWarehouseMock = (payload) => {
  const nextId =
    warehousesMockData.length > 0
      ? Math.max(...warehousesMockData.map((warehouse) => Number(warehouse.id) || 0)) + 1
      : 1;

  const newWarehouse = {
    id: nextId,
    name: payload.name,
    address: payload.address,
    locations_count: 0,
    active: true,
  };

  warehousesMockData = [newWarehouse, ...warehousesMockData];
  return simulateSuccess(newWarehouse);
};

export const updateWarehouseMock = (id, payload) => {
  const targetId = Number(id);

  warehousesMockData = warehousesMockData.map((warehouse) =>
    Number(warehouse.id) === targetId
      ? {
          ...warehouse,
          ...payload,
          id: warehouse.id,
        }
      : warehouse
  );

  const updatedWarehouse = warehousesMockData.find(
    (warehouse) => Number(warehouse.id) === targetId
  );
  return simulateSuccess(updatedWarehouse || null);
};

export const deleteWarehouseMock = (id) => {
  const targetId = Number(id);
  warehousesMockData = warehousesMockData.filter(
    (warehouse) => Number(warehouse.id) !== targetId
  );
  return simulateSuccess({ deleted: true, id: targetId });
};
