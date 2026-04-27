const seedProducts = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    code: "DELL-XPS-13",
    sku: "SKU-001-DX13",
    category: "Electrónica",
    supplier_id: 1,
    supplier_name: "Tech Supplies Inc",
  },
  {
    id: 2,
    name: "Mouse Logitech MX Master",
    code: "LOG-MX-MASTER",
    sku: "SKU-002-LMM",
    category: "Periféricos",
    supplier_id: 2,
    supplier_name: "Periféricos Global",
  },
  {
    id: 3,
    name: "Monitor LG 27 4K",
    code: "LG-MON-27",
    sku: "SKU-003-LM27",
    category: "Monitores",
    supplier_id: 1,
    supplier_name: "Tech Supplies Inc",
  },
  {
    id: 4,
    name: "Teclado Mecánico Corsair K95",
    code: "CORS-K95",
    sku: "SKU-004-CK95",
    category: "Periféricos",
    supplier_id: 3,
    supplier_name: "Gaming Gear Ltd",
  },
];

let productsMockData = [...seedProducts];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

export const getProductsMock = () => simulateSuccess([...productsMockData]);

export const createProductMock = (payload) => {
  const nextId =
    productsMockData.length > 0
      ? Math.max(...productsMockData.map((product) => Number(product.id) || 0)) + 1
      : 1;

  const newProduct = {
    id: nextId,
    name: payload.name,
    code: payload.code,
    sku: payload.sku,
    category: payload.category,
    supplier_id: payload.supplier_id,
    supplier_name: `Supplier ${payload.supplier_id}`,
  };

  productsMockData = [newProduct, ...productsMockData];
  return simulateSuccess(newProduct);
};

export const updateProductMock = (id, payload) => {
  const targetId = Number(id);

  productsMockData = productsMockData.map((product) =>
    Number(product.id) === targetId
      ? {
        ...product,
        ...payload,
        id: product.id,
      }
      : product
  );

  const updatedProduct = productsMockData.find((product) => Number(product.id) === targetId);
  return simulateSuccess(updatedProduct || null);
};

export const deleteProductMock = (id) => {
  const targetId = Number(id);
  productsMockData = productsMockData.filter((product) => Number(product.id) !== targetId);
  return simulateSuccess({ deleted: true, id: targetId });
};

export const getSuppliersMock = () =>
  simulateSuccess([
    { id: 1, name: "Tech Supplies Inc" },
    { id: 2, name: "Periféricos Global" },
    { id: 3, name: "Gaming Gear Ltd" },
    { id: 4, name: "Office Solutions" },
    { id: 5, name: "Premium Components" },
  ]);
