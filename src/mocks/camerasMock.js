const seedCameras = [
  {
    id: 1,
    code: "ENTRADA-A",
    api_key: "cam-key-001",
    location_id: 1,
    location_name: "RECEPCION-01",
    active: true,
  },
  {
    id: 2,
    code: "PASILLO-B1",
    api_key: "cam-key-002",
    location_id: 2,
    location_name: "ALMACEN-A01",
    active: true,
  },
  {
    id: 3,
    code: "DESPACHO-C1",
    api_key: "cam-key-003",
    location_id: 4,
    location_name: "DESPACHO-01",
    active: true,
  },
];

let camerasMockData = [...seedCameras];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

const locationNames = {
  1: "RECEPCION-01",
  2: "ALMACEN-A01",
  3: "ALMACEN-A02",
  4: "DESPACHO-01",
  5: "FRIO-01",
};

export const getCamerasMock = () => simulateSuccess([...camerasMockData]);

export const createCameraMock = (payload) => {
  const code = payload.code?.trim();

  if (camerasMockData.some((camera) => camera.code === code)) {
    return Promise.reject({
      response: {
        data: { message: "Code already in cameras!" },
      },
    });
  }

  const nextId =
    camerasMockData.length > 0
      ? Math.max(...camerasMockData.map((camera) => Number(camera.id) || 0)) + 1
      : 1;

  const newCamera = {
    id: nextId,
    code,
    api_key: payload.api_key,
    location_id: Number(payload.location_id),
    location_name: locationNames[payload.location_id] || `Location ${payload.location_id}`,
    active: true,
  };

  camerasMockData = [newCamera, ...camerasMockData];
  return simulateSuccess(newCamera);
};

export const updateCameraMock = (id, payload) => {
  const targetId = Number(id);
  const code = payload.code?.trim();

  if (
    code &&
    camerasMockData.some(
      (camera) => camera.code === code && Number(camera.id) !== targetId
    )
  ) {
    return Promise.reject({
      response: {
        data: { message: "Code already in cameras!" },
      },
    });
  }

  camerasMockData = camerasMockData.map((camera) =>
    Number(camera.id) === targetId
      ? {
        ...camera,
        ...payload,
        id: camera.id,
        code: code || camera.code,
        location_id: Number(payload.location_id),
        location_name:
          locationNames[payload.location_id] || `Location ${payload.location_id}`,
      }
      : camera
  );

  const updatedCamera = camerasMockData.find((camera) => Number(camera.id) === targetId);
  return simulateSuccess(updatedCamera || null);
};

export const deleteCameraMock = (id) => {
  const targetId = Number(id);
  camerasMockData = camerasMockData.filter((camera) => Number(camera.id) !== targetId);
  return simulateSuccess({ deleted: true, id: targetId });
};