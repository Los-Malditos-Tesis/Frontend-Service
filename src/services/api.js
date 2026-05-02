import axios from "axios";
import {
  createUserMock,
  deleteUserMock,
  getUsersMock,
  resetPasswordMock,
  updateUserMock,
} from "../mocks/usersMock";
import {
  createProductMock,
  deleteProductMock,
  getProductsMock,
  updateProductMock,
  getSuppliersMock,
} from "../mocks/productsMock";
import {
  createWarehouseMock,
  deleteWarehouseMock,
  getWarehousesMock,
  updateWarehouseMock,
} from "../mocks/warehousesMock";
import {
  createLocationMock,
  deleteLocationMock,
  getLocationsMock,
  updateLocationMock,
} from "../mocks/locationsMock";
import {
  createCameraMock,
  deleteCameraMock,
  getCamerasMock,
  updateCameraMock,
} from "../mocks/camerasMock";
import {
  createSupplierMock,
  deleteSupplierMock,
  getSuppliersMock as getSuppliersDirectoryMock,
  updateSupplierMock,
} from "../mocks/suppliersMock";
import {
  createStoreMock,
  deleteStoreMock,
  getStoresMock,
  updateStoreMock,
} from "../mocks/storesMock";

export const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// CRUD mockeado para desarrollo sin backend.
export const getUsers = () => getUsersMock();
export const createUser = (data) => createUserMock(data);
export const updateUser = (id, data) => updateUserMock(id, data);
export const deleteUser = (id) => deleteUserMock(id);
export const resetPassword = (id) => resetPasswordMock(id);

// Products
export const getProducts = () => getProductsMock();
export const createProduct = (data) => createProductMock(data);
export const updateProduct = (id, data) => updateProductMock(id, data);
export const deleteProduct = (id) => deleteProductMock(id);
export const getSuppliers = () => getSuppliersMock();

// Warehouses
export const getWarehouses = () => getWarehousesMock();
export const createWarehouse = (data) => createWarehouseMock(data);
export const updateWarehouse = (id, data) => updateWarehouseMock(id, data);
export const deleteWarehouse = (id) => deleteWarehouseMock(id);

// Locations
export const getLocations = () => getLocationsMock();
export const createLocation = (data) => createLocationMock(data);
export const updateLocation = (id, data) => updateLocationMock(id, data);
export const deleteLocation = (id) => deleteLocationMock(id);

// Cameras
export const getCameras = () => getCamerasMock();
export const createCamera = (data) => createCameraMock(data);
export const updateCamera = (id, data) => updateCameraMock(id, data);
export const deleteCamera = (id) => deleteCameraMock(id);

// Suppliers
export const getSuppliersDirectory = () => getSuppliersDirectoryMock();
export const createSupplier = (data) => createSupplierMock(data);
export const updateSupplier = (id, data) => updateSupplierMock(id, data);
export const deleteSupplier = (id) => deleteSupplierMock(id);

// Stores
export const getStores = () => getStoresMock();
export const createStore = (data) => createStoreMock(data);
export const updateStore = (id, data) => updateStoreMock(id, data);
export const deleteStore = (id) => deleteStoreMock(id);