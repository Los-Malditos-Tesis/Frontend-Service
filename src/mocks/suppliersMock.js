const seedSuppliers = [
  {
    id: 1,
    name: "Tech Supplies Inc",
    code: "TECH-001",
    contactName: "Ana Torres",
    phone: "+1 555 100 200",
    email: "ventas@techsupplies.com",
    location: "Av. Central 120",
    products: ["Laptop Dell XPS 13", "Monitor LG 27 4K"],
    active: true,
  },
  {
    id: 2,
    name: "Periféricos Global",
    code: "PERI-002",
    contactName: "Luis Ramírez",
    phone: "+1 555 300 400",
    email: "contacto@perifericosglobal.com",
    location: "Calle 45 #20",
    products: ["Mouse Logitech MX Master", "Teclado Mecánico Corsair K95"],
    active: true,
  },
  {
    id: 3,
    name: "Gaming Gear Ltd",
    code: "GGEAR-003",
    contactName: "Sofía Martínez",
    phone: "+1 555 500 600",
    email: "hola@gaminggear.com",
    location: "Zona Industrial Norte",
    products: ["Teclado Mecánico Corsair K95"],
    active: true,
  },
  {
    id: 4,
    name: "Office Solutions",
    code: "OFF-004",
    contactName: "Carlos Vega",
    phone: "+1 555 700 800",
    email: "ventas@officesolutions.com",
    location: "Boulevard Empresarial 99",
    products: [],
    active: true,
  },
];

let suppliersMockData = [...seedSuppliers];

const simulateSuccess = (data, delay = 350) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });

const normalizeText = (value) => (value || "").trim();

export const getSuppliersMock = () =>
  simulateSuccess(
    suppliersMockData.map((supplier) => ({
      ...supplier,
      products: supplier.products || [],
    }))
  );

export const createSupplierMock = (payload) => {
  const code = normalizeText(payload.code);
  if (suppliersMockData.some((supplier) => supplier.code === code)) {
    return Promise.reject({
      response: {
        data: { message: "Code already in supplier!" },
      },
    });
  }

  const nextId =
    suppliersMockData.length > 0
      ? Math.max(...suppliersMockData.map((supplier) => Number(supplier.id) || 0)) + 1
      : 1;

  const newSupplier = {
    id: nextId,
    name: normalizeText(payload.name),
    code,
    contactName: normalizeText(payload.contactName),
    phone: normalizeText(payload.phone),
    email: normalizeText(payload.email),
    location: normalizeText(payload.location),
    products: [],
    active: true,
  };

  suppliersMockData = [newSupplier, ...suppliersMockData];
  return simulateSuccess(newSupplier);
};

export const updateSupplierMock = (id, payload) => {
  const targetId = Number(id);
  const code = normalizeText(payload.code);

  if (
    code &&
    suppliersMockData.some(
      (supplier) => supplier.code === code && Number(supplier.id) !== targetId
    )
  ) {
    return Promise.reject({
      response: {
        data: { message: "Code already in supplier!" },
      },
    });
  }

  suppliersMockData = suppliersMockData.map((supplier) =>
    Number(supplier.id) === targetId
      ? {
        ...supplier,
        ...payload,
        id: supplier.id,
        code: code || supplier.code,
      }
      : supplier
  );

  const updatedSupplier = suppliersMockData.find((supplier) => Number(supplier.id) === targetId);
  return simulateSuccess(updatedSupplier || null);
};

export const deleteSupplierMock = (id) => {
  const targetId = Number(id);
  const supplier = suppliersMockData.find((item) => Number(item.id) === targetId);

  if (supplier && supplier.products && supplier.products.length > 0) {
    return Promise.reject({
      response: {
        data: {
          message: "No se puede eliminar un proveedor con productos activos asociados",
        },
      },
    });
  }

  suppliersMockData = suppliersMockData.filter((supplier) => Number(supplier.id) !== targetId);
  return simulateSuccess({ deleted: true, id: targetId });
};
