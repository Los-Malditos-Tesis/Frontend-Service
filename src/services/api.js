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

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
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