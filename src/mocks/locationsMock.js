const seedLocations = [
  {
    id: 1,
    zone: "RECEPCION-01",
    warehouse_id: 1,
    warehouse_name: "Bodega Central",
    pallets_count: 3,
    active: true,
  },
  {
    id: 2,
    zone: "ALMACEN-A01",
    warehouse_id: 1,
    warehouse_name: "Bodega Central",
    pallets_count: 5,
    active: true,
  },
  {
    id: 3,
    zone: "ALMACEN-A02",
    warehouse_id: 1,
    warehouse_name: "Bodega Central",
    pallets_count: 0,
    active: true,
  },
  {
    id: 4,
    zone: "DESPACHO-01",
    warehouse_id: 2,
    warehouse_name: "Centro de Distribución Sur",
    pallets_count: 2,
    active: true,
  },
  {
    id: 5,
    zone: "FRIO-01",
    warehouse_id: 3,
    warehouse_name: "Almacén Este",
    pallets_count: 12,
    active: true,
  },
];

let locationsMockData = [...seedLocations];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

export const getLocationsMock = () => simulateSuccess([...locationsMockData]);

export const getLocationsByWarehouseMock = (warehouseId) =>
  simulateSuccess(
    locationsMockData.filter((location) => Number(location.warehouse_id) === Number(warehouseId))
  );

export const createLocationMock = (payload) => {
  // Validar que la zona sea única
  if (locationsMockData.some((loc) => loc.zone === payload.zone)) {
    return Promise.reject({
      response: {
        data: { message: "Zone already in locations!" },
      },
    });
  }

  const nextId =
    locationsMockData.length > 0
      ? Math.max(...locationsMockData.map((location) => Number(location.id) || 0)) + 1
      : 1;

  const warehouseName =
    {
      1: "Bodega Central",
      2: "Centro de Distribución Sur",
      3: "Almacén Este",
      4: "Bodega Oeste",
    }[payload.warehouse_id] || `Bodega ${payload.warehouse_id}`;

  const newLocation = {
    id: nextId,
    zone: payload.zone,
    warehouse_id: Number(payload.warehouse_id),
    warehouse_name: warehouseName,
    pallets_count: 0,
    active: true,
  };

  locationsMockData = [newLocation, ...locationsMockData];
  return simulateSuccess(newLocation);
};

export const updateLocationMock = (id, payload) => {
  const targetId = Number(id);

  // Validar que la nueva zona sea única (excepto para el mismo registro)
  if (
    payload.zone &&
    locationsMockData.some((loc) => loc.zone === payload.zone && Number(loc.id) !== targetId)
  ) {
    return Promise.reject({
      response: {
        data: { message: "Zone already in locations!" },
      },
    });
  }

  locationsMockData = locationsMockData.map((location) =>
    Number(location.id) === targetId
      ? {
        ...location,
        ...payload,
        id: location.id,
      }
      : location
  );

  const updatedLocation = locationsMockData.find((location) => Number(location.id) === targetId);
  return simulateSuccess(updatedLocation || null);
};

export const deleteLocationMock = (id) => {
  const targetId = Number(id);
  const location = locationsMockData.find((loc) => Number(loc.id) === targetId);

  // Validar que no tenga pallets (seguridad)
  if (location && location.pallets_count > 0) {
    return Promise.reject({
      response: {
        data: { message: "No se puede eliminar una ubicación con pallets asociados" },
      },
    });
  }

  locationsMockData = locationsMockData.filter((location) => Number(location.id) !== targetId);
  return simulateSuccess({ deleted: true, id: targetId });
};
